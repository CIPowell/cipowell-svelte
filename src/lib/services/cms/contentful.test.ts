import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import type * as contentful from 'contentful';

const envMock: Record<string, string | undefined> = {};
const getEntriesMock = vi.fn();
const createClientMock = vi.fn(() => ({
	getEntries: getEntriesMock
}));

vi.mock('$env/dynamic/private', () => ({
	env: envMock
}));

vi.mock('contentful', () => ({
	createClient: createClientMock
}));

type BreadcrumbEntry = Pick<contentful.Entry, 'sys' | 'fields'>;

function createPage(
	id: string | undefined,
	title: string,
	slug: string,
	parent?: BreadcrumbEntry
): BreadcrumbEntry {
	return {
		sys: id ? { id } : undefined,
		fields: {
			title,
			slug,
			parent
		}
	} as unknown as BreadcrumbEntry;
}

describe('Contentful.getGlobalNavLinks', () => {
	beforeEach(() => {
		vi.resetModules();
		getEntriesMock.mockReset();
		createClientMock.mockClear();
		for (const key of Object.keys(envMock)) {
			delete envMock[key];
		}
	});

	test('uses root-page query filters and field selection on delivery host', async () => {
		envMock.CONTENTFUL_API_KEY = 'delivery-token';

		getEntriesMock.mockResolvedValueOnce({
			items: [
				{ fields: { title: 'Home', slug: '/' } },
				{ fields: { title: 'About', slug: '/about' } }
			]
		});

		const { default: Contentful } = await import('./contentful');
		const cms = new Contentful();

		await expect(cms.getGlobalNavLinks()).resolves.toEqual([
			{ title: 'Home', target: '/' },
			{ title: 'About', target: '/about' }
		]);

		expect(createClientMock).toHaveBeenCalledWith(
			expect.objectContaining({
				host: 'cdn.contentful.com',
				accessToken: 'delivery-token'
			})
		);
		expect(getEntriesMock).toHaveBeenCalledWith({
			content_type: 'page',
			'fields.parent[exists]': false,
			select: 'fields.title,fields.slug'
		});
	});

	test('uses preview token and same nav query on preview host', async () => {
		envMock.CONTENTFUL_API_KEY = 'fallback-token';
		envMock.CONTENTFUL_PREVIEW_API_KEY = 'preview-token';

		getEntriesMock.mockResolvedValueOnce({
			items: [{ fields: { title: 'Home', slug: '/' } }]
		});

		const { default: Contentful } = await import('./contentful');
		const cms = new Contentful(undefined, true);

		await expect(cms.getGlobalNavLinks()).resolves.toEqual([{ title: 'Home', target: '/' }]);

		expect(createClientMock).toHaveBeenCalledWith(
			expect.objectContaining({
				host: 'preview.contentful.com',
				accessToken: 'preview-token'
			})
		);
		expect(getEntriesMock).toHaveBeenCalledWith({
			content_type: 'page',
			'fields.parent[exists]': false,
			select: 'fields.title,fields.slug'
		});
	});
});

describe('Contentful.getBreadcrumb', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	test('builds breadcrumbs from parent chain in root-to-leaf order', async () => {
		const root = createPage('root', 'Home', '/');
		const child = createPage('child', 'About', '/about', root);
		const grandchild = createPage('grandchild', 'Team', '/about/team', child);
		const { default: Contentful } = await import('./contentful');
		const client = Object.create(Contentful.prototype) as InstanceType<typeof Contentful>;

		expect(client.getBreadcrumb(grandchild as contentful.Entry)).toEqual([
			{ title: 'Home', target: '/' },
			{ title: 'About', target: '/about' },
			{ title: 'Team', target: '/about/team' }
		]);
	});

	test('returns a single crumb when there is no parent', async () => {
		const page = createPage('home', 'Home', '/');
		const { default: Contentful } = await import('./contentful');
		const client = Object.create(Contentful.prototype) as InstanceType<typeof Contentful>;

		expect(client.getBreadcrumb(page as contentful.Entry)).toEqual([
			{ title: 'Home', target: '/' }
		]);
	});

	test('stops traversal and warns when a parent cycle is detected', async () => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
		const first = createPage('first', 'First', '/first');
		const second = createPage('second', 'Second', '/second', first);
		(first.fields as Record<string, unknown>).parent = second;
		const { default: Contentful } = await import('./contentful');
		const client = Object.create(Contentful.prototype) as InstanceType<typeof Contentful>;

		expect(client.getBreadcrumb(first as contentful.Entry)).toEqual([
			{ title: 'Second', target: '/second' },
			{ title: 'First', target: '/first' }
		]);
		expect(warnSpy).toHaveBeenCalledWith(
			'Cycle detected in breadcrumb parent chain for entry first'
		);
	});
});

