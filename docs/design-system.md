<!-- 2026-11-03: moved from the Make export guidelines/Guidelines.md. Edited later in checklist §3.7. -->
<!-- 2026-11-03: source note added. Live values are src/styles/index.css. Figma style guide is file iGhSTY4TzNtuGE3rDQNO3C node 1:2506, which is a capture of the same Make style-guide screen, not a second token set. -->

# Galactos Observatory Editorial — Design System Guidelines

## Where the tokens live

Two copies, one palette. Do not treat the Figma frame as a new system.

| Source | What it is |
| --- | --- |
| `src/styles/index.css` | What the dev server applies. Semantic colors are on `:root` and `.dark`. Type classes are `.text-display-xl` through `.text-meta`. |
| Figma file `iGhSTY4TzNtuGE3rDQNO3C`, node `1:2506` | Style Guide frame. It is the Make `/#styleguide` page (Preview bar included). Swatch labels match the table below: Paper `#F8F6F3` = `surface/base` light, White `#FFFFFF` = `surface/raised` light, Deep Space `#0F1E2E` = `surface/emphasis`, Stone `#D6D1C9` = `border/default`. |
| This file | Rules for using those tokens. Checklist §3.7 is where motion rules get amended. |

Self-hosted Fraunces and Inter files are in `assets/fonts/`. The stylesheet still loads both families with a Google Fonts `@import`. Replacing that import is checklist §2.1.8, not this port.

---

**Version 1.0.0** — Foundation prompt. Every later section prompt inherits this document.

---

## Design System Name

**Galactos Observatory Editorial**

The feel is an editorial research journal crossed with a systems observatory and a technical diagnostic instrument. Flat, matte, paper-like. No glossy fills, no floating UI chrome.

---

## Color Tokens

All colors are authored as CSS custom properties (`var(--token-name)`) with two modes: Light and Dark. **Never hard-code a hex value in a component.** Always reference the semantic token.

### Semantic token map

| Token | Light value | Dark value |
|---|---|---|
| `--surface-base` | `#F8F6F3` (Paper) | `#0A1520` (Abyss) |
| `--surface-raised` | `#FFFFFF` | `#0F1E2E` (Deep Space) |
| `--surface-emphasis` | `#0F1E2E` (Deep Space) | `#162A3F` (Midnight) |
| `--border-default` | `#D6D1C9` (Stone) | `#243649` |
| `--border-strong` | `#D6D1C9` (Stone) | `#35495E` |
| `--text-primary` | `#0F1E2E` (Deep Space) | `#F8F6F3` (Paper) |
| `--text-secondary` | `#374151` (Graphite) | `#D6D1C9` (Stone) |
| `--text-muted` | `rgba(55,65,81,0.8)` | `#9AA3AE` |
| `--accent-info` | `#3882F6` (Cobalt) | `#3882F6` (shapes/lines) |
| `--accent-info-text` | `#3882F6` | `#6FA6F8` (small icons/text on dark) |
| `--accent-divergence` | `#F97316` (Signal Orange) | `#F97316` unchanged |
| `--accent-success` | `#22C55E` (Success Green) | `#22C55E` unchanged |

### Semantic rules

- **Success Green** = local success states only.
- **Signal Orange** = divergence, anomaly, broken handoff, failed verification only.
- **Never use red.**
- Orange and green are graphic and state colors. **Never set body-size text in orange or green on Paper or dark surfaces.** Pair them with an icon or shape; keep the label in Deep Space or Graphite.
- **Never use `#374151` (Graphite) as text on dark surfaces** — it fails contrast. Use `--text-secondary` or `--text-muted` instead.
- Accessibility: maintain 4.5:1 for body text, 3:1 for graphics and large text, in both modes.

---

## Typography

### Font families

- **Fraunces** (Google Fonts) — display and headlines
- **Inter** (Google Fonts) — body, labels, metadata

Wired via `@import` at the top of `src/styles/index.css`. No monospace decorative face. Metadata strings (trace IDs) use tracked Inter, not monospace. Self-hosted files in `assets/fonts/` are not connected yet (§2.1.8).

### Scale

| Name | Family | Weight | Size | Usage |
|---|---|---|---|---|
| Display XL | Fraunces | 700 | 72px | Hero headlines |
| Display LG | Fraunces | 700 | 48px | Section leads |
| Display MD | Fraunces | 700 | 32px | Sub-section heads |
| Section Title | Fraunces | 600 | 24px | Section titles |
| Body | Inter | 400 | 16px / 1.55lh | Body copy |
| Card Title | Inter | 600 | 16px | Card headings |
| Label | Inter | 500 | 12px / 0.08em | Uppercase labels, callouts |
| Metadata | Inter | 400 | 13px / 0.04em | Trace IDs, captions |

Mobile scale: Display XL collapses to 40px, Display LG to 32px, Display MD to 24px.

---

## Spacing, Radius & Shadow

### Spacing scale

`4 · 8 · 16 · 24 · 32 · 48` px for component spacing. `96–160px` for macro gaps between conceptual movements on the page.

### Radius

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | `4px` | Buttons, most cards |
| `--radius-md` | `8px` | Cards, panels |
| `--radius-lg` | `12px` | Large containers |

