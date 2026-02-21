const PREVIEW_HOST = 'preview.contentful.com';

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

