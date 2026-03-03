import Contentful from '../cms/contentful';
import type { SiteFooterContent } from './footer-content';

export interface FooterClient {
	getSiteFooter(): Promise<SiteFooterContent>;
}

export class FooterService {
	footerClient: FooterClient;

	constructor(platform?: App.Platform, preview = false) {
		this.footerClient = new Contentful(platform, preview);
	}

	async getSiteFooter(): Promise<SiteFooterContent> {
		return this.footerClient.getSiteFooter();
	}
}
