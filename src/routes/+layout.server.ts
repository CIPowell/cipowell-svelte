import { NavigationService, type NavLink } from '$lib/services/navigation/nav';
import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

interface LayoutData {
	navLinks: NavLink[];
}

export async function load({ platform, setHeaders }) {
	const navService = new NavigationService(platform);
	const layoutData: LayoutData = {
		navLinks: []
	};

	try {
		layoutData.navLinks = await navService.getGlobalNavLinks();
	} catch {
		throw error(500, {
			message: 'Failed to load Layout data'
		});
	}

	// Disable caching for preview mode to avoid persisting draft content
	const contentfulHost = env.CONTENTFUL_HOST;
	const isPreviewMode = contentfulHost?.includes('preview');

	setHeaders({
		'Cache-Control': isPreviewMode ? 'private, no-store' : 'public, max-age=3600, s-maxage=86400'
	});

	return layoutData;
}
