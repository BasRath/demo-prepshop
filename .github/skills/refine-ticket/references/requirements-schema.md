# requirements.json schema

Location: `docs/tickets/<id>/requirements.json`. Written by refine-ticket; `testApproach` is filled in by
write-e2e-tests. Read by write-e2e-tests, exploratory-testing and the report generator (which validates it).
Keep IDs stable across re-runs; append new items instead of renumbering.

```jsonc
{
  "ticket": 1,                                   // number, matches ticket.json id
  "summary": "One sentence: who gets what and why.",
  "acceptanceCriteria": [
    {
      "id": "AC1",                               // AC + number, ticket order
      "original": "Text as written in the ticket",
      "refined": "Precise, testable statement incl. decisions (numbers, names, behaviour)",
      "risk": {
        "impact": "high | medium | low",
        "likelihood": "high | medium | low",
        "level": "high | medium | low",          // from the matrix in risk-assessment.md
        "rationale": "Why – one sentence"
      },
      "testApproach": {                          // added by write-e2e-tests
        "automated": true,
        "technique": "boundary value analysis | equivalence partitioning | state transition | decision table | use case | error guessing",
        "reason": "Only required when automated is false"
      }
    }
  ],
  "decisions": [
    {
      "id": "D1",
      "topic": "Short name of the ambiguity",
      "decision": "What was decided",
      "source": "derived | user",
      "evidence": "File/line, rule or standard (derived) or the question asked (user)",
      "acceptanceCriteria": ["AC3"]
    }
  ],
  "affectedAreas": ["index.html", "style.css"],
  "outOfScope": ["Things deliberately not built"]
}
```
