import type { RequestHandler } from './$types';

import { buildRobotsTxt } from '$lib/services/seo/robots';

export const GET: RequestHandler = ({ url }) => {
	return new Response(buildRobotsTxt(url.origin), {
		headers: {
			'content-type': 'text/plain; charset=utf-8'
		}
	});
};
