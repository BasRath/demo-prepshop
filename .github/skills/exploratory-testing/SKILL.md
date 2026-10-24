---
name: exploratory-testing
description: 'Run charter-based, risk-driven exploratory testing sessions in the browser with playwright-cli and log sessions and findings to exploratory.json. Use when exploring a feature or ticket, hunting for bugs, testing responsiveness, keyboard and accessibility, reduced motion, persistence or regressions, retesting a finding, or collecting screenshot evidence. Stage 3 of develop-feature.'
argument-hint: '<ticket-number>'
---

# Exploratory testing with playwright-cli

Structured, time-boxed sessions (session-based test management). Each session follows a **charter** derived from
risk, uses heuristics to vary conditions, and records notes, evidence and findings in a fixed JSON format that the
report generator reads.

Inputs: `docs/tickets/<id>/requirements.json`, the ticket feature file and its latest E2E results.
Output: `docs/tickets/<id>/exploratory.json` and `docs/tickets/<id>/screenshots/*.png`.

## Procedure

1. **Plan charters** (before opening a browser) with [charters-and-heuristics.md](./references/charters-and-heuristics.md):
   - One charter per **high**-risk criterion (or tightly related pair), one shared charter for medium/low criteria
     (incl. every `testApproach.automated = false` criterion – these must be checked here), and one **regression**
     charter when shared parts (header, `shop.js`, `style.css`) changed.
   - Usually 2–4 charters. Format: *Explore &lt;target&gt; with &lt;resources/heuristics&gt; to discover &lt;information&gt;*.
2. **Start the site** (attached async process) and verify it responds:
   ```bash
   npm run serve            # async; then: curl -sf http://localhost:8000 >/dev/null
   ```
3. **Run each session** with its own named browser session, following [playwright-cli-guide.md](./references/playwright-cli-guide.md):
   ```bash
   playwright-cli -s=t<id>-S1 open http://localhost:8000
   ```
   - Snapshot → act → snapshot. Vary conditions using the charter's heuristics (widths around boundaries, keyboard only,
     reduced motion, reload/back, empty and full basket, rapid repeats).
   - Time box: about 25 actions per charter. Stop earlier when the charter's question is answered.
   - Check `playwright-cli -s=… console error` at least once per page visited (the favicon 404 is known noise).
   - Save evidence only when it proves something (a finding or a key observation):
     `--filename=docs/tickets/<id>/screenshots/<session>-<nn>-<slug>.png` (deterministic names, `nn` = 01, 02, …).
   - Close: `playwright-cli -s=t<id>-S1 close`.
4. **Log** every session and finding in `exploratory.json` using [exploratory-schema.md](./references/exploratory-schema.md).
   Notes are factual observations ("At 1023 px one card is shown"), not opinions. Severity follows the table in the schema.
5. **Retest** (called from the develop-feature fix loop): reproduce the finding's steps in a new session, update
   `status` to `fixed` with a `resolution`, or keep it `open`. Do not delete findings; never renumber IDs.
6. Stop the server process and return: sessions run, findings by severity, anything not explored (`notExplored`).

## Examples (ticket #1)

1. [01-charters.md](./examples/01-charters.md) – charters derived from the risk table
2. [02-session-transcript.md](./examples/02-session-transcript.md) – one session, command by command
3. [03-exploratory.json](./examples/03-exploratory.json) – the resulting log
