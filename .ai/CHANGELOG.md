<!-- Created 2026-11-03: add-only dated log of agent revisions. Newest date first.
     2026-11-03: MAX-998 type-scale bullet.
     2026-11-03: MAX-1003 dark mode wiring bullet.
     2026-11-03: MAX-994 dev-only preview bar and style guide.
     2026-11-03: noted MAX-991 tooling check (Node 22, Playwright 1.64.1, Chromium).
     2026-11-03: noted MAX-990 asset decisions (hero plate cancelled, G favicon, OG, mocks). -->

# Galactos agent changelog

Add-only. Newest date at the top. Do not edit or delete older bullets.

Format:

```
## YYYY-MM-DD
- [agent] summary of additions / changes / removals (Linear IDs if any)
```

---

## 2026-11-04
- [cursor-grok] MAX-1017 closed against the hero mock: mobile 40px title, hero Playwright checks, and Lighthouse LCP/CLS plus a 20% regression ceiling. Plate-only checklist lines are cancelled.
- [cursor-grok] MAX-1017 started after the owner waived the Phase 4 read-through and live seam review. Hero CTAs emit `hero_cta_click`, the section emits `hero_view` once, and the mock diagram fades in with `useTrace`. Planet-plate checklist items stay open because the mock is the visual target.
- [cursor-grok] Removed the dev preview bar, fake case rail, section numbers, the S2 placeholder circle, the “A new standard” arrow, and unreadable output-card labels.
- [cursor-grok] `/impeccable document`: wrote `DESIGN.md` and `.impeccable/design.json` from the live tokens. Mocks win over the live page. No rebuild.
- [cursor-grok] Recorded code-first as the Impeccable build path in `.impeccable/config.json`.
- [cursor-grok] `/impeccable init`: wrote `PRODUCT.md` from the owner’s confirmed reader, position, and no-invented-proof rule, plus `.impeccable/live/config.json` (no CSP).
- [cursor-grok] Installed Impeccable into `.cursor` (skill, agents, design-check hook) and ignored ephemeral `.impeccable/` runtime files.
- [cursor-grok] Merged Phase 4 onto main: story sequence, spine, header, seams, evidence, and section intake (MAX-1011–MAX-1016). Owner read-through and live seam review stay open.
- [cursor-grok] MAX-1016: section intake protocol in `scripts/section-intake.mjs` and `npm run gate:section` (token lint, type floor, one `?motion=final` shot). Checklist §4.6 items 1–7 checked; Go when stays open.
- [cursor-grok] MAX-1013: sticky header reads Diagnostic, Method, About, workflow, and verification anchors from `sections.ts`; skip link, scroll border, mobile focus trap, and `nav_click`.
- [cursor-grok] MAX-1014 §4.4: dashed hero→S2 drop and S3→S4 arrow scrub between shared seam anchors; S7 and S11 use a 1px border-strong band edge. Playwright checks x within 2px at 1440, 768, and 390. Live motion review stays open. Placeholders stand in for the S2 node and S4 eyebrow.
- [cursor-grok] MAX-1011 §4.1: eleven reader questions and seam handoffs live on `src/content/sections.ts` and each section element. Owner read-through stays unsigned. §4.2–4.6 not started.
- [cursor-grok] MAX-1012: page-long scroll spine in the left margin, scrubbed with useScrollScrub, with Playwright clearance and final/reduced coverage. Seams stay untouched.
- [cursor-grok] MAX-1015: Evidence footnote for Appendix A rows with status OK. Build fails when an Evidence id is missing or not OK. Section placement stays with later tickets.
- [cursor-grok] Closed MAX-1010 and committed the Phase 3 motion system. Phase 4 shell starts with MAX-1011, MAX-1012, MAX-1013, and MAX-1015.
- [cursor-grok] MAX-1005 through MAX-1010 gaps: prerendered HTML for no-js, motion-lab loop proof, always-visible authoritative-state copy, web vitals, Lighthouse budget, style-guide rules aligned to v1.1.0.
- [cursor-grok] MAX-1006 through MAX-1010: reveal, trace, loop, and scrub hooks; pause toggle; hover/focus rules; transform/opacity limits; guidelines v1.1.0. Lighthouse CI stays with the later performance pass.
- [cursor-grok] MAX-1004 and MAX-1005: GSAP 3.15.1 registered once, `src/motion/tokens.ts` beside the existing CSS mirrors, `no-js` swap, bundle gzip budget in the build and CI summary.
- [cursor-grok] Phase 2 gate closed. Contrast exceptions recorded, connector can measure endpoints, style guide kit checked in dark. Inline `fontSize` and section rebuilds stay with Acts I–V. DrawSVG stays in Phase 3.

## 2026-11-03
- [cursor-grok] Hero copy and `HeroDiagram` match `instructions/design/mocks/galactos-mock-hero.png` (local success cards, failed business outcome, timeline).
- [cursor-grok] MAX-1001: case file, copy, and evidence modules. The invented trace id is not shown.
- [cursor-grok] MAX-1000: diagram kit under `src/components/diagram/` plus a dev StyleGuide sample. Connector takes coordinates. DrawSVG stays in Phase 3.
- [cursor-grok] MAX-999: layout primitives in `src/components/layout/` and `npm run test:layout`.
- [cursor-grok] MAX-1002: owner deferred the 1440 focal review to production. Sub-issues MAX-1106–1109 closed on the shipped generator, Motif, crosshairs, and Icon wrapper.
- [cursor-grok] MAX-1002: seeded contour SVGs (`scripts/gen-contours.mjs`, seed 1002), `<Motif>` and `<Icon>` (lucide-react, stroke 1.5), `--motif-opacity: 0.08`, determinism test, prebuild check.
- [cursor-grok] MAX-1003: no-flash theme from `localStorage['galactos-theme']` else `prefers-color-scheme` (`?mode=` still wins). Header toggle persistence and dark first-paint e2e. Dev-only theme source log. Hero plate stays cancelled.
- [cursor-grok] MAX-998: type scale classes (lede, pull, diagram hierarchy), 62ch body measure, 12px floor, and `npm run test:type-floor`. Checklist §2.2 item 7 stays open — most section strings still use inline `fontSize`.
- [cursor-grok] MAX-997: token set in `src/styles/tokens.css`, self-hosted Fraunces/Inter, `npm run test:contrast`, CI summary row. Dark hex measurement (checklist §2.1 item 10) is still human-only.
- [cursor-grok] MAX-996: removed the one-off Linux snapshot workflow from main after the Ubuntu PNG was committed.
- [cursor-grok] MAX-996 follow-up: `npm run shot -- --section all` wrote 88 non-blank PNGs. Checklist §1.4 item 12 is checked. Shots stay gitignored.
- [cursor-grok] MAX-996: screenshot harness (`npm run shot`, `npm run compare`, dev `window.__galactos`, Playwright smoke at 390×844 light). CI e2e runs that one screenshot, not the 11×4×2 matrix. `.shots/` PNGs are gitignored; the first local shot copies `.shots/baseline/`. The committed `toHaveScreenshot` baseline was generated on macOS (`darwin`); Ubuntu CI will miss it until `npm run shot:update` is run on Linux.
- [cursor-grok] MAX-995: added `lint:tokens` with a pre-token baseline, seed tests, `typecheck`, and a PR workflow (typecheck → lint:tokens → test:lint-tokens → build → e2e placeholder for MAX-996).
- [cursor-grok] MAX-994: Preview bar and Style Guide render only when `import.meta.env.DEV`. Production keeps the theme class effect and always shows the landing page. Deleted unused `LandingPlaceholder.tsx`.
- [cursor-grok] Opened Phase 1 worktrees A and B for MAX-994 and MAX-995. Ignored `.worktrees/`. MAX-996 stays until those two merge.
- [cursor-grok] Added the parallel execution waves (MAX-994 through Phase 10) to `.ai/linear-execution-plan.md`.
- [cursor-grok] Owner closed the Phase 1 gate (MAX-993). Plan and checklist now name the four section mocks and unblock MAX-994–996.
- [cursor-grok] MAX-1049: added `.env.example` and local `.env.local` for the Vite site vars. `.env` stays gitignored.
- [cursor-grok] MAX-1048 marked Done: form endpoint confirmed, Plausible snippet in `index.html`, public address `hello@galactos.io`. MAX-990 stays open for MAX-1049.
- [cursor-grok] MAX-1048: owner confirmed the form test email arrived.
- [cursor-grok] MAX-1048: form Worker now sends to the verified personal destination. Test POST returned `{"ok":true}`.
- [cursor-grok] MAX-1048: Wrangler login succeeded and `galactos-form` deployed to `https://galactos-form.opatowsky77.workers.dev`. `VITE_FORM_ENDPOINT` set in `.env`. Site form still unwired (MAX-1027).
- [cursor-grok] MAX-1048: Plausible snippet in `index.html`. Worker destination set to `hello@galactos.io`. Deploy is waiting on `wrangler login`. `VITE_FORM_ENDPOINT` still unset. Form remains unwired (MAX-1027).
- [cursor-grok] MAX-1048: added `galactos-form/` Worker source. Not deployed. `VITE_FORM_ENDPOINT` is not set until a workers.dev URL exists. Site form stays unwired (MAX-1027).
- [cursor-grok] MAX-989 Done, D12 closed on the Fraunces default. MAX-1050 Playwright Chromium confirmed (1.64.1). MAX-1045 and MAX-1046 canceled. MAX-1047 Done. MAX-990 stays open for the form endpoint, Plausible, and env example. Public mail is hello@galactos.io forwarded to a personal inbox.
- [cursor-grok] MAX-991 Done, MAX-992 Done, MAX-993 In Progress. `docs/design-system.md` now points at `src/styles/index.css` and Figma style guide node `1:2506`. Mock layout check stays open.
- [cursor-grok] MAX-993: removed `instructions/context/Galactos • Figma Make - Landing Page/` and ported it to a root Vite app (`src/components/{sections,diagram,shell,primitives}`, `content/sections.ts`, `docs/design-system.md`). Visual compare at 1440 is still open.
- [cursor-grok] MAX-992 / MAX-993: recorded that the Make download is the scratch scaffold only; visual target is `instructions/design/mocks/` and Dev Mode file `iGhSTY4TzNtuGE3rDQNO3C` node `1:3`. Scratch `npm i && npm run build` succeeded (Vite 8.3.5).
- [cursor-grok] MAX-990: self-hosted variable fonts in `assets/fonts/` — Inter 4.1 and Fraunces 1.000 (opsz axis), plus their licenses.
- [cursor-grok] MAX-990: cancelled `design/refs/`. R1–R5 stay in Figma file `V2K9MFBI5DHBZPlnK0wag3` and are read with the Figma MCP.
- [cursor-grok] MAX-990 owner decisions recorded in the checklist and execution plan: hero plate cancelled; favicon is the G tile (no ring + Cobalt dot); 48×48 icon skipped; OG source `assets/Galactos-OG.png` (1733×908); mocks in `instructions/design/mocks/`.
- [cursor-grok] MAX-991 (§0.3 Tooling): `node -v` is v22.23.1; `npx playwright --version` is 1.64.1; Chromium installed via `npx playwright install chromium`. No project `package.json` yet (that arrives with §0.4).
- [cursor-grok] Added `.ai/` with this changelog, `README.md` (agent index), and `linear-execution-plan.md` from Linear project Galactos (P-MAX-21). Added `AGENTS.md`, `CLAUDE.md`, `GROK.md`, and `.cursor/rules/ai-workspace.mdc` so Cursor / Claude / Grok load the same plan.
MAX-996 follow-up: Linux Playwright snapshot from the Ubuntu runner. Removed the one-off workflow.
