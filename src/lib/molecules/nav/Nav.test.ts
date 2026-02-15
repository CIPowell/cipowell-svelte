import { expect, test } from 'vitest';
import type { NavLink } from '$lib/services/navigation/nav';
import { render, screen, fireEvent } from '@testing-library/svelte';
import Nav from './Nav.svelte';

test('Navigation Header', async () => {
	const testLinks: NavLink[] = [
		{
			title: 'Home',
			target: '/'
		},
		{
			title: 'Blog',
			target: '/blog'
		}
	];

	render(Nav, { links: testLinks });

	const actualNav = screen.getByRole('navigation', { name: 'Primary navigation' });
	expect(actualNav).toBeTruthy();

	const menuButton = screen.getByRole('button', { name: 'Menu' });
	expect(menuButton.getAttribute('aria-expanded')).toBe('false');

	await fireEvent.click(menuButton);
	expect(menuButton.getAttribute('aria-expanded')).toBe('true');

	const actualLinks = screen.getAllByRole('link');
	expect(actualLinks.length).toBe(testLinks.length);

	testLinks.forEach((link) => {
		const actualLink = screen.getByText(link.title);
		expect(actualLink.getAttribute('href')).toBe(link.target);
	});
});
