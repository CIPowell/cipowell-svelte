import { env } from '$env/dynamic/private';
import type { NavClient, NavLink } from '$lib/services/navigation/nav';
import * as contentful from 'contentful';
import type { ContentfulPage } from './content_types';
import type { Page, PageClient } from '$lib/services/page/Page';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { BLOCKS } from '@contentful/rich-text-types';
import { ContentfulCache } from './cache';

export class Contentful implements NavClient, PageClient {
	client: contentful.ContentfulClientApi<undefined>;
	cache: ContentfulCache;

	constructor(platform?: App.Platform) {
		const host = env.CONTENTFUL_HOST || 'cdn.contentful.com';
		const isPreviewMode = host === 'preview.contentful.com';

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
		this.cache = new ContentfulCache(platform);
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
					'fields.slug': slug || 'home'
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
				} as any);

				if (!pages.items || pages.items.length === 0) {
					console.error(`Page not found: ${slug}`);
					throw new Error(`Page not found: ${slug}`);
				}

				const page = pages.items[0];
				const breadcrumbs = this.getBreadcrumb(page);

				// Custom asset renderer for Contentful rich text
				const options = {
					renderNode: {
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						[BLOCKS.EMBEDDED_ASSET]: (node: any) => {
							const { file, description, title } = node.data.target.fields;
							// Use the same markup as the Image atom, but as a string
							// Default width to 600 if not specified
							const width = 600;
							const imageUrl = file?.url?.startsWith('http') ? file.url : `https:${file.url}`;
							return `
<picture>
  <source srcset="${imageUrl}?w=${width}&fm=avif" />
  <source srcset="${imageUrl}?w=${width}&fm=webp" />
  <img src="${imageUrl}?w=${width}&fm=png" alt="${description || title || ''}" />
</picture>
`;
						}
					}
				};

				return {
					title: page.fields.title as string,
					slug: page.fields.slug as string,
					content: documentToHtmlString(page.fields.content, options),
					breadcrumbs
				};
			},
			60 * 60 // Cache pages for 1 hour
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
