import Contentful from '$lib/services/cms/contentful';
import type { Page } from '$lib/services/page/Page';
import { error } from '@sveltejs/kit';

export async function load({ params, platform }) {
	const slug = params.catchall;
	const contentful = new Contentful(platform);
	let pageData: Page;

	try {
		pageData = await contentful.getPage(slug);
	} catch {
		throw error(404, {
			message: 'Page not found'
		});
	}

	return pageData;
}
