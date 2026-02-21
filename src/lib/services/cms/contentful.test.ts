import { afterEach, describe, expect, test, vi } from 'vitest';
import Contentful from './contentful';
import type * as contentful from 'contentful';

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

describe('Contentful.getBreadcrumb', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	test('builds breadcrumbs from parent chain in root-to-leaf order', () => {
		const root = createPage('root', 'Home', '/');
		const child = createPage('child', 'About', '/about', root);
		const grandchild = createPage('grandchild', 'Team', '/about/team', child);
		const client = Object.create(Contentful.prototype) as Contentful;

		expect(client.getBreadcrumb(grandchild as contentful.Entry)).toEqual([
			{ title: 'Home', target: '/' },
			{ title: 'About', target: '/about' },
			{ title: 'Team', target: '/about/team' }
		]);
	});

	test('returns a single crumb when there is no parent', () => {
		const page = createPage('home', 'Home', '/');
		const client = Object.create(Contentful.prototype) as Contentful;

		expect(client.getBreadcrumb(page as contentful.Entry)).toEqual([
			{ title: 'Home', target: '/' }
		]);
	});

	test('stops traversal and warns when a parent cycle is detected', () => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
		const first = createPage('first', 'First', '/first');
		const second = createPage('second', 'Second', '/second', first);
		(first.fields as Record<string, unknown>).parent = second;
		const client = Object.create(Contentful.prototype) as Contentful;

		expect(client.getBreadcrumb(first as contentful.Entry)).toEqual([
			{ title: 'Second', target: '/second' },
			{ title: 'First', target: '/first' }
		]);
		expect(warnSpy).toHaveBeenCalledWith(
			'Cycle detected in breadcrumb parent chain for entry first'
		);
	});
});
