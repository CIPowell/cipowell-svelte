import { expect, test } from '@playwright/test';

test('home page has expected h1', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('h1')).toBeVisible();
});

test('homepage should have the main nav', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Home', exact: true })).toBeVisible();
});
