<!-- Created 2026-11-03: add-only dated log of agent revisions. Newest date first.
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

## 2026-11-03

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
