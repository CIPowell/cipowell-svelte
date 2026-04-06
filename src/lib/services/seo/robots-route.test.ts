import { describe, expect, test } from 'vitest';

import { GET } from '../../../routes/robots.txt/+server';

describe('GET /robots.txt', () => {
	test('returns text/plain content for the production policy', async () => {
		const response = await GET({
			url: new URL('https://www.chrisipowell.co.uk/robots.txt')
		} as never);

		expect(response.headers.get('content-type')).toBe('text/plain; charset=utf-8');
		await expect(response.text()).resolves.toBe(
			[
				'User-agent: *',
				'Allow: /',
				'Sitemap: https://www.chrisipowell.co.uk/sitemap.xml',
				''
			].join('\n')
		);
	});

	test('returns a disallow-all policy outside production', async () => {
		const response = await GET({
			url: new URL('https://preview.chrisipowell.workers.dev/robots.txt')
		} as never);

		await expect(response.text()).resolves.toBe(['User-agent: *', 'Disallow: /', ''].join('\n'));
	});
});
