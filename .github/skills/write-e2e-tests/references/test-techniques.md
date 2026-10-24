# Test techniques – choosing the minimum set of test data

Pick the technique that matches the *shape* of the criterion. Use the smallest data set the technique allows.

| Criterion looks like… | Technique | Minimum data |
|---|---|---|
| A number, size, width, length, duration, count with limits | **Boundary value analysis** (2-value) | For every boundary: the last value of one side and the first value of the other (e.g. 719 / 720). Add a max/overflow value only when input can exceed it (e.g. 99 → add one more). |
| Inputs that fall into groups handled the same way | **Equivalence partitioning** | One representative per valid partition, one per invalid partition. Invalid partitions are tested one at a time. |
| Behaviour that depends on combinations of conditions | **Decision table** | One row per distinct outcome; collapse rules whose conditions don't matter ("–"). |
| Things that change over time or by events (carousel, wizard, basket states) | **State transition** | Every valid transition once; the most likely invalid transition once. Time limits are boundaries too (9 s vs 10 s). |
| A user journey | **Use case** | Main success path once; alternative paths only for high risk. |
| Known weak spots (empty, very long, rapid repeat, reload, back button) | **Error guessing** | Mostly for exploratory testing; automate only a high-risk guess. |

## Worked mini-examples (Prep Shop)

**Boundary value analysis** – maximum quantity 99 per product (baseline suite):
`98 → add → 99` (last valid) and `99 → add → 99` (attempt to cross). `1..97` add nothing new.

**Boundary value analysis on agreed breakpoints** – 0/1/3/5 cards at 720/1024/1440 px:
`719, 720, 1023, 1024, 1439, 1440` – six rows in one outline. 1200 px would add nothing.

**Equivalence partitioning** – checkout required fields: partitions *all required filled* (valid, covered by the
happy path), *Name empty*, *Address line 1 empty* (each invalid alone). *Address line 2 empty* is a valid partition
already covered by the happy path → no extra scenario.

**State transition with time** – carousel: `showing A,B,C` —10 s→ `showing B,C,D`; check at 9 s (no change) and 10 s
(changed). `paused` —any time→ `paused` (no change).

## How many scenarios?

1. Start with one row/scenario per item in the "minimum data" column.
2. Delete any that would only fail together with another one (same root cause) – keep the more informative one.
3. Delete any already covered by the baseline or another ticket feature.
4. Low-risk criteria: none (exploratory only).
