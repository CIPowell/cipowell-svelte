import { ContentfulCache } from '$lib/services/cms/cache';
import Contentful, { type SitemapContentEntry } from '$lib/services/cms/contentful';

import { PRODUCTION_ORIGIN } from './robots';

export const SITEMAP_CACHE_TTL = 60 * 60 * 24;
export const SITEMAP_CACHE_CONTROL = `public, max-age=0, s-maxage=${SITEMAP_CACHE_TTL}`;

type SitemapChangeFrequency = 'daily' | 'weekly' | 'monthly';

export interface SitemapUrlEntry {
	loc: string;
	lastmod: string;
	changefreq: SitemapChangeFrequency;
	priority: number;
}

const STATIC_ROUTE_LASTMOD = '2026-04-06T00:00:00.000Z';

// Keep this list updated when new first-class public routes launch so they stay discoverable.
const STATIC_SITEMAP_ROUTES: Array<{
	path: string;
	lastmod: string;
	changefreq: SitemapChangeFrequency;
	priority: number;
}> = [
	{
		path: '/library',
		lastmod: STATIC_ROUTE_LASTMOD,
		changefreq: 'weekly',
		priority: 0.7
	},
	{
		path: '/thoughts',
		lastmod: STATIC_ROUTE_LASTMOD,
		changefreq: 'daily',
		priority: 0.8
	}
];

function escapeXml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}

function normalizeLastmod(value: string): string {
	const lastModified = new Date(value);

	if (Number.isNaN(lastModified.valueOf())) {
		return STATIC_ROUTE_LASTMOD;
	}

	return lastModified.toISOString();
}

export function normalizeCanonicalPath(value: string): string | null {
	const trimmed = value.trim();

	if (!trimmed) {
		return null;
	}

	const withoutQuery = trimmed.split(/[?#]/, 1)[0];
	if (!withoutQuery) {
		return null;
	}

	if (withoutQuery === '/' || withoutQuery.toLowerCase() === 'home') {
		return '/';
	}

	const withoutLeadingSlash = withoutQuery.replace(/^\/+/, '');
	const normalized = withoutLeadingSlash.replace(/\/+$/, '');

	if (!normalized) {
		return '/';
	}

	return `/${normalized}`;
}

function buildBlogPostPath(slug: string): string | null {
	const normalized = normalizeCanonicalPath(slug);

	if (!normalized || normalized === '/') {
		return null;
	}

	return `/thoughts${normalized}`;
}

function buildCanonicalUrl(path: string): string {
	if (path === '/') {
		return PRODUCTION_ORIGIN;
	}

	return `${PRODUCTION_ORIGIN}${path}`;
}

function mapStaticRoute(route: (typeof STATIC_SITEMAP_ROUTES)[number]): SitemapUrlEntry {
	return {
		loc: buildCanonicalUrl(route.path),
		lastmod: normalizeLastmod(route.lastmod),
		changefreq: route.changefreq,
		priority: route.priority
	};
}

function mapPageEntry(entry: SitemapContentEntry): SitemapUrlEntry | null {
	const path = normalizeCanonicalPath(entry.slug);

	if (!path) {
		return null;
	}

	return {
		loc: buildCanonicalUrl(path),
		lastmod: normalizeLastmod(entry.updatedAt),
		changefreq: path === '/' ? 'weekly' : 'monthly',
		priority: path === '/' ? 1 : 0.7
	};
}

function mapBlogPostEntry(entry: SitemapContentEntry): SitemapUrlEntry | null {
	const path = buildBlogPostPath(entry.slug);

	if (!path) {
		return null;
	}

	return {
		loc: buildCanonicalUrl(path),
		lastmod: normalizeLastmod(entry.updatedAt),
		changefreq: 'monthly',
		priority: 0.6
	};
}

export function buildSitemapUrls({
	pages,
	blogPosts
}: {
	pages: SitemapContentEntry[];
	blogPosts: SitemapContentEntry[];
}): SitemapUrlEntry[] {
	const urls = [
		...STATIC_SITEMAP_ROUTES.map((route) => mapStaticRoute(route)),
		...pages.map((entry) => mapPageEntry(entry)),
		...blogPosts.map((entry) => mapBlogPostEntry(entry))
	].filter((entry): entry is SitemapUrlEntry => entry !== null);

	const uniqueUrls = new Map<string, SitemapUrlEntry>();

	for (const entry of urls) {
		if (!uniqueUrls.has(entry.loc)) {
			uniqueUrls.set(entry.loc, entry);
		}
	}

	return [...uniqueUrls.values()].sort((left, right) => left.loc.localeCompare(right.loc));
}

export function buildSitemapXml(urls: SitemapUrlEntry[]): string {
	const body = urls
		.map(
			(entry) => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
    <lastmod>${escapeXml(entry.lastmod)}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority.toFixed(1)}</priority>
  </url>`
		)
		.join('\n');

	return [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
		body,
		'</urlset>'
	].join('\n');
}

export class SitemapService {
	private readonly cache: ContentfulCache;
	private readonly contentful: Contentful;

	constructor(platform?: App.Platform) {
		this.cache = new ContentfulCache(platform);
		this.contentful = new Contentful(platform);
	}

	async getXml(): Promise<string> {
		return this.cache.get(
			'seo-sitemap',
			async () => {
				const [pages, blogPosts] = await Promise.all([
					this.contentful.getSitemapPages(),
					this.contentful.getSitemapBlogPosts()
				]);

				return buildSitemapXml(
					buildSitemapUrls({
						pages,
						blogPosts
					})
				);
			},
			SITEMAP_CACHE_TTL
		);
	}
}
