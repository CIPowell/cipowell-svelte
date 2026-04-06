import { describe, expect, test } from 'vitest';

import { buildRobotsTxt, isProductionOrigin, PRODUCTION_ORIGIN } from './robots';

describe('robots policy', () => {
	test('matches the canonical production origin exactly', () => {
		expect(isProductionOrigin(PRODUCTION_ORIGIN)).toBe(true);
		expect(isProductionOrigin('https://preview.chrisipowell.workers.dev')).toBe(false);
		expect(isProductionOrigin('http://www.chrisipowell.co.uk')).toBe(false);
	});

	test('allows crawling and includes the sitemap for production', () => {
		expect(buildRobotsTxt(PRODUCTION_ORIGIN)).toBe(
			[
				'User-agent: *',
				'Allow: /',
				'Sitemap: https://www.chrisipowell.co.uk/sitemap.xml',
				''
			].join('\n')
		);
	});

	test('disallows all crawling for non-production origins', () => {
		expect(buildRobotsTxt('http://localhost:5173')).toBe(
			['User-agent: *', 'Disallow: /', ''].join('\n')
		);
	});
});
