import { describe, expect, test } from 'vitest';

import { PRODUCTION_ORIGIN } from './robots';
import {
	DEFAULT_SOCIAL_IMAGE_PATH,
	SITE_NAME,
	buildOpenGraphMetadata,
	formatSeoTitle,
	resolveSocialImageUrl
} from './open-graph';

describe('formatSeoTitle', () => {
	test('appends the site name to page titles', () => {
		expect(formatSeoTitle('Thoughts')).toBe('Thoughts | Chris I Powell');
	});

	test('uses the site name by itself when no page title is available', () => {
		expect(formatSeoTitle('')).toBe(SITE_NAME);
	});
});

describe('resolveSocialImageUrl', () => {
	test('keeps external image URLs and expands root-relative/static asset paths', () => {
		expect(resolveSocialImageUrl('//images.ctfassets.net/post/main.png')).toBe(
			'https://images.ctfassets.net/post/main.png'
		);
		expect(resolveSocialImageUrl('/logo-cip.png')).toBe(`${PRODUCTION_ORIGIN}/logo-cip.png`);
	});

	test('rejects unsupported image URL protocols', () => {
		expect(resolveSocialImageUrl('javascript:alert(1)')).toBeNull();
	});
});

describe('buildOpenGraphMetadata', () => {
	test('builds canonical Open Graph metadata without query strings or trailing slashes', () => {
		expect(
			buildOpenGraphMetadata({
				title: 'About',
				description: 'About Chris I Powell.',
				path: '/about/?preview=true'
			})
		).toEqual({
			title: 'About | Chris I Powell',
			description: 'About Chris I Powell.',
			type: 'website',
			url: `${PRODUCTION_ORIGIN}/about`,
			siteName: SITE_NAME,
			image: {
				url: `${PRODUCTION_ORIGIN}${DEFAULT_SOCIAL_IMAGE_PATH}`,
				alt: SITE_NAME
			}
		});
	});

	test('uses article type and supplied image for blog posts', () => {
		expect(
			buildOpenGraphMetadata({
				title: 'Leading teams',
				description: 'A post about leadership.',
				path: '/thoughts/leading-teams',
				type: 'article',
				imageUrl: 'https://images.ctfassets.net/post/social.png',
				imageAlt: 'People around a workshop table'
			})
		).toMatchObject({
			title: 'Leading teams | Chris I Powell',
			description: 'A post about leadership.',
			type: 'article',
			url: `${PRODUCTION_ORIGIN}/thoughts/leading-teams`,
			image: {
				url: 'https://images.ctfassets.net/post/social.png',
				alt: 'People around a workshop table'
			}
		});
	});
});
