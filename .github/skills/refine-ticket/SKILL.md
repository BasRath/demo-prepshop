---
name: refine-ticket
description: 'Fetch a scrum board ticket by number and refine it into testable acceptance criteria with risk levels. Use when refining, analysing or clarifying a ticket, writing requirements.json, or resolving ambiguous acceptance criteria. Derives answers from the codebase and asks only multiple-choice questions for genuinely ambiguous points. Stage 1 of develop-feature.'
argument-hint: '<ticket-number>'
---

# Refine ticket

Turns a raw ticket into `docs/tickets/<id>/requirements.json`: numbered, testable acceptance criteria, a list of
decisions (each either **derived** with evidence or **asked** via multiple choice) and a risk level per criterion.

## Procedure

1. **Fetch** the ticket (validates the number and stores a snapshot):
   ```bash
   npm run ticket:fetch -- <id>
   ```
   Output: `docs/tickets/<id>/ticket.json` with `id, title, status, slug, url, createdAt, updatedAt, description`.
   On an error (invalid number, 404, network) stop and report the script's message.

2. **Gather context before thinking about questions.** Read `README.md`, `.github/copilot-instructions.md`, the pages
   and code the ticket touches (`*.html`, `style.css`, `shop.js`), existing features in `tests/e2e/features/`, and an
   existing `docs/tickets/<id>/requirements.json` if this is a re-run (keep earlier answers; never re-ask).

3. **Split** the description into atomic acceptance criteria `AC1..ACn` (keep the ticket's order, fix numbering
   mistakes). Keep the original wording in `original`; write a precise, testable `refined` version.

4. **Find ambiguities** and resolve each one with the decision procedure in
   [clarification-rules.md](./references/clarification-rules.md):
   derive → record evidence; only if not derivable and behaviour/tests would differ → ask with `ask_user`
   (multiple choice, recommended first, one question per call). Batch nothing; ask the highest-impact question first,
   because its answer may make later questions derivable.

5. **Assess risk** per criterion with [risk-assessment.md](./references/risk-assessment.md) (impact × likelihood).

6. **Write** `docs/tickets/<id>/requirements.json` following [requirements-schema.md](./references/requirements-schema.md).
   List touched files in `affectedAreas` and anything explicitly excluded in `outOfScope`.

7. **Return** a short summary: criteria count, risk distribution, decisions asked vs. derived.

## Examples (ticket #1)

1. [01-clarification-walkthrough.md](./examples/01-clarification-walkthrough.md) – every ambiguity and how it was resolved
2. [02-requirements.json](./examples/02-requirements.json) – the resulting file
