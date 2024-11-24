import { fetchEntries, type BuilderContent } from '@builder.io/sdk-svelte';
import type { NavClient, NavLink } from '../navigation/nav';

import type { BlogClient, BlogPostSummary } from '../blog/Blog';

export const BUILDER_API_KEY = "22644214b95c46deab8d7849131f4881";

export class BuildIOClient implements NavClient, BlogClient {
    api_key: string  = "";

    constructor(api_key?: string) {
        this.api_key = api_key || BUILDER_API_KEY || "";
    }

    async getPostPreviews(tagList: string[]): Promise<BlogPostSummary[]> {
        if (this.api_key == '') {
            throw "Builder.io API Key not set";
        }

        let posts: BuilderContent[] = await fetchEntries({
            apiKey: this.api_key,
            model: 'blog-article',
            query: {
                "data.tags.$elemMatch" : {
                    $item: {
                        $in: tagList
                    }
                }
            }
        }) ?? [];
        
        return posts.map(blogpost => {

           
            return {
                title: blogpost.data?.title?.Default ?? '',
                blurb: blogpost.data?.blurb ?? '',
                slug: blogpost.data?.slug ?? '',
                featuredImage: blogpost.data?.featuredImage ?? '',
                featuredImageAltText: blogpost.data?.featuredImageAltText ?? '',
                previewText: blogpost.data?.previewText ?? '',
                published: blogpost.data?.published ?? new Date(),
                lastUpdated: blogpost.data?.lastUpdated ?? new Date(),
                tags: blogpost.data?.tags ?? []
            } as BlogPostSummary;
        }); 
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