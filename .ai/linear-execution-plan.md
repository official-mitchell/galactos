<!-- Created 2026-11-03: Linear-backed execution order for Galactos (P-MAX-21).
     2026-11-03: Owner closed the Phase 1 gate. Visual target is the four mocks named below plus Dev Mode file iGhSTY4TzNtuGE3rDQNO3C node 1:3. MAX-994–996 are unblocked.
     2026-11-03: Added the parallel execution waves (Phase 1 infra through Phase 10) under "Parallel execution". -->

# Galactos Linear execution plan

Source of truth for *what* to do: Linear project [Galactos](https://linear.app/maximus-automaton/project/galactos-6d8a77546ba7/overview) (`P-MAX-21`). This file is the *order* agents must follow.

Project status as of 2026-11-04: **Phase 2 gate met** on `phase-2-integration`. Tokens, type scale, layout primitives, diagram kit, case file, motifs, and dark mode are in. Act rebuilds still replace inline `fontSize`. DrawSVG waits for Phase 3. Phase 1 gate was met on 2026-11-03. Phase 0 is Done. MAX-993 (§1.1) visual compare is accepted. MAX-994, MAX-995, and MAX-996 are unblocked. Do not invent a parallel track around the gates below.

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

## Later phases

Milestones Phase 2–10 exist on the project (design system → motion → narrative acts → launch hardening). Parent section issues MAX-997 through MAX-1033 carry `sequential-only`, `parallel-safe`, or `needs-integration-pass`. The wave order is in [Parallel execution](#parallel-execution). Re-read Linear before starting a wave; `Requires:` on the issue body still wins.

## Parallel execution

Added 2026-11-03. Phase 0 and MAX-993 are done. One parent issue per worktree. Children stay inside the parent’s worktree. Same `track:*` may share a worktree only when every issue on it is `parallel-safe`.

### Now — Phase 1 infra

Merge MAX-994 and MAX-995 before MAX-996. All three touch `package.json`. §2.1 cannot start until `lint:tokens` from MAX-995 exists.

| Worktree | Issue | Owns |
| --- | --- | --- |
| A | [MAX-994](https://linear.app/maximus-automaton/issue/MAX-994) §1.2 Isolate dev scaffolding | Preview bar and style guide behind `import.meta.env.DEV` |
| B | [MAX-995](https://linear.app/maximus-automaton/issue/MAX-995) §1.3 Quality gates | `typecheck`, `lint:tokens`, CI |
| C, after A and B merge | [MAX-996](https://linear.app/maximus-automaton/issue/MAX-996) §1.4 Screenshot harness | `npm run shot`, `npm run compare` |

### Phase 2 — shared core

One `track:shared-core` worktree for the sequential chain. Extra worktrees only after tokens land.

1. [MAX-997](https://linear.app/maximus-automaton/issue/MAX-997) §2.1 Tokens
2. In parallel after 997: [MAX-998](https://linear.app/maximus-automaton/issue/MAX-998) §2.2 Type scale, [MAX-1002](https://linear.app/maximus-automaton/issue/MAX-1002) §2.6 Motifs and icons, [MAX-1003](https://linear.app/maximus-automaton/issue/MAX-1003) §2.7 Dark mode
3. Then one worktree, in order: [MAX-999](https://linear.app/maximus-automaton/issue/MAX-999) §2.3 Layout primitives → [MAX-1000](https://linear.app/maximus-automaton/issue/MAX-1000) §2.4 Diagram kit → [MAX-1001](https://linear.app/maximus-automaton/issue/MAX-1001) §2.5 Case-file content

Phase 3 waits until 2.1 through 2.7 are done.

### Phase 3 — motion

Same `track:shared-core` rule.

1. [MAX-1004](https://linear.app/maximus-automaton/issue/MAX-1004) §3.1 Install → [MAX-1005](https://linear.app/maximus-automaton/issue/MAX-1005) §3.2 Motion tokens → [MAX-1006](https://linear.app/maximus-automaton/issue/MAX-1006) §3.3 Primitives
2. In parallel after 1006: [MAX-1007](https://linear.app/maximus-automaton/issue/MAX-1007) §3.4 Reduced motion, [MAX-1008](https://linear.app/maximus-automaton/issue/MAX-1008) §3.5 Hover/focus/touch, [MAX-1009](https://linear.app/maximus-automaton/issue/MAX-1009) §3.6 Performance rules
3. [MAX-1010](https://linear.app/maximus-automaton/issue/MAX-1010) §3.7 Amend guidelines after 1005, 1007, and 1008

### Phase 4 — shell

After Phase 3. These four can run together:

- [MAX-1011](https://linear.app/maximus-automaton/issue/MAX-1011) §4.1 Story sequence (`track:shared-core`)
- [MAX-1012](https://linear.app/maximus-automaton/issue/MAX-1012) §4.2 Scroll spine (`track:frontend`)
- [MAX-1013](https://linear.app/maximus-automaton/issue/MAX-1013) §4.3 Header (`track:frontend`)
- [MAX-1015](https://linear.app/maximus-automaton/issue/MAX-1015) §4.5 Evidence (`track:shared-core`)

Then [MAX-1014](https://linear.app/maximus-automaton/issue/MAX-1014) §4.4 Seams after 1011 and 1012. Then [MAX-1016](https://linear.app/maximus-automaton/issue/MAX-1016) §4.6 Section intake after 1013.

### Acts I–V

`sequential-only` and `track:frontend`. One worktree. Do not fan these out.

[MAX-1017](https://linear.app/maximus-automaton/issue/MAX-1017) Hero → [MAX-1018](https://linear.app/maximus-automaton/issue/MAX-1018) Failure state → [MAX-1019](https://linear.app/maximus-automaton/issue/MAX-1019) Mechanism → [MAX-1020](https://linear.app/maximus-automaton/issue/MAX-1020) New standard → [MAX-1021](https://linear.app/maximus-automaton/issue/MAX-1021) Cross-domain → [MAX-1022](https://linear.app/maximus-automaton/issue/MAX-1022) Recognition → [MAX-1023](https://linear.app/maximus-automaton/issue/MAX-1023) Intervention → [MAX-1024](https://linear.app/maximus-automaton/issue/MAX-1024) Outputs → [MAX-1025](https://linear.app/maximus-automaton/issue/MAX-1025) Method → [MAX-1026](https://linear.app/maximus-automaton/issue/MAX-1026) Credibility → [MAX-1027](https://linear.app/maximus-automaton/issue/MAX-1027) Final CTA → [MAX-1028](https://linear.app/maximus-automaton/issue/MAX-1028) Footer.

Mocks already named:

- Hero uses `instructions/design/mocks/galactos-mock-hero.png` (MAX-1017).
- Reported versus verified uses `instructions/design/mocks/galactos-mock-done.png`.
- Verified completion uses `instructions/design/mocks/galactos-mock-component-success.png`.
- Reliability diagnostic uses `instructions/design/mocks/galactos-mock-reliability-diagnostic.png` (MAX-1023).

Hero is `needs-integration-pass`: build it in that same frontend worktree, then reconcile with the header and spine before the failure state.

### Phase 10

After Act V.

1. [MAX-1029](https://linear.app/maximus-automaton/issue/MAX-1029) §10.1 Prerender and SEO, alone.
2. Then three worktrees: [MAX-1030](https://linear.app/maximus-automaton/issue/MAX-1030) accessibility (`track:frontend`), [MAX-1031](https://linear.app/maximus-automaton/issue/MAX-1031) performance (`track:infra`), [MAX-1032](https://linear.app/maximus-automaton/issue/MAX-1032) analytics (`track:infra`).
3. [MAX-1033](https://linear.app/maximus-automaton/issue/MAX-1033) Deploy last. It is `needs-integration-pass` and waits on 10.1–10.4.

The first pair to start is MAX-994 and MAX-995.

## Agent operating rules

1. Open Linear for the issue you claim. Honor `Requires:` on the issue body over memory.
2. One Linear parent issue per worktree unless two issues share `parallel-safe` and the same `track:*` **and** 1.1 is done.
3. Do not mark Phase 0/1 complete without the gate checks above.
4. After file changes, append a line to [CHANGELOG.md](./CHANGELOG.md).
5. Prefer existing checklist source named on issues: `galactos-implementation-checklist.md` (project doc path `claude/galactos-implementation-checklist.md` in Linear). If that file is not in this repo yet, do not invent a replacement checklist—port or link it as part of Phase 0/1 work.

## Changelog (this file)

- 2026-11-03: Added the parallel execution waves from MAX-994 through Phase 10. First pair to start is MAX-994 and MAX-995.
- 2026-11-03: Owner closed the Phase 1 gate. Named mocks: hero, reliability diagnostic, verified completion, reported versus verified. MAX-994–996 unblocked. Build was already green.
- 2026-11-03: MAX-989 Done (D12 closed on the Fraunces wordmark default). MAX-1050 Done. MAX-990 stays open for MAX-1048 and MAX-1049. Hero plate and design/refs cancelled in Linear. Fonts marked done.
- 2026-11-03: Linear updated. MAX-991 and MAX-992 Done. MAX-993 In Progress. Mock compare on MAX-993 is deferred, so MAX-994–996 stay blocked.
- 2026-11-03: §1.1 port started at the repo root. The Make scratch folder was removed after the copy. §1.1 item 7 (1440 vs mocks) is still open, so Phase 1 is not unblocked.
- 2026-11-03: Owner set the visual target (MAX-992, MAX-993). The Make folder under `instructions/context/` is the §0.4 scratch app only. Layout parity is the mocks plus Dev Mode file `iGhSTY4TzNtuGE3rDQNO3C` node `1:3`, not the Make preview.
- 2026-11-03: Owner cancelled the hero-plate gate (MAX-990 / checklist §0.2). Phase 0 gate is now D1–D11 (or defaults) and a green `npm run build`.
- 2026-11-03: Initial plan from Linear P-MAX-21 (labels, Phase 0→1.1 sequence, first parallel-safe trio).
