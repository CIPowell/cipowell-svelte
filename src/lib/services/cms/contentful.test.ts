import { beforeEach, describe, expect, test, vi } from 'vitest';

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
