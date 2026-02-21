import type { NavLink } from '../navigation/nav';
import Contentful from '../cms/contentful';

export interface Page {
	title: string;
	slug: string;
	content: { nodeType: string; content: unknown[] } | null;
	breadcrumbs: NavLink[];
}

export interface PageClient {
	getPage(slug: string): Promise<Page>;
}

export class PageService {
	pageClient: PageClient;

	constructor(platform?: App.Platform, preview = false) {
		this.pageClient = new Contentful(platform, preview);
	}

	async getPage(slug: string): Promise<Page> {
		return this.pageClient.getPage(slug);
	}
}
