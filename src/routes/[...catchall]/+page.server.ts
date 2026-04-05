import Contentful from '$lib/services/cms/contentful';
import type { Page } from '$lib/services/page/Page';
import { error } from '@sveltejs/kit';

export async function load({ params, platform, url }) {
	const slug = params.catchall;
	const preview = url.searchParams.get('preview') == 'true';
	const contentful = new Contentful(platform, preview);
	let pageData: Page;

	try {
		pageData = await contentful.getPage(slug);
	} catch (err) {
		console.error(err);
		throw error(404, {
			message: 'Page not found'
		});
	}

	return pageData;
}
