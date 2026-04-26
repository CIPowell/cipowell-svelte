import type { NavLink } from '../navigation/nav';

export interface Page {
	title: string;
	slug: string;
	description: string;
	content: { nodeType: string; content: unknown[] } | null;
	breadcrumbs: NavLink[];
	contentfulMetadata: {
		entryId: string;
		locale: string;
		environment: string;
	};
	livePreview: {
		enabled: boolean;
	};
}

export interface PageClient {
	getPage(slug: string): Promise<Page>;
}
