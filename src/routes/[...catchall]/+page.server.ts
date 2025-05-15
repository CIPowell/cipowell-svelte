import Contentful from '$lib/services/cms/contentful';
import type { Page } from '$lib/services/page/Page';
import type { NavLink } from '$lib/services/navigation/nav';
import { error } from '@sveltejs/kit';


export async function load({ params }) {
    const slug = params.catchall;
    const contentful = new Contentful();
    let pageData: Page;

    try {
        pageData = await contentful.getPage(slug);
    } catch (err) {
        throw error(404, {
            message: 'Page not found'
        });
    }

    return pageData;
}