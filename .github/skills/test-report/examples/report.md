# Test report – Ticket #1: Create kawaii doomsday stories

| Item | Value |
| --- | --- |
| Ticket | [#1](https://basic-scrum-board.vercel.app/api/tickets/1) |
| Ticket status | in-progress |
| Ticket last updated | 2026-10-24T19:03:10.047Z |
| Verdict | **⚠️ PASSED WITH ISSUES** |

## 1. Summary

- 1 open medium/low finding.

| Area | Passed | Passed with issues | Failed | Not covered / skipped | Total |
| --- | --- | --- | --- | --- | --- |
| Acceptance criteria | 5 | 1 | 0 | 0 | 6 |
| Automated scenarios – this ticket | 11 | 0 | 0 | 0 | 11 |
| Automated scenarios – regression | 9 | 0 | 0 | 0 | 9 |
| Exploratory sessions | 3 | 0 | 0 | 0 | 3 |

| Findings | critical | high | medium | low |
| --- | --- | --- | --- | --- |
| Open | 0 | 0 | 0 | 1 |
| Fixed | 0 | 0 | 1 | 0 |
| Accepted | 0 | 0 | 0 | 0 |

## 2. Goal and scope

**Goal:** Shoppers on wider screens see cute doomsday story cards in the header that cycle and open a story page recommending the products that help in that scenario.

**Affected areas:**

- All *.html pages (header)
- README.md
- shop.js
- story-*.html (new)
- style.css

**Out of scope:**

- Story cards on screens narrower than 720px
- Sharing or commenting on stories
- Changes to products, basket or checkout

## 3. Clarifications and decisions

| ID | Topic | Decision | Source | Evidence |
| --- | --- | --- | --- | --- |
| D1 | Duplicate criterion number | Second criterion 5 becomes AC6. | 🔎 Derived | Ticket text numbers two criteria as 5. |
| D2 | Meaning of kawaii | Same cute anime, tongue-in-cheek tone as the existing shop copy. | 🔎 Derived | README.md 'anime-themed'; index.html title 'Kawaii Doomsday Supplies'; copilot-instructions tone rule. |
| D3 | Card count per screen width | 0 below 720px, 1 from 720px, 3 from 1024px, 5 from 1440px. | 🙋 Asked | Asked: 'AC3: at which screen widths should 0, 1, 3 and 5 story cards be shown in the header?' |
| D4 | Cycling behaviour | Advance by one story every 10 seconds. | 🙋 Asked | Asked: 'AC4: when fewer than 5 cards are visible, what should change every 10 seconds?' |
| D5 | Pause control | Visible pause/play button; cycling also pauses while a card is hovered or has focus. | 🔎 Derived | WCAG 2.2.2 Pause, Stop, Hide; copilot-instructions accessibility rule. |
| D6 | Reduced motion | No slide animation when prefers-reduced-motion is set; cards still change. | 🔎 Derived | style.css: @media (prefers-reduced-motion: reduce). |
| D7 | Card content | Story title and a one-line teaser; the whole card is one link. | 🔎 Derived | Limited header space; HTML semantics for navigation. |
| D8 | Story page technology | One static page per story (story-<slug>.html) using the product page skeleton. | 🔎 Derived | Static site without build step; strict CSP (copilot-instructions). |
| D9 | Story page content | Story title as h1, story text, then links to the products that help. | 🔎 Derived | AC6 requires products to be beneficial; product pages exist. |
| D10 | Choice of legends | Ragnarök, The Kraken's Bath Day, The Mind-Ray Mothership, The Great Calendar Reset, The Moon Catches a Cold. | 🔎 Derived | Creative content without behavioural impact, constrained by AC1, AC2 and AC6. |
| D11 | Pages with cards | Cards appear in the header on every page. | 🔎 Derived | All pages share the same site-header markup. |

## 4. Acceptance criteria

| AC | Criterion | Risk | Automated | Exploratory | Findings | Status |
| --- | --- | --- | --- | --- | --- | --- |
| AC1 | Every story is written in the shop's cute, tongue-in-cheek anime tone; factual accuracy is not required. | low | Not automated (see 9) | S2 | None | ✅ Passed |
| AC2 | Each story page shows between 1 and 3 paragraphs of story text. | low | Not automated (see 9) | S2 | None | ✅ Passed |
| AC3 | The header shows 0 story cards below 720px wide, 1 from 720px, 3 from 1024px and 5 from 1440px, without overlapping the logo or the basket link. | high | 6/6 passed | S1 | F2 (open) | ⚠️ Passed with issues |
| AC4 | When fewer than 5 cards are visible, the cards advance by one story every 10 seconds; with 5 cards visible nothing moves. A pause button stops cycling, and cycling pauses while a card is hovered or focused. | high | 3/3 passed | S1 | F1 (fixed) | ✅ Passed |
| AC5 | Activating a story card (click or Enter) opens that story's page, whose main heading is the story title. | high | 1/1 passed | S2 | None | ✅ Passed |
| AC6 | There are exactly 5 stories based on lore or legend; every product (Dehydrated Water, Tinfoil Thinking Cap, Canned Optimism) is recommended with a link on at least one story page. | medium | 1/1 passed | S2 | None | ✅ Passed |

## 5. Automated scenarios – this ticket

| # | Feature | Scenario | AC | Risk | Result |
| --- | --- | --- | --- | --- | --- |
| 1 | Kawaii doomsday stories | Number of story cards on a 719 pixel wide screen is 0 | AC3 | high | ✅ passed |
| 2 | Kawaii doomsday stories | Number of story cards on a 720 pixel wide screen is 1 | AC3 | high | ✅ passed |
| 3 | Kawaii doomsday stories | Number of story cards on a 1023 pixel wide screen is 1 | AC3 | high | ✅ passed |
| 4 | Kawaii doomsday stories | Number of story cards on a 1024 pixel wide screen is 3 | AC3 | high | ✅ passed |
| 5 | Kawaii doomsday stories | Number of story cards on a 1439 pixel wide screen is 3 | AC3 | high | ✅ passed |
| 6 | Kawaii doomsday stories | Number of story cards on a 1440 pixel wide screen is 5 | AC3 | high | ✅ passed |
| 7 | Kawaii doomsday stories | The stories move on by one after 10 seconds | AC4 | high | ✅ passed |
| 8 | Kawaii doomsday stories | Pausing the stories keeps them in place | AC4 | high | ✅ passed |
| 9 | Kawaii doomsday stories | With room for all five stories nothing moves | AC4 | medium | ✅ passed |
| 10 | Kawaii doomsday stories | Opening a story from its card | AC5 | high | ✅ passed |
| 11 | Kawaii doomsday stories | Every product is recommended by at least one of the five stories | AC6 | medium | ✅ passed |

## 6. Regression – existing scenarios

| Feature file | Passed | Failed | Flaky | Skipped |
| --- | --- | --- | --- | --- |
| tests/e2e/features/baseline/checkout.feature | 4 | 0 | 0 | 0 |
| tests/e2e/features/baseline/shopping-basket.feature | 5 | 0 | 0 | 0 |

## 7. Exploratory testing sessions

### S1 – Explore the header story cards with widths around 720/1024/1440 px, keyboard focus, hover and reduced motion to discover overlap, clipping and cycling/pause problems

| Field | Value |
| --- | --- |
| Status | ✅ completed |
| Acceptance criteria | AC3, AC4 |
| Heuristics | Boundaries, Goldilocks, Keyboard only, Preferences, Interrupt |
| Environments | Chromium 720x800, Chromium 721x800, Chromium 1023x800, Chromium 1024x800, Chromium 1440x900, reduced motion |
| Findings | F1, F2 |

**Notes:**

- At 720 px one card is shown and fits between logo and basket.
- At 1024 px three cards are shown; at 1440 px five cards are shown and nothing moves.
- Cycling pauses on hover (D5) and changes cards without animation under reduced motion (D6).
- Cycling did not pause while a card had keyboard focus (F1); after the fix focus pauses cycling.

**Evidence:**

- [.github/skills/test-report/examples/ticket-1/screenshots/S1-01-one-card-at-720.png](ticket-1/screenshots/S1-01-one-card-at-720.png)
- [.github/skills/test-report/examples/ticket-1/screenshots/S1-02-title-truncated-at-721.png](ticket-1/screenshots/S1-02-title-truncated-at-721.png)
- [.github/skills/test-report/examples/ticket-1/screenshots/S1-03-focus-lost-after-cycle.png](ticket-1/screenshots/S1-03-focus-lost-after-cycle.png)

### S2 – Explore the five story pages with keyboard and the accessibility snapshot to discover navigation, content-length and tone problems

| Field | Value |
| --- | --- |
| Status | ✅ completed |
| Acceptance criteria | AC1, AC2, AC5, AC6 |
| Heuristics | Consistency, Assistive tech, Boundaries |
| Environments | Chromium 1440x900 |
| Findings | None |

**Notes:**

- All five stories open from their card with Enter; h1 matches the card title.
- Paragraph counts: 3, 2, 3, 3, 2 (AC2 met).
- Tone is cute and tongue-in-cheek, consistent with product copy (AC1 met).
- Each product is linked from at least one story: Dehydrated Water (2), Tinfoil Thinking Cap (2), Canned Optimism (2).

**Evidence:**

- None.

### S3 – Explore basket and checkout with the new header on 720 and 1440 px to discover regressions caused by the shared header change

| Field | Value |
| --- | --- |
| Status | ✅ completed |
| Acceptance criteria | – |
| Heuristics | Consistency, State/persistence, Repetition |
| Environments | Chromium 720x800, Chromium 1440x900 |
| Findings | None |

**Notes:**

- Basket count stays correct across pages and reloads.
- Checkout and thank-you message unaffected; no console errors besides the known favicon 404.

**Evidence:**

- None.

## 8. Findings

| ID | Severity | Status | AC | Session | Title |
| --- | --- | --- | --- | --- | --- |
| F1 | medium | fixed | AC4 | S1 | Story cards keep cycling while a card has keyboard focus |
| F2 | low | open | AC3 | S1 | Long story title truncated at 721 px without a way to read it in full |

### F1 – Story cards keep cycling while a card has keyboard focus

**Steps to reproduce:**

1. Open the shop at 1024 px wide
2. Press Tab until the first story card has focus
3. Wait 10 seconds

**Expected:** Cycling pauses while a card has focus (decision D5).

**Actual:** The focused card slides away and focus is lost.

**Resolution:** Added focusin/focusout handlers that pause and resume the timer; retested with the same steps in S1 – focus now pauses cycling.

**Evidence:** [.github/skills/test-report/examples/ticket-1/screenshots/S1-03-focus-lost-after-cycle.png](ticket-1/screenshots/S1-03-focus-lost-after-cycle.png)

### F2 – Long story title truncated at 721 px without a way to read it in full

**Steps to reproduce:**

1. Open the shop at 721 px wide
2. Look at the single story card

**Expected:** The full story title is readable or available.

**Actual:** "The Great Calendar Reset" is shown as "The Great Calen…".

**Evidence:** [.github/skills/test-report/examples/ticket-1/screenshots/S1-02-title-truncated-at-721.png](ticket-1/screenshots/S1-02-title-truncated-at-721.png)

## 9. Residual risks

- AC1 (low risk) is not automated: Subjective content quality; reviewed during exploratory session S2.
- AC2 (low risk) is not automated: Static content with no input; counted once during exploratory session S2.
- F2 (low) is still open: Long story title truncated at 721 px without a way to read it in full
- Not explored: Firefox and WebKit – the project tests Chromium only.
- Not explored: Screen widths below 720 px beyond a single check – story cards are out of scope there.

## 10. Artifacts

- [.github/skills/test-report/examples/ticket-1/ticket.json](ticket-1/ticket.json)
- [.github/skills/test-report/examples/ticket-1/requirements.json](ticket-1/requirements.json)
- [.github/skills/test-report/examples/ticket-1/exploratory.json](ticket-1/exploratory.json)
- [tests/e2e/features/tickets/ticket-1-create-kawaii-doomsday-stories.feature](../../../../tests/e2e/features/tickets/ticket-1-create-kawaii-doomsday-stories.feature)

---

_Generated by `.github/skills/test-report/scripts/generate-report.mjs`. Do not edit by hand; re-run the script instead._
