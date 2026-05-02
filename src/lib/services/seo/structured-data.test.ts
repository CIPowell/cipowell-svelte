import { describe, expect, test } from 'vitest';

import type { BlogPost } from '$lib/services/blog/Blog';

import {
	buildArticleStructuredData,
	buildSameAsUrls,
	buildSiteStructuredData,
	serializeJsonLd
} from './structured-data';
import { PRODUCTION_ORIGIN } from './robots';

describe('buildSameAsUrls', () => {
	test('includes default personal profiles and configured social links', () => {
		const sameAs = buildSameAsUrls([
			{ label: 'Generic GitHub', href: 'https://github.com' },
			{ label: 'Mastodon', href: 'https://mastodon.social/@chrisipowell' },
			{ label: 'Email', href: 'mailto:hello@example.com' }
		]);

		expect(sameAs).toEqual([
			'https://www.linkedin.com/in/chris-i-powell/',
			'https://github.com/CIPowell',
			'https://mastodon.social/@chrisipowell'
		]);
	});
});

describe('buildSiteStructuredData', () => {
	test('builds a Person-centric site graph', () => {
		const graph = buildSiteStructuredData(['https://github.com/CIPowell']);

		expect(graph).toEqual({
			'@context': 'https://schema.org',
			'@graph': [
				expect.objectContaining({
					'@type': 'Person',
					'@id': `${PRODUCTION_ORIGIN}/#person`,
					name: 'Chris I Powell',
					sameAs: ['https://github.com/CIPowell']
				}),
				expect.objectContaining({
					'@type': 'WebSite',
					'@id': `${PRODUCTION_ORIGIN}/#website`,
					url: PRODUCTION_ORIGIN,
					author: { '@id': `${PRODUCTION_ORIGIN}/#person` }
				})
			]
		});
	});
});

describe('buildArticleStructuredData', () => {
	test('builds canonical Article data for a blog post', () => {
		const post = {
			title: 'Leading teams well',
			slug: 'leading-teams-well',
			description: 'A practical reflection on leading teams well.',
			socialImage: null,
			body: null,
			tags: ['leadership', 'teams'],
			published: '2026-04-01T08:30:00.000Z',
			lastUpdated: '2026-04-02T09:45:00.000Z',
			contentfulMetadata: {
				entryId: 'post-1',
				locale: 'en-US',
				environment: 'master'
			},
			livePreview: {
				enabled: false
			}
		} satisfies BlogPost;

		expect(buildArticleStructuredData(post)).toEqual(
			expect.objectContaining({
				'@context': 'https://schema.org',
				'@type': 'Article',
				'@id': `${PRODUCTION_ORIGIN}/thoughts/leading-teams-well#article`,
				url: `${PRODUCTION_ORIGIN}/thoughts/leading-teams-well`,
				headline: 'Leading teams well',
				name: 'Chris I Powell - Leading teams well',
				description: 'A practical reflection on leading teams well.',
				datePublished: '2026-04-01T08:30:00.000Z',
				dateModified: '2026-04-02T09:45:00.000Z',
				keywords: 'leadership, teams',
				author: { '@id': `${PRODUCTION_ORIGIN}/#person` }
			})
		);
	});
});

describe('serializeJsonLd', () => {
	test('serializes JSON-LD safely for script content', () => {
		const json = serializeJsonLd({
			'@context': 'https://schema.org',
			'@type': 'Thing',
			name: '</script><script>alert(1)</script>'
		});

		expect(json).toContain('\\u003c/script\\u003e');
		expect(json).not.toContain('</script><script>');
	});
});
