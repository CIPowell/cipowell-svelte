import Contentful from '$lib/services/cms/contentful';
import { createLibraryPageData } from '$lib/services/library/library';

export async function load({ platform, url }) {
	const preview = url.searchParams.get('preview') === 'true';
	const contentful = new Contentful(platform, preview);
	const entries = await contentful.getLibraryEntries();
	return createLibraryPageData(entries);
}
