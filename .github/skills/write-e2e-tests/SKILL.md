---
name: write-e2e-tests
description: 'Design and automate risk-based end-to-end tests in Gherkin (Given/When/Then) with playwright-bdd. Use when writing, reviewing or running E2E tests, feature files, BDD scenarios or step definitions; applying boundary value analysis, equivalence partitioning, state transition or decision tables; minimising test overlap; or capturing and reviewing screenshot proof. Tests focus on front-end user experience and are readable by non-technical testers. Stage 2 of develop-feature.'
argument-hint: '<ticket-number> [design|automate]'
---

# Write E2E tests (Gherkin + playwright-bdd)

Two phases. **Design** runs *before* implementation (the feature file is the executable spec).
**Automate** runs *after* implementation (step definitions + green run).

Inputs: `docs/tickets/<id>/requirements.json` (criteria, decisions, risk). Existing suites: `tests/e2e/features/`.

## Phase A – Design (before coding)

1. **Select by risk** – from each criterion's `risk.level` (matrix in the refine-ticket skill):
   - `high` → automate with a formal technique; `medium` → one scenario for the main behaviour; `low` → **not automated**
     (left to exploratory testing).
   - Write `testApproach` (`automated`, `technique`, `reason` when not automated) back into `requirements.json`.
2. **Pick the technique and the minimum data** with [test-techniques.md](./references/test-techniques.md).
   Use the values from `decisions` (e.g. agreed breakpoints) as boundaries.
3. **Remove overlap** before writing:
   - Read `tests/e2e/features/baseline/*.feature` and other ticket features. Do not re-test behaviour they already cover.
   - Each scenario must be able to fail for a reason no other scenario fails for. Merge scenarios that would fail together;
     move data variations into one `Scenario Outline`.
   - Target: the fewest scenarios that cover every automated criterion. Typically 1–2 per high-risk criterion, 1 per medium.
4. **Write** `tests/e2e/features/tickets/ticket-<id>-<slug>.feature` following [gherkin-style-guide.md](./references/gherkin-style-guide.md):
   - Feature tag `@ticket-<id>`; every scenario tagged `@AC<n>` and `@risk-<level>` (the report relies on these tags).
   - A comment above each scenario: criterion, risk and technique (one line).
5. **Self-check** with the checklist at the end of the style guide.

## Phase B – Automate (after coding)

1. Reuse steps from `tests/e2e/steps/shop.steps.js`. Put new steps in `tests/e2e/steps/<feature-slug>.steps.js`
   following [step-definitions.md](./references/step-definitions.md) (role-based locators, `page.clock` for time, no sleeps,
   **`captureProof` in every visual `Then` step**).
2. Run only this ticket, then everything:
   ```bash
   npx bddgen && npx playwright test --grep @ticket-<id>
   npm run test:e2e
   ```
   `npm run test:e2e` must run last: it writes `test-results/e2e-results.json` (with the proof screenshots attached),
   the input of the report.
3. **Review the proof screenshots** of this ticket's scenarios (`test-results/**/attachments/proof-*.png`, open them
   with the `view` tool). For each, check that the changed behaviour is actually visible in the viewport: the outlined
   element is the one the step is about, it is in the expected state, fully readable and not cut off or covered.
   If not, change the test – a better proof locator, a viewport/state step in the scenario, or scrolling to the part of
   the page under test – and re-run. Never change the assertion itself to make a proof fit.
4. **Prove the tests can fail** (quick mutation check): temporarily break the behaviour behind each high-risk scenario
   (e.g. change a breakpoint or the 10 s interval), confirm the scenario fails, then revert.
5. A failing scenario means the implementation is wrong unless the scenario contradicts `requirements.json`.
   Never weaken an assertion to get green.

## Examples (ticket #1)

1. [01-test-design.md](./examples/01-test-design.md) – risk-based selection, techniques, overlap removal
2. [02-ticket-1-doomsday-stories.feature](./examples/02-ticket-1-doomsday-stories.feature) – resulting feature file
3. [03-doomsday-stories.steps.js](./examples/03-doomsday-stories.steps.js) – step definitions with clock, viewport and screenshot proof
4. [04-gherkin-do-and-dont.md](./examples/04-gherkin-do-and-dont.md) – style before/after

Runnable reference: [tests/e2e/features/baseline](../../../tests/e2e/features/baseline) and [shop.steps.js](../../../tests/e2e/steps/shop.steps.js).
