import { fetchEntries } from '@builder.io/sdk-svelte';
import type { NavClient, NavLink } from '../navigation/nav';

import { BUILDER_API_KEY } from '$env/static/private';

export class BuildIOClient implements NavClient {
    api_key: string  = "";

    constructor(api_key?: string) {
        this.api_key = api_key || BUILDER_API_KEY || "";
    }

    async getGlobalNavLinks() : Promise<NavLink[]> {
        if (this.api_key == '') {
            throw "Builder.io API Key not set";
        }
    
        let navPages = await fetchEntries({
            apiKey: this.api_key,
            model: 'page'
        });
    
        if (!navPages) {
            return [];
        }

        return navPages.map(page => ({
            title: (page.data?.title) ?? '',
            target: (page.data?.url) ?? ''
        }));
    }
} 