import { NavigationService, getOrderedNavLinks, type NavLink } from '$lib/services/navigation/nav';
import { DEFAULT_SITE_FOOTER, type SiteFooterContent } from '$lib/services/footer/footer-content';
import { FooterService } from '$lib/services/footer/footer.server';
import { env } from '$env/dynamic/private';
import { getResponseCacheHeaders, isPreviewRequest } from '$lib/services/cms/preview';

interface LayoutData {
	navLinks: NavLink[];
	footer: SiteFooterContent;
}

export async function load({ platform, setHeaders, url }) {
	const preview = isPreviewRequest(url);
	const layoutData: LayoutData = {
		navLinks: [],
		footer: DEFAULT_SITE_FOOTER
	};

	try {
		const navService = new NavigationService(platform, preview);
		layoutData.navLinks = getOrderedNavLinks(await navService.getGlobalNavLinks());
	} catch {
		layoutData.navLinks = getOrderedNavLinks([]);
	}

	try {
		const footerService = new FooterService(platform, preview);
		layoutData.footer = await footerService.getSiteFooter();
	} catch {
		layoutData.footer = DEFAULT_SITE_FOOTER;
	}

	// Disable caching for preview mode to avoid persisting draft content
	const contentfulHost = env.CONTENTFUL_HOST;
	const isPreviewMode = preview || Boolean(contentfulHost?.includes('preview'));

	setHeaders(getResponseCacheHeaders(isPreviewMode));

	return layoutData;
}
