import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Header from './Header.svelte';

test('renders logo link to homepage with accessible text', () => {
	render(Header);

	const homeLink = screen.getByRole('link', {
		name: 'Go to Chris I Powell homepage'
	});
	const logo = screen.getByRole('img', { name: 'Chris I Powell logo' });

	expect(homeLink.getAttribute('href')).toBe('/');
	expect(homeLink.contains(logo)).toBe(true);
});
