import type { LibraryEntry } from '$lib/services/library/library';
import Contentful from '$lib/services/cms/contentful';
import { error } from '@sveltejs/kit';

export async function load({ params, platform, url }) {
	const preview = url.searchParams.get('preview') === 'true';
	const contentful = new Contentful(platform, preview);
	let entry: LibraryEntry;

	try {
		entry = await contentful.getLibraryEntry(params.slug);
	} catch (err) {
		console.error(err);
		throw error(404, {
			message: 'Library entry not found'
		});
	}

	return entry;
}
