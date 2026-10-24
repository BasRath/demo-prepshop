# Step definitions (playwright-bdd)

Config: [playwright.config.js](../../../../playwright.config.js) – features `tests/e2e/features/**/*.feature`,
steps `tests/e2e/steps/**/*.js`, base URL `http://localhost:8000` (server started automatically).

## Rules

- Import from playwright-bdd and use the built-in `page` fixture:
  ```js
  import { expect } from '@playwright/test';
  import { createBdd } from 'playwright-bdd';
  const { Given, When, Then } = createBdd();
  ```
- **Reuse first.** Check `tests/e2e/steps/shop.steps.js` for an existing phrase. Duplicate step texts across files
  break `bddgen` – put generic steps in `shop.steps.js`, feature-specific ones in `<feature-slug>.steps.js`.
- **Locators the way a user finds things**: `getByRole` (with accessible name) → `getByLabel` → `getByText`.
  CSS selectors only when there is no accessible alternative (e.g. the basket badge), and keep them in one helper.
- **Web-first assertions** (`await expect(locator).toHaveText(...)`) – they auto-wait. Never `waitForTimeout`.
- **Time**: install a fake clock before the first navigation (`await page.clock.install()`) and advance it with
  `await page.clock.runFor(ms)`. This makes "every 10 seconds" deterministic and instant.
- **Viewport**: `await page.setViewportSize({ width, height: 800 })` in a `Given I am using a screen that is … wide` step.
- **State setup** (`Given`): set `localStorage` via `page.evaluate` (see `setBasket` in `shop.steps.js`) instead of clicking
  through the UI, unless the clicking *is* the behaviour under test.
- **Parameters**: `{string}` for quoted text, `{int}` for numbers; data tables via `table.hashes()`. Optional text: `item(s)`.
- Throw a clear error for unknown test data (see `productId()` in `tests/e2e/support/products.js`).
- Run: `npx bddgen && npx playwright test --grep @ticket-<id>`; debug with `--headed` or `--debug`.
