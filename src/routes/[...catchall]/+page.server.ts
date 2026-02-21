import Contentful from '$lib/services/cms/contentful';
import type { Page } from '$lib/services/page/Page';
import { error } from '@sveltejs/kit';
import { getResponseCacheHeaders, isPreviewRequest } from '$lib/services/cms/preview';

export async function load({ params, platform, setHeaders, url }) {
	const slug = params.catchall;
	const preview = isPreviewRequest(url);
	const contentful = new Contentful(platform, preview);
	setHeaders(getResponseCacheHeaders(preview));
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
