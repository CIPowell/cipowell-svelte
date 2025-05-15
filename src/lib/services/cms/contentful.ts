import { env } from '$env/dynamic/private';
import type { NavClient, NavLink } from '$lib/services/navigation/nav';
import * as contentful from 'contentful';
import type { Page } from './content_types';
import { page } from '$app/state';

export class Contentful implements NavClient {
    client: contentful.ContentfulClientApi<undefined>;

    constructor() {
        this.client = contentful.createClient({
            space: 'c85g7urd11yl',
            accessToken: env.CONTENTFUL_API_KEY,
            host: env.CONTENTFUL_HOST || "cdn.contentful.com"
        });
    }

    async getGlobalNavLinks(): Promise<NavLink[]> {
        let pages = await this.client.getEntries<Page>({
            'content_type': 'page',
        });

        return pages.items.filter(p => !p.fields.parent)
            .map(p => ({
                title: p.fields.title,
                target: p.fields.slug
            }));
    }
};

export default Contentful;