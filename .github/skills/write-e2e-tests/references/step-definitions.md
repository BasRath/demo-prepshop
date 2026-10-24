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
- **Screenshot proof in every `Then` step that checks something visible.** After the assertions, call
  `await captureProof(page, <locator that shows the result>, '<what it proves>')` from
  [tests/e2e/support/proof.js](../../../../tests/e2e/support/proof.js). The helper scrolls the element into view,
  fails the step when it is not inside the viewport or is covered by another element, outlines it and attaches
  the screenshot (`proof: …`) that the test report embeds.
  - Pass the element that *shows the change* (the updated badge, the new message, the card), not the whole page.
  - For "is gone / is hidden / count is 0" checks, pass the visible container where it used to be (e.g. `main`, the header).
  - When the change cannot be brought into the viewport (e.g. it only appears at another width, or after a hover/focus),
    add the condition to the scenario (`Given I am using a screen that is … wide`, a focus/hover step) instead of
    dropping the proof.
  - Non-visual checks (counters in fixtures, data tables of recommendations) need no proof.
- **Time**: install a fake clock before the first navigation (`await page.clock.install()`) and advance it with
  `await page.clock.runFor(ms)`. This makes "every 10 seconds" deterministic and instant.
- **Viewport**: `await page.setViewportSize({ width, height: 800 })` in a `Given I am using a screen that is … wide` step.
- **State setup** (`Given`): set `localStorage` via `page.evaluate` (see `setBasket` in `shop.steps.js`) instead of clicking
  through the UI, unless the clicking *is* the behaviour under test.
- **Parameters**: `{string}` for quoted text, `{int}` for numbers; data tables via `table.hashes()`. Optional text: `item(s)`.
- Throw a clear error for unknown test data (see `productId()` in `tests/e2e/support/products.js`).
- Run: `npx bddgen && npx playwright test --grep @ticket-<id>`; debug with `--headed` or `--debug`.
