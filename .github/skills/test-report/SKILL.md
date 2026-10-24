---
name: test-report
description: 'Generate a deterministic, identical-format test report (report.md + report.html with screenshot proof) for a ticket from requirements.json, Playwright E2E results and the exploratory log. Use when creating, regenerating, opening or explaining a test report or HTML report, screenshot proof, verdict, acceptance-criteria coverage or residual risks. Stage 4 of develop-feature.'
argument-hint: '<ticket-number>'
---

# Test report

The report is produced **only** by a script, so every run has the same sections, order, wording and formatting, and
identical inputs give a byte-identical file. It writes two files with the same content:

- `docs/tickets/<id>/report.md` – for review in git / pull requests
- `docs/tickets/<id>/report.html` – the report to read: styled, with the **screenshot proof** of every ticket scenario
  and the exploratory evidence shown inline (click an image for full size)

Proof screenshots are the `proof: …` attachments that `captureProof` ([tests/e2e/support/proof.js](../../../tests/e2e/support/proof.js))
adds in `Then` steps. The script copies those of the ticket scenarios to `docs/tickets/<id>/proof/` with deterministic
names (`<nn>-<scenario-slug>-<mm>.png`), replacing the folder on every run.

Never write or edit `report.md` / `report.html` by hand – fix the inputs and re-run.

## Procedure

1. Make sure the inputs are current:
   - `docs/tickets/<id>/ticket.json` and `requirements.json` (refine-ticket; `testApproach` from write-e2e-tests)
   - `test-results/e2e-results.json` from the **last full** `npm run test:e2e` run (after the last code change);
     the proof screenshots it references live in `test-results/` and are overwritten by the next test run
   - `docs/tickets/<id>/exploratory.json` (exploratory-testing)
2. Generate:
   ```bash
   npm run report -- --ticket <id>
   ```
   The script validates all inputs and exits with a list of problems if anything is malformed – fix those and re-run.
3. Verify determinism: run it a second time and confirm `git diff --stat docs/tickets/<id>/report.md` shows no change.
4. **Check the proof**: open `report.html` and look at section 5 *Proof – screenshots* and the evidence in sections 7–8.
   Every ticket scenario must have at least one image, and each image must show the verified change inside the viewport
   (outlined element visible, in the expected state, not cut off or covered). A scenario without proof is listed under
   *Residual risks*. If proof is missing or does not show the change, fix the test (write-e2e-tests, Automate step 3) or
   retake the evidence (exploratory-testing), re-run `npm run test:e2e` and regenerate.
5. Return the verdict line printed by the script and the paths of `report.md` and `report.html`.

## Open the HTML report

Open `report.html` in the VS Code integrated browser with `openBrowserPage` and the absolute file URL
(`file:///<repo>/docs/tickets/<id>/report.html`). The integrated browser only serves files inside the workspace.
If browser tools are not available, run `open docs/tickets/<id>/report.html` (macOS), `xdg-open …` (Linux) or
`start "" …` (Windows).

## What the report contains

Fixed sections, verdict rules and status rules: [report-format.md](./references/report-format.md).

## Example (ticket #1)

[examples/report.md](./examples/report.md) – generated from the ticket #1 examples of the earlier stages plus
[examples/sample-e2e-results.json](./examples/sample-e2e-results.json) (a trimmed real Playwright JSON report).
`examples/ticket-1/` holds the ticket snapshot and symlinks to the earlier examples, so the inputs never drift apart.
Screenshot and feature-file links in the example are intentionally dead – those files only exist in a real run – and
the sample results predate screenshot proof, so the example shows "_No screenshot proof recorded._" per scenario.
Regenerate it with:

```bash
node .github/skills/test-report/scripts/generate-report.mjs --ticket 1 \
  --dir .github/skills/test-report/examples/ticket-1 \
  --results .github/skills/test-report/examples/sample-e2e-results.json \
  --out .github/skills/test-report/examples/report.md
```

This also writes [examples/report.html](./examples/report.html).