### Shadow

| Name | Value | Notes |
|---|---|---|
| sm | `0 1px 2px rgba(15,30,46,0.06)` | Subtle lift |
| md | `0 8px 24px rgba(15,30,46,0.08)` | Panel lift |

Shadows imply layered paper, not floating software. **Remove shadows entirely in dark mode.** Convey depth with a slightly lighter fill and the border instead.

---

## Diagram Grammar

Reuse these components identically across every section. Import from `src/components/DiagramNodes.tsx`.

| Component | Visual | Meaning |
|---|---|---|
| `<NodeIntent>` | Filled Deep Space circle (Paper in dark) | Workflow intent origin |
| `<NodeSuccess>` | Filled Success Green circle with check | Locally successful state |
| `<NodeExpected>` | Thin Deep Space outline circle | Expected / target state |
| `<NodeEvidence>` | Cobalt filled circle | External context or evidence source |
| `<NodeAnomaly>` | Signal Orange circle with exclamation | Rare — actual anomaly marker |
| `<NodeMissing>` | Dashed border circle | Missing handoff or unverified step |
| `<FlowArrow variant="solid">` | Deep Space solid arrow | Intended flow |
| `<FlowArrow variant="dashed">` | Deep Space dashed arrow | Missing or unverified handoff |
| `<DivergencePath>` | Orange dashed curved path | Divergence between reported and actual state |

### Dark mode inversions

- Intent node: Deep Space fill → Paper fill
- Intended-flow arrows, expected-state outlines: Deep Space → Stone `#D6D1C9`
- Success nodes, orange paths, anomaly marker: **unchanged**
- Cobalt evidence nodes: **unchanged**
- Missing-handoff dashed circles: Stone border at 70% opacity

---

## Background Motifs

Always very low contrast — **never the focal point**.

- **Fine grid**: `--border-default` lines at 0.18 opacity on light; Paper lines at 7% opacity on dark.
- **Topographic contour**: faint concentric radial gradients.
- **Radial construction lines**: conic gradient at low opacity.

**Dark mode rule**: Switch to Paper lines at 6–10% opacity. No glow, neon, or bloom on any motif. Keep the matte, forensic feel.

---

## Motion Rules

**Forensic, not playful.**

| Rule | Status |
|---|---|
| Lines trace into existence on scroll | ✓ Allowed |
| Nodes resolve from outline to filled on scroll | ✓ Allowed |
| Orange divergence appears after green nodes | ✓ Allowed |
| Dark mode switch: 200ms color crossfade only | ✓ Allowed |
| `prefers-reduced-motion`: show final static state | ✓ Required |
| Bounce / spring physics | ✗ Forbidden |
| Parallax spectacle | ✗ Forbidden |
| Looping animation | ✗ Forbidden |
| Sliding or sweeping mode transitions | ✗ Forbidden |

---

## Layout

- **12-column grid**, `1200px` max content width on a `1440px` desktop frame, `24px` gutters.
- Breakpoints: 1440 desktop · 768 tablet · 390 mobile.
- Minimum `44px` touch targets.
- Focus: 2px Cobalt (`#6FA6F8` in dark) outline, 2px offset.

---

## Buttons

| Type | Light | Dark |
|---|---|---|
| Primary | Deep Space fill, Paper text, 4px radius | Paper fill, Deep Space text |
| Secondary | 1px Deep Space outline, Deep Space text | 1px Stone outline, Paper text |
| Tertiary | Text link, underline draws in on hover | Same |

No pill buttons.

---

## Cards & Surfaces

- **`card`**: `--surface-raised` fill, `1px --border-default` border, sm shadow (light only). Hover shifts to `--border-strong`.
- **`surface-emphasis-band`**: `--surface-emphasis` fill, `1px --border-strong` top/bottom. Used for Sections 7 and 11 only. Reads as a distinct raised plane against the base in dark mode.

---

## Dark Mode

- Default to `prefers-color-scheme`.
- Toggle: thin-line half-filled circle icon in the header, to the left of the CTA. Label: "Switch to dark mode / light mode". On mobile: inside the menu.
- Persist choice in `localStorage`. No flash of wrong mode on load.
- Transition: 200ms color crossfade. No sliding or sweeping. Skip under `prefers-reduced-motion`.

---

## Avoid List

- Glossy gradients or translucent floating cards
- Cartoon AI imagery — glowing robots, network globes
- Stock team photography
- Generic SaaS dashboard chrome
- Oversized pill buttons
- Fake product screenshots, invented testimonials, client logos, metrics, case studies, or company-scale claims
- Red (use Signal Orange for errors and divergence)
- Body-size orange or green text on Paper or dark surfaces
- Hard-coded hex values — always reference semantic tokens
- Graphite `#374151` as text on dark surfaces (fails contrast)
- Glow, neon, or bloom effects in dark mode
- Parallax, looping animation, spring physics

---

## Voice

Precise, observant, restrained. Never alarmist about AI. No invented testimonials, client logos, metrics, case studies, or company-scale claims.

---

## Changelog

- 2026-11-03: Noted the live stylesheet and Figma style-guide node `1:2506`. Palette is the Make style guide, not a separate Dev Mode token set.
