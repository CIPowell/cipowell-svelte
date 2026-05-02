import type { BlogPost } from '$lib/services/blog/Blog';
import Contentful from '$lib/services/cms/contentful';
import { buildArticleStructuredData, serializeJsonLd } from '$lib/services/seo/structured-data';
import { error } from '@sveltejs/kit';

export async function load({ params, platform, url }) {
	const preview = url.searchParams.get('preview') === 'true';
	const contentful = new Contentful(platform, preview);
	let post: BlogPost;

	try {
		post = await contentful.getBlogPost(params.slug);
	} catch (err) {
		console.error(err);
		throw error(404, {
			message: 'Post not found'
		});
	}

	return {
		...post,
		articleStructuredDataJson: serializeJsonLd(buildArticleStructuredData(post))
	};
}
