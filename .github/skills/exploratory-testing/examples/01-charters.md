# Example – charters for ticket #1

Derived from the risk table in [02-requirements.json](../../refine-ticket/examples/02-requirements.json) and the test
design in [write-e2e-tests/examples/01-test-design.md](../../write-e2e-tests/examples/01-test-design.md).

| Session | Charter | ACs | Heuristics | Why this charter |
|---|---|---|---|---|
| S1 | Explore the header story cards **with** widths around 720/1024/1440 px, keyboard focus, hover and reduced motion **to discover** overlap, clipping and cycling/pause problems | AC3, AC4 | Boundaries, Goldilocks, Keyboard only, Preferences, Interrupt | Two high-risk criteria; verifies derived decisions D5 (pause on hover/focus) and D6 (reduced motion) that the E2E suite does not automate |
| S2 | Explore the five story pages **with** keyboard and the accessibility snapshot **to discover** navigation, content-length and tone problems | AC1, AC2, AC5, AC6 | Consistency, Assistive tech, Boundaries (≤ 3 paragraphs) | AC1 and AC2 are not automated (low risk) and must be checked here |
| S3 | Explore basket and checkout **with** the new header on 720 and 1440 px **to discover** regressions caused by the shared header change | – | Consistency, State/persistence, Repetition | Shared header and `shop.js` changed |

Not explored (recorded in `notExplored`): Firefox/WebKit – the project tests Chromium only; screen widths below 720 px
beyond a single check – out of scope per `outOfScope`.

## Checklist used inside S2 for the not-automated criteria

- [ ] AC1 – each story reads cute and tongue-in-cheek, matches the shop's tone
- [ ] AC2 – count `paragraph` nodes inside `main` in the snapshot (1–3 per story)
