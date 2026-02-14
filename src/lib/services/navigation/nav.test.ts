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
			{ title: 'About', target: '/about-me' }
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
			{ title: 'About', target: '/about' }
		]);
	});
});
