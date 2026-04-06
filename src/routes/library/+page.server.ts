import { getLibraryPageData } from '$lib/services/library/library';

export async function load() {
	return getLibraryPageData();
}
