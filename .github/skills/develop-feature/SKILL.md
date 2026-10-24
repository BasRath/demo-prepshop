---
name: develop-feature
description: 'Develop and test a feature end to end from a scrum board ticket number. Use when asked to develop, build, implement or deliver ticket <number> / #<number>, or "/develop-feature 5". Fetches the ticket, refines it with multiple-choice clarifications, designs risk-based Gherkin E2E tests, implements the feature, runs automated and exploratory (playwright-cli) tests, fixes defects and generates a deterministic test report.'
argument-hint: '<ticket-number>, e.g. 5'
---

# Develop feature from a ticket

Single entry point. Given a ticket number it delivers a committed feature branch with code, Gherkin E2E tests,
an exploratory testing log and a deterministic report in `docs/tickets/<id>/report.md`.

Project conventions: [copilot-instructions.md](../../copilot-instructions.md). Pipeline overview: [skills README](../README.md).

## Questioning rules (apply to every stage)

- **Never ask what can be derived** from the ticket, the codebase, `README.md`, `copilot-instructions.md`, earlier decisions in `requirements.json` or industry standards (WCAG, HTML semantics). Record such answers as `"source": "derived"` with evidence.
- Ask only when there are ≥2 reasonable interpretations that lead to **different behaviour or different tests**. Always use the `ask_user` tool with **multiple-choice options**, one question per call, recommended option first with "(Recommended)".
- Never ask for confirmation of a plan, permission to continue, or anything already answered.

## Procedure

Track progress with the session `todos` table (one todo per step below).

### 0. Preflight
1. Parse the ticket number from the argument (`5`, `#5`, `ticket-5`). If none was given, ask for it (free text – the only free-text question allowed).
2. `git status --porcelain`: if the working tree is dirty with changes unrelated to this ticket, ask: *Stash them (Recommended)* / *Commit them first* / *Continue with them*.
3. If `node_modules` is missing run `npm ci`; make sure Chromium is installed (`npx playwright install chromium`).
4. Run `npm run test:e2e`. Remember pre-existing failures so they are not blamed on this feature.

### 1. Refine → [refine-ticket](../refine-ticket/SKILL.md)
Produces `docs/tickets/<id>/ticket.json` and `requirements.json` (refined acceptance criteria, decisions, risk per criterion).
Stop and report if the ticket does not exist or has status `done`.

### 2. Branch
Create or switch to `feature/ticket-<id>-<slug>` (slug from `ticket.json`) based on `main`. Do not ask.

### 3. Design tests first → [write-e2e-tests](../write-e2e-tests/SKILL.md), *Design* phase
Write `tests/e2e/features/tickets/ticket-<id>-<slug>.feature` before implementing; it is the executable specification.

### 4. Implement
- Follow [copilot-instructions.md](../../copilot-instructions.md) (static pages, strict CSP, `textContent` only, accessibility, mobile first).
- Implement exactly the refined acceptance criteria and decisions – nothing more. Respect `outOfScope`.
- Update `README.md` (Features / Project structure) and `tests/e2e/support/products.js` if products change.

### 5. Automate and run → [write-e2e-tests](../write-e2e-tests/SKILL.md), *Automate* phase
Bind steps, run the ticket scenarios, then the full suite. Fix the **implementation** until green; only change a scenario when it contradicts `requirements.json`.

### 6. Explore → [exploratory-testing](../exploratory-testing/SKILL.md)
Charter-based `playwright-cli` sessions. Produces `docs/tickets/<id>/exploratory.json` and screenshots.

### 7. Fix loop (max 3 iterations)
For each **open** finding with severity `critical`, `high` or `medium` that is in scope:
fix → re-run step 5 → re-test the finding with `playwright-cli` → set `"status": "fixed"` and a `resolution`.
If a finding reveals a missing scenario for a high-risk criterion, add it (step 3 rules). Leave `low` findings and anything out of scope `open` or `accepted` with a reason. After 3 loops, stop fixing and report what is left.

### 8. Report → [test-report](../test-report/SKILL.md)
`npm run report -- --ticket <id>`. Never edit `report.md` by hand.

### 9. Commit
Stage the feature code, tests, README and `docs/tickets/<id>/`. Commit on the feature branch:

```text
feat(ticket-<id>): <ticket title>

<one line per acceptance criterion and its status>
Test report: docs/tickets/<id>/report.md
```

Do not push or open a PR unless asked.

### 10. Hand-over
Reply concisely: verdict, link to `report.md`, decisions that were asked vs. derived, open findings, and suggested next step (e.g. open a PR).

## Done when
- [ ] Every acceptance criterion in `requirements.json` has status Passed or Passed with issues in the report
- [ ] `npm run test:e2e` is green (or only pre-existing failures remain, listed in the report)
- [ ] No open critical/high findings
- [ ] `report.md` regenerated after the last change and committed
