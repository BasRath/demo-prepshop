# Example – session S1 transcript (ticket #1)

**Charter:** Explore the header story cards with widths around 720/1024/1440 px, keyboard focus, hover and reduced
motion to discover overlap, clipping and cycling/pause problems.

Commands are shown with the relevant part of their output. `S` = `playwright-cli -s=t1-S1`.

```bash
$ npm run serve                                   # async; curl -sf http://localhost:8000 → OK
$ S open http://localhost:8000
$ S resize 720 800
$ S find "Doomsday stories"
  - navigation "Doomsday stories" [ref=e9]:
    - link "Ragnarök – Fenrir nibbles the sun" [ref=e10]
    - button "Pause stories" [ref=e11]
```
Note: *At 720 px one card is shown; it fits between logo and basket.*

```bash
$ S screenshot --filename=docs/tickets/1/screenshots/S1-01-one-card-at-720.png
$ S resize 721 800 ; S resize 1023 800            # still one card, title truncated with an ellipsis at 721 px
$ S screenshot --filename=docs/tickets/1/screenshots/S1-02-title-truncated-at-721.png
```
Finding **F2 (low)**: long title truncated without the full title being available on hover.

```bash
$ S resize 1024 800
$ S run-code "async page => { await page.clock.install(); await page.reload(); }"
$ S press Tab ; S press Tab ; S press Tab         # focus reaches the first story card
$ S run-code "async page => page.clock.runFor(10000)"
$ S find "Doomsday stories"
    - link "The Kraken's Bath Day – …" [ref=e10]     # first card changed while it had focus!
```
Finding **F1 (medium)**: cycling continues while a card has keyboard focus (decision D5 says it should pause) –
focused card slides away, keyboard users lose their place.

```bash
$ S screenshot --filename=docs/tickets/1/screenshots/S1-03-focus-lost-after-cycle.png
$ S set-reduced-motion reduce ; S reload
$ S run-code "async page => page.clock.runFor(10000)"   # cards change instantly, no slide animation ✔ (D6)
$ S hover e10 ; S run-code "async page => page.clock.runFor(20000)"   # paused on hover ✔ (D5)
$ S console error
  [ERROR] Failed to load resource: 404 … /favicon.ico   # known noise, ignored
$ S close
```

Result: session **completed**, findings F1 (medium) and F2 (low) logged in
[03-exploratory.json](./03-exploratory.json). F1 was fixed in the develop-feature fix loop and retested in session S1-retest
(steps reproduced, focus now pauses cycling) → `status: fixed`.
