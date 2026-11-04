<!-- Created 2026-11-03: Linear-backed execution order for Galactos (P-MAX-21).
     2026-11-03: Owner closed the Phase 1 gate. Visual target is the four mocks named below plus Dev Mode file iGhSTY4TzNtuGE3rDQNO3C node 1:3. MAX-994–996 are unblocked. -->

# Galactos Linear execution plan

Source of truth for *what* to do: Linear project [Galactos](https://linear.app/maximus-automaton/project/galactos-6d8a77546ba7/overview) (`P-MAX-21`). This file is the *order* agents must follow.

Project status as of 2026-11-03: **Phase 1 gate met** by owner decision. Phase 0 is Done. MAX-993 (§1.1) visual compare is accepted. MAX-994, MAX-995, and MAX-996 are unblocked. Do not invent a parallel track around the gates below.

## Labels that control worktrees

| Label | Agent rule |
| --- | --- |
| `human-only` | Do not implement. Surface to the human; wait. |
| `sequential-only` | One agent, one worktree, in checklist order. No fan-out. |
| `parallel-safe` | Eligible for parallel git worktrees **after** listed Requires are done. |
| `needs-integration-pass` | Coordinate after parallel work; do not treat as isolated. |
| `track:infra` / `track:frontend` / `track:shared-core` | Lane for a worktree. Do not mix lanes in one worktree unless the issue says so. |

Worktree labels live on **parent section issues**. Child tickets usually inherit domain labels only (`Frontend`, `Motion`, …). Execute children under the parent’s worktree rule.

## Hard sequence (do this before parallel worktrees)

```
0.1 Decisions (human)     MAX-989 + D1–D11 (MAX-1034 … MAX-1044)
        │
        ├─► 0.2 Assets (human)     MAX-990     [parallel with 0.3]
        └─► 0.3 Tooling            MAX-991     sequential-only, track:infra
                    │
                    ▼
              0.4 Baseline         MAX-992     sequential-only
                    │
                    ▼
              1.1 Port Make        MAX-993     sequential-only  ★ last blocker
                    │
                    ├─► 1.2 Isolate scaffolding   MAX-994  parallel-safe
                    ├─► 1.3 Quality gates         MAX-995  parallel-safe
                    └─► 1.4 Screenshot harness    MAX-996  parallel-safe (also needs 0.3)
```

**Phase 0 gate** (milestone *Phase 0 — Pre-Flight*): D1–D11 answered or defaults accepted, `npm run build` green. Hero plate was cancelled by the owner on 2026-11-03 (checklist §0.2); it is not a gate.

**Phase 1 gate** (milestone *Phase 1 — Repo and Agent Feedback Loop*): `npm run build` green, gates fail on seeded violations, `npm run shot -- --section all` produces a full non-blank set.

**Owner decision 2026-11-03:** this gate is met. The visual target is on disk and in Figma, so §1.1 item 7 is accepted and MAX-994–996 are no longer blocked on a missing compare. `npm run build` is green (Vite 8.3.5). Section layout follows these mocks:

| Section | Mock |
| --- | --- |
| Hero | `instructions/design/mocks/galactos-mock-hero.png` |
| Reliability diagnostic | `instructions/design/mocks/galactos-mock-reliability-diagnostic.png` |
| Verified completion | `instructions/design/mocks/galactos-mock-component-success.png` |
| Reported versus verified | `instructions/design/mocks/galactos-mock-done.png` |

Plus Dev Mode file `iGhSTY4TzNtuGE3rDQNO3C` node `1:3`. Do not match the Make preview. §1.2–§1.4 stay open as their own tickets; they are eligible to start.

Later `parallel-safe` tickets (type scale, motifs, header, …) wait until Phase 2 sequential core (`§2.1` tokens and related `sequential-only` parents) is in place. Do not jump to Act I–V section work.

## Phase 0 — Pre-Flight (current)

| ID | Title | Labels | Requires |
| --- | --- | --- | --- |
| [MAX-989](https://linear.app/maximus-automaton/issue/MAX-989) | §0.1 Decisions | `decision`, `human-only` | Checklist read |
| [MAX-1034](https://linear.app/maximus-automaton/issue/MAX-1034) … [MAX-1044](https://linear.app/maximus-automaton/issue/MAX-1044) | D1–D11 | `decision`, `human-only` | Parent MAX-989 |
| [MAX-990](https://linear.app/maximus-automaton/issue/MAX-990) | §0.2 Assets and Access | `Infrastructure`, `human-only` | 0.1 |
| [MAX-991](https://linear.app/maximus-automaton/issue/MAX-991) | §0.3 Tooling | `sequential-only`, `track:infra` | 0.1 (0.2 in parallel) |
| [MAX-992](https://linear.app/maximus-automaton/issue/MAX-992) | §0.4 Baseline | `sequential-only`, `track:infra` | 0.3 |

D1–D11: Stack, Animation, Hero layout, Metadata typeface, Orange/green text, Scroll spine, External citations, Loop policy, Form backend + analytics, Reference mapping, Reversibility cues. All Urgent, all Backlog.

Human verification for 0.3: `node -v` ≥ 22; Playwright installed. For 0.4: `npm run dev`; `/` and `/#styleguide` both render.

## Phase 1 — first parallel-safe window

**MAX-993 (§1.1 Port Make Source)** is accepted (2026-11-03). The window is open.

| ID | Title | After 1.1 |
| --- | --- | --- |
| [MAX-993](https://linear.app/maximus-automaton/issue/MAX-993) | §1.1 Port Make Source | sequential-only; visual target is the four mocks plus Dev Mode node `1:3` |
| [MAX-994](https://linear.app/maximus-automaton/issue/MAX-994) | §1.2 Isolate Dev Scaffolding | `parallel-safe` |
| [MAX-995](https://linear.app/maximus-automaton/issue/MAX-995) | §1.3 Quality Gates | `parallel-safe` |
| [MAX-996](https://linear.app/maximus-automaton/issue/MAX-996) | §1.4 Screenshot Harness | `parallel-safe` |

## Later phases (do not start)

Milestones Phase 2–10 exist on the project (design system → motion → narrative acts → launch hardening). Parent section issues MAX-997 through MAX-1033 carry `sequential-only`, `parallel-safe`, or `needs-integration-pass`. Re-read Linear before leaving Phase 1; this plan is add-only until someone updates it for accuracy.

## Agent operating rules

1. Open Linear for the issue you claim. Honor `Requires:` on the issue body over memory.
2. One Linear parent issue per worktree unless two issues share `parallel-safe` and the same `track:*` **and** 1.1 is done.
3. Do not mark Phase 0/1 complete without the gate checks above.
4. After file changes, append a line to [CHANGELOG.md](./CHANGELOG.md).
5. Prefer existing checklist source named on issues: `galactos-implementation-checklist.md` (project doc path `claude/galactos-implementation-checklist.md` in Linear). If that file is not in this repo yet, do not invent a replacement checklist—port or link it as part of Phase 0/1 work.

## Changelog (this file)

- 2026-11-03: Owner closed the Phase 1 gate. Named mocks: hero, reliability diagnostic, verified completion, reported versus verified. MAX-994–996 unblocked. Build was already green.
- 2026-11-03: MAX-989 Done (D12 closed on the Fraunces wordmark default). MAX-1050 Done. MAX-990 stays open for MAX-1048 and MAX-1049. Hero plate and design/refs cancelled in Linear. Fonts marked done.
- 2026-11-03: Linear updated. MAX-991 and MAX-992 Done. MAX-993 In Progress. Mock compare on MAX-993 is deferred, so MAX-994–996 stay blocked.
- 2026-11-03: §1.1 port started at the repo root. The Make scratch folder was removed after the copy. §1.1 item 7 (1440 vs mocks) is still open, so Phase 1 is not unblocked.
- 2026-11-03: Owner set the visual target (MAX-992, MAX-993). The Make folder under `instructions/context/` is the §0.4 scratch app only. Layout parity is the mocks plus Dev Mode file `iGhSTY4TzNtuGE3rDQNO3C` node `1:3`, not the Make preview.
- 2026-11-03: Owner cancelled the hero-plate gate (MAX-990 / checklist §0.2). Phase 0 gate is now D1–D11 (or defaults) and a green `npm run build`.
- 2026-11-03: Initial plan from Linear P-MAX-21 (labels, Phase 0→1.1 sequence, first parallel-safe trio).
