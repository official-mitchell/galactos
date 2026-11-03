<!-- Created 2026-11-03: Linear-backed execution order for Galactos (P-MAX-21). -->

# Galactos Linear execution plan

Source of truth for *what* to do: Linear project [Galactos](https://linear.app/maximus-automaton/project/galactos-6d8a77546ba7/overview) (`P-MAX-21`). This file is the *order* agents must follow.

Project status as of 2026-11-03: **Backlog**. No issues started. Do not invent a parallel track around the gates below.

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

**Phase 0 gate** (milestone *Phase 0 — Pre-Flight*): D1–D11 answered or defaults accepted, hero plate requested, `npm run build` green.

**Phase 1 gate** (milestone *Phase 1 — Repo and Agent Feedback Loop*): `npm run build` green, gates fail on seeded violations, `npm run shot -- --section all` produces a full non-blank set.

Later `parallel-safe` tickets (type scale, motifs, header, …) wait until **Phase 1 is done**, then until Phase 2 sequential core (`§2.1` tokens and related `sequential-only` parents) is in place. Do not jump to Act I–V section work.

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

Only after **MAX-993 (§1.1 Port Make Source)** is complete.

| ID | Title | After 1.1 |
| --- | --- | --- |
| [MAX-993](https://linear.app/maximus-automaton/issue/MAX-993) | §1.1 Port Make Source | sequential-only; 1440 light vs Make parity |
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

- 2026-11-03: Initial plan from Linear P-MAX-21 (labels, Phase 0→1.1 sequence, first parallel-safe trio).
