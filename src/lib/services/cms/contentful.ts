import { env } from '$env/dynamic/private';
import type { NavClient, NavLink } from '$lib/services/navigation/nav';
import * as contentful from 'contentful';
import type { ContentfulPage } from './content_types';
import type { Page, PageClient } from '$lib/services/page/Page';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { page } from '$app/state';

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
            'fields.slug': slug
        });

        if (pages.items.length === 0) {
            throw new Error(`Page not found: ${slug}`);
        }

        let page = pages.items[0];

        return {
            title: page.fields.title,
            slug: page.fields.slug,
            content: documentToHtmlString(page.fields.content),
            breadcrumbs: []
        };
    }
};

export default Contentful;