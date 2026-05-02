import type { BlogPost } from '$lib/services/blog/Blog';
import type { SiteFooterContent } from '$lib/services/footer/footer-content';

import { PRODUCTION_ORIGIN } from './robots';

const SITE_NAME = 'Chris I Powell';
const SITE_DESCRIPTION = 'Building teams and systems that deliver real impact.';
const LANGUAGE = 'en-GB';
const PERSON_ID = `${PRODUCTION_ORIGIN}/#person`;
const WEBSITE_ID = `${PRODUCTION_ORIGIN}/#website`;
const DEFAULT_PERSON_SAME_AS = [
	'https://www.linkedin.com/in/chris-i-powell/',
	'https://github.com/CIPowell'
];

type JsonLdValue =
	| string
	| number
	| boolean
	| null
	| JsonLdValue[]
	| { [key: string]: JsonLdValue };

type JsonLdNode = { [key: string]: JsonLdValue };
type SameAsLink = SiteFooterContent['connect']['links'][number];

function toCanonicalUrl(path: string): string {
	if (path === '/') {
		return PRODUCTION_ORIGIN;
	}

	const normalizedPath = path.startsWith('/') ? path : `/${path}`;
	return `${PRODUCTION_ORIGIN}${normalizedPath}`;
}

function isSpecificSocialUrl(url: URL): boolean {
	const hostname = url.hostname.replace(/^www\./, '');
	const path = url.pathname.replace(/\/+$/, '');

	if ((hostname === 'github.com' || hostname === 'linkedin.com') && !path) {
		return false;
	}

	return url.protocol === 'https:' || url.protocol === 'http:';
}

function normalizeSameAsUrl(value: string): string | null {
	try {
		const url = new URL(value);

		if (!isSpecificSocialUrl(url)) {
			return null;
		}

		return url.toString();
	} catch {
		return null;
	}
}

function normalizeIsoDate(value: string): string {
	const date = new Date(value);

	if (Number.isNaN(date.valueOf())) {
		return new Date(0).toISOString();
	}

	return date.toISOString();
}

export function buildSameAsUrls(links: SameAsLink[]): string[] {
	const sameAs = new Set<string>();

	for (const value of DEFAULT_PERSON_SAME_AS) {
		const normalized = normalizeSameAsUrl(value);
		if (normalized) {
			sameAs.add(normalized);
		}
	}

	for (const link of links) {
		const normalized = normalizeSameAsUrl(link.href);
		if (normalized) {
			sameAs.add(normalized);
		}
	}

	return [...sameAs];
}

export function buildSiteStructuredData(sameAs: string[]): JsonLdNode {
	return {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'Person',
				'@id': PERSON_ID,
				name: SITE_NAME,
				url: PRODUCTION_ORIGIN,
				description: SITE_DESCRIPTION,
				sameAs
			},
			{
				'@type': 'WebSite',
				'@id': WEBSITE_ID,
				url: PRODUCTION_ORIGIN,
				name: SITE_NAME,
				description: SITE_DESCRIPTION,
				inLanguage: LANGUAGE,
				author: { '@id': PERSON_ID },
				publisher: { '@id': PERSON_ID }
			}
		]
	};
}

export function buildArticleStructuredData(post: BlogPost): JsonLdNode {
	const canonicalUrl = toCanonicalUrl(`/thoughts/${post.slug}`);
	const keywords = post.tags.length ? post.tags.join(', ') : undefined;

	return {
		'@context': 'https://schema.org',
		'@type': 'Article',
		'@id': `${canonicalUrl}#article`,
		url: canonicalUrl,
		mainEntityOfPage: canonicalUrl,
		isPartOf: { '@id': WEBSITE_ID },
		headline: post.title,
		name: `${SITE_NAME} - ${post.title}`,
		description: post.description,
		datePublished: normalizeIsoDate(post.published),
		dateModified: normalizeIsoDate(post.lastUpdated),
		inLanguage: LANGUAGE,
		author: { '@id': PERSON_ID },
		publisher: { '@id': PERSON_ID },
		...(keywords ? { keywords } : {})
	};
}

export function serializeJsonLd(data: JsonLdNode): string {
	return JSON.stringify(data)
		.replace(/</g, '\\u003c')
		.replace(/>/g, '\\u003e')
		.replace(/&/g, '\\u0026')
		.replace(/\u2028/g, '\\u2028')
		.replace(/\u2029/g, '\\u2029');
}
