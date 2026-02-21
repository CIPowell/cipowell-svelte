const PREVIEW_HOST = 'preview.contentful.com';

const PREVIEW_RESPONSE_HEADERS = {
	'Cache-Control': 'private, no-store, no-cache, must-revalidate, max-age=0',
	Pragma: 'no-cache',
	Expires: '0'
} as const;

const DELIVERY_RESPONSE_HEADERS = {
	'Cache-Control': 'public, max-age=3600, s-maxage=86400'
} as const;

export function isPreviewRequest(url: URL): boolean {
	const previewParam = url.searchParams.get('preview')?.toLowerCase();
	return previewParam === 'true' || previewParam === '1';
}

export function resolveContentfulHost(preview: boolean, fallbackHost?: string): string {
	if (preview) {
		return PREVIEW_HOST;
	}

	return fallbackHost || 'cdn.contentful.com';
}

export function getResponseCacheHeaders(preview: boolean): Record<string, string> {
	return preview ? PREVIEW_RESPONSE_HEADERS : DELIVERY_RESPONSE_HEADERS;
}
