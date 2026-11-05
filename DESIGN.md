<!-- 2026-11-04: Scan of the incumbent system for /impeccable document.
     North star kept from docs/design-system.md. Mocks win when the live page disagrees.
     Longer motion and diagram rules stay in docs/design-system.md. -->

---
name: Galactos Observatory Editorial
description: Editorial research journal, systems observatory, and technical diagnostic instrument.
colors:
  paper: "#F8F6F3"
  white: "#FFFFFF"
  deep-space: "#0F1E2E"
  stone: "#D6D1C9"
  graphite: "#374151"
  graphite-muted: "rgba(55, 65, 81, 0.8)"
  cobalt: "#3882F6"
  cobalt-on-dark: "#6FA6F8"
  signal-orange: "#F97316"
  success-green: "#22C55E"
  night: "#0A1520"
  night-raised: "#162A3F"
  night-border: "#243649"
  night-border-strong: "#35495E"
typography:
  display:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(40px, 5vw, 72px)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "48px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    letterSpacing: "0.08em"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
spacing:
  1: "4px"
  2: "8px"
  3: "16px"
  4: "24px"
  5: "32px"
  6: "48px"
  section: "clamp(96px, 11vw, 160px)"
components:
  button-primary:
    backgroundColor: "{colors.deep-space}"
    textColor: "{colors.paper}"
    rounded: "{rounded.sm}"
    padding: "12px 24px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.deep-space}"
    textColor: "{colors.paper}"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.deep-space}"
    rounded: "{rounded.sm}"
    padding: "12px 24px"
    height: "44px"
  card:
    backgroundColor: "{colors.white}"
    textColor: "{colors.deep-space}"
    rounded: "{rounded.sm}"
    padding: "24px"
---

# Design System: Galactos Observatory Editorial

## Overview

**Creative North Star: "Galactos Observatory Editorial"**

An editorial research journal crossed with a systems observatory and a technical diagnostic instrument. Flat, matte, and paper-like. The page should read as a careful record of a workflow, not as a software demo.

This file is the full spec for new screens. It records the tokens in `src/styles/tokens.css`. Motion, diagram grammar, and the avoid list in more detail stay in `docs/design-system.md`. Do not rebuild the app to match this file. Use it to clean the page that already exists.

**The Mock Rule.** When the live page and a mock in `instructions/design/mocks/` disagree, the mock wins. Leftovers from the original Figma Make / Vite export are defects, not a second system. Tokens still name color, type, and spacing. They do not excuse a layout or a sentence the mock has already replaced.

**Key Characteristics:**

- Paper ground, Deep Space ink, one cobalt instrument accent.
- Fraunces for display, Inter for reading and labels.
- Slightly curved corners (4px), not pills.
- Depth is layered paper. Shadows are faint and light-mode only.
- Diagrams are the product picture: nodes, arrows, and a divergence path.

## Colors

Light is the paper instrument. Dark is the same ink inverted, not a second palette. Semantic names in `tokens.css` are the source. Do not hard-code a hex in a component.

### Primary

- **Deep Space** (`{colors.deep-space}`): Ink for primary text, primary buttons, and the emphasis bands. In dark mode the page ink flips to Paper and the ground becomes Night.

### Secondary

- **Cobalt** (`{colors.cobalt}`): Evidence, focus, and information. On dark surfaces the text form is Cobalt on dark (`{colors.cobalt-on-dark}`). It is an instrument mark, not a wash.

### Tertiary

- **Signal Orange** (`{colors.signal-orange}`): Divergence between a reported done and the actual outcome. Rare.
- **Success Green** (`{colors.success-green}`): A locally successful node. Not body text.

### Neutral

- **Paper** (`{colors.paper}`): Page ground in light. Primary button text.
- **White** (`{colors.white}`): Raised cards.
- **Stone** (`{colors.stone}`): Borders and rules.
- **Graphite** (`{colors.graphite}`): Secondary text on Paper. Do not use it as text on dark surfaces.
- **Graphite muted** (`{colors.graphite-muted}`): Meta text on Paper.
- **Night** (`{colors.night}`), **Night raised** (`{colors.night-raised}`), **Night border** (`{colors.night-border}`), **Night border strong** (`{colors.night-border-strong}`): Dark-mode ground, raised plane, and borders.

**The One Instrument Rule.** Cobalt, orange, and green mark evidence, divergence, and local success. They are not body copy and they are not decoration.

## Typography

