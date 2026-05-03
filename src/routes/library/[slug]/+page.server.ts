import { getLibraryEntryData, type LibraryEntry } from '$lib/services/library/library';
import Contentful from '$lib/services/cms/contentful';
import { error } from '@sveltejs/kit';

export async function load({ params, platform, url }) {
	const preview = url.searchParams.get('preview') === 'true';
	let entry: LibraryEntry;

	try {
		const contentful = new Contentful(platform, preview);
		entry = await contentful.getLibraryEntry(params.slug);
	} catch (err) {
		if (!preview) {
			try {
				console.warn('Falling back to seeded Library entry for local development.', err);
				return getLibraryEntryData(params.slug);
			} catch {
				// Continue to the shared 404 below.
			}
		}

		console.error(err);
		throw error(404, {
			message: 'Library entry not found'
		});
	}

	return entry;
}
