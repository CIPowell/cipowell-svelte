import { NavigationService, getOrderedNavLinks, type NavLink } from '$lib/services/navigation/nav';
import { DEFAULT_SITE_FOOTER, type SiteFooterContent } from '$lib/services/footer/footer-content';
import { FooterService } from '$lib/services/footer/footer.server';
import {
	buildSameAsUrls,
	buildSiteStructuredData,
	serializeJsonLd
} from '$lib/services/seo/structured-data';

interface LayoutData {
	navLinks: NavLink[];
	footer: SiteFooterContent;
	preview: boolean;
	siteStructuredDataJson: string;
}

export async function load({ platform, url }) {
	const preview = url.searchParams.get('preview') == 'true';
	const layoutData: LayoutData = {
		navLinks: [],
		footer: DEFAULT_SITE_FOOTER,
		preview,
		siteStructuredDataJson: ''
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

	console.log(`Loaded ${url} preview mode is ${preview}`);

	layoutData.siteStructuredDataJson = serializeJsonLd(
		buildSiteStructuredData(buildSameAsUrls(layoutData.footer.connect.links))
	);

	return layoutData;
}
