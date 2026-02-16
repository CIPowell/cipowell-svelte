import { NavigationService, getOrderedNavLinks, type NavLink } from '$lib/services/navigation/nav';
import {
	DEFAULT_SITE_FOOTER,
	FooterService,
	type SiteFooterContent
} from '$lib/services/footer/footer';
import { env } from '$env/dynamic/private';

interface LayoutData {
	navLinks: NavLink[];
	footer: SiteFooterContent;
}

export async function load({ platform, setHeaders }) {
	const layoutData: LayoutData = {
		navLinks: [],
		footer: DEFAULT_SITE_FOOTER
	};

	try {
		const navService = new NavigationService(platform);
		layoutData.navLinks = getOrderedNavLinks(await navService.getGlobalNavLinks());
	} catch {
		layoutData.navLinks = getOrderedNavLinks([]);
	}

	try {
		const footerService = new FooterService(platform);
		layoutData.footer = await footerService.getSiteFooter();
	} catch {
		layoutData.footer = DEFAULT_SITE_FOOTER;
	}

	// Disable caching for preview mode to avoid persisting draft content
	const contentfulHost = env.CONTENTFUL_HOST;
	const isPreviewMode = contentfulHost?.includes('preview');

	setHeaders({
		'Cache-Control': isPreviewMode ? 'private, no-store' : 'public, max-age=3600, s-maxage=86400'
	});

	return layoutData;
}
