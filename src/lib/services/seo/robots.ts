export const PRODUCTION_ORIGIN = 'https://www.chrisipowell.co.uk';
export const PRODUCTION_SITEMAP_URL = `${PRODUCTION_ORIGIN}/sitemap.xml`;

const PRODUCTION_POLICY = ['User-agent: *', 'Allow: /', `Sitemap: ${PRODUCTION_SITEMAP_URL}`];
const NON_PRODUCTION_POLICY = ['User-agent: *', 'Disallow: /'];

export function isProductionOrigin(origin: string): boolean {
	return origin === PRODUCTION_ORIGIN;
}

export function buildRobotsTxt(origin: string): string {
	const policy = isProductionOrigin(origin) ? PRODUCTION_POLICY : NON_PRODUCTION_POLICY;

	return `${policy.join('\n')}\n`;
}
