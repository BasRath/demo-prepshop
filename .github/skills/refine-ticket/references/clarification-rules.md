# Clarification rules

Goal: zero unnecessary questions, zero silent assumptions. Every ambiguity ends up as a `decision` in
`requirements.json` with `"source": "derived"` (plus evidence) or `"source": "user"`.

## Decision procedure (per ambiguity)

```text
Is it ambiguous at all? ── no ──► no decision needed
        │ yes
Can it be derived? (sources below, in order) ── yes ──► record "derived" + evidence
        │ no
Would different answers change behaviour or tests? ── no ──► pick the simplest option, record "derived" (evidence: "no behavioural impact")
        │ yes
Ask with ask_user: multiple choice, 2–4 options, recommended first ──► record "user"
```

## Derivation sources (check in this order)

1. **The ticket itself** – other criteria, title, examples in the text. Obvious typos and numbering mistakes are fixed silently.
2. **Project rules** – `.github/copilot-instructions.md` (CSP, `textContent`, accessibility, mobile first, tone).
3. **Existing code and design** – breakpoints in `style.css`, patterns in `shop.js`, page structure, naming, copy style.
4. **Existing behaviour and tests** – `README.md` features, `tests/e2e/features/**`.
5. **Earlier decisions** – `docs/tickets/*/requirements.json` (this and other tickets).
6. **Standards and conventions** – WCAG 2.2 AA, HTML semantics, platform conventions (e.g. a clickable card is a link).

If a source answers the question, it is **not** a question. Quote the evidence, e.g. `style.css: @media (min-width: 720px)`.

## Writing good multiple-choice questions

- One decision per question; the question names the criterion: *"AC3: at which screen widths should 0, 1, 3 and 5 cards be shown?"*
- Options are concrete, mutually exclusive and testable (numbers, names, behaviour) – never "something else" (the UI adds a free-text option).
- Put the recommended option first with `(Recommended)` and a short reason in the label, preferably one that reuses existing patterns.
- Never ask: permission to proceed, confirmation of a plan, preferences without behavioural impact, things the ticket already states, technology choices dictated by project rules.

## Typical ambiguity → usual resolution

| Ambiguity | Usually |
|---|---|
| Typo / duplicate numbering in criteria | Derived (fix silently) |
| Tone, look & feel ("kawaii", "nice") | Derived from existing copy, styling and README |
| Where a new element appears / what it looks like | Derived from existing layout patterns |
| Accessibility of moving/auto-updating content, focus, labels | Derived from WCAG + copilot-instructions |
| New page vs. dynamic rendering | Derived: static site → new static pages following existing page pattern |
| Exact numeric limits (breakpoints, counts, durations) not in the ticket and not in code | **Ask** |
| Interaction semantics with several valid UX patterns (carousel step vs. page swap, modal vs. page) | **Ask** |
| Conflicts between criteria, or a criterion conflicting with project rules | **Ask** (show the conflict in the question) |
| Data/content the business owns (prices, legal text, product names) | **Ask** |
