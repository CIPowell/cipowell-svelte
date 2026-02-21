import { env } from '$env/dynamic/private';
import type { NavClient, NavLink } from '$lib/services/navigation/nav';
import type { SiteFooterContent } from '$lib/services/footer/footer-content';
import * as contentful from 'contentful';
import type { ContentfulBlogPost, ContentfulPage, ContentfulSiteFooter } from './content_types';
import type { Page, PageClient } from '$lib/services/page/Page';
import { ContentfulCache } from './cache';
import { resolveContentfulHost } from './preview';

const CONTENTFUL_DELIVERY_HOST = 'cdn.contentful.com';
const CONTENTFUL_PREVIEW_HOST = 'preview.contentful.com';

type RichTextNode = {
	nodeType?: string;
	data?: {
		target?: {
			sys?: {
				contentType?: {
					sys?: {
						id?: string;
					};
				};
			};
			fields?: {
				title?: string;
				subjectTag?: string;
				items?: Array<{ fields?: Record<string, string> }>;
			};
		};
	};
	content?: RichTextNode[];
};

function mapResolvedFooterLinks(
	links: Array<contentful.Entry | contentful.UnresolvedLink<'Entry'>>
): Array<{ label: string; href: string }> {
	return links.flatMap((link) => {
		if (!('fields' in link)) {
			return [];
		}

		return [
			{
				label: link.fields.label as string,
				href: link.fields.href as string
			}
		];
	});
}

export class Contentful implements NavClient, PageClient {
	client: contentful.ContentfulClientApi<undefined>;
	cache: ContentfulCache;

	constructor(platform?: App.Platform, preview = false) {
		const host = resolveContentfulHost(preview, env.CONTENTFUL_HOST);
		const isPreviewMode = host === CONTENTFUL_PREVIEW_HOST;

		// Use preview API key if available and we're in preview mode, otherwise use regular key
		const accessToken =
			isPreviewMode && env.CONTENTFUL_PREVIEW_API_KEY
				? env.CONTENTFUL_PREVIEW_API_KEY
				: env.CONTENTFUL_API_KEY;

		if (!accessToken) {
			const requiredKey = isPreviewMode
				? 'CONTENTFUL_PREVIEW_API_KEY or CONTENTFUL_API_KEY'
				: 'CONTENTFUL_API_KEY';
			throw new Error(`Missing required environment variable: ${requiredKey}`);
		}

		this.client = contentful.createClient({
			space: 'c85g7urd11yl',
			accessToken,
			host,
			environment: env.CONTENTFUL_ENVIRONMENT || 'master'
		});
		this.cache = new ContentfulCache(platform, host);
	}

	async getGlobalNavLinks(): Promise<NavLink[]> {
		return this.cache.get(
			'nav-links',
			async () => {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Contentful SDK query types are strict and do not include all supported search params
				const pages = await this.client.getEntries<ContentfulPage>({
					content_type: 'page',
					'fields.parent[exists]': false,
					select: 'fields.title,fields.slug'
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
				} as any);

				return pages.items
					.map((p) => ({
						title: p.fields.title,
						target: p.fields.slug
					}));
			},
			60 * 60 * 24 // Cache nav links for 24 hours
		);
	}

	async getPage(slug: string): Promise<Page> {
		return this.cache.get(
			`page-${slug || 'home'}`,
			async () => {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Contentful SDK types are strict about query parameters
				const pages = await this.client.getEntries<ContentfulPage>({
					content_type: 'page',
					'fields.slug': slug || 'home',
					include: 10
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
				} as any);

				if (!pages.items || pages.items.length === 0) {
					console.error(`Page not found: ${slug}`);
					throw new Error(`Page not found: ${slug}`);
				}

				const page = pages.items[0];
				await this.hydrateBlogPreviewSections(
					page.fields.content as RichTextNode | null | undefined
				);
				const breadcrumbs = this.getBreadcrumb(page);

				return {
					title: page.fields.title as string,
					slug: page.fields.slug as string,
					content: page.fields.content ?? null,
					breadcrumbs
				};
			},
			60 * 60 // Cache pages for 1 hour
		);
	}

