import { fireEvent, render, screen } from '@testing-library/svelte';
import { expect, test } from 'vitest';
import LibraryExperience from './LibraryExperience.svelte';
import { getLibraryPageData } from '$lib/services/library/library';

test('renders one mixed collection with both books and articles visible by default', () => {
	render(LibraryExperience, getLibraryPageData());

	expect(
		screen.getByRole('heading', {
			name: 'A curated shelf of books and articles that keep the work honest.'
		})
	).toBeTruthy();
	expect(screen.getByRole('heading', { name: 'Reading now' })).toBeTruthy();
	expect(screen.getByText('The Art of Gathering')).toBeTruthy();
	expect(screen.getByText('Roadmaps, bets, and the cost of false certainty')).toBeTruthy();
	expect(screen.getAllByLabelText('book recommendation').length).toBeGreaterThan(0);
	expect(screen.getAllByLabelText('article recommendation').length).toBeGreaterThan(0);
	expect(screen.getByRole('button', { name: 'All topics' }).getAttribute('aria-pressed')).toBe(
		'true'
	);
	expect(screen.getByText(/8 picks showing 4 books and 4 articles\./)).toBeTruthy();
});

test('type filters can narrow the mixed collection to books only', async () => {
	render(LibraryExperience, getLibraryPageData());

	const articleButton = screen.getByRole('button', { name: 'Articles' });
	await fireEvent.click(articleButton);

	expect(articleButton.getAttribute('aria-pressed')).toBe('false');
	expect(screen.getByText('The Art of Gathering')).toBeTruthy();
	expect(screen.queryByText('Roadmaps, bets, and the cost of false certainty')).toBeNull();
	expect(screen.getByText(/4 picks showing 4 books and 0 articles/)).toBeTruthy();
});

test('topic filters still narrow the mixed collection across both types', async () => {
	render(LibraryExperience, getLibraryPageData());

	const leadershipButton = screen.getByRole('button', { name: 'Leadership' });
	await fireEvent.click(leadershipButton);

	expect(leadershipButton.getAttribute('aria-pressed')).toBe('true');
	expect(screen.getByText('The Art of Gathering')).toBeTruthy();
	expect(screen.getByText('What staff-plus leadership looks like at a humane pace')).toBeTruthy();
	expect(screen.queryByText('Designing Data-Intensive Applications')).toBeNull();
	expect(screen.getByText(/4 picks showing 2 books and 2 articles/)).toBeTruthy();
});
