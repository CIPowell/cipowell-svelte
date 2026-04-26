import { describe, expect, test } from 'vitest';

import { normalizeCanonicalPath } from './canonical';
import { PRODUCTION_ORIGIN } from './robots';
import { buildSitemapUrls, buildSitemapXml } from './sitemap';

describe('normalizeCanonicalPath', () => {
	test('maps home slugs and trims extra delimiters', () => {
		expect(normalizeCanonicalPath('home')).toBe('/');
		expect(normalizeCanonicalPath('/about/')).toBe('/about');
		expect(normalizeCanonicalPath('about?preview=true')).toBe('/about');
	});

	test('returns null for empty values', () => {
		expect(normalizeCanonicalPath('')).toBeNull();
		expect(normalizeCanonicalPath('   ')).toBeNull();
	});
});

describe('buildSitemapUrls', () => {
	test('combines static routes, content pages, and blog posts into canonical URLs', () => {
		const urls = buildSitemapUrls({
			pages: [
				{ slug: 'home', updatedAt: '2026-04-01T08:30:00.000Z' },
				{ slug: '/about/', updatedAt: '2026-04-02T09:45:00.000Z' },
				{ slug: 'thoughts', updatedAt: '2026-04-03T10:15:00.000Z' }
			],
			blogPosts: [{ slug: 'leading-teams', updatedAt: '2026-04-04T11:00:00.000Z' }]
		});

		expect(urls).toEqual([
			{
				loc: PRODUCTION_ORIGIN,
				lastmod: '2026-04-01T08:30:00.000Z',
				changefreq: 'weekly',
				priority: 1
			},
			{
				loc: `${PRODUCTION_ORIGIN}/about`,
				lastmod: '2026-04-02T09:45:00.000Z',
				changefreq: 'monthly',
				priority: 0.7
			},
			{
				loc: `${PRODUCTION_ORIGIN}/library`,
				lastmod: '2026-04-06T00:00:00.000Z',
				changefreq: 'weekly',
				priority: 0.7
			},
			{
				loc: `${PRODUCTION_ORIGIN}/thoughts`,
				lastmod: '2026-04-06T00:00:00.000Z',
				changefreq: 'daily',
				priority: 0.8
			},
			{
				loc: `${PRODUCTION_ORIGIN}/thoughts/leading-teams`,
				lastmod: '2026-04-04T11:00:00.000Z',
				changefreq: 'monthly',
				priority: 0.6
			}
		]);
	});

	test('preserves blog slugs named home instead of aliasing them to the site root', () => {
		const urls = buildSitemapUrls({
			pages: [],
			blogPosts: [{ slug: 'home', updatedAt: '2026-04-05T12:00:00.000Z' }]
		});

		expect(urls).toContainEqual({
			loc: `${PRODUCTION_ORIGIN}/thoughts/home`,
			lastmod: '2026-04-05T12:00:00.000Z',
			changefreq: 'monthly',
			priority: 0.6
		});
	});
});

describe('buildSitemapXml', () => {
	test('renders a valid XML sitemap body', () => {
		const xml = buildSitemapXml([
			{
				loc: `${PRODUCTION_ORIGIN}/thoughts/leading-teams`,
				lastmod: '2026-04-04T11:00:00.000Z',
				changefreq: 'monthly',
				priority: 0.6
			}
		]);

		expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
		expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
		expect(xml).toContain(`<loc>${PRODUCTION_ORIGIN}/thoughts/leading-teams</loc>`);
		expect(xml).toContain('<lastmod>2026-04-04T11:00:00.000Z</lastmod>');
		expect(xml).toContain('<changefreq>monthly</changefreq>');
		expect(xml).toContain('<priority>0.6</priority>');
	});
});
