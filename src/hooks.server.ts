import type { Handle } from '@sveltejs/kit';

const LOG_SAMPLE_PERCENT = 10;

const SUSPICIOUS_PATH_RULES = [
	{
		reason: 'xmlrpc-endpoint',
		test: (pathname: string) => pathname === '/xmlrpc.php'
	},
	{
		reason: 'wordpress-probe',
		test: (pathname: string) => pathname.startsWith('/wp-')
	},
	{
		reason: 'php-script-probe',
		test: (pathname: string) => pathname.endsWith('.php')
	}
] as const;

export const getSuspiciousPathReason = (pathname: string): string | null => {
	const matchedRule = SUSPICIOUS_PATH_RULES.find((rule) => rule.test(pathname));

	return matchedRule?.reason ?? null;
};

export const isSuspiciousPath = (pathname: string): boolean =>
	getSuspiciousPathReason(pathname) !== null;

export const shouldSampleSuspiciousLog = (pathname: string, userAgent: string): boolean => {
	let hash = 0;
	const input = `${pathname}|${userAgent}`;

	for (let index = 0; index < input.length; index += 1) {
		hash = (hash * 31 + input.charCodeAt(index)) >>> 0;
	}

	return hash % 100 < LOG_SAMPLE_PERCENT;
};

const createBlockedResponse = (): Response =>
	new Response('Not Found', {
		status: 404,
		headers: {
			'cache-control': 'no-store',
			'x-robots-tag': 'noindex'
		}
	});

export const handle: Handle = async ({ event, resolve }) => {
	const { pathname } = event.url;
	const suspiciousPathReason = getSuspiciousPathReason(pathname);

	if (suspiciousPathReason === null) {
		return resolve(event);
	}

	const userAgent = event.request.headers.get('user-agent') ?? 'unknown';

	if (shouldSampleSuspiciousLog(pathname, userAgent)) {
		console.warn('Blocked suspicious request path', {
			reason: suspiciousPathReason,
			path: pathname,
			method: event.request.method,
			userAgent,
			referer: event.request.headers.get('referer'),
			ip: event.request.headers.get('cf-connecting-ip')
		});
	}

	return createBlockedResponse();
};
