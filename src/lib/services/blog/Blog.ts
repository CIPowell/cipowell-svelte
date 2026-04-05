export interface BlogPostSummary {
	title: string;
	slug: string;
	blurb: string;
	featuredImage: string;
	featuredImageAltText: string;
	previewText: string;
	published: Date;
	lastUpdated: Date;
	tags: string[];
}

export interface BlogPostPreview {
	title: string;
	slug: string;
	tags: string[];
}

export interface BlogPost {
	title: string;
	slug: string;
	body: { nodeType: string; content: unknown[] } | null;
	tags: string[];
	contentfulMetadata: {
		entryId: string;
		locale: string;
		environment: string;
	};
	livePreview: {
		enabled: boolean;
	};
}

export interface BlogClient {
	getPostPreviews(tagList: string[]): Promise<BlogPostSummary[]>;
	getMostRecentlyCreatedBlogPosts(limit?: number, tag?: string): Promise<BlogPostPreview[]>;
	getBlogPost(slug: string): Promise<BlogPost>;
}
