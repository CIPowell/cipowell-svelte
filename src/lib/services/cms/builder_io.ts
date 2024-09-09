import { fetchEntries } from '@builder.io/sdk-svelte';
import type { NavLink } from '../navigation/nav';

export class BuildIOClient {
    api_key: string  = "";

    constructor(api_key: string) {
        this.api_key = api_key;
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