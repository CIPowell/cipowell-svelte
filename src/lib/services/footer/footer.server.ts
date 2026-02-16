import Contentful from '../cms/contentful';
import type { SiteFooterContent } from './footer-content';

export interface FooterClient {
	getSiteFooter(): Promise<SiteFooterContent>;
}

export class FooterService {
	footerClient: FooterClient;

	constructor(platform?: App.Platform) {
		this.footerClient = new Contentful(platform);
	}

	async getSiteFooter(): Promise<SiteFooterContent> {
		return this.footerClient.getSiteFooter();
	}
}
