import { expect, test } from '@playwright/test';
import { aw } from 'vitest/dist/chunks/reporters.C_zwCd4j.js';

test('home page has expected h1', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('h1')).toBeVisible();
});

test('homepage should have the main nav', async ({ page }) => {
	await page.goto('/')
	await expect(page.locator('nav')).toBeVisible();
	await expect(page.locator('a')).toBeVisible();
});