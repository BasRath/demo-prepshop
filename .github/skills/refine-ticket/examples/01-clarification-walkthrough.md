# Example – refining ticket #1 "Create kawaii doomsday stories"

Fetched with `npm run ticket:fetch -- 1`. Raw criteria from the ticket:

```text
1 Scenario's need to be kawaii, but they do not have to be accurate.
2 Scenario's are at most 3 paragraphs.
3 Scenariocards are visible on each viewport that has plenty of room between the logo and the basket.
  Show either 0, 1, 3 or 5 depending on available space.
4 If less than 5 scenariocards are shown, make sure they cycle every 10 seconds.
5 When you click a story card, a story page is shown. That page is centerered around a scenario.
5 Create 5 scenario's that are loosely based on popular belief, lore or legend. Incorporate the 3 products
  in a way so that each of the products would be beneficial for at least 1 of the scenario's.
```

## Ambiguities found and how each was resolved

| # | Ambiguity | Resolution | Why |
|---|---|---|---|
| D1 | Criterion "5" appears twice | 🔎 Derived: second one becomes AC6 | Obvious numbering mistake in the ticket |
| D2 | What does "kawaii" mean here? | 🔎 Derived: same cute anime tone as the shop copy | README ("anime-themed"), page title "Kawaii Doomsday Supplies", copilot-instructions tone rule |
| D3 | At which widths are 0 / 1 / 3 / 5 cards shown? | 🙋 **Asked** | Ticket gives no numbers and the code only has one breakpoint (720px); the answer changes the boundary tests |
| D4 | What happens every 10 seconds? | 🙋 **Asked** | Two common carousel patterns behave and test differently |
| D5 | Moving content needs a pause control? | 🔎 Derived: pause button + pause while hovered/focused | WCAG 2.2.2 (auto-updating > 5 s) and copilot-instructions accessibility rule |
| D6 | Reduced motion | 🔎 Derived: no slide animation with `prefers-reduced-motion`; cards still cycle | Existing `@media (prefers-reduced-motion: reduce)` in style.css |
| D7 | What is on a card? | 🔎 Derived: story title + one-line teaser, the whole card is a link | Limited header space; a clickable card is a link (HTML semantics) |
| D8 | How is the story page built? | 🔎 Derived: one static page per story (`story-<slug>.html`) using the product page skeleton | Static site, no build step, strict CSP (copilot-instructions) |
| D9 | "Centered around a scenario" | 🔎 Derived: the story is the page's `h1` and main content, followed by links to the products that help | AC6 asks for products to be beneficial; product pages already exist |
| D10 | Which 5 legends, which product helps where? | 🔎 Derived: chosen during implementation within the constraints of AC1, AC2, AC6 | Creative content with no behavioural impact on tests beyond AC6 |
| D11 | On which pages are cards shown? | 🔎 Derived: every page (shared header) | The header is identical on all pages |

Only **2 of 11** ambiguities became questions.

## The two questions, as asked with `ask_user`

**D3** – the boundaries are business decisions and directly become boundary-value test data.

```json
{
  "question": "AC3: at which screen widths should 0, 1, 3 and 5 story cards be shown in the header?",
  "choices": [
    "0 below 720px, 1 from 720px, 3 from 1024px, 5 from 1440px (Recommended – reuses the existing 720px desktop breakpoint)",
    "0 below 960px, 1 from 960px, 3 from 1280px, 5 from 1600px",
    "Calculated from the actual free space between logo and basket (container query, no fixed widths)"
  ]
}
```
Answer: option 1 → decision D3, refined AC3.

**D4** – step-by-one vs. page-swap changes what a tester expects to see after 10 seconds.

```json
{
  "question": "AC4: when fewer than 5 cards are visible, what should change every 10 seconds?",
  "choices": [
    "Advance by one: the first card leaves, the next story appears at the end (Recommended – content changes gradually)",
    "Swap the whole set: all visible cards are replaced by the next stories"
  ]
}
```
Answer: option 1 → decision D4, refined AC4.

## Questions that were deliberately **not** asked

- "Should I use a carousel library?" – project rules: no runtime dependencies.
- "Should the cards be accessible?" – always, per project rules.
- "Can I create a new branch?" / "Shall I proceed?" – permission questions are never asked.
- "Which legends do you prefer?" – no behavioural impact; constrained by AC1, AC2 and AC6.

Result: [02-requirements.json](./02-requirements.json).
