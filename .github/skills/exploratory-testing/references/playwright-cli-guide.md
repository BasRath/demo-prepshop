# playwright-cli guide for exploratory sessions

Full help: `playwright-cli --help` and `playwright-cli --help <command>`. Always pass a session name (`-s=t<id>-S<n>`)
so sessions don't collide. Headless by default; add `--headed` to `open` when a human wants to watch.

## Session skeleton

```bash
S="playwright-cli -s=t5-S1"
$S open http://localhost:8000            # prints a snapshot with element refs (e12, e13 …)
$S resize 1280 800
$S snapshot                               # accessibility tree – the main way to "see" the page
$S find "Add to Cart"                     # search the snapshot instead of reading it all
$S click e21                              # act on a ref from the latest snapshot
$S press Tab                              # keyboard exploration
$S console error                          # JS errors / CSP violations since load
$S screenshot --filename=docs/tickets/5/screenshots/S1-01-dark-header.png
$S close
```

Refs change after every page update – take a new `snapshot` (or use `find`) before the next action.

## Useful commands per heuristic

| Heuristic | Commands |
|---|---|
| Boundaries / Goldilocks | `resize <w> <h>`, `open --device="iPhone 15"`, `open --mobile` |
| Keyboard | `press Tab`, `press Shift+Tab`, `press Enter`, `press Space`, `press Escape` |
| Assistive tech | `snapshot`, `find`, `eval "el => el.getAttribute('aria-label')" e7` |
| Preferences | `set-reduced-motion reduce`, `set-color-scheme dark`, `set-forced-colors active`, `clear-…` |
| State | `localstorage-list`, `localstorage-get <k>`, `localstorage-set <k> <v>`, `localstorage-clear`, `reload` |
| Interrupt | `reload`, `go-back`, `go-forward`, `tab-new <url>`, `tab-select <i>` |
| Time | `run-code "async page => { await page.clock.install(); await page.reload(); }"` then `run-code "async page => page.clock.runFor(10000)"` |
| Network | `network-state-set offline`, `requests` |
| Evidence | `screenshot --filename=… [--full-page]`, `screenshot e14 --filename=…` (element only) |

## Notes

- Use the **snapshot** to reason about labels, headings and roles; use a **screenshot** only for visual evidence
  (layout, overlap, clipping) or when a finding needs proof.
- Screenshot names are deterministic: `<session>-<nn>-<kebab-slug>.png`, numbered per session in order of capture.
- Working files (`.playwright-cli/`) are git-ignored; only `docs/tickets/<id>/screenshots/` is committed.
- If a command hangs or a session is stale: `playwright-cli list`, then `playwright-cli -s=<name> close`
  (or `playwright-cli kill-all` as a last resort).
