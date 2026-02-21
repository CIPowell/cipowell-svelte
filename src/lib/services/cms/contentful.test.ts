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
	} as BreadcrumbEntry;
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
		envMock.CONTENTFUL_HOST = 'preview.contentful.com';
		envMock.CONTENTFUL_API_KEY = 'fallback-token';
		envMock.CONTENTFUL_PREVIEW_API_KEY = 'preview-token';

		getEntriesMock.mockResolvedValueOnce({
			items: [{ fields: { title: 'Home', slug: '/' } }]
		});

		const { default: Contentful } = await import('./contentful');
		const cms = new Contentful();

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

		expect(client.getBreadcrumb(page as contentful.Entry)).toEqual([{ title: 'Home', target: '/' }]);
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
