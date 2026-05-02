import { env } from '$env/dynamic/private';
import type { BlogPost, BlogPostPreview } from '$lib/services/blog/Blog';
import type { SiteFooterContent } from '$lib/services/footer/footer-content';
import type {
	LibraryEntry,
	LibraryEntryPreview,
	LibraryImage,
	LibraryReadingStatus
} from '$lib/services/library/library';
import type { NavClient, NavLink } from '$lib/services/navigation/nav';
import * as contentful from 'contentful';
import type { Page, PageClient } from '$lib/services/page/Page';
import { ContentfulCache } from './cache';
import type {
	ContentfulBlogPost,
	ContentfulLibraryEntry,
	ContentfulPage,
	ContentfulSiteFooter
} from './content_types';

export interface SitemapContentEntry {
	slug: string;
	updatedAt: string;
}

type RichTextNode = {
	nodeType?: string;
	value?: string;
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
				subtitle?: string;
				subjectTag?: string;
				items?: Array<{ fields?: Record<string, string> }>;
			};
		};
	};
	content?: RichTextNode[];
};

type RichTextDocument = { nodeType: string; content: unknown[] };
type ContentfulAssetLike = {
	fields?: {
		title?: string | Record<string, string | undefined>;
		description?: string | Record<string, string | undefined>;
		file?:
			| {
					url?: string;
			  }
			| Record<string, { url?: string } | undefined>;
	};
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

class Contentful implements NavClient, PageClient {
	client: contentful.ContentfulClientApi<undefined>;
	cache: ContentfulCache;
	contentfulEnvironment: string;
	previewEnabled: boolean;

	constructor(platform?: App.Platform, preview = false) {
		const contentfulEnvironment = env.CONTENTFUL_ENVIRONMENT || 'master';

		// Use preview API key if available and we're in preview mode, otherwise use regular key
		const accessToken =
			preview && env.CONTENTFUL_PREVIEW_API_KEY
				? env.CONTENTFUL_PREVIEW_API_KEY
				: env.CONTENTFUL_API_KEY;

		if (!accessToken) {
			const requiredKey = preview
				? 'CONTENTFUL_PREVIEW_API_KEY or CONTENTFUL_API_KEY'
				: 'CONTENTFUL_API_KEY';
			throw new Error(`Missing required environment variable: ${requiredKey}`);
		}

		this.client = contentful.createClient({
			space: 'c85g7urd11yl',
			host: preview ? 'preview.contentful.com' : 'cdn.contentful.com',
			accessToken,
			environment: contentfulEnvironment
		});
		this.cache = new ContentfulCache(platform);
		this.contentfulEnvironment = contentfulEnvironment;
		this.previewEnabled = preview;
	}

	async getGlobalNavLinks(): Promise<NavLink[]> {
		return this.cache.get(
			'nav-links',
			async () => {
				const query = {
					content_type: 'page',
					'fields.parent[exists]': false,
					select: 'fields.title,fields.slug'
				} as const;
				const pages = await this.client.getEntries<ContentfulPage>(
					query as unknown as contentful.EntriesQueries<ContentfulPage, undefined>
				);

				return pages.items.map((p) => ({
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
				const query = {
					content_type: 'page',
					'fields.slug': slug || 'home',
					include: 10
				} as const;
				const pages = await this.client.getEntries<ContentfulPage>(
					query as unknown as contentful.EntriesQueries<ContentfulPage, undefined>
				);

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
					description: this.truncateDescription(
						this.getRichTextPlainText(page.fields.content as RichTextNode | null | undefined),
						160
					),
					content: page.fields.content ?? null,
					breadcrumbs,
					contentfulMetadata: {
						entryId: page.sys.id,
						locale: page.sys.locale || 'en-US',
						environment: this.contentfulEnvironment
					},
					livePreview: {
						enabled: this.previewEnabled
					}
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

	private getSymbolFieldValue(
		value: string | Record<string, string | undefined> | undefined
	): string {
		if (value === undefined) {
			return '';
		}

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

		const entries = await this.client.getEntries<ContentfulBlogPost>(
			query as unknown as contentful.EntriesQueries<ContentfulBlogPost, undefined>
		);
		return entries.items;
	}

	private getTagFieldValues(
		value: string[] | Record<string, string[] | undefined> | undefined
	): string[] {
		if (Array.isArray(value)) {
			return value;
		}

		return value?.['en-US'] ?? [];
	}

	private getDateFieldValue(
		value: string | Record<string, string | undefined> | undefined
	): string {
		if (value === undefined) {
			return '';
		}

		if (typeof value === 'string') {
			return value;
		}

		return value['en-US'] ?? '';
	}

	private getIntegerFieldValue(
		value: number | Record<string, number | undefined> | undefined
	): number | null {
		if (value === undefined) {
			return null;
		}

		if (typeof value === 'number') {
			return value;
		}

		return value['en-US'] ?? null;
	}

	private getAssetImage(asset: unknown): LibraryImage | null {
		if (!asset || typeof asset !== 'object' || !('fields' in asset)) {
			return null;
		}

		const resolvedAsset = asset as ContentfulAssetLike;
		const fileField = resolvedAsset.fields?.file;
		let url = '';
		if (fileField && 'url' in fileField) {
			url = (fileField as { url?: string }).url ?? '';
		} else if (fileField) {
			url = (fileField as Record<string, { url?: string } | undefined>)['en-US']?.url ?? '';
		}

		if (!url) {
			return null;
		}

		return {
			url: url.startsWith('//') ? `https:${url}` : url,
			title: this.getSymbolFieldValue(resolvedAsset.fields?.title),
			description: this.getSymbolFieldValue(resolvedAsset.fields?.description)
		};
	}

	private getRichTextPlainText(content: RichTextNode | null | undefined): string {
		if (!content) {
			return '';
		}

		const parts: string[] = [];

		const walk = (node: RichTextNode) => {
			if (node.nodeType === 'text' && node.value) {
				parts.push(node.value);
			}

			const target = node.data?.target;
			if (node.nodeType === 'embedded-entry-block' && target?.fields?.subtitle) {
				parts.push(target.fields.subtitle);
			}

			for (const child of node.content ?? []) {
				walk(child);
			}
		};

		walk(content);
		return parts.join(' ').replace(/\s+/g, ' ').trim();
	}

	private truncateDescription(value: string, maxLength: number): string {
		const normalized = value.replace(/\s+/g, ' ').trim();

		if (normalized.length <= maxLength) {
			return normalized;
		}

		return `${normalized.slice(0, maxLength).trimEnd()}...`;
	}

	private getFirstRichTextAssetImage(
		content: RichTextNode | null | undefined
	): LibraryImage | null {
		if (!content) {
			return null;
		}

		if (content.nodeType === 'embedded-asset-block') {
			return this.getAssetImage(content.data?.target);
		}

		for (const child of content.content ?? []) {
			const image = this.getFirstRichTextAssetImage(child);

			if (image) {
				return image;
			}
		}

		return null;
	}

	private mapLibraryEntryPreview(
		entry: contentful.Entry<ContentfulLibraryEntry>
	): LibraryEntryPreview {
		return {
			title: this.getSymbolFieldValue(entry.fields.title),
			slug: this.getSymbolFieldValue(entry.fields.slug),
			format: this.getSymbolFieldValue(entry.fields.format) as LibraryEntryPreview['format'],
			creatorText: this.getSymbolFieldValue(entry.fields.creatorText),
			summary: this.getSymbolFieldValue(entry.fields.summary),
			recommendationNote: this.getSymbolFieldValue(entry.fields.recommendationNote),
			miniReview: this.getSymbolFieldValue(entry.fields.miniReview),
			publicationTitle: this.getSymbolFieldValue(entry.fields.publicationTitle),
			publicationDate: this.getDateFieldValue(entry.fields.publicationDate),
			externalUrl: this.getSymbolFieldValue(entry.fields.externalUrl),
			topics: this.getTagFieldValues(entry.fields.topics),
			readingStatus: this.getSymbolFieldValue(entry.fields.readingStatus) as
				| LibraryReadingStatus
				| '',
			startedOn: this.getDateFieldValue(entry.fields.startedOn),
			finishedOn: this.getDateFieldValue(entry.fields.finishedOn),
			rating: this.getIntegerFieldValue(entry.fields.rating),
			coverImage: this.getAssetImage(entry.fields.coverOrThumbnail)
		};
	}

	private mapBlogPostPreview(entry: contentful.Entry<ContentfulBlogPost>): BlogPostPreview {
		return {
			title: this.getSymbolFieldValue(entry.fields.title),
			slug: this.getSymbolFieldValue(entry.fields.slug),
			tags: this.getTagFieldValues(entry.fields.tags)
		};
	}

	private mapSitemapEntry<T extends ContentfulPage | ContentfulBlogPost>(
		entry: contentful.Entry<T>
	): SitemapContentEntry {
		return {
			slug: this.getSymbolFieldValue(entry.fields.slug),
			updatedAt: entry.sys.updatedAt ?? entry.sys.createdAt ?? new Date(0).toISOString()
		};
	}

	private async getPaginatedSitemapEntries<T extends ContentfulPage | ContentfulBlogPost>(
		contentType: T['contentTypeId']
	): Promise<SitemapContentEntry[]> {
		const limit = 1000;
		const items: Array<contentful.Entry<T>> = [];
		let skip = 0;

		while (true) {
			const entries = await this.client.getEntries<T>({
				content_type: contentType,
				order: 'fields.slug',
				limit,
				skip,
				select: ['fields.slug', 'sys.createdAt', 'sys.updatedAt'].join(',')
			} as unknown as contentful.EntriesQueries<T, undefined>);

			items.push(...entries.items);

			if (!entries.items.length || items.length >= entries.total) {
				break;
			}

			skip += entries.items.length;
		}

		return items.map((entry) => this.mapSitemapEntry(entry));
	}

	async getMostRecentlyCreatedBlogPosts(limit = 3, tag = ''): Promise<BlogPostPreview[]> {
		const query: Record<string, string | number> = {
			content_type: 'blogPost',
			order: '-sys.createdAt',
			limit
		};

		if (tag.trim()) {
			query['fields.tags[in]'] = tag.trim();
		}

		const entries = await this.client.getEntries<ContentfulBlogPost>(
			query as unknown as contentful.EntriesQueries<ContentfulBlogPost, undefined>
		);

		return entries.items.map((entry) => this.mapBlogPostPreview(entry));
	}

	async getLibraryEntries(): Promise<LibraryEntryPreview[]> {
		return this.cache.get(
			'library-entries',
			async () => {
				const entries = await this.client.getEntries<ContentfulLibraryEntry>({
					content_type: 'libraryEntry',
					order: 'fields.format,-fields.publicationDate,fields.title',
					include: 2
				} as unknown as contentful.EntriesQueries<ContentfulLibraryEntry, undefined>);

				return entries.items.map((entry) => this.mapLibraryEntryPreview(entry));
			},
			60 * 60
		);
	}

	async getLibraryEntry(slug: string): Promise<LibraryEntry> {
		return this.cache.get(
			`library-entry-${slug}`,
			async () => {
				const entries = await this.client.getEntries<ContentfulLibraryEntry>({
					content_type: 'libraryEntry',
					'fields.slug': slug,
					include: 2,
					limit: 1
				} as unknown as contentful.EntriesQueries<ContentfulLibraryEntry, undefined>);

				if (!entries.items.length) {
					throw new Error(`Library entry not found: ${slug}`);
				}

				const entry = entries.items[0];
				return {
					...this.mapLibraryEntryPreview(entry),
					notes: (entry.fields.notes as RichTextDocument | null | undefined) ?? null,
					contentfulMetadata: {
						entryId: entry.sys.id,
						locale: entry.sys.locale || 'en-US',
						environment: this.contentfulEnvironment
					},
					livePreview: {
						enabled: this.previewEnabled
					}
				};
			},
			60 * 60
		);
	}

	async getSitemapPages(): Promise<SitemapContentEntry[]> {
		return this.cache.get(
			'sitemap-pages',
			async () => this.getPaginatedSitemapEntries('page'),
			60 * 60 * 24
		);
	}

	async getSitemapBlogPosts(): Promise<SitemapContentEntry[]> {
		return this.cache.get(
			'sitemap-blog-posts',
			async () => this.getPaginatedSitemapEntries('blogPost'),
			60 * 60 * 24
		);
	}

	async getBlogPost(slug: string): Promise<BlogPost> {
		const entries = await this.client.getEntries<ContentfulBlogPost>({
			content_type: 'blogPost',
			'fields.slug': slug,
			include: 10,
			limit: 1
		} as unknown as contentful.EntriesQueries<ContentfulBlogPost, undefined>);

		if (!entries.items.length) {
			throw new Error(`Blog post not found: ${slug}`);
		}

		const post = entries.items[0];
		const body = (post.fields.body as RichTextDocument | null | undefined) ?? null;
		const explicitDescription = this.getSymbolFieldValue(post.fields.description);
		const derivedDescription = this.getRichTextPlainText(body as RichTextNode | null | undefined);

		return {
			title: this.getSymbolFieldValue(post.fields.title),
			slug: this.getSymbolFieldValue(post.fields.slug),
			description: explicitDescription
				? this.truncateDescription(explicitDescription, 160)
				: this.truncateDescription(derivedDescription, 100),
			socialImage: this.getFirstRichTextAssetImage(body as RichTextNode | null | undefined),
			body,
			tags: this.getTagFieldValues(post.fields.tags),
			published: post.sys.createdAt ?? post.sys.updatedAt ?? new Date(0).toISOString(),
			lastUpdated: post.sys.updatedAt ?? post.sys.createdAt ?? new Date(0).toISOString(),
			contentfulMetadata: {
				entryId: post.sys.id,
				locale: post.sys.locale || 'en-US',
				environment: this.contentfulEnvironment
			},
			livePreview: {
				enabled: this.previewEnabled
			}
		};
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
