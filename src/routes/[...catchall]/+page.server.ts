import Contentful from '$lib/services/cms/contentful';
import type { Page } from '$lib/services/page/Page';
import { error } from '@sveltejs/kit';

export async function load({ params, platform, setHeaders }) {
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

	// Set cache headers for the page response
	// Cache for 1 hour in browser and CDN
	setHeaders({
		'Cache-Control': 'public, max-age=3600, s-maxage=3600'
	});

	return pageData;
}
