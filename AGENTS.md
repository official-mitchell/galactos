<!-- Created 2026-11-03: Cursor / Codex / generic agents must load the .ai index.
     2026-11-03: MAX-996 screenshot loop. -->

# Agent instructions (Galactos)

Before planning or writing code, read **[`.ai/README.md`](.ai/README.md)**.

That index points at:

- [`.ai/linear-execution-plan.md`](.ai/linear-execution-plan.md) — Linear order of work, gates, worktree labels
- [`.ai/CHANGELOG.md`](.ai/CHANGELOG.md) — append a dated summary after you change files

Follow the execution plan. Do not skip Phase 0 or §1.1. Do not start `parallel-safe` worktrees until the plan says they are unblocked.

Linear project: [Galactos](https://linear.app/maximus-automaton/project/galactos-6d8a77546ba7/overview).

## Screenshot loop (MAX-996)

After a visual edit:

1. `npm run shot -- --section <id> --w 1440 --h 900 --mode both --motion final`
2. `npm run shot -- --section <id> --w 390 --h 844 --mode both --motion final`
3. Read the PNGs in `.shots/`.
4. `npm run compare -- --section <id>` when `instructions/design/mocks/` has a matching mock.
5. Fix and repeat. Stop after 5 passes and report the remaining gaps.

`npm run shot -- --section all` is the full 11×4×2 acceptance check. CI runs only `npm run test:e2e` (hero, 390×844, light, final). Update that baseline with `npm run shot:update`. Any console error or warning fails the shot.
