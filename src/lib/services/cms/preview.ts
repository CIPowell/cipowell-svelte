const PREVIEW_HOST = 'preview.contentful.com';

const PREVIEW_RESPONSE_HEADERS = {
	'Cache-Control': 'private, no-store, no-cache, must-revalidate, max-age=0',
	Pragma: 'no-cache',
	Expires: '0'
} as const;

const DELIVERY_RESPONSE_HEADERS = {
	'Cache-Control': 'public, max-age=3600, s-maxage=86400'
} as const;

const CONTENTFUL_APP_HOSTS = new Set(['app.contentful.com', 'app.eu.contentful.com']);

function parseHost(value: string | null | undefined): string | null {
	if (!value) {
		return null;
	}

	try {
		return new URL(value).hostname;
	} catch {
		return null;
	}
}

export function isContentfulLivePreviewUrl(url: URL): boolean {
	const livePreviewParam = url.searchParams.get('live_preview')?.toLowerCase();
	if (livePreviewParam === 'true' || livePreviewParam === '1') {
		return true;
	}

	const ctfLivePreviewParam = url.searchParams.get('ctf_live_preview')?.toLowerCase();
	if (ctfLivePreviewParam === 'true' || ctfLivePreviewParam === '1') {
		return true;
	}

	return Boolean(url.searchParams.get('ctf_space_id') && url.searchParams.get('ctf_entry_id'));
}

export function isContentfulLivePreviewRequest(url: URL, referer?: string | null): boolean {
	if (isContentfulLivePreviewUrl(url)) {
		return true;
	}

	const refererHost = parseHost(referer);
	return refererHost ? CONTENTFUL_APP_HOSTS.has(refererHost) : false;
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

export function isContentfulLivePreviewClientContext(): boolean {
	if (typeof window === 'undefined' || typeof document === 'undefined') {
		return false;
	}

	const inIframe = window.self !== window.top;
	if (!inIframe) {
		return false;
	}

	const refererHost = parseHost(document.referrer);
	return refererHost ? CONTENTFUL_APP_HOSTS.has(refererHost) : false;
}
