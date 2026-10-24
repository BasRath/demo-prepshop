---
name: test-report
description: 'Generate a deterministic, identical-format Markdown test report for a ticket from requirements.json, Playwright E2E results and the exploratory log. Use when creating, regenerating or explaining a test report, verdict, acceptance-criteria coverage or residual risks. Stage 4 of develop-feature.'
argument-hint: '<ticket-number>'
---

# Test report

The report is produced **only** by a script, so every run has the same sections, order, wording and formatting, and
identical inputs give a byte-identical file. Never write or edit `report.md` by hand – fix the inputs and re-run.

## Procedure

1. Make sure the inputs are current:
   - `docs/tickets/<id>/ticket.json` and `requirements.json` (refine-ticket; `testApproach` from write-e2e-tests)
   - `test-results/e2e-results.json` from the **last full** `npm run test:e2e` run (after the last code change)
   - `docs/tickets/<id>/exploratory.json` (exploratory-testing)
2. Generate:
   ```bash
   npm run report -- --ticket <id>
   ```
   The script validates all inputs and exits with a list of problems if anything is malformed – fix those and re-run.
3. Verify determinism: run it a second time and confirm `git diff --stat docs/tickets/<id>/report.md` shows no change.
4. Return the verdict line printed by the script and the path `docs/tickets/<id>/report.md`.

## What the report contains

Fixed sections, verdict rules and status rules: [report-format.md](./references/report-format.md).

## Example (ticket #1)

[examples/report.md](./examples/report.md) – generated from the ticket #1 examples of the earlier stages plus
[examples/sample-e2e-results.json](./examples/sample-e2e-results.json) (a trimmed real Playwright JSON report).
`examples/ticket-1/` holds the ticket snapshot and symlinks to the earlier examples, so the inputs never drift apart.
Screenshot and feature-file links in the example are intentionally dead – those files only exist in a real run.
Regenerate it with:

```bash
node .github/skills/test-report/scripts/generate-report.mjs --ticket 1 \
  --dir .github/skills/test-report/examples/ticket-1 \
  --results .github/skills/test-report/examples/sample-e2e-results.json \
  --out .github/skills/test-report/examples/report.md
```
