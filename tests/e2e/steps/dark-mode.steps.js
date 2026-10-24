import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { captureProof } from '../support/proof.js';

const { Given, When, Then } = createBdd();

Given('my device prefers dark appearance', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
});

Given('my device prefers light appearance', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
});

When('I open the shop', async ({ page }) => {
  await page.goto('/index.html');
});

Then('the shop uses its dark appearance', async ({ page }) => {
  const html = page.locator('html');
  const header = page.locator('.site-header');
  const productCard = page.getByRole('listitem').first();

  await expect(page.getByRole('heading', { level: 1, name: 'Kawaii Doomsday Supplies' })).toBeVisible();
  await expect(html).toHaveCSS('background-color', 'rgb(28, 23, 36)');
  await expect(html).toHaveCSS('color', 'rgb(247, 237, 248)');
  await expect(header).toHaveCSS('background-image', 'linear-gradient(135deg, rgb(58, 40, 57), rgb(32, 50, 61))');
  await expect(productCard).toHaveCSS('background-color', 'rgb(48, 37, 56)');
  await captureProof(page, productCard, 'product card in dark appearance');
});

Then('secondary basket controls remain readable', async ({ page }) => {
  const removeButton = page.getByRole('button', { name: 'Remove Canned Optimism from basket' });

  await expect(removeButton).toHaveCSS('color', 'rgb(247, 237, 248)');
  await expect(removeButton).toHaveCSS('background-color', 'rgb(58, 48, 67)');
  await captureProof(page, removeButton, 'secondary basket control in dark appearance');
});

Then('the shop keeps its original light appearance and shows a {string} total', async ({ page }, total) => {
  const totalText = page.getByText(`Total: ${total}`, { exact: true });
  const html = page.locator('html');
  const header = page.locator('.site-header');
  const basketItem = page.getByRole('listitem').first();

  await expect(totalText).toBeVisible();
  await expect(html).toHaveCSS('background-color', 'rgb(255, 247, 251)');
  await expect(html).toHaveCSS('color', 'rgb(59, 42, 74)');
  await expect(header).toHaveCSS('background-image', 'linear-gradient(135deg, rgb(255, 225, 240), rgb(227, 247, 255))');
  await expect(basketItem).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await captureProof(page, totalText, `light appearance with total ${total}`);
});
