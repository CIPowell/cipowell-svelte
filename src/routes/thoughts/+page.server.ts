import Contentful from '$lib/services/cms/contentful';

export async function load({ platform, url }) {
	const preview = url.searchParams.get('preview') === 'true';
	const contentful = new Contentful(platform, preview);
	const recentPosts = await contentful.getMostRecentlyCreatedBlogPosts(3);

	return {
		recentPosts
	};
}
