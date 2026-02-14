import { NavigationService, getOrderedNavLinks, type NavLink } from '$lib/services/navigation/nav';
import { env } from '$env/dynamic/private';

interface LayoutData {
	navLinks: NavLink[];
}

export async function load({ platform, setHeaders }) {
	const layoutData: LayoutData = {
		navLinks: []
	};

	try {
		const navService = new NavigationService(platform);
		layoutData.navLinks = getOrderedNavLinks(await navService.getGlobalNavLinks());
	} catch {
		layoutData.navLinks = getOrderedNavLinks([]);
	}

	// Disable caching for preview mode to avoid persisting draft content
	const contentfulHost = env.CONTENTFUL_HOST;
	const isPreviewMode = contentfulHost?.includes('preview');

	setHeaders({
		'Cache-Control': isPreviewMode ? 'private, no-store' : 'public, max-age=3600, s-maxage=86400'
	});

	return layoutData;
}
