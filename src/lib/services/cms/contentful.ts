import { env } from '$env/dynamic/private';
import type { NavClient, NavLink } from '$lib/services/navigation/nav';
import * as contentful from 'contentful';
import type { ContentfulPage } from './content_types';
import type { Page, PageClient } from '$lib/services/page/Page';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { page } from '$app/state';
import { BLOCKS } from '@contentful/rich-text-types';

export class Contentful implements NavClient, PageClient {
    client: contentful.ContentfulClientApi<undefined>;

    constructor() {
        this.client = contentful.createClient({
            space: 'c85g7urd11yl',
            accessToken: env.CONTENTFUL_API_KEY,
            host: env.CONTENTFUL_HOST || "cdn.contentful.com"
        });
    }

    async getGlobalNavLinks(): Promise<NavLink[]> {
        let pages = await this.client.getEntries<ContentfulPage>({
            'content_type': 'page',
        });

        return pages.items.filter(p => !p.fields.parent)
            .map(p => ({
                title: p.fields.title,
                target: p.fields.slug
            }));
    }

    async getPage(slug: string): Promise<Page> {
        let pages = await this.client.getEntries<ContentfulPage>({
            'content_type': 'page',
            'fields.slug': slug || 'home'
        });

        if (!pages.items || pages.items.length === 0) {
            console.error(`Page not found: ${slug}`)
            throw new Error(`Page not found: ${slug}`);
        }

        let page = pages.items[0];
        let breadcrumbs =  this.getBreadcrumb(page);

        // Custom asset renderer for Contentful rich text
        const options = {
            renderNode: {
                [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
                    const { file, description, title } = node.data.target.fields;
                    // Use the same markup as the Image atom, but as a string
                    // Default width to 600 if not specified
                    const width = 600;
                    const imageUrl = file?.url?.startsWith('http') ? file.url : `https:${file.url}`;
                    return `
<picture>
  <source srcset=\"${imageUrl}?w=${width}&fm=avif\" />
  <source srcset=\"${imageUrl}?w=${width}&fm=webp\" />
  <img src=\"${imageUrl}?w=${width}&fm=png\" alt=\"${description || title || ''}\" />
</picture>
`;
                }
            }
        };

        return {
            title: page.fields.title,
            slug: page.fields.slug,
            content: documentToHtmlString(page.fields.content, options),
            breadcrumbs
        };
    }

    getBreadcrumb(page: contentful.Entry): NavLink[] {
        let breadcrumbs: NavLink[] = []
        if (page.fields.parent) { 
            breadcrumbs = this.getBreadcrumb(page.fields.parent)
        }

        breadcrumbs.push({
            title: page.fields.title,
            target: page.fields.slug
        });
        return breadcrumbs;
    }
};

export default Contentful;