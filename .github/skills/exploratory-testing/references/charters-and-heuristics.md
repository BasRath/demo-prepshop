# Charters and heuristics

## Charter template

> **Explore** &lt;target area&gt; **with** &lt;resources, conditions, heuristics&gt; **to discover** &lt;the information/risk&gt;.

Good: *Explore the header story cards with widths around 720/1024/1440 px, browser zoom and reduced motion to discover
overlap, clipping and motion problems.*
Bad: *Test the stories.* (no target conditions, no information goal)

## Deriving charters from risk

| Source | Charter focus |
|---|---|
| High-risk criterion | Its boundaries and states **beyond** what the E2E outline already checks (odd widths, transitions while resizing, rapid interaction) |
| Medium/low and not-automated criteria | Quick confirmation checklist (e.g. count paragraphs, read tone) |
| Decisions with `source: derived` | Verify the assumption holds in the real UI (e.g. pause on focus) |
| Shared code touched | Regression tour of basket and checkout |
| Previous findings | Retest + look for siblings of the same bug |

## Heuristics (pick 3–5 per charter)

| Heuristic | What to vary in Prep Shop |
|---|---|
| **Boundaries** | Widths just below/on/above breakpoints (`resize 719 800`, `resize 720 800`), quantity 98/99, text length limits |
| **Goldilocks** | Too small (320 px), just right, too big (1920 px, zoom); empty / one / many items |
| **Interrupt** | Reload, back/forward, open in new tab, resize mid-animation, navigate away mid-cycle |
| **Keyboard only** | `press Tab` through the page, `press Enter` / `press Space` on controls, focus visibility, focus order |
| **Assistive tech** | Snapshot = accessibility tree: names on links/buttons, headings order, live regions, `alt` text |
| **Preferences** | `set-reduced-motion reduce`, `set-color-scheme dark`, `set-forced-colors active` |
| **State/persistence** | `localstorage-list`, corrupt values (`localstorage-set prepshop-basket "oops"`), second tab sync |
| **Repetition** | Rapid repeated clicks, double submit, add the same product many times |
| **Consistency** | Same header on every page, wording/tone vs. the rest of the shop, prices identical everywhere |
| **Security hygiene** | `console error` for CSP violations, no inline script/style needed, user text rendered as text |

## Severity

| Severity | Shopper impact |
|---|---|
| critical | Cannot buy / data loss / site unusable for a group of users (e.g. keyboard users) |
| high | Acceptance criterion not met, or main flow broken with an awkward workaround |
| medium | Criterion met but with noticeable UX/accessibility problems |
| low | Cosmetic, wording, minor inconsistency |
