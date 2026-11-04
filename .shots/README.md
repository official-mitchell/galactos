<!-- 2026-11-03: MAX-996. Generated viewport PNGs stay untracked. The committed smoke baseline is tests/final-state.spec.ts-snapshots/. -->

# Screenshot output

`npm run shot` writes PNGs and `manifest.json` here. They are gitignored except this file.

- `.shots/<section>@<w>x<h>.<mode>.png` — latest capture
- `.shots/manifest.json` — git sha, viewport, timings, console output
- `.shots/baseline/` — one pre-edit copy from the first shot run in a checkout. Later runs do not overwrite it.
- `.shots/compare/` — side-by-side files from `npm run compare`

ScrollTrigger is not in the app. Captures record `scrollTrigger: "absent"` and skip `ScrollTrigger.refresh()`.

The full 11 × 4 × 2 matrix is `npm run shot -- --section all`. CI runs one Playwright screenshot (`390×844`, light, hero, `motion=final`) via `npm run test:e2e`. Update that committed baseline with `npm run shot:update`.
