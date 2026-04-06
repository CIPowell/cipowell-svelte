import { fireEvent, render, screen } from '@testing-library/svelte';
import { expect, test } from 'vitest';
import LibraryExperience from './LibraryExperience.svelte';
import { getLibraryPageData } from '$lib/services/library/library';

test('renders bookshelf sections for books and articles', () => {
	render(LibraryExperience, getLibraryPageData());

	expect(
		screen.getByRole('heading', {
			name: 'A curated shelf of books and articles that keep the work honest.'
		})
	).toBeTruthy();
	expect(screen.getByRole('heading', { name: 'Books' })).toBeTruthy();
	expect(screen.getByRole('heading', { name: 'Articles' })).toBeTruthy();
	expect(screen.getByRole('button', { name: 'All topics' }).getAttribute('aria-pressed')).toBe(
		'true'
	);
	expect(screen.getByText(/The current selection shows\s+4 books and 4 articles\./)).toBeTruthy();
});

test('filters both shelves from a single topic selection', async () => {
	render(LibraryExperience, getLibraryPageData());

	const leadershipButton = screen.getByRole('button', { name: 'Leadership' });
	await fireEvent.click(leadershipButton);

	expect(leadershipButton.getAttribute('aria-pressed')).toBe('true');
	expect(screen.getAllByText('2 on this shelf')).toHaveLength(2);
	expect(screen.getByText('Roadmaps, bets, and the cost of false certainty')).toBeTruthy();
	expect(screen.queryByText('Designing Data-Intensive Applications')).toBeNull();
	expect(screen.getByText(/2 books and 2 articles/)).toBeTruthy();
});
