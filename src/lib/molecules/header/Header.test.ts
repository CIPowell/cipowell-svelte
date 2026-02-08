import { test } from 'vitest';
import { render } from '@testing-library/svelte';
import Header from './Header.svelte';

test('Renders the header successfully', () => {
	render(Header);
});
