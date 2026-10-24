# Example – test design for ticket #1

Input: [refine-ticket/examples/02-requirements.json](../../refine-ticket/examples/02-requirements.json).

## 1. Selection by risk

| AC | Risk | Automate? | Technique | Why |
|---|---|---|---|---|
| AC1 kawaii tone | low | ❌ | – | Subjective; reviewed in exploratory session S2 |
| AC2 ≤ 3 paragraphs | low | ❌ | – | Static content, no input; counted once in S2 |
| AC3 0/1/3/5 cards by width | **high** | ✅ | Boundary value analysis | Responsive logic in the shared header |
| AC4 cycle every 10 s, pause | **high** | ✅ | State transition + time boundary | Timers and state |
| AC5 card opens story page | **high** | ✅ | Use case | Navigation from every page |
| AC6 5 stories, every product helps | medium | ✅ | Equivalence partitioning | One check per product |

## 2. Minimum data per technique

**AC3 – boundaries from decision D3** (0 < 720 ≤ 1 < 1024 ≤ 3 < 1440 ≤ 5):

| Boundary | Below | On |
|---|---|---|
| 0 → 1 | 719 → 0 cards | 720 → 1 card |
| 1 → 3 | 1023 → 1 card | 1024 → 3 cards |
| 3 → 5 | 1439 → 3 cards | 1440 → 5 cards |

→ one `Scenario Outline`, six rows. A mid-range value (e.g. 1200) adds no information and is left out.

**AC4 – states and transitions** (decisions D4, D5):

```text
[A,B,C] ──10 s──► [B,C,D]         check at 9 s (unchanged) and 10 s (changed) = time boundary
[A,B,C] ──pause──► paused ──30 s──► [A,B,C]
5 visible ──10 s──► 5 visible (unchanged)
```
→ three scenarios. Hover/focus pausing (D5) and reduced motion (D6) are medium/low impact variants → exploratory session S1.

**AC5 – use case**: open one story from a non-home page (also proves cards appear on every page, D11) → one scenario.

**AC6 – partitions**: one partition per product (3) + story count (5) → one scenario with a table.

## 3. Overlap removed

| Candidate | Decision |
|---|---|
| "Cards are links" | Dropped – implied by AC5 scenario |
| "Cards show on the checkout page" | Dropped – AC5 scenario starts on the basket page, proving the shared header |
| "Basket count still correct with cards in the header" | Dropped – baseline `shopping-basket.feature` already covers it |
| "Header cards at 1440 also cycle" | Merged into "With room for all five stories nothing moves" |

**Result: 6 scenarios (one outline with 6 rows) for 4 automated criteria** →
[02-ticket-1-doomsday-stories.feature](./02-ticket-1-doomsday-stories.feature).
