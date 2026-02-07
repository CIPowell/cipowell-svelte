import type { NavLink } from '../navigation/nav';
import Contentful from '../cms/contentful';

export interface Page {
	title: string;
	slug: string;
	content: string;
	breadcrumbs: NavLink[];
}

export interface PageClient {
	getPage(slug: string): Promise<Page>;
}

export class PageService {
	pageClient: PageClient;

	constructor(platform?: App.Platform) {
		this.pageClient = new Contentful(platform);
	}

	async getPage(slug: string): Promise<Page> {
		return this.pageClient.getPage(slug);
	}
}
