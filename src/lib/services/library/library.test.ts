import { describe, expect, test } from 'vitest';
import { getLibraryEntryData, getLibraryPageData } from './library';

describe('seed Library data', () => {
	test('returns local fallback page data with preview disabled', () => {
		const pageData = getLibraryPageData();

		expect(pageData.entries.length).toBeGreaterThan(0);
		expect(pageData.livePreview).toEqual({ enabled: false });
	});

	test('returns local fallback detail data for seeded entries', () => {
		const entry = getLibraryEntryData('art-of-gathering');

		expect(entry).toMatchObject({
			title: 'The Art of Gathering',
			slug: 'art-of-gathering',
			format: 'book',
			contentfulMetadata: {
				entryId: 'art-of-gathering',
				locale: 'en-US',
				environment: 'local'
			},
			livePreview: {
				enabled: false
			}
		});
	});
});
