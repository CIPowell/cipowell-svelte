import { env } from '$env/dynamic/private';
import type { NavClient, NavLink } from '$lib/services/navigation/nav';
import type { SiteFooterContent } from '$lib/services/footer/footer';
import * as contentful from 'contentful';
import type { ContentfulPage, ContentfulSiteFooter } from './content_types';
import type { Page, PageClient } from '$lib/services/page/Page';
import { ContentfulCache } from './cache';

const CONTENTFUL_DELIVERY_HOST = 'cdn.contentful.com';
const CONTENTFUL_PREVIEW_HOST = 'preview.contentful.com';

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

	constructor(platform?: App.Platform) {
		const host = env.CONTENTFUL_HOST || CONTENTFUL_DELIVERY_HOST;
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
			host
		});
		this.cache = new ContentfulCache(platform, host);
	}

	async getGlobalNavLinks(): Promise<NavLink[]> {
		return this.cache.get(
			'nav-links',
			async () => {
				const pages = await this.client.getEntries<ContentfulPage>({
					content_type: 'page'
				});

				return pages.items
					.filter((p) => !p.fields.parent)
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
		let breadcrumbs: NavLink[] = [];
		if (page.fields.parent) {
			breadcrumbs = this.getBreadcrumb(page.fields.parent as contentful.Entry);
		}

		breadcrumbs.push({
			title: page.fields.title as string,
			target: page.fields.slug as string
		});
		return breadcrumbs;
	}
}

export default Contentful;
