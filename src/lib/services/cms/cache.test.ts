import { describe, expect, test } from 'vitest';
import { ContentfulCache } from './cache';

describe('ContentfulCache', () => {
	test('handles cache keys with malformed URI characters without throwing', async () => {
		const cache = new ContentfulCache(undefined, 'cdn.contentful.com');
		const malformedKey = 'page-\ud800';

		await expect(cache.get(malformedKey, async () => 'ok')).resolves.toBe('ok');
	});
});
