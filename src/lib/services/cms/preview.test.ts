import { describe, expect, test } from 'vitest';
import {
	getResponseCacheHeaders,
	isContentfulLivePreviewRequest,
	isContentfulLivePreviewUrl,
	resolveContentfulHost
} from './preview';

describe('isContentfulLivePreviewUrl', () => {
	test('returns true when ctf_live_preview=true query param is set', () => {
		const url = new URL('https://example.com/about?ctf_live_preview=true');
		expect(isContentfulLivePreviewUrl(url)).toBe(true);
	});

	test('returns true when ctf entry context query params are set', () => {
		const url = new URL('https://example.com/about?ctf_space_id=space&ctf_entry_id=entry');
		expect(isContentfulLivePreviewUrl(url)).toBe(true);
	});

	test('returns false for non-live-preview urls', () => {
		const url = new URL('https://example.com/about');
		expect(isContentfulLivePreviewUrl(url)).toBe(false);
	});
});

describe('isContentfulLivePreviewRequest', () => {
	test('returns true when referer is Contentful app', () => {
		const url = new URL('https://example.com/about');
		expect(isContentfulLivePreviewRequest(url, 'https://app.contentful.com/spaces/my-space')).toBe(
			true
		);
	});

	test('returns false when referer and url are not Contentful live preview', () => {
		const url = new URL('https://example.com/about');
		expect(isContentfulLivePreviewRequest(url, 'https://example.org/path')).toBe(false);
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
