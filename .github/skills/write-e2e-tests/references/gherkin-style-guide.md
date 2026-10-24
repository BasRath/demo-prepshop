# Gherkin style guide

Readers are **non-technical testers and product owners**. A scenario must make sense to someone who has never seen the code.

## Structure

```gherkin
@ticket-<id>
Feature: <capability in shopper language>
  As a <type of shopper>
  I want <goal>
  So that <benefit>

  # <AC id> – <risk> risk. Technique: <technique and why these values>.
  @AC<n> @risk-<level>
  Scenario: <the outcome, stated as a fact>
    Given <the situation the shopper is in>
    When <the one thing the shopper does>
    Then <what the shopper sees or can do>
```

## Rules

1. **Declarative, not imperative** – describe *what* the shopper does and sees, not *how* the page is built.
   No selectors, CSS, HTML, ids, `localStorage`, URLs, "click the element", "wait 2 seconds".
2. **Shopper vocabulary** – words that appear on screen ("basket", "Add to Cart", "Submit Order") or that a shopper uses
   ("screen width", "story card"). First person "I", present tense.
3. **One behaviour per scenario** – one `When` (a second `When` only for a time step or a clearly sequential check,
   as in the carousel example). 3–8 steps.
4. **Scenario titles state the outcome**: "Pausing the stories keeps them in place" – not "Test pause button".
   Outline titles include the varying value: "Number of story cards on a <width> pixel wide screen is <cards>".
5. **Concrete example data** – real product names, real amounts (`"$52.48"`), real widths. No "some product".
6. **Outlines for variations** – when only data changes, use one `Scenario Outline` with `Examples`, columns named in
   plain words (`| missing field | filled field |`).
7. **Background** only if *every* scenario in the file starts the same way and it stays ≤ 2 steps.
8. **Given = state, not clicks** – set up through the quickest reliable path (`Given my basket contains 98 "Canned Optimism"`).
9. **Tags**: feature `@ticket-<id>` (or `@baseline`); scenario `@AC<n>` (one or more) and exactly one `@risk-high|medium|low`.
10. **Comments** explain risk and technique, never steps.
11. Reuse existing step phrases verbatim (see `tests/e2e/steps/shop.steps.js`) instead of inventing synonyms.

## Checklist before handing over

- [ ] Every automated criterion has ≥ 1 scenario; every scenario has an `@AC` tag; low-risk criteria have none.
- [ ] No scenario re-tests baseline behaviour or another ticket's behaviour.
- [ ] No two scenarios would fail for the same root cause.
- [ ] Boundaries come from `requirements.json` decisions, tested on both sides.
- [ ] A product owner could read each scenario aloud and agree or disagree with it.
- [ ] No technical words: click, element, selector, div, css, id, url, localStorage, wait, timeout, API.
