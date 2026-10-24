# exploratory.json schema

Location: `docs/tickets/<id>/exploratory.json`. Validated by the report generator – invalid values stop report generation.
IDs are stable: sessions `S1, S2 …`, findings `F1, F2 …` (never renumber; append on re-runs).

```jsonc
{
  "ticket": 1,
  "sessions": [
    {
      "id": "S1",
      "charter": "Explore <target> with <resources> to discover <information>",
      "acceptanceCriteria": ["AC3", "AC4"],      // [] for a pure regression charter
      "heuristics": ["Boundaries", "Interrupt"], // names from charters-and-heuristics.md
      "environments": ["Chromium 1280x800", "Chromium 719x800", "reduced motion"],
      "status": "completed",                      // completed | blocked
      "notes": ["Factual observation", "…"],
      "evidence": ["screenshots/S1-01-cards-at-720.png"]   // relative to docs/tickets/<id>/
    }
  ],
  "findings": [
    {
      "id": "F1",
      "title": "Short, specific: what is wrong where",
      "severity": "critical | high | medium | low",
      "status": "open | fixed | accepted",
      "acceptanceCriterion": "AC4",               // omit for regressions outside the ticket
      "session": "S1",
      "steps": ["Step 1", "Step 2"],
      "expected": "What should happen (quote the criterion/decision)",
      "actual": "What happened",
      "evidence": ["screenshots/S1-02-focus-still-cycles.png"],
      "resolution": "Required when fixed or accepted: what changed / why accepted, and how it was retested"
    }
  ],
  "notExplored": ["Areas consciously skipped and why"]
}
```

Severity definitions: see [charters-and-heuristics.md](./charters-and-heuristics.md#severity).
