<!-- Created 2026-11-03: add-only dated log of agent revisions. Newest date first.
     2026-11-03: noted MAX-991 tooling check (Node 22, Playwright 1.64.1, Chromium). -->

# Galactos agent changelog

Add-only. Newest date at the top. Do not edit or delete older bullets.

Format:

```
## YYYY-MM-DD
- [agent] summary of additions / changes / removals (Linear IDs if any)
```

---

## 2026-11-03

- [cursor-grok] MAX-991 (§0.3 Tooling): `node -v` is v22.23.1; `npx playwright --version` is 1.64.1; Chromium installed via `npx playwright install chromium`. No project `package.json` yet (that arrives with §0.4).
- [cursor-grok] Added `.ai/` with this changelog, `README.md` (agent index), and `linear-execution-plan.md` from Linear project Galactos (P-MAX-21). Added `AGENTS.md`, `CLAUDE.md`, `GROK.md`, and `.cursor/rules/ai-workspace.mdc` so Cursor / Claude / Grok load the same plan.
