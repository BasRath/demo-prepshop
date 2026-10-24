# Prep Shop – project guidelines

Prep Shop is a static, framework-free demo webshop (HTML + CSS + vanilla JS, no build step).
The site has **no runtime dependencies**; `package.json` only holds dev dependencies for end-to-end testing.

## Implementation rules

- **Keep it static.** Plain `.html` pages in the repository root, one shared `style.css` and one shared `shop.js`. New pages follow the existing page skeleton (skip link, `site-header`, `main#main`, `site-footer`, `<noscript>`). Copy the header/footer from an existing page so they stay identical.
- **Strict CSP.** No inline `<script>`, `<style>`, `style=""` or event-handler attributes, no external URLs (fonts, CDNs, images). Every page keeps the same CSP `<meta>` tag as the existing pages; `vercel.json` must keep working unchanged.
- **Safe DOM.** Update the DOM with `textContent`, `createElement` and `replaceChildren` only – never `innerHTML`/`outerHTML`/`insertAdjacentHTML`. Validate anything read from `localStorage` (see `readBasket()` in `shop.js`).
- **Accessibility is a requirement, not a nice-to-have.** Semantic HTML, labelled controls, `alt` text, visible focus, `aria-live` for status messages, keyboard operability, and respect `prefers-reduced-motion`. Anything that moves or updates automatically for more than 5 seconds needs a pause control (WCAG 2.2.2).
- **Responsive, mobile first.** Base styles target small screens; the existing desktop breakpoint is `@media (min-width: 720px)`. Reuse it before adding new breakpoints.
- **Tone.** Copy is tongue-in-cheek and kawaii (cute anime style), and never mean-spirited.
- Keep `shop.js` in its IIFE with `'use strict'`; add features as small `init*` functions called from the `DOMContentLoaded` handler.
- Update `README.md` (Features / Project structure) when user-visible behaviour or files change.

## Testing

- Run locally: `npm run serve` → <http://localhost:8000> (applies the `vercel.json` security headers).
- End-to-end tests are Gherkin features in `tests/e2e/features/` executed by playwright-bdd: `npm run test:e2e`.
  - `baseline/` covers existing shop behaviour; `tickets/` holds one feature file per ticket.
  - Step definitions live in `tests/e2e/steps/`; reuse `shop.steps.js` before adding new steps.
  - Visual `Then` steps call `captureProof` (`tests/e2e/support/proof.js`) so every scenario has screenshot proof that
    shows the verified change inside the viewport.
- Exploratory testing uses `playwright-cli`.
- Per-ticket artifacts (ticket snapshot, requirements, exploratory log, screenshots, proof, `report.md` / `report.html`) live in `docs/tickets/<id>/`.

## Feature workflow

Use the `develop-feature` skill with a ticket number (e.g. `/develop-feature 5`). It chains the skills in
`.github/skills/` – see [.github/skills/README.md](skills/README.md) for the order.