	private async hydrateBlogPreviewSections(
		content: RichTextNode | null | undefined
	): Promise<void> {
		if (!content) {
			return;
		}

		const sections = this.getBlogPreviewSectionTargets(content);
		if (!sections.length) {
			return;
		}

		for (const section of sections) {
			const posts = await this.getLatestBlogPosts(section.fields?.subjectTag ?? '');

			section.fields = {
				...section.fields,
				items: posts.map((post) => ({
					fields: {
						title: this.getSymbolFieldValue(post.fields.title),
						linkLabel: 'Read post',
						linkHref: `/thoughts/${this.getSymbolFieldValue(post.fields.slug)}`
					}
				}))
			};
		}
	}

	private getBlogPreviewSectionTargets(content: RichTextNode): Array<{
		fields?: {
			title?: string;
			subjectTag?: string;
			items?: Array<{ fields?: Record<string, string> }>;
		};
	}> {
		const targets: Array<{
			fields?: {
				title?: string;
				subjectTag?: string;
				items?: Array<{ fields?: Record<string, string> }>;
			};
		}> = [];

		const walk = (node: RichTextNode) => {
			const target = node.data?.target;
			const contentTypeId = target?.sys?.contentType?.sys?.id;
			if (
				node.nodeType === 'embedded-entry-block' &&
				contentTypeId === 'blogPreviewSection' &&
				target
			) {
				targets.push(target);
			}

			for (const child of node.content ?? []) {
				walk(child);
			}
		};

		walk(content);
		return targets;
	}

	private getSymbolFieldValue(value: string | Record<string, string | undefined>): string {
		if (typeof value === 'string') {
			return value;
		}

		return value['en-US'] ?? '';
	}

	private async getLatestBlogPosts(
		subjectTag: string
	): Promise<Array<contentful.Entry<ContentfulBlogPost>>> {
		const query: Record<string, string | number> = {
			content_type: 'blogPost',
			order: '-sys.createdAt',
			limit: 3
		};

		if (subjectTag.trim()) {
			query['fields.tags[in]'] = subjectTag.trim();
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Contentful SDK types are strict about query parameters
		const entries = await this.client.getEntries<ContentfulBlogPost>(query as any);
		return entries.items;
	}

	async getSiteFooter(): Promise<SiteFooterContent> {
		return this.cache.get(
			'site-footer',
			async () => {
				const entries = await this.client.getEntries<ContentfulSiteFooter>({
					content_type: 'siteFooter',
					limit: 1,
					include: 2
				});

				if (!entries.items.length) {
					throw new Error('Site footer entry not found');
				}

				const footer = entries.items[0].fields;
				const navigationLinks = mapResolvedFooterLinks(footer.navigationLinks);
				const writingLinks = mapResolvedFooterLinks(footer.writingLinks);
				const socialLinks = mapResolvedFooterLinks(footer.socialLinks);

				return {
					brandTagline: footer.brandTagline,
					navigation: {
						title: footer.navigationTitle,
						links: navigationLinks
					},
					writing: {
						title: footer.writingTitle,
						links: writingLinks
					},
					connect: {
						title: footer.connectTitle,
						links: [...socialLinks, { label: 'Email', href: `mailto:${footer.email}` }]
					},
					metaText: footer.metaText
				};
			},
			60 * 60 * 24
		);
	}

	getBreadcrumb(page: contentful.Entry): NavLink[] {
		const breadcrumbs: NavLink[] = [];
		const visited = new Set<string>();
		let current: contentful.Entry | undefined = page;

		while (current) {
			const currentId = current.sys?.id;
			if (currentId) {
				if (visited.has(currentId)) {
					console.warn(`Cycle detected in breadcrumb parent chain for entry ${currentId}`);
					break;
				}

				visited.add(currentId);
			}

			breadcrumbs.push({
				title: current.fields.title as string,
				target: current.fields.slug as string
			});

			const parent = current.fields.parent as contentful.Entry | undefined;
			if (!parent) {
				break;
			}

			const parentId = parent.sys?.id;
			if (!parentId) {
				break;
			}

			current = parent;
		}

		return breadcrumbs.reverse();
	}
}

export default Contentful;
