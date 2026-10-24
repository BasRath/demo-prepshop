# Risk assessment

Risk drives how much testing each acceptance criterion gets. Score every criterion on two axes from the shopper's
point of view, then read the level from the matrix.

## Impact – what happens to the shopper if this criterion is broken?

| Level | Meaning | Prep Shop examples |
|---|---|---|
| high | Shopper cannot buy, sees wrong money/quantities, loses data, is blocked (incl. keyboard/screen-reader users), or the layout hides navigation | Basket total wrong, checkout fails, header overlaps basket link |
| medium | A feature works partly or is confusing; a workaround exists | Carousel does not pause, story link goes to wrong story |
| low | Cosmetic or content-tone issue | Slightly off wording, a story with four paragraphs |

## Likelihood – how likely is a defect?

| Level | Signals |
|---|---|
| high | New logic, timers, responsive/viewport logic, state in `localStorage`, calculations, many combinations, changes to shared header/`shop.js` |
| medium | New page or component following an existing pattern, moderate logic |
| low | Static content, copy, reuse of proven code |

## Matrix

| Impact \ Likelihood | low | medium | high |
|---|---|---|---|
| **high** | medium | high | high |
| **medium** | low | medium | high |
| **low** | low | low | medium |

## What the level means for testing

| Risk | Automated E2E (write-e2e-tests) | Exploratory (exploratory-testing) |
|---|---|---|
| high | Yes – apply a formal technique (boundaries, partitions, state transitions, decision table) | Dedicated charter |
| medium | Yes – one scenario for the main behaviour, outline only if a boundary/partition matters | Covered within a shared charter |
| low | No – record `testApproach.automated = false` with the reason | Checked during a charter (checklist item) |

Shared/regression risk: if the change touches shared parts (header, `shop.js`, `style.css` base rules), add an
exploratory regression charter for basket and checkout; the baseline E2E suite runs anyway.
