import { beforeEach, describe, expect, test, vi } from 'vitest';

const getXmlMock = vi.fn();

vi.mock('$lib/services/seo/sitemap', () => ({
	SITEMAP_CACHE_CONTROL: 'public, max-age=0, s-maxage=86400',
	SitemapService: class {
		getXml = getXmlMock;
	}
}));

import { GET } from '../../../routes/sitemap.xml/+server';

describe('GET /sitemap.xml', () => {
	beforeEach(() => {
		getXmlMock.mockReset();
	});

	test('returns the generated sitemap with XML and cache headers', async () => {
		getXmlMock.mockResolvedValueOnce('<?xml version="1.0" encoding="UTF-8"?><urlset />');

		const response = await GET({ platform: undefined } as never);

		expect(response.headers.get('content-type')).toBe('application/xml; charset=utf-8');
		expect(response.headers.get('cache-control')).toBe('public, max-age=0, s-maxage=86400');
		await expect(response.text()).resolves.toBe('<?xml version="1.0" encoding="UTF-8"?><urlset />');
	});
});