describe('Contentful blog queries', () => {
	beforeEach(() => {
		vi.resetModules();
		getEntriesMock.mockReset();
		createClientMock.mockClear();
		for (const key of Object.keys(envMock)) {
			delete envMock[key];
		}
		envMock.CONTENTFUL_API_KEY = 'delivery-token';
	});

	test('filters recent blog posts by tag when requested', async () => {
		getEntriesMock.mockResolvedValueOnce({
			items: [{ fields: { title: 'Leading teams', slug: 'leading-teams', tags: ['leadership'] } }]
		});

		const { default: Contentful } = await import('./contentful');
		const cms = new Contentful();

		await expect(cms.getMostRecentlyCreatedBlogPosts(3, 'leadership')).resolves.toEqual([
			{ title: 'Leading teams', slug: 'leading-teams', tags: ['leadership'] }
		]);

		expect(getEntriesMock).toHaveBeenCalledWith({
			content_type: 'blogPost',
			order: '-sys.createdAt',
			limit: 3,
			'fields.tags[in]': 'leadership'
		});
	});

	test('returns blog post details for an individual slug', async () => {
		getEntriesMock.mockResolvedValueOnce({
			items: [
				{
					sys: {
						id: 'post-1',
						locale: 'en-US',
						createdAt: '2026-04-01T08:30:00.000Z',
						updatedAt: '2026-04-02T09:45:00.000Z'
					},
					fields: {
						title: 'A thoughtful post',
						slug: 'a-thoughtful-post',
						description: 'A carefully written post summary.',
						body: { nodeType: 'document', content: [] },
						tags: ['leadership', 'culture']
					}
				}
			]
		});

		const { default: Contentful } = await import('./contentful');
		const cms = new Contentful();

		await expect(cms.getBlogPost('a-thoughtful-post')).resolves.toEqual({
			title: 'A thoughtful post',
			slug: 'a-thoughtful-post',
			description: 'A carefully written post summary.',
			socialImage: null,
			body: { nodeType: 'document', content: [] },
			tags: ['leadership', 'culture'],
			published: '2026-04-01T08:30:00.000Z',
			lastUpdated: '2026-04-02T09:45:00.000Z',
			contentfulMetadata: {
				entryId: 'post-1',
				locale: 'en-US',
				environment: 'master'
			},
			livePreview: {
				enabled: false
			}
		});

		expect(getEntriesMock).toHaveBeenCalledWith({
			content_type: 'blogPost',
			'fields.slug': 'a-thoughtful-post',
			include: 10,
			limit: 1
		});
	});

	test('derives blog post metadata from description, body, and embedded images', async () => {
		getEntriesMock.mockResolvedValueOnce({
			items: [
				{
					sys: {
						id: 'post-2',
						locale: 'en-US',
						createdAt: '2026-04-03T10:15:00.000Z',
						updatedAt: '2026-04-04T11:00:00.000Z'
					},
					fields: {
						title: 'A visual post',
						slug: 'a-visual-post',
						description: '',
						body: {
							nodeType: 'document',
							content: [
								{
									nodeType: 'paragraph',
									content: [
										{
											nodeType: 'text',
											value:
												'This first paragraph is long enough to become a concise fallback description for the shared link preview.'
										}
									]
								},
								{
									nodeType: 'embedded-asset-block',
									data: {
										target: {
											fields: {
												title: 'Workshop wall',
												description: 'Sticky notes arranged on a workshop wall',
												file: {
													url: '//images.ctfassets.net/blog/workshop-wall.jpg'
												}
											}
										}
									}
								}
							]
						},
						tags: []
					}
				}
			]
		});

		const { default: Contentful } = await import('./contentful');
		const cms = new Contentful();

		await expect(cms.getBlogPost('a-visual-post')).resolves.toMatchObject({
			title: 'A visual post',
			slug: 'a-visual-post',
			description:
				'This first paragraph is long enough to become a concise fallback description for the shared link pre...',
			socialImage: {
				url: 'https://images.ctfassets.net/blog/workshop-wall.jpg',
				title: 'Workshop wall',
				description: 'Sticky notes arranged on a workshop wall'
			},
			published: '2026-04-03T10:15:00.000Z',
			lastUpdated: '2026-04-04T11:00:00.000Z'
		});
	});

	test('returns sitemap page entries with slugs and updated timestamps', async () => {
		getEntriesMock.mockResolvedValueOnce({
			total: 2,
			items: [
				{
					sys: { updatedAt: '2026-04-01T08:30:00.000Z' },
					fields: { slug: 'home' }
				},
				{
					sys: { updatedAt: '2026-04-02T09:45:00.000Z' },
					fields: { slug: 'about' }
				}
			]
		});

		const { default: Contentful } = await import('./contentful');
		const cms = new Contentful();

		await expect(cms.getSitemapPages()).resolves.toEqual([
			{ slug: 'home', updatedAt: '2026-04-01T08:30:00.000Z' },
			{ slug: 'about', updatedAt: '2026-04-02T09:45:00.000Z' }
		]);

		expect(getEntriesMock).toHaveBeenCalledWith({
			content_type: 'page',
			order: 'fields.slug',
			limit: 1000,
			skip: 0,
			select: 'fields.slug,sys.createdAt,sys.updatedAt'
		});
	});

	test('returns sitemap blog post entries with slugs and updated timestamps', async () => {
		getEntriesMock.mockResolvedValueOnce({
			total: 1,
			items: [
				{
					sys: { updatedAt: '2026-04-03T10:15:00.000Z' },
					fields: { slug: 'leading-teams' }
				}
			]
		});

		const { default: Contentful } = await import('./contentful');
		const cms = new Contentful();

		await expect(cms.getSitemapBlogPosts()).resolves.toEqual([
			{ slug: 'leading-teams', updatedAt: '2026-04-03T10:15:00.000Z' }
		]);

		expect(getEntriesMock).toHaveBeenCalledWith({
			content_type: 'blogPost',
			order: 'fields.slug',
			limit: 1000,
			skip: 0,
			select: 'fields.slug,sys.createdAt,sys.updatedAt'
		});
	});

	test('paginates sitemap page entries past the first thousand items', async () => {
		getEntriesMock
			.mockResolvedValueOnce({
				total: 1001,
				items: Array.from({ length: 1000 }, (_, index) => ({
					sys: { updatedAt: `2026-04-01T08:30:${String(index % 60).padStart(2, '0')}.000Z` },
					fields: { slug: `page-${index}` }
				}))
			})
			.mockResolvedValueOnce({
				total: 1001,
				items: [
					{
						sys: { updatedAt: '2026-04-02T09:45:00.000Z' },
						fields: { slug: 'page-1000' }
					}
				]
			});

		const { default: Contentful } = await import('./contentful');
		const cms = new Contentful();

		const pages = await cms.getSitemapPages();

		expect(pages).toHaveLength(1001);
		expect(pages.at(0)).toEqual({
			slug: 'page-0',
			updatedAt: '2026-04-01T08:30:00.000Z'
		});
		expect(pages.at(-1)).toEqual({
			slug: 'page-1000',
			updatedAt: '2026-04-02T09:45:00.000Z'
		});
		expect(getEntriesMock).toHaveBeenNthCalledWith(1, {
			content_type: 'page',
			order: 'fields.slug',
			limit: 1000,
			skip: 0,
			select: 'fields.slug,sys.createdAt,sys.updatedAt'
		});
		expect(getEntriesMock).toHaveBeenNthCalledWith(2, {
			content_type: 'page',
			order: 'fields.slug',
			limit: 1000,
			skip: 1000,
			select: 'fields.slug,sys.createdAt,sys.updatedAt'
		});
	});

	test('paginates sitemap blog post entries past the first thousand items', async () => {
		getEntriesMock
			.mockResolvedValueOnce({
				total: 1001,
				items: Array.from({ length: 1000 }, (_, index) => ({
					sys: { updatedAt: `2026-04-03T10:15:${String(index % 60).padStart(2, '0')}.000Z` },
					fields: { slug: `post-${index}` }
				}))
			})
			.mockResolvedValueOnce({
				total: 1001,
				items: [
					{
						sys: { updatedAt: '2026-04-04T11:00:00.000Z' },
						fields: { slug: 'post-1000' }
					}
				]
			});

		const { default: Contentful } = await import('./contentful');
		const cms = new Contentful();

		const posts = await cms.getSitemapBlogPosts();

		expect(posts).toHaveLength(1001);
		expect(posts.at(0)).toEqual({
			slug: 'post-0',
			updatedAt: '2026-04-03T10:15:00.000Z'
		});
		expect(posts.at(-1)).toEqual({
			slug: 'post-1000',
			updatedAt: '2026-04-04T11:00:00.000Z'
		});
		expect(getEntriesMock).toHaveBeenNthCalledWith(1, {
			content_type: 'blogPost',
			order: 'fields.slug',
			limit: 1000,
			skip: 0,
			select: 'fields.slug,sys.createdAt,sys.updatedAt'
		});
		expect(getEntriesMock).toHaveBeenNthCalledWith(2, {
			content_type: 'blogPost',
			order: 'fields.slug',
			limit: 1000,
			skip: 1000,
			select: 'fields.slug,sys.createdAt,sys.updatedAt'
		});
	});
});

