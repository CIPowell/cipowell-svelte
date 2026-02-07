import { NavigationService, type NavLink } from '$lib/services/navigation/nav';
import { error } from '@sveltejs/kit';

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
		error(500, {
			message: 'Failed to load Layout data'
		});
	}

	// Set cache headers for the page response
	// Cache for 1 hour in browser, 24 hours in CDN
	setHeaders({
		'Cache-Control': 'public, max-age=3600, s-maxage=86400'
	});

	return layoutData;
}
