import { buildCanonicalUrl } from './canonical';

export const SITE_NAME = 'Chris I Powell';
export const DEFAULT_SITE_DESCRIPTION =
	'Product, design, and engineering leadership notes from Chris I Powell.';
export const DEFAULT_SOCIAL_IMAGE_PATH = '/logo-cip.png';

export type OpenGraphType = 'website' | 'article';

export interface OpenGraphImage {
	url: string;
	alt?: string;
}

export interface OpenGraphMetadata {
	title: string;
	description: string;
	type: OpenGraphType;
	url: string;
	siteName: string;
	image: OpenGraphImage;
}

interface BuildOpenGraphMetadataOptions {
	title?: string;
	description?: string;
	path: string;
	type?: OpenGraphType;
	imageUrl?: string | null;
	imageAlt?: string | null;
}

function cleanText(value: string): string {
	return value.replace(/\s+/g, ' ').trim();
}

export function formatSeoTitle(title?: string): string {
	const cleanTitle = cleanText(title ?? '');

	if (!cleanTitle || cleanTitle === SITE_NAME) {
		return SITE_NAME;
	}

	return `${cleanTitle} | ${SITE_NAME}`;
}

export function resolveSocialImageUrl(value?: string | null): string | null {
	const cleanValue = cleanText(value ?? '');

	if (!cleanValue) {
		return null;
	}

	if (cleanValue.startsWith('//')) {
		return `https:${cleanValue}`;
	}

	if (cleanValue.startsWith('/')) {
		return buildCanonicalUrl(cleanValue);
	}

	try {
		const url = new URL(cleanValue);
		return ['http:', 'https:'].includes(url.protocol) ? url.toString() : null;
	} catch {
		return null;
	}
}

export function buildOpenGraphMetadata({
	title,
	description = DEFAULT_SITE_DESCRIPTION,
	path,
	type = 'website',
	imageUrl,
	imageAlt
}: BuildOpenGraphMetadataOptions): OpenGraphMetadata {
	const resolvedImageUrl =
		resolveSocialImageUrl(imageUrl) ?? buildCanonicalUrl(DEFAULT_SOCIAL_IMAGE_PATH);

	return {
		title: formatSeoTitle(title),
		description: cleanText(description) || DEFAULT_SITE_DESCRIPTION,
		type,
		url: buildCanonicalUrl(path),
		siteName: SITE_NAME,
		image: {
			url: resolvedImageUrl,
			alt: cleanText(imageAlt ?? '') || SITE_NAME
		}
	};
}
