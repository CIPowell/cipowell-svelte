import { describe, expect, test } from 'vitest';
import { getOrderedNavLinks, type NavLink } from './nav';

describe('getOrderedNavLinks', () => {
	test('orders home thoughts and about links and renames blog to thoughts', () => {
		const links: NavLink[] = [
			{ title: 'About', target: '/about-me' },
			{ title: 'Blog', target: '/blog' },
			{ title: 'Home', target: '/' }
		];

		expect(getOrderedNavLinks(links)).toEqual([
			{ title: 'Home', target: '/' },
			{ title: 'Thoughts', target: '/blog' },
			{ title: 'About Me', target: '/about-me' }
		]);
	});

	test('adds default thoughts link if it does not exist', () => {
		const links: NavLink[] = [
			{ title: 'Home', target: '/' },
			{ title: 'About', target: '/about' }
		];

		expect(getOrderedNavLinks(links)).toEqual([
			{ title: 'Home', target: '/' },
			{ title: 'Thoughts', target: '/thoughts' },
			{ title: 'About Me', target: '/about' }
		]);
	});

	test('ignores duplicate links from CMS', () => {
		const links: NavLink[] = [
			{ title: 'Home', target: '/' },
			{ title: 'Home Duplicate', target: '/' },
			{ title: 'Blog', target: '/thoughts' },
			{ title: 'Thoughts Duplicate', target: '/thoughts' },
			{ title: 'About', target: '/about' },
			{ title: 'Contact', target: '/contact' },
			{ title: 'Contact Again', target: '/contact/' }
		];

		expect(getOrderedNavLinks(links)).toEqual([
			{ title: 'Home', target: '/' },
			{ title: 'Thoughts', target: '/thoughts' },
			{ title: 'About Me', target: '/about' },
			{ title: 'Contact', target: '/contact' }
		]);
	});
});