**Display Font:** Fraunces (Georgia, serif)
**Body Font:** Inter (system-ui, sans-serif)

**Character:** A journal headline over a technical instrument label. Display is heavy and tight. Labels are small, tracked, and uppercase. Body stays at a 62ch measure.

### Hierarchy

- **Display** (700, `clamp(40px, 5vw, 72px)`, 1.05): Hero only. At most three lines at 1440.
- **Headline** (700, 48px, 1.1): Section display.
- **Title** (600, 24px, 1.3): Section titles. Pull quotes use Fraunces 700 at 32px.
- **Body** (400, 16px, 1.55): Reading text, max 62ch. Lede is Inter 18px in Graphite.
- **Label** (500, 12px, 0.08em, uppercase): Eyebrows and diagram system labels. Nothing visible goes under 12px.

**The Two-Family Rule.** Fraunces carries the editorial voice. Inter carries the instrument. Do not add a third family.

## Layout

A 12-column grid. Content maxes at 1200px inside a 1440 frame, with 24px gutters. Breakpoints are 1440, 768, and 390. Component spacing is 4, 8, 16, 24, 32, 48. Space between conceptual movements is `clamp(96px, 11vw, 160px)`. Touch targets are at least 44px. The header offset is 72px.

## Elevation & Depth

The system is flat paper with a tonal step, not lifted software. Light mode may use a hairline shadow. Dark mode drops shadows and uses a lighter fill plus a border.

### Shadow Vocabulary

- **Paper lift** (`0 1px 2px rgba(15, 30, 46, 0.06)`): Cards at rest, light mode only.
- **Panel lift** (`0 8px 24px rgba(15, 30, 46, 0.08)`): A panel that needs a second sheet. Still light mode only.

**The Flat-by-Default Rule.** Surfaces are matte. No glow, neon, bloom, or glossy gradient. Dark mode has no shadow.

## Shapes

Corners are slightly cut, never capsules. 4px on buttons, chips, and most cards. 8px on panels. 12px only on a large container. Diagram nodes are circles because they are marks in a flow, not UI chrome. Borders are 1px Stone. Motifs (grid, contour, construction lines) stay under 8% opacity and never become the subject.

## Components

### Buttons

Restrained, rectangular, 44px tall.

- **Shape:** Slightly curved (4px). Never a pill.
- **Primary:** Deep Space fill, Paper text, 12px 24px padding. Hover drops opacity to 0.85. In dark mode the fill is Paper and the text is Deep Space.
- **Hover / Focus:** Opacity change on hover. Focus is a 2px Cobalt outline, 2px offset, and must exist without hover.
- **Secondary:** Transparent fill, 1px Deep Space outline, Deep Space text. Dark mode outline is Stone.
- **Tertiary:** Text link. Underline draws in on hover.

### Cards / Containers

- **Corner Style:** 4px.
- **Background:** White on Paper. Emphasis bands use Deep Space and appear only where the spec already places them.
- **Shadow Strategy:** Paper lift in light mode. None in dark.
- **Border:** 1px Stone. Hover may strengthen the border.
- **Internal Padding:** 24px when the card holds a reading block.

### Navigation

A thin header. Wordmark and section links in Inter. The dark-mode control is a thin-line half circle, labeled, and sits with the primary action. Mobile links live in a menu, not a second visual system.

### Diagram marks

The signature component. Filled, outlined, dashed, cobalt, orange, and green circles mean intent, expected, missing, evidence, anomaly, and local success. Solid arrows are intended flow. Dashed arrows are unverified. The orange path is divergence. Reuse the same marks. Do not restyle them per section. Full grammar is in `docs/design-system.md`.

## Do's and Don'ts

### Do:

- **Do** match `instructions/design/mocks/` when the live page has drifted.
- **Do** use semantic tokens from `src/styles/tokens.css`.
- **Do** keep Fraunces for display and Inter for body and labels.
- **Do** keep corners at 4px unless the token scale says 8px or 12px.
- **Do** show the final static state under `prefers-reduced-motion`.

### Don't:

- **Don't** rebuild the app to "apply the design system." Clean the existing page.
- **Don't** keep a Figma Make / Vite artifact once a mock shows the intended layout or content.
- **Don't** use pill buttons, glossy gradients, glow, neon, or cartoon AI imagery.
- **Don't** invent screenshots, testimonials, logos, metrics, or case studies.
- **Don't** set body copy in orange, green, or red. Orange is divergence. Green is a success node.
- **Don't** use Graphite as text on a dark surface.
