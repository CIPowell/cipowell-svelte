import { PRODUCTION_ORIGIN } from './robots';

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

export function buildCanonicalUrl(value: string): string {
	const path = normalizeCanonicalPath(value) ?? '/';

	if (path === '/') {
		return PRODUCTION_ORIGIN;
	}

	return `${PRODUCTION_ORIGIN}${path}`;
}
