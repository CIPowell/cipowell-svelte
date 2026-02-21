import { describe, expect, test } from 'vitest';
import { getResponseCacheHeaders, isPreviewRequest, resolveContentfulHost } from './preview';

describe('isPreviewRequest', () => {
	test('returns true when preview=true query param is set', () => {
		const url = new URL('https://example.com/about?preview=true');
		expect(isPreviewRequest(url)).toBe(true);
	});

	test('returns true when preview=1 query param is set', () => {
		const url = new URL('https://example.com/about?preview=1');
		expect(isPreviewRequest(url)).toBe(true);
	});

	test('returns false for non-preview requests', () => {
		const url = new URL('https://example.com/about');
		expect(isPreviewRequest(url)).toBe(false);
	});
});

describe('resolveContentfulHost', () => {
	test('forces preview host for preview requests', () => {
		expect(resolveContentfulHost(true, 'cdn.contentful.com')).toBe('preview.contentful.com');
	});

	test('uses configured host outside preview mode', () => {
		expect(resolveContentfulHost(false, 'cdn.contentful.com')).toBe('cdn.contentful.com');
	});

	test('falls back to delivery host when no host is configured', () => {
		expect(resolveContentfulHost(false)).toBe('cdn.contentful.com');
	});
});

describe('getResponseCacheHeaders', () => {
	test('returns strict no-cache headers for preview requests', () => {
		expect(getResponseCacheHeaders(true)).toEqual({
			'Cache-Control': 'private, no-store, no-cache, must-revalidate, max-age=0',
			Pragma: 'no-cache',
			Expires: '0'
		});
	});

	test('returns public cache headers for delivery requests', () => {
		expect(getResponseCacheHeaders(false)).toEqual({
			'Cache-Control': 'public, max-age=3600, s-maxage=86400'
		});
	});
});
