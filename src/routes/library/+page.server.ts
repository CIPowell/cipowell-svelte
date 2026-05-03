import Contentful from '$lib/services/cms/contentful';
import { createLibraryPageData, getLibraryPageData } from '$lib/services/library/library';

export async function load({ platform, url }) {
	const preview = url.searchParams.get('preview') === 'true';

	try {
		const contentful = new Contentful(platform, preview);
		const entries = await contentful.getLibraryEntries();
		return createLibraryPageData(entries);
	} catch (err) {
		if (preview) {
			throw err;
		}

		console.warn('Falling back to seeded Library content for local development.', err);
		return getLibraryPageData();
	}
}
