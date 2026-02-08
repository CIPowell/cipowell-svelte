import Contentful from '$lib/services/cms/contentful';
import type { Page } from '$lib/services/page/Page';
import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

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

	// Disable caching for preview mode to avoid persisting draft content
	const contentfulHost = env.CONTENTFUL_HOST;
	const isPreviewMode = contentfulHost?.includes('preview');

	setHeaders({
		'Cache-Control': isPreviewMode ? 'private, no-store' : 'public, max-age=3600, s-maxage=3600'
	});

	return pageData;
}