describe('Contentful library queries', () => {
	beforeEach(() => {
		vi.resetModules();
		getEntriesMock.mockReset();
		createClientMock.mockClear();
		for (const key of Object.keys(envMock)) {
			delete envMock[key];
		}
		envMock.CONTENTFUL_API_KEY = 'delivery-token';
	});

	test('returns library entries mapped from the shared libraryEntry content type', async () => {
		getEntriesMock.mockResolvedValueOnce({
			items: [
				{
					sys: { id: 'library-preview-1', locale: 'en-US' },
					fields: {
						title: 'An Elegant Puzzle',
						slug: 'an-elegant-puzzle',
						format: 'book',
						creatorText: 'Will Larson',
						summary: 'A management book for scaling engineering teams.',
						recommendationNote: 'Useful whenever I need to reset how I think about org design.',
						miniReview: 'Practical and opinionated in the right places.',
						publicationTitle: '',
						publicationDate: '2019-03-01',
						externalUrl: '',
						topics: ['leadership', 'engineering-management'],
						readingStatus: 'finished',
						startedOn: '2026-03-01',
						finishedOn: '2026-03-12',
						rating: 5,
						coverOrThumbnail: {
							fields: {
								title: 'An Elegant Puzzle cover',
								description: 'Book cover image',
								file: {
									url: '//images.ctfassets.net/library/book-cover.jpg'
								}
							}
						}
					}
				}
			]
		});

		const { default: Contentful } = await import('./contentful');
		const cms = new Contentful();

		await expect(cms.getLibraryEntries()).resolves.toEqual([
			{
				title: 'An Elegant Puzzle',
				slug: 'an-elegant-puzzle',
				format: 'book',
				creatorText: 'Will Larson',
				summary: 'A management book for scaling engineering teams.',
				recommendationNote: 'Useful whenever I need to reset how I think about org design.',
				miniReview: 'Practical and opinionated in the right places.',
				publicationTitle: '',
				publicationDate: '2019-03-01',
				externalUrl: '',
				topics: ['leadership', 'engineering-management'],
				readingStatus: 'finished',
				startedOn: '2026-03-01',
				finishedOn: '2026-03-12',
				rating: 5,
				coverImage: {
					url: 'https://images.ctfassets.net/library/book-cover.jpg',
					title: 'An Elegant Puzzle cover',
					description: 'Book cover image'
				},
				contentfulMetadata: {
					entryId: 'library-preview-1',
					locale: 'en-US',
					environment: 'master'
				},
				livePreview: {
					enabled: false
				}
			}
		]);

		expect(getEntriesMock).toHaveBeenCalledWith({
			content_type: 'libraryEntry',
			order: 'fields.format,-fields.publicationDate,fields.title',
			include: 2
		});
	});

	test('returns full library entry details for an individual slug', async () => {
		getEntriesMock.mockResolvedValueOnce({
			items: [
				{
					sys: { id: 'library-1', locale: 'en-US' },
					fields: {
						title: 'The Source Article',
						slug: 'the-source-article',
						format: 'article',
						creatorText: 'Charity Majors',
						summary: 'A sharp article about observability and feedback loops.',
						recommendationNote: 'This one changed how I talk about systems work.',
						miniReview: '',
						publicationTitle: 'Honeycomb Blog',
						publicationDate: '2024-11-05',
						externalUrl: 'https://example.com/source-article',
						topics: ['observability'],
						readingStatus: 'on-the-list',
						startedOn: '',
						finishedOn: '',
						rating: 4,
						coverOrThumbnail: undefined,
						notes: { nodeType: 'document', content: [] }
					}
				}
			]
		});

		const { default: Contentful } = await import('./contentful');
		const cms = new Contentful();

		await expect(cms.getLibraryEntry('the-source-article')).resolves.toEqual({
			title: 'The Source Article',
			slug: 'the-source-article',
			format: 'article',
			creatorText: 'Charity Majors',
			summary: 'A sharp article about observability and feedback loops.',
			recommendationNote: 'This one changed how I talk about systems work.',
			miniReview: '',
			publicationTitle: 'Honeycomb Blog',
			publicationDate: '2024-11-05',
			externalUrl: 'https://example.com/source-article',
			topics: ['observability'],
			readingStatus: 'on-the-list',
			startedOn: '',
			finishedOn: '',
			rating: 4,
			coverImage: null,
			notes: { nodeType: 'document', content: [] },
			contentfulMetadata: {
				entryId: 'library-1',
				locale: 'en-US',
				environment: 'master'
			},
			livePreview: {
				enabled: false
			}
		});

		expect(getEntriesMock).toHaveBeenCalledWith({
			content_type: 'libraryEntry',
			'fields.slug': 'the-source-article',
			include: 2,
			limit: 1
		});
	});
});
