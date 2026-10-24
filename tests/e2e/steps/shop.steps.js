// Shared step definitions. Steps describe what a shopper sees and does, never how the page is built,
// so that feature files stay readable for non-technical testers.
// Add feature-specific steps in a separate file named after the feature (e.g. doomsday-stories.steps.js).
import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { PRODUCTS, productId, STORAGE_KEY } from '../support/products.js';
import { captureProof } from '../support/proof.js';

const { Given, When, Then } = createBdd();

async function setBasket(page, basket) {
  await page.goto('/index.html');
  await page.evaluate(([key, value]) => {
    if (value) window.localStorage.setItem(key, JSON.stringify(value));
    else window.localStorage.removeItem(key);
  }, [STORAGE_KEY, basket]);
  await page.reload();
}

async function addToBasket(page, name, times) {
  await page.goto(PRODUCTS[productId(name)].url);
  const status = page.getByRole('status');
  for (let i = 0; i < times; i += 1) {
    await page.getByRole('button', { name: 'Add to Cart' }).click();
    await expect(status).toContainText(`${name} added to your basket`);
  }
}

function basketItem(page, name) {
  return page.getByRole('main').getByRole('listitem').filter({ has: page.getByRole('link', { name, exact: true }) });
}

// ---------- Given ----------

Given('my basket is empty', async ({ page }) => {
  await setBasket(page, null);
});

Given('my basket contains {int} {string}', async ({ page }, quantity, name) => {
  await setBasket(page, { [productId(name)]: quantity });
});

Given('my basket contains:', async ({ page }, table) => {
  const basket = {};
  for (const row of table.hashes()) basket[productId(row.product)] = Number(row.quantity);
  await setBasket(page, basket);
});

// ---------- When ----------

When('I add {string} to my basket', async ({ page }, name) => {
  await addToBasket(page, name, 1);
});

When('I add {string} to my basket {int} times', async ({ page }, name, times) => {
  await addToBasket(page, name, times);
});

When('I open my basket', async ({ page }) => {
  await page.getByRole('link', { name: /View Basket/ }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Your Basket' })).toBeVisible();
});

When('I go to the checkout page', async ({ page }) => {
  await page.goto('/checkout.html');
});

When('I remove {string} from my basket', async ({ page }, name) => {
  await page.getByRole('button', { name: `Remove ${name} from basket` }).click();
});

When('I clear all products', async ({ page }) => {
  await page.getByRole('button', { name: 'Clear All Products' }).click();
});

When('I fill in {string} with {string}', async ({ page }, label, value) => {
  await page.getByLabel(label, { exact: true }).fill(value);
});

When('I submit my order', async ({ page }) => {
  await page.getByRole('button', { name: 'Submit Order' }).click();
});

// ---------- Then ----------

Then('the basket icon shows {int} item(s)', async ({ page }, count) => {
  const badge = page.locator('.basket-link [data-basket-count]');
  await expect(badge).toHaveText(String(count));
  await captureProof(page, page.locator('.basket-link'), `basket icon shows ${count}`);
});

Then('I see {string} with quantity {int} for {string}', async ({ page }, name, quantity, lineTotal) => {
  const item = basketItem(page, name);
  await expect(item).toContainText(`Quantity: ${quantity} ×`);
  await expect(item).toContainText(lineTotal);
  await captureProof(page, item, `${name} × ${quantity} = ${lineTotal}`);
});

Then('I no longer see {string} in my basket', async ({ page }, name) => {
  await expect(basketItem(page, name)).toHaveCount(0);
  await captureProof(page, page.getByRole('main'), `${name} is no longer in the basket`);
});

Then('the basket total is {string}', async ({ page }, total) => {
  const totalText = page.getByText(`Total: ${total}`, { exact: true });
  await expect(totalText).toBeVisible();
  await captureProof(page, totalText, `basket total ${total}`);
});

Then('I see the message {string}', async ({ page }, message) => {
  const text = page.getByText(message, { exact: true });
  await expect(text).toBeVisible();
  await captureProof(page, text, `message "${message}"`);
});

Then('I cannot proceed to checkout', async ({ page }) => {
  const proceed = page.getByText('Proceed to Checkout', { exact: true });
  await expect(proceed).toHaveAttribute('aria-disabled', 'true');
  await expect(proceed).not.toHaveAttribute('href');
  await captureProof(page, proceed, 'checkout is disabled');
});

Then('the order is not placed', async ({ page }) => {
  const submit = page.getByRole('button', { name: 'Submit Order' });
  await expect(submit).toBeVisible();
  await expect(page.getByText('Thank you for your order')).toHaveCount(0);
  await captureProof(page, submit, 'order is not placed – still on the order form');
});

Then('I am asked to fill in {string}', async ({ page }, label) => {
  const field = page.getByLabel(label, { exact: true });
  await expect(field).toBeFocused();
  expect(await field.evaluate((input) => input.validity.valueMissing)).toBe(true);
  await captureProof(page, field, `asked to fill in ${label}`);
});

Then('I do not see the order form', async ({ page }) => {
  await expect(page.getByRole('button', { name: 'Submit Order' })).toBeHidden();
  await captureProof(page, page.getByRole('main'), 'order form is not shown');
});
