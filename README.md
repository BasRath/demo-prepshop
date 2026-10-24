# demo-prepshop

**Prep Shop** is a tongue-in-cheek, anime-themed demo webshop for doomsday preppers.
It sells three totally essential products:

- **Dehydrated Water** – just add water!
- **Tinfoil Thinking Cap** – blocks mind rays and unsolicited opinions.
- **Canned Optimism** – open in case of apocalypse, Mondays or both.

It is a plain static site built with HTML, CSS and vanilla JavaScript – no build step,
no frameworks and no runtime dependencies (the `devDependencies` in `package.json` are only
used for automated testing). Nothing is actually for sale: the basket is
kept in your browser's `localStorage` and the checkout form data is never sent or stored.

## Features

- Product listing, product detail pages, basket and checkout.
- Prep Shop browser icon in modern PNG and legacy ICO formats.
- Basket with item count, remove, "Clear All Products" and "Proceed to Checkout".
- Checkout form (name + two address lines) that shows "Thank you for your order" and
  clears the basket on submit.
- Responsive layout (mobile first, CSS grid/flexbox).
- Dark appearance automatically follows the device color-scheme preference; the existing light appearance remains the default.
- Accessibility: semantic HTML, skip link, labelled form fields, alt text, visible focus
  styles, live regions for status messages and reduced-motion support.
- Security: strict Content Security Policy (no inline scripts/styles, `form-action 'none'`),
  DOM updates via `textContent` only (no `innerHTML`), validated `localStorage` data and
  security headers on Vercel (`vercel.json`).

## Project structure

```
├── index.html                      # Main product listing page
├── basket.html                     # Shopping cart page
├── checkout.html                   # Checkout form page
├── product-*.html                  # Individual product pages
├── style.css                       # Main stylesheet
├── shop.js                         # JavaScript functionality
├── favicon.ico                     # Legacy browser tab icon
├── img/                            # Image assets
│   ├── prep-shop-logo.png
│   ├── basket-icon.png
│   ├── favicon.png                 # Modern browser tab icon
│   └── product-*.png
├── vercel.json                     # Security headers for Vercel
├── .vercelignore                   # Keeps test tooling out of deployments
├── package.json                    # Dev-only test tooling (Playwright + playwright-bdd)
├── playwright.config.js
├── tests/
│   ├── e2e/features/baseline/      # Gherkin regression suite for the existing shop
│   ├── e2e/features/tickets/       # Gherkin features added per ticket
│   ├── e2e/steps/                  # Step definitions
│   ├── e2e/support/proof.js        # Screenshot proof helper for Then steps
│   └── support/static-server.mjs   # Local server used by the tests
├── docs/tickets/<id>/              # Per-ticket requirements, exploratory log, proof and test report (MD + HTML)
├── .github/
│   ├── copilot-instructions.md     # Project conventions for the AI agent
│   └── skills/                     # Feature development skills (see below)
└── README.md
```

## Run locally

Any static file server works. Serving over HTTP (rather than opening the files directly)
is recommended so `localStorage` behaves consistently. From the repository root:

```bash
# Python 3
python3 -m http.server 8000

# or Node.js
npx serve .
```

Then open <http://localhost:8000> (or the URL printed by `serve`).
`npm run serve` (after `npm ci`) starts the same server the tests use, including the security headers.

## Testing

End-to-end tests are written in Gherkin (Given/When/Then) so non-technical testers can read
them, and run with [Playwright](https://playwright.dev) via [playwright-bdd](https://github.com/vitalets/playwright-bdd).

```bash
npm ci                              # once
npx playwright install chromium     # once
npm run test:e2e                    # all scenarios (baseline + tickets)
npm run test:e2e:ticket -- @ticket-5   # only the scenarios tagged @ticket-5
```

Results are written to `test-results/e2e-results.json`. Every visual `Then` step attaches a screenshot
(`proof: …`) of the verified element, scrolled into view and outlined; the step fails if that element is not
visible in the viewport.

## Developing a feature from a ticket

Tickets live on the scrum board (`https://basic-scrum-board.vercel.app/api/tickets/<id>`).
In GitHub Copilot agent mode run:

```text
/develop-feature 5
```

The agent fetches the ticket, asks multiple-choice questions only about things it cannot
derive, writes risk-based Gherkin scenarios, implements the feature, explores it with
`playwright-cli`, generates a deterministic test report in `docs/tickets/5/report.md` and `report.html`
(with screenshot proof per scenario) and opens the HTML report when it is done.
See [.github/skills/README.md](.github/skills/README.md) for the stages and a worked example.

## Deploy to Vercel (Hobby plan)

The site is fully static, so it runs on the free Vercel Hobby plan without configuration:

1. Import this repository in the [Vercel dashboard](https://vercel.com/new)
   (Framework preset: **Other**, no build command, output directory: the repository root).
2. Click **Deploy**.

Or with the Vercel CLI: `npx vercel` (preview) and `npx vercel --prod` (production).
The security headers in `vercel.json` are applied automatically.
