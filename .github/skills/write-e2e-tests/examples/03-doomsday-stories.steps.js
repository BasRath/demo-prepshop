// Example step definitions for ticket #1. In a real run this file lives in
// tests/e2e/steps/doomsday-stories.steps.js. Locators assume the implementation from requirements.json:
// a <nav aria-label="Doomsday stories"> in the header with one link per card and a "Pause stories" button.
import { expect } from '@playwright/test';
import { test as base, createBdd } from 'playwright-bdd';

// Scenario-scoped memory for multi-step checks ("I read all stories" -> "the stories recommend").
export const test = base.extend({
  // eslint-disable-next-line no-empty-pattern
  stories: async ({}, use) => use({ read: 0, recommended: new Set() })
});

const { Given, When, Then } = createBdd(test);

const storyNav = (page) => page.getByRole('navigation', { name: 'Doomsday stories' });
// Cards hidden by CSS are excluded from the accessibility tree, so this only returns visible cards.
const storyCards = (page) => storyNav(page).getByRole('link');

// ---------- Given ----------

Given('I am using a screen that is {int} pixels wide', async ({ page }, width) => {
  // Install the fake clock before the first navigation so the 10-second timer is controllable.
  await page.clock.install();
  await page.setViewportSize({ width, height: 800 });
});

Given('I open the shop', async ({ page }) => {
  await page.goto('/index.html');
});

Given('I am on the basket page', async ({ page }) => {
  await page.goto('/basket.html');
});

// ---------- When ----------

When('{int} second(s) pass(es)', async ({ page }, seconds) => {
  await page.clock.runFor(seconds * 1000);
});

When('{int} more second(s) pass(es)', async ({ page }, seconds) => {
  await page.clock.runFor(seconds * 1000);
});

When('I pause the stories', async ({ page }) => {
  await page.getByRole('button', { name: 'Pause stories' }).click();
});

When('I open the story {string}', async ({ page }, title) => {
  await storyCards(page).filter({ hasText: title }).click();
});

When('I read all stories', async ({ page, stories }) => {
  await page.goto('/index.html');
  const links = await storyCards(page).evaluateAll((els) => els.map((a) => a.getAttribute('href')));
  for (const href of links) {
    await page.goto(href);
    const names = await page.getByRole('main').getByRole('link').allTextContents();
    names.forEach((name) => stories.recommended.add(name.trim()));
  }
  stories.read = links.length;
});

// ---------- Then ----------

Then('I see {int} story card(s) in the header', async ({ page }, count) => {
  await expect(storyCards(page)).toHaveCount(count);
});

Then('the story cards do not cover the logo or the basket', async ({ page }) => {
  const header = page.locator('.site-header');
  const boxes = await Promise.all([
    header.getByRole('link', { name: /View Products/ }).boundingBox(),
    header.getByRole('link', { name: /View Basket/ }).boundingBox()
  ]);
  const cards = await storyCards(page).all();
  for (const card of cards) {
    const c = await card.boundingBox();
    for (const b of boxes) {
      const overlaps = c.x < b.x + b.width && c.x + c.width > b.x && c.y < b.y + b.height && c.y + c.height > b.y;
      expect(overlaps, 'a story card overlaps the logo or basket link').toBe(false);
    }
  }
});

Then('the story cards show {string}, {string} and {string}', async ({ page }, a, b, c) => {
  await expect(storyCards(page)).toHaveText([new RegExp(a), new RegExp(b), new RegExp(c)]);
});

Then('the first story card is still {string}', async ({ page }, title) => {
  await expect(storyCards(page).first()).toContainText(title);
});

Then('I am reading the story {string}', async ({ page }, title) => {
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
});

Then('I have read {int} stories', async ({ stories }, count) => {
  expect(stories.read).toBe(count);
});

Then('the stories recommend:', async ({ stories }, table) => {
  for (const { product } of table.hashes()) {
    expect(stories.recommended.has(product), `no story recommends ${product}`).toBe(true);
  }
});
