import type { RequestHandler } from './$types';

import { SITEMAP_CACHE_CONTROL, SitemapService } from '$lib/services/seo/sitemap';

export const GET: RequestHandler = async ({ platform }) => {
	const sitemap = await new SitemapService(platform).getXml();

	return new Response(sitemap, {
		headers: {
			'cache-control': SITEMAP_CACHE_CONTROL,
			'content-type': 'application/xml; charset=utf-8'
		}
	});
};
