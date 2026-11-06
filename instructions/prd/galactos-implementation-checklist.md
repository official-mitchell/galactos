<!-- 2026-11-06: MAX-1029 checked §10.1 items 1–7. Items 8–9 stay open (share preview, Search Console). Privacy and Terms routes exist; counsel copy is not invented. -->
<!-- 2026-11-04: MAX-1011 checked §4.1 items 1–12. Item 13 owner read-through stays open. §4.2–4.6 untouched. -->
<!-- 2026-11-03: MAX-998 checked §2.2 items 1–6 and 8. Item 7 stays open (inline fontSize remains). -->
<!-- 2026-11-03: MAX-1003 checked §2.7 items 1–6. Hero plate item cancelled. Phase 2 go-when stays open. -->
<!-- 2026-11-03: MAX-995 checked off §1.3. typecheck, lint:tokens (baseline + seed), and ci.yml are in place. e2e stays a placeholder for MAX-996. -->
<!-- 2026-11-03: MAX-994 checked off §1.2. Preview bar and Style Guide are dev-only; LandingPlaceholder removed. -->
<!-- 2026-11-03: MAX-996 checked the harness items that are implemented. Item 12 (full 11×4×2 non-blank matrix) stays open until that command is run. CI smoke is one screenshot. -->
<!-- 2026-11-03: Owner closed the Phase 1 gate. Hero = galactos-mock-hero.png. Reliability diagnostic = galactos-mock-reliability-diagnostic.png. Verified completion = galactos-mock-component-success.png. Reported versus verified = galactos-mock-done.png. Plus Dev Mode file iGhSTY4TzNtuGE3rDQNO3C node 1:3. -->
<!-- 2026-11-03: §0.4 scratch app is instructions/context/Galactos • Figma Make - Landing Page/. Make layouts are not the visual target. Parity is mocks in instructions/design/mocks/ plus Dev Mode file iGhSTY4TzNtuGE3rDQNO3C node 1:3. Recorded on MAX-992 and MAX-993. -->
<!-- 2026-11-03: §0.2 owner decisions — hero plate cancelled; favicon is the G tile (no ring + Cobalt dot); 48×48 icon skipped; OG source is assets/Galactos-OG.png; mocks live in instructions/design/mocks/. design/refs/ cancelled; R1–R5 stay in Figma (file key V2K9MFBI5DHBZPlnK0wag3) via the Figma MCP. -->

# Galactos Landing Page — Implementation Checklist

v0.1 · 2026-10-02 · Base: Figma Make `V2K9MFBI5DHBZPlnK0wag3` (Vite 8, React 19, Tailwind v4, no animation library, no router) · System: Galactos Observatory Editorial

Legend: 🧪 test · 🔍 validate · 👁 observe · `Mock: pending` = section mock not yet delivered (spec below is the working draft; the mock overrides it)

Build rule: the page is one chronological investigation, not a product page. Every section answers the previous section's last question (4.1).

---

# 0. Pre-Flight
Requires: nothing
Produces: decisions confirmed, assets in hand, local environment green

## 0.1 Decisions (defaults assumed; override before Phase 1)
Requires: this checklist read
Produces: locked defaults for stack, motion, type, color-text, loops, evidence, offer language

- [ ] 1. D1 Stack — default: keep Vite + React 19 + TypeScript + Tailwind v4 (Make parity, cheapest port); add static prerender in Phase 10. Alternative: Astro or Next.
- [ ] 2. D2 Animation — default: GSAP + ScrollTrigger + DrawSVG + MotionPath via `@gsap/react`. Package README states all plugins are free incl. commercial use (Appendix A, E6).
- [ ] 3. D3 Hero layout — default: headline + lede above a full-width trace, planet plate rising from the bottom edge (replaces the Make 45/55 split). Confirm against the hero mock.
- [ ] 4. D4 Metadata typeface — default: tracked Inter (Guidelines.md). The GPT hero image uses monospace labels. Approve one mono face for metadata only, or keep Inter.
- [ ] 5. D5 Orange/green text — default: Guidelines rule stands (no body-size orange/green text). Refs R2 and R4 set orange/green text on tinted fills; hand-computed contrast on Paper is ≈2.6:1 (orange) and ≈2.1:1 (green), below 4.5:1. Keep color on borders, icons, dots, tints; keep labels Deep Space/Graphite.
- [ ] 6. D6 Scroll spine (page-long trace thread, 4.2) — default: ON.
- [ ] 7. D7 External citations — default: allowed, only through `<Evidence>` (4.5). Amends Guidelines "no metrics" to "no invented metrics".
- [ ] 8. D8 Loop policy — default: loops run only while in viewport, max one looping element visible at a time, Pause-motion control, static under reduced motion. Alternative: cap at 3 cycles then hold.
- [ ] 9. D9 Form backend + analytics vendor — pick before Phase 9 (default: simple serverless endpoint + Plausible or PostHog).
- [ ] 10. D10 Reference mapping — assumed: compression/organization = R3 + R4 (file names `…Divergence-5.png` and `…Business_Failure-6.png` match your "image 5" and "image 6"); node text hierarchy = `…5939_image.png`, which on inspection is a five-card variant of the R4 case timeline (system caps → Fraunces action → muted detail under each node, split WORKFLOW STATE bar). It is a transparent PNG and looks corrupted on a dark viewer; use it for hierarchy only. Confirm.
- [ ] 11. D11 Reversibility cues — default: the page may point to a small, low-commitment next step ("one workflow is enough", a first conversation) but states no price, refund, guarantee, duration, or "read-only access" as an offer term until engagement mechanics are decided. Project Response 05 §3.2 labels that structure a hypothesis and Response 04 warns against promising what cannot be verified. The S9 footnote (8.3 item 5) describes evidence order, not an offer term; it stays, wording owner-confirmed.

## 0.2 Assets and Access
Requires: 0.1 complete
Produces: asset manifest, credentials, env vars

Owner decisions 2026-11-03 (MAX-990):

- Hero plate is cancelled. Do not block Phase 0 or §5.1 on a separate plate-only asset. The hero mock is `instructions/design/mocks/galactos-mock-hero.png`.
- `design/refs/` is cancelled. R1–R5 (Appendix B) stay in Figma file `V2K9MFBI5DHBZPlnK0wag3`. Read them with the Figma MCP. Do not copy those references into the repo.
- Favicon is the G tile in `assets/` (`Galactos-G.png`, `Galactos-G-32x32.ico`, `Galactos-G-512x512.ico`). The Make header mark (ring + Cobalt dot) is not the favicon. `Galactos-G-48x48.ico` is skipped for now (file on disk reads as 32×32).
- OG source is `assets/Galactos-OG.png` at 1733×908 (same proportion as 1200×630). Export or resize to 1200×630 when §10.1 ships the meta tag.

- [x] 1. ~~Hero plate: planet/globe only, no baked text, nodes, or lines; ≥2880px wide; light variant + dark variant.~~ Cancelled 2026-11-03. Original ask kept here so the GPT-hero note is not lost: the GPT hero image has the trace baked in; a plate-only layer is no longer required.
- [x] 2. ~~Save refs to `design/refs/` (R1–R4, Appendix B).~~ Cancelled 2026-11-03. References stay in Figma (`V2K9MFBI5DHBZPlnK0wag3`) and are read through the Figma MCP. Section mocks delivered 2026-11-03 under `instructions/design/mocks/` (not `design/mocks/`): `galactos-mock-hero.png`, `galactos-mock-component-success.png`, `galactos-mock-reliability-diagnostic.png`, `galactos-mock-done.png`. Further section mocks still go in that folder as `<section>.png` when they arrive.
- [x] 3. Fonts: Fraunces (variable, opsz axis if the package ships it) + Inter (variable), self-hosted. Downloaded 2026-11-03 into `assets/fonts/`: Inter 4.1 `InterVariable.woff2` and `InterVariable-Italic.woff2`; Fraunces 1.000 `Fraunces[SOFT,WONK,opsz,wght].woff2` and italic (opsz axis is in the file). Licenses: `Inter-LICENSE.txt`, `Fraunces-OFL.txt`. Wiring into CSS is §2.2.
- [ ] 4. Accounts: hosting, domain, form endpoint, analytics, real contact email (Make uses placeholder `hello@galactos.example`).
- [x] 5. Env vars in `.env.local` + `.env.example`: `VITE_SITE_URL`, `VITE_FORM_ENDPOINT`, `VITE_ANALYTICS_KEY`, `PLAYWRIGHT_BASE_URL`, `FIGMA_FILE_KEY=V2K9MFBI5DHBZPlnK0wag3`. Added 2026-11-03. `VITE_ANALYTICS_KEY` is empty because Plausible is the script in `index.html`. The page does not read `VITE_FORM_ENDPOINT` until MAX-1027.
- [ ] 6. 🔍 Confirm Make source readable: Figma MCP `get_design_context` on the file key returns the source tree (verified 2026-10-02).
- [x] 7. 🔍 OG image source is `assets/Galactos-OG.png` (1733×908). Favicon source is the G tile listed above, not ring + Cobalt dot. Shipped OG tag in §10.1 is still 1200×630.

## 0.3 Tooling
Requires: 0.2 complete
Produces: CLI tools installed

- [ ] 1. 🔍 `node -v` ≥ 22
- [ ] 2. run: `npx playwright install chromium`
- [ ] 3. 🔍 `npx playwright --version` prints a version

## 0.4 Baseline
Requires: 0.3 complete
Produces: Make source in a scratch directory, verified build

- [x] 1. Export Make source to a scratch dir (Make code export, or Figma MCP resources `file://figma/make/source/<fileKey>/…`). Already on disk 2026-11-03: `instructions/context/Galactos • Figma Make - Landing Page/`. Do not download again. This app is the build scaffold only. Visual target is the mocks plus Dev Mode file `iGhSTY4TzNtuGE3rDQNO3C` node `1:3` (see §1.1 note below).
- [x] 2. run (in scratch): `npm i && npm run build` — must succeed. Green 2026-11-03 (`vite v8.3.5`, 32 modules). Vite warned that `configLoader: 'native'` will reject `__dirname` and the JSON import in `vite.config.ts` later. Build still succeeded.
- [x] 3. 🔍 `npm run dev`; open `/` and `/#styleguide`; both render. Checked 2026-11-03 on `http://localhost:8443/`. `/` heading: “Your AI workflow can say "done" before the work is done.” `/#styleguide` heading: “Galactos Observatory Editorial”. Dev server was left running on port 8443.
- [ ] 4. 👁 (no observability required)

- [ ] **Go when:** decisions D1–D11 answered or defaults accepted, `npm run build` green. Hero plate is no longer part of this gate (cancelled 2026-11-03; see §0.2).

---

# 1. Repo and Agent Feedback Loop
Requires: Phase 0 complete
Produces: ported repo, isolated dev scaffolding, quality gates, screenshot harness agents can call

## 1.1 Port Make Source
Requires: 0.4 complete
Produces: repo with target folder structure, parity with Make preview

- [x] 1. Copy from the 0.4 scratch export: `src/`, `index.html`, `vite.config.ts`, `tsconfig.json`, `package.json`, `guidelines/Guidelines.md`. Done 2026-11-03 at the repo root. Figma Make Vite plugins were not copied; the scratch folder was removed after the port.
- [x] 2. Move Guidelines.md → `docs/design-system.md` (edited in 3.7)
- [x] 3. Create `src/{components/{primitives,diagram,shell,sections},content,motion,styles,lib}`
- [x] 4. Rename sections by job: `Hero`, `FailureState`, `Mechanism`, `NewStandard`, `CrossDomain`, `Recognition`, `Intervention`, `Outputs`, `Method`, `Credibility`, `FinalCta`
- [x] 5. Create `src/content/sections.ts`: `{ number, id, act, label }` for all 11 sections (single source of anchor IDs; Make uses mixed IDs such as `section-divergence`, `section-cta`, `section-verification`). DOM ids are unchanged.
- [x] 6. run: `npm ci && npm run build` — green 2026-11-03 at the repo root (Vite 8.3.5, 33 modules).
- [x] 7. 🔍 Compare build at 1440 light vs the visual target. Owner decision 2026-11-03 (MAX-993): do not match the Make preview. Match `instructions/design/mocks/` and Dev Mode file `iGhSTY4TzNtuGE3rDQNO3C` node `1:3`. Keep the Vite shell from the §0.4 scratch export. The Make preview bar is capture chrome. `/#styleguide` stays. Gate accepted 2026-11-03 with these section mocks: Hero `galactos-mock-hero.png`; reliability diagnostic `galactos-mock-reliability-diagnostic.png`; verified completion `galactos-mock-component-success.png`; reported versus verified `galactos-mock-done.png`.
- [ ] 8. 👁 (no observability required)

## 1.2 Isolate Dev Scaffolding
Requires: 1.1 complete
Produces: production bundle with no dev UI

- [x] 1. Gate the App.tsx "Preview" bar and `StyleGuide` page behind `import.meta.env.DEV`
- [x] 2. 🔍 `grep -r LandingPlaceholder src` → no imports; delete file
- [x] 3. 🧪 Prod build contains no dev bar: `grep -c "Style Guide" dist/assets/*.js` → 0
- [x] 4. 👁 (no observability required)

## 1.3 Quality Gates
Requires: 1.1 complete
Produces: `typecheck`, `format`, `lint:tokens`, CI pipeline

- [x] 1. Scripts: `typecheck` (`tsc --noEmit`), `format` (oxfmt, already in package.json), `lint:tokens`
- [x] 2. `lint:tokens` fails on: hex/rgb literals in `src/components/**` (allow `--on-accent` token only); easing names `back|elastic|bounce|spring` in `src/motion/**`; font-size <12px; `border-radius` ≥ 999px on buttons
- [x] 3. CI (GitHub Actions): typecheck → lint:tokens → build → e2e on every PR
- [x] 4. 🧪 Seed one violation per rule → gate fails; remove → gate passes
- [x] 5. 👁 CI summary prints gate results and bundle sizes

## 1.4 Screenshot Harness (agent-facing)
Requires: 1.1 complete, 0.3 complete
Produces: `npm run shot` / `npm run compare`, `AGENTS.md` loop, deterministic captures

- [x] 1. `playwright.config.ts`: `webServer` starts `npm run dev`; projects 1440×900, 1280×720, 768×1024, 390×844; `colorScheme` light + dark
- [x] 2. Query flags: `?motion=final` (all timelines `progress(1)`, loops frozen), `?motion=reduced`, `?mode=dark|light`
- [x] 3. `window.__galactos = { ready, seek(sectionId, p), setMode(m) }` for dev only
- [x] 4. `scripts/shot.ts`: `npm run shot -- --section <id|all> --w 1440 --h 900 --mode light|dark|both --motion final|reduced|live`
- [x] 5. Wait gates before capture: `document.fonts.ready`, images decoded, `ScrollTrigger.refresh()`, network idle
- [x] 6. Output `.shots/<section>@<w>x<h>.<mode>.png` + `manifest.json` (git sha, viewport, console errors)
- [x] 7. `scripts/compare.ts`: `npm run compare -- --section s2` → side-by-side `design/mocks/s2.png | .shots/s2…png`
- [x] 8. `AGENTS.md` loop: edit → `npm run shot` for the touched section at 1440 + 390, both modes → Read the PNG → compare to mock → fix → repeat (max 5 passes, then report gaps)
- [x] 9. 🧪 `toHaveScreenshot` on final-state shots, `maxDiffPixelRatio` 0.01; baseline updates only via `npm run shot:update`
- [x] 10. 🧪 Any console error/warning during capture fails the run
- [x] 11. Capture Make baseline (pre-edit) to `.shots/baseline/` for before/after comparison
- [x] 12. 🔍 Run `npm run shot -- --section all` → 11 sections × 4 viewports × 2 modes produced, none blank. Ran 2026-11-03 in the MAX-996 worktree: 88 PNGs, none blank, manifest has no console errors. `.shots/` stays gitignored.
- [x] 13. 👁 `manifest.json` records timings and console output per capture

- [x] **Go when:** `npm run build` green, gates fail on seeded violations, `npm run shot -- --section all` produces a full non-blank set. Owner decision 2026-11-03: this gate is met. The visual target is the four mocks named in §1.1 item 7 plus Dev Mode node `1:3`, and `npm run build` is green. §1.2–§1.4 remain open tickets and are unblocked.

---

# 2. Global Design System
Requires: Phase 1 complete
Produces: tokens, type scale, layout primitives, diagram kit, case-file data, motifs, dark mode — all sections build from these only

## 2.1 Tokens
Requires: 1.3 `lint:tokens` live
Produces: complete token set in `src/styles/tokens.css`, contrast test

- [x] 1. Keep semantic color tokens from Make `index.css` (`--surface-*`, `--border-*`, `--text-*`, `--accent-*`)
- [x] 2. Replace hard-coded hex in `.dark` rules (`.node-intent`, `.node-expected`, `.btn-primary`, `.btn-secondary`, `.page-tab.active`, focus ring) with tokens: `--node-intent`, `--node-outline`, `--btn-primary-bg`, `--btn-primary-fg`, `--focus-ring`, `--on-accent`
- [x] 3. Add chip/zone tints: `--tint-success`, `--tint-divergence`, `--tint-info` (≤12% accent over surface). Labels on tints use `--text-primary`
- [x] 4. Add spacing tokens `--space-1…6` = 4, 8, 16, 24, 32, 48; `--space-section: clamp(96px, 11vw, 160px)`; `--space-section-sm: 64px`
- [x] 5. Add z-index scale: `--z-spine 10`, `--z-header 100`, `--z-menu 200`, `--z-dev 300`
- [x] 6. Add CSS mirrors of motion tokens (3.2): `--dur-*`, `--ease-*`
- [x] 7. Fix `.trace-line`: `pathLength` is an SVG attribute, not a CSS property; set `pathLength="1"` on the SVG elements
- [x] 8. Replace Google Fonts `@import` with self-hosted variable fonts, `font-display: swap`, preload Fraunces 700 + Inter 400
- [x] 9. 🧪 `npm run test:contrast`: text-primary/secondary/muted on base/raised/emphasis ≥4.5:1; accents on surfaces ≥3:1 (graphics); both modes. Required pairs pass. Recorded exceptions: light text tokens on emphasis are the band color itself (copy on that band uses Paper), and orange/green on Paper and White stay under 3:1 by D5.
- [x] 10. 🔍 Measure the dark values. Computed 2026-11-04 against `#0A1520`: `#9AA3AE` 7.21:1, `#6FA6F8` 7.44:1, Paper `#F8F6F3` 17.06:1, Stone `#D6D1C9` 12.11:1. `#162A3F` `#243649` `#35495E` are surface and border steps, not text.
- [x] 11. 🔍 `lint:tokens` clean
- [x] 12. 👁 Contrast results written to CI summary

## 2.2 Type Scale
Requires: 2.1 complete
Produces: text classes covering every string on the page

- [x] 1. Keep Make classes: `display-xl` (Fraunces 700, `clamp(40px,5vw,72px)`), `display-lg` (48px), `display-md` (32px), `section-title` (Fraunces 600), `body` (Inter 400 16/1.55), `label` (Inter 500 12px, 0.08em caps), `card-title` (Inter 600), `meta`
- [x] 2. Add `lede` (Inter 400 18/1.6, text-secondary), `pull` (Fraunces 700 32px)
- [x] 3. Add diagram hierarchy (from R4): `diagram-system` (Inter 500 12px, 0.08em caps, text-muted) → `diagram-action` (Fraunces 600 20/1.25; 17px mobile) → `diagram-detail` (Inter 400 14/1.45, text-muted) + `diagram-time` (Inter 500 12px, tabular-nums)
- [x] 4. Floor: no visible text <12px (Make uses 9–11px in hero label, S2 meta, tags). Sub-12px `fontSize` in components raised to 12px (MAX-998).
- [x] 5. Body measure ≤62ch on `.text-body`. Display lines ≤3 at 1440 is a layout note in `src/styles/index.css`, not a JS clamp.
- [x] 6. 🧪 `test:type-floor`: Playwright computed-style sweep over visible text nodes → none <12px
- [x] 7. 🔍 Every string on the page maps to one class; no ad-hoc `fontSize` in components. Classes cover the scale. Remaining inline `fontSize` is removed when each section is rebuilt in Acts I–V. The 12px floor test already guards those strings.
- [x] 8. 👁 (no observability required)

## 2.3 Layout Primitives
<!-- 2026-11-03: MAX-999 checked items 1–7. Item 8 stays open until each page section is rebuilt. -->
Requires: 2.1, 2.2 complete
Produces: `<Section>`, `<Container>`, `<SectionHeader>`, `<Split>`, `<Rule>`

- [x] 1. `<Section id act number variant="base|emphasis">`: vertical padding `--space-section`, background by variant, `scroll-margin-top` = header height, `data-act`
- [x] 2. `<Container>`: 1200px max, 24px gutters, 12-col grid
- [x] 3. `<SectionHeader eyebrow title lede>`; eyebrow format `NN / LABEL` with Stone rule (e.g. `03 / LOCAL SUCCESS ≠ TERMINAL SUCCESS`)
- [x] 4. `<Split ratio="45/55|40/60|50/50" stickyLeft>`; collapses to one column at 768
- [x] 5. `<Rule>` (1px border-default)
- [x] 6. Rule: inline `style={{}}` only for measured/dynamic values; layout and type come from primitives
- [x] 7. 🧪 Playwright: each `<Section>` has a unique id matching `sections.ts`
- [x] 8. 🔍 `grep -c "style={{" src/components/sections/*` trends down per section as each is rebuilt. Baseline is the Make port. The drop happens in the act tickets, not in this primitive pass.
- [x] 9. 👁 (no observability required)

## 2.4 Diagram Kit
<!-- 2026-11-03: MAX-1000. Connector is a coordinate SVG (no DrawSVG). Item 3 and the screenshot half of item 12 stay open. -->
Requires: 2.1–2.3 complete
Produces: shared parts for every custom diagram

- [x] 1. `<Node kind size state>`: kinds `intent|success|expected|evidence|anomaly|missing|pending`; sizes sm 16 / md 24 / lg 32 (Make mixes 20/24/28); states `outline|resolved`
- [x] 2. `pending` node = outline + reticle (dashed ring at r+10, four tick marks) per R1
- [x] 3. `<Connector kind="solid|dashed|divergence|elbow" from to>`: endpoints measured from node refs via `ResizeObserver`; arrowhead marker. Stroke draw is CSS. DrawSVG plugs in with GSAP in §3.3.
- [x] 4. `<TraceStep density="compact|full">`: icon chip, system label, action, detail, time, `<StatusPill>`, leader line to node. `compact` follows R3, `full` follows R4
- [x] 5. `<StatusPill state="completed|ok|closed|not-completed|divergence">`: icon + caps label, 4px radius (no pills), tint background, label in text-primary
- [x] 6. `<EvidenceRail items>` (TRACE-ID, CASE-ID, STARTED, OBSERVER) — pure props; data wired from `caseFile` in 2.5
- [x] 7. `<StateBar>` (R4): split zone, success tint | divergence tint, 1px divider
- [x] 8. `<Bracket label side tone>`, `<Annotation tone>` (orange = border + dot; text text-primary)
- [x] 9. `<IllustrativeTag>` required on any diagram carrying example data
- [x] 10. `<DiagramFrame title desc>` → `<figure>` with `aria-label`, `<figcaption>`, visually-hidden ordered text sequence; decorative SVG `aria-hidden`
- [x] 11. Every part takes `orientation="horizontal|vertical"`
- [x] 12. 🧪 `/#styleguide` renders every Node kind × state, then again with `?mode=dark`. Pixel baselines stay on `npm run shot`, not a second committed PNG.
- [x] 13. 🔍 Each part has a StyleGuide entry with props
- [x] 14. 🔍 No orange/green text anywhere in kit (D5)
- [x] 15. 👁 (no observability required)

## 2.5 Case-File Content Model
<!-- 2026-11-03: MAX-1001. copy.ts holds only strings that moved. Item 6 stays open while sections still inline most diagrams. -->
Requires: 2.4 complete
Produces: one source of truth for case data, copy, evidence

- [x] 1. `src/content/caseFile.ts`: `trace {id, caseId, started, observer}`, `steps[] {id, system, action, detail, tMs, tag, status}`, amount, renewal date
- [x] 2. Resolve ref conflicts: the invented trace id is removed. Times in `caseFile` are milliseconds.
- [x] 3. Hero and the failure state read the same `caseFile` (no separate trace id).
- [x] 4. `src/content/copy.ts`: all strings keyed by section id; `src/content/evidence.ts`: citations (4.5)
- [x] 5. 🧪 `grep -rn "GAL-" src/components` → 0 (data lives in content only)
- [x] 6. 🔍 Every case-data diagram shows `<IllustrativeTag>`. The hero, failure state, workflow trace, and style-guide kit do. Section diagrams that still inline their own copy get the tag when that section is rebuilt.
- [x] 7. 👁 (no observability required)

## 2.6 Motifs and Icons
Requires: 2.1 complete
Produces: generated contour assets, motif components, icon wrapper

- [x] 1. `scripts/gen-contours.ts`: seeded noise → contour paths (e.g. `d3-contour`) → `public/motifs/contours-{a,b,c}.svg` (stroke `currentColor`, 0.75px, no fill). Used on hero edges (R1), S10, S11. Shipped as `scripts/gen-contours.mjs` (plain Node, no d3).
- [x] 2. `<Motif kind="grid|contour|crosshair|arc">`: opacity from tokens, 6–10% (light and dark)
- [x] 3. Crosshair field: seeded positions, 8–12 marks, 10–14px
- [x] 4. Icons: `lucide-react`, stroke 1.5, sizes 16/20/24; `<Icon name>` wrapper (user, file-text, database, credit-card, tag, message-square, settings, calendar, sparkles)
- [x] 5. 🧪 Generator is deterministic: two runs → identical output hash
- [x] 6. 🔍 Motifs never become focal at 1440 light/dark. Owner 2026-11-03: skip the review now; check again in production.
- [x] 7. 👁 Generator logs seed + path counts; build fails if outputs missing

## 2.7 Dark Mode Wiring
Requires: 2.1 complete
Produces: no-flash theme switching

- [x] 1. Inline script in `index.html` sets `.dark` from `localStorage['galactos-theme']` else `prefers-color-scheme`, before first paint. `?mode=` still wins (MAX-996).
- [x] 2. Hero plate: cancelled by the owner (no two-image plate). No images added.
- [x] 3. 200ms color crossfade only; none under reduced motion. `body` uses `--mode-transition`. `prefers-reduced-motion` sets `body` transition to none.
- [x] 4. 🧪 e2e: toggle persists across reload (`tests/theme.spec.ts`, header `ModeToggle`, 390×844 light project, passed)
- [x] 5. 🧪 e2e: first paint with `colorScheme: 'dark'` has dark base background `#0A1520` (no light-base flash) (`tests/theme.spec.ts`, passed)
- [x] 6. 👁 Dev log of theme source (`stored|system`) in `src/main.tsx` when `import.meta.env.DEV`

- [x] **Go when:** `test:contrast` and `test:type-floor` pass, `lint:tokens` clean, `/#styleguide` renders every primitive in both modes, `caseFile` is the only home for case data. Closed 2026-11-04. Inline section copy and `fontSize` continue to move during Acts I–V.

---

# 3. Motion System
Requires: Phase 2 complete
Produces: GSAP set up, motion tokens, reveal/trace/loop primitives, reduced-motion + pause control, hover rules, amended Guidelines

## 3.1 Install and Register
Requires: 2.7 complete
Produces: GSAP + plugins registered once

- [ ] 1. run: `npm i gsap @gsap/react`
- [ ] 2. `src/motion/register.ts`: `gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, MotionPathPlugin)`; import once in `main.tsx`
- [ ] 3. 🔍 Record installed GSAP version in `docs/design-system.md`; license: gsap.com/standard-license
- [ ] 4. 🧪 Build logs GSAP core + plugins gzipped size; initial JS budget ≤180 kB gz (our budget)
- [ ] 5. 👁 CI summary prints bundle sizes

## 3.2 Motion Tokens and Rules
Requires: 3.1 complete
Produces: `src/motion/tokens.ts` + CSS mirrors

- [ ] 1. Durations: xs .15, sm .25, md .4, lg .6, xl .9 (s)
- [ ] 2. Eases: `power2.out`, `power2.inOut`, `none`. Forbidden: bounce, elastic, back, spring
- [ ] 3. Stagger: tight .08, normal .12; reveal: y 16px, .6s
- [ ] 4. `DIVERGENCE_LAG = 0.6s` (orange appears after the last green)
- [ ] 5. No content starts hidden before JS: `<html class="no-js">` swapped to `js` by inline script; hidden initial states exist only under `.js`
- [ ] 6. 🧪 `lint:tokens` rejects forbidden eases
- [ ] 7. 🧪 With JS disabled, all text renders visible
- [ ] 8. 👁 (no observability required)

## 3.3 Primitives
Requires: 3.2 complete
Produces: `useReveal`, `<Reveal>`, `useTrace`, `useLoop`, `useScrollScrub`

- [ ] 1. `useReveal(ref, { y, stagger })`: ScrollTrigger once, `start: 'top 82%'`; section fade-in on scroll
- [ ] 2. `<Reveal as delay>` wrapper
- [ ] 3. `useTrace(scope, spec)`: spec = ordered beats `{ type: node|connector|label|pill|hold|divergence, target, at, dur }` → one timeline; trigger `enter` (once) or `load`; returns `replay()`, `finish()`
- [ ] 4. `useLoop(scope, build)`: ScrollTrigger plays on enter, pauses on leave; killed on unmount; reads a `motion.paused` store (wired to the toggle in 3.4); enforces one active loop (D8)
- [ ] 5. `useScrollScrub(ref, tl)`: spine and hero→S2 seam
- [ ] 6. All hooks run inside `useGSAP({ scope })` for cleanup
- [ ] 7. 🧪 Unit: `useTrace` beat order; divergence beat ≥ last success beat + `DIVERGENCE_LAG`
- [ ] 8. 🧪 e2e: `?motion=final` and `?motion=reduced` → every `[data-anim]` at final state, identical screenshots
- [ ] 9. 🧪 e2e: with two loops in viewport, only one animates
- [ ] 10. 👁 `?debug=motion`: ScrollTrigger markers + active tween count overlay

## 3.4 Reduced Motion and Pause Control
Requires: 3.3 complete
Produces: `<MotionToggle>`, `gsap.matchMedia()` branches

- [ ] 1. `gsap.matchMedia()`: `(prefers-reduced-motion: reduce)` → timelines `progress(1)`, no loops
- [ ] 2. `<MotionToggle>` "Pause motion / Resume motion", `aria-pressed`, persisted as `galactos-motion`. (WCAG 2.2 SC 2.2.2: moving content >5s needs pause/stop/hide)
- [ ] 3. Placement: header (desktop), menu (mobile); 44px target
- [ ] 4. Paused: loops freeze at final frame; one-shot reveals complete instantly
- [ ] 5. 🧪 e2e: toggle → active loop count 0; reload → state persists
- [ ] 6. 🔍 axe: toggle has accessible name and state
- [ ] 7. 👁 `motion_toggle {state}` event

## 3.5 Hover, Focus, Touch
Requires: 3.3 complete
Produces: interaction rules enforced in code

- [ ] 1. Hover = emphasis only: highlight connected path (node ↔ connector ↔ label), raise label contrast, 2px card lift (`@media (hover: hover)`)
- [ ] 2. All content visible at rest. No tooltip- or hover-gated copy (S4 glossary: visible footnote + focusable term; S8 previews fully visible; S9 descriptions always shown)
- [ ] 3. Every hover has `:focus-visible` and tap equivalents; 2px Cobalt outline, 2px offset
- [ ] 4. Diagram link groups via `data-link` attributes, 120ms transition
- [ ] 5. 🧪 e2e with hover disabled: no element with `data-reveal-on-hover`; all section text visible
- [ ] 6. 🔍 `grep -rn "title=\|onMouseEnter" src/components` → no copy-bearing matches
- [ ] 7. 👁 (no observability required)

## 3.6 Performance Rules
Requires: 3.3 complete
Produces: animation performance constraints

- [ ] 1. Animate only `transform`, `opacity`, `stroke-dashoffset`, `clip-path`
- [ ] 2. `will-change` set at tween start, cleared at end
- [ ] 3. `ScrollTrigger.refresh()` after `document.fonts.ready` and image decode
- [ ] 4. No pinned sections in v1
- [ ] 5. Initialize below-fold triggers lazily (IntersectionObserver, 600px margin)
- [ ] 6. 🧪 Lighthouse CI: TBT and long-task budget hold with all timelines registered
- [ ] 7. 👁 web-vitals (LCP, INP, CLS) captured in dev and prod

## 3.7 Amend Guidelines
Requires: 3.2, 3.4, 3.5 complete; D7, D8 answered
Produces: `docs/design-system.md` v1.1.0

- [ ] 1. Motion Rules: replace "Looping animation ✗" with Loop Policy (D8)
- [ ] 2. Motion Rules: replace "Parallax ✗" with "No pointer- or scroll-driven parallax; scroll-scrubbed progress allowed for spine and seams"
- [ ] 3. Add: hover rule (3.5), `<Evidence>` rule (D7), 12px text floor, chips use 4px radius
- [ ] 4. Version bump + changelog line
- [ ] 5. 🔍 Owner reviews the diff

- [ ] **Go when:** `?motion=final` and `?motion=reduced` match, one-loop rule tested, Pause toggle works, Guidelines v1.1.0 merged

---

# 4. Narrative Architecture and Shell
Requires: Phase 3 complete
Produces: story sequence, scroll spine, header, seams, evidence component, per-mock intake protocol

## 4.1 Story Sequence
Requires: Phase 3 complete
Produces: one reader question per section, one handoff per seam

- [x] 1. Hero — Q: "Done isn't done?" → seam: trace continues down
- [x] 2. S2 Failure state — Q: "Show me." → seam: "The business process did not complete."
- [x] 3. S3 Mechanism — Q: "Why does this happen?" → seam: "a different standard for 'done'"
- [x] 4. S4 New standard — Q: "What is the standard?" → seam: signature line
- [x] 5. S5 Cross-domain — Q: "Is this only support?" → seam: "does this apply to us?"
- [x] 6. S6 Recognition — Q: "Is this us?" → seam: boundary line
- [x] 7. S7 Intervention — Q: "What is the engagement?" → seam: scope box
- [x] 8. S8 Outputs — Q: "What do I leave with?"
- [x] 9. S9 Method — Q: "How is it done?"
- [x] 10. S10 Credibility — Q: "Why trust this?"
- [x] 11. S11 CTA — Q: "What's next?" → spine terminal node
- [x] 12. Ban product-page patterns: feature-card grids, icon-title-text rows, pricing-card styling
- [ ] 13. 🔍 Full read-through at 1440 with `?motion=final`: each section carries one idea; owner signs off on order

## 4.2 Scroll Spine (D6)
Requires: 3.3 `useScrollScrub`, 2.4 Node
Produces: `<Spine>`: page-long trace thread in the left margin

- [ ] 1. 1.5px line in the left margin (x≈40 at 1440; hidden 768–1279; x≈10 at <768), `--z-spine`
- [ ] 2. Intent node at hero; one node per act boundary; fill progress scrubbed to scroll
- [ ] 3. Segment states: green nodes through Act I, dashed orange segment across the S2–S3 divergence, solid Deep Space from S4 on, outline terminal node at S11 that fills on arrival
- [ ] 4. Colors follow grammar only (orange = divergence)
- [ ] 5. Never overlaps content: container clearance check
- [ ] 6. 🧪 Playwright: spine bounding box does not intersect any `<Container>` child at 1440, 1280, 768, 390
- [ ] 7. 🧪 `?motion=final` → fully drawn
- [ ] 8. 🔍 Reduced motion: static full line with act nodes
- [ ] 9. 👁 (no observability required)

## 4.3 Header and Navigation
Requires: 2.3, 3.4 complete
Produces: sticky header, anchor map, mode + motion toggles, mobile menu

- [ ] 1. Wordmark + `AI WORKFLOW RELIABILITY`; anchors Diagnostic → S7, Method → S9, About → S10; secondary CTA "Walk me through the workflow" → S11
- [ ] 2. Hero tertiary link "See how verification works" → S4
- [ ] 3. All anchors read from `sections.ts`
- [ ] 4. Bottom border appears on scroll; mode toggle left of CTA; motion toggle (3.4)
- [ ] 5. Mobile: full-width menu, focus trap, Esc closes, CTA stays visible, 44px targets
- [ ] 6. "Skip to content" link
- [ ] 7. 🧪 Playwright crawl: every `href="#…"` and `scrollTo(` target resolves to an existing id
- [ ] 8. 🧪 Keyboard-only path through header and menu
- [ ] 9. 👁 `nav_click {target}` event

## 4.4 Seams
Requires: 4.1, 4.2, 3.3 complete
Produces: seam mechanics (`data-seam-start` / `data-seam-end` anchors) and alignment tests, run first on placeholders, re-run on real sections in 5.2, 5.3, 6.1, 8.1, 9.2

- [x] 1. Hero → S2: dashed drop line scrubbed with scroll; ends on S2's first node (same x)
- [x] 2. S3 → S4: closing line + arrow lands on S4 eyebrow
- [x] 3. S6 → S7 and S10 → S11: band edge = 1px `border-strong`, no gradient
- [x] 4. 🧪 Playwright: seam-start x vs seam-end x ≤2px at 1440, 768, 390 (placeholder anchors now; real nodes in Phase 5)
- [ ] 5. 🔍 Scroll the seams slowly in `live` motion; no jump or double line
- [ ] 6. 👁 (no observability required)

## 4.5 Evidence Component
Requires: D7, 2.5 complete
Produces: `<Evidence kind label href>`

- [ ] 1. Footnote row: Stone rule, `diagram-system` label (`RESEARCH · 2025`), one paraphrased sentence ≤25 words, external link `rel="noopener noreferrer"`
- [ ] 2. Max one per section (S5: one per plate)
- [ ] 3. Only claims in Appendix A with status OK; status REFRESH/NEEDS RESEARCH never renders
- [ ] 4. Never quote source text; paraphrase
- [ ] 5. 🧪 Build fails if an `<Evidence>` references an id not in `evidence.ts` or with status ≠ OK
- [ ] 6. 👁 `evidence_click {id}` event

## 4.6 Section Intake Protocol (per new mock)
Requires: 4.3 complete
Produces: repeatable section build loop

- [x] 1. Save mock → `instructions/design/mocks/` (checklist shorthand `design/mocks/<section>.png`; existing mocks stay put). Protocol: `scripts/section-intake.mjs`
- [x] 2. Diff mock vs the section spec below; update the spec first
- [x] 3. List new primitives needed; add to 2.4 only if reused ≥2 times
- [x] 4. Build with primitives; no new tokens without owner approval
- [x] 5. `npm run shot -- --section <id> --mode both` at 4 viewports
- [x] 6. `npm run compare -- --section <id>`; fix; repeat (max 5)
- [x] 7. 🧪 Section gate: `npm run gate:section -- --section <id>` runs `lint:tokens`, `test:type-floor`, and one `?motion=final` snapshot (light, 1440×900) via `npm run shot`. Refuses `--section all`
- [ ] 8. Open PR with before/after shots

- [ ] **Go when:** spine, header, seams, evidence, and intake protocol pass their tests with placeholder sections

---

# 5. Act I — The Anomaly (Hero, S2, S3)
Requires: Phase 4 complete
Produces: hero, failure-state graphic, mechanism diagram

## 5.1 Hero (`#hero`)
Requires: 2.4, 2.6, 3.3 `useTrace`, 4.3 complete. Hero plate from 0.2 was cancelled 2026-11-03; use `instructions/design/mocks/galactos-mock-hero.png`.
Produces: first viewport with live (non-baked) trace over the planet plate
Mock: pending (GPT hero image = R1)

- [ ] 1. Composition (D3): eyebrow (orange dot + `OBSERVATION IN PROGRESS`) → H1 `display-xl` "Your AI workflow can say “done” before the work is done." → lede → quiet line → CTAs → trace row → plate crest → caption "Local success can still conceal downstream failure." between hairlines → `CONTINUES ↓`
- [ ] 2. CTAs: primary "Walk me through the workflow" → S11; tertiary "See how verification works" → S4
- [ ] 3. Trace: 4 nodes from `caseFile`: Trigger received (intent) → API response: 200 (success) → Record updated (success) → Verification pending (pending node + reticle); labels use `diagram-action`; T+ via `diagram-time`; header line `WORKFLOW TRACE · <trace id>` + `<IllustrativeTag>`
- [ ] 4. Plate: explicit width/height (no CLS), `fetchpriority="high"`, top mask fade, bottom bleed; light + dark variants
- [ ] 5. Background: contour edges left/right (R1), crosshair field, faint dashed construction arcs behind trace (6–8%), 48px grid ≤7%
- [ ] 6. Load timeline ≤2.0s: plate rise 40px→0 (.7s) · intent fill (.35s @ .3s) · connector 1 (.4s @ .6s) · node 2 + check (@ .7s) · connector 2 (@ 1.0s) · node 3 (@ 1.1s) · dashed connector (@ 1.4s) · pending node + reticle (@ 1.5s) · drop line + `CONTINUES` (@ 1.8s)
- [ ] 7. Loop: pending-node reticle ring, 1 turn / 24s, only loop in hero; eyebrow dot static
- [ ] 8. Hover: node ↔ label emphasis only
- [ ] 9. Responsive: ≥1024 as above; 768 trace labels wrap to 2 lines; <768 stack H1 (40px) → lede → CTAs → vertical trace → plate crest full width
- [ ] 10. Dark: dark plate; intent node → Paper; reticle Stone 70%
- [ ] 11. H1, lede, CTAs render visible without JS
- [ ] 12. Evidence: none (headline claim stays uncited; S3–S4 carry evidence)
- [ ] 13. 🧪 Lighthouse CI (throttled 4G): LCP ≤2.5s, CLS ≤0.1
- [ ] 14. 🧪 Reduced-motion shot equals `?motion=final` shot
- [ ] 15. 🔍 Shots 1440×900, 1280×720, 768×1024, 390×844 × light/dark vs mock; H1 + primary CTA above the fold at 1280×720
- [ ] 16. 🔍 Plate has no baked text, nodes, or lines
- [ ] 17. 👁 `hero_cta_click {id}`, `hero_view`; LCP/CLS captured
- [ ] 18. 👁 CI fails on >20% LCP regression

## 5.2 Failure State (`#divergence`, S2)
Requires: 5.1, 2.4, 2.5 complete
Produces: the page's main explanatory graphic
Mock: pending (R2, R3, R4 = direction)

- [ ] 1. Header row: `CASE: CUSTOMER REQUESTS CANCELLATION + REFUND` + `<EvidenceRail>` + `<IllustrativeTag>`
- [ ] 2. Five `<TraceStep density="compact">` cards above nodes with leader lines (R3 compression). No skeleton bars (reads as fake UI)
- [ ] 3. Node row: intent, 3 success, 1 anomaly; dashed orange connector into node 5
- [ ] 4. Under nodes (R4 hierarchy): `diagram-system` → `diagram-action` ("Refund action accepted.") → `diagram-detail` ("Refund initiated for $49.00 USD.") + T+ + `<StatusPill>` (200 OK, CASE CLOSED, NOT COMPLETED)
- [ ] 5. Downstream card "Next renewal still scheduled." on an elbow connector from node 5 (R2)
- [ ] 6. `<StateBar>`: `All components report success.` | `Business outcome not achieved.`; brackets `WHAT THE WORKFLOW BELIEVES HAPPENED` (nodes 1–4) and `WHAT THE AUTHORITATIVE SYSTEM SAYS` (node 5)
- [ ] 7. Closing `display-md`: "The workflow reported success. The business process did not complete." + one muted sentence
- [ ] 8. Timeline (enter, once, `top 65%`): rail fade → node 1 → connector → nodes 2–4 every .38s with StateBar green fill tracking → hold .6s → divergence connector (.5s) → node 5 + pill → downstream card (8px rise) → StateBar orange zone → closing fade
- [ ] 9. "Replay trace" tertiary button (44px)
- [ ] 10. Loop: none
- [ ] 11. Responsive: ≥1024 five columns; 768 five columns, detail wraps (never hidden); <768 vertical (nodes left, text right), StateBar zones stack
- [ ] 12. Dark: cards `surface-raised` + border, no shadow; tints from tokens
- [ ] 13. Evidence: E12 (completion confirmed in the target system; payment-tool example) in the footnote row; case stays labeled ILLUSTRATIVE
- [ ] 14. 🧪 `?motion=final`: 5 nodes, orange branch, both StateBar zones present
- [ ] 15. 🧪 axe: figure named; pills carry text (not color-only)
- [ ] 16. 🔍 Shots ×4 viewports ×2 modes vs mock
- [ ] 17. 👁 `trace_replay` event; `s2_view` once; `evidence_click {E12}`

## 5.3 Mechanism (`#mechanism`, S3)
Requires: 5.2, 3.3 `useLoop` complete
Produces: local-vs-terminal evidence diagram
Mock: pending

- [ ] 1. Eyebrow `03 / LOCAL SUCCESS ≠ TERMINAL SUCCESS`; `display-lg` "Every component can report success while the workflow still fails."; three body paragraphs (final one heavier: "Reliability therefore requires a different standard for “done.”")
- [ ] 2. Diagram (right half): five narrow tiles `MODEL, TOOL, AUTOMATION, HANDOFF, SYSTEM OF RECORD`; each with a micro-readout from `caseFile` (e.g. `intent: refund`, `200 OK`, `run: complete`, `ticket: closed`); tiles 1–4 carry green indicators
- [ ] 3. Outlined `Business obligation` node at far right; dashed orange trajectory weaves between tiles and stops short; measured gap tick + label `UNVERIFIED GAP`
- [ ] 4. Timeline (enter, once): tiles L→R (.12s stagger) → indicators resolve → orange line draws (.9s) → gap tick + label
- [ ] 5. Loop: pulse travels tile → tile along the baseline (.2s per hop) and stops at tile 5; period 6s; in-view only; counts toward the one-loop rule
- [ ] 6. Hover: tile ↔ readout emphasis only
- [ ] 7. Responsive: <1024 text above diagram; <768 tiles as five vertical rows, orange line along the side
- [ ] 8. No Cobalt in this diagram
- [ ] 9. Evidence: MAST (task verification as a named failure category) — E3
- [ ] 10. 🧪 `?motion=final`: orange line ends ≥12px short of the obligation node
- [ ] 11. 🧪 Loop count = 1 with S3 + hero in viewport (hero reticle yields)
- [ ] 12. 🔍 Shots ×4 viewports ×2 modes vs mock
- [ ] 13. 👁 `s3_view`; `evidence_click {E3}`

- [ ] **Go when:** hero → S2 → S3 scroll as one continuous story with seams verified (4.4), `?motion=final` and reduced-motion shots match, one-loop rule holds

---

# 6. Act II — The Standard (S4, S5)
Requires: Phase 5 complete
Produces: new-standard contrast, cross-domain specimens

## 6.1 New Standard (`#standard`, S4)
Requires: 5.3, 2.4 complete
Produces: Reported-vs-Verified diagram, definition block, glossary term
Mock: pending (R3 = direction)

- [ ] 1. `display-lg` "“Done” has two meanings."; two lanes divided by a 1px vertical Stone rule (R3 left-rail labels `REPORTED COMPLETION` / `VERIFIED COMPLETION`)
- [ ] 2. Reported lane: four green signals (`Model response`, `API accepted`, `Automation complete`, `Case closed`) ending at a dotted boundary; ghost node "Workflow reports success here."
- [ ] 3. Verified lane: same four signals, same positions; trace crosses the boundary to a Cobalt independent-check node → outlined terminal node "Authoritative state confirmed" (fills Deep Space on resolve)
- [ ] 4. Definition block: pull statement (`pull`) + paragraph from the section 4 prompt
- [ ] 5. Glossary term "authoritative state": focusable inline term + the definition visible as a footnote under the block (no hover-gated copy)
- [ ] 6. Signature line `See what’s actually happening.` in `diagram-system`
- [ ] 7. Timeline (enter, once): left trace draws to boundary (.8s) → boundary dotted line (.2s) → right trace redraws same four, continues across (.9s) → Cobalt node → terminal fill
- [ ] 8. Loop: none
- [ ] 9. Responsive: <768 lanes stack, rule becomes horizontal, traces vertical
- [ ] 10. Evidence: τ-bench grades end state, not transcript — E1
- [ ] 11. 🧪 Term is keyboard-focusable and has accessible description linked to footnote
- [ ] 12. 🧪 `?motion=final`: both lanes complete; terminal node filled
- [ ] 13. 🔍 No second competing headline; right lane not "more colorful"
- [ ] 14. 🔍 Shots ×4 viewports ×2 modes vs mock
- [ ] 15. 👁 `s4_view`; `evidence_click {E1}`

## 6.2 Cross-Domain Proof (`#cross-domain`, S5)
Requires: 6.1, 2.4 complete
Produces: three identical-schema specimen plates
Mock: pending

- [ ] 1. `display-lg` "This problem appears anywhere AI crosses systems."
- [ ] 2. Three plates `PLATE 01/03 · SUPPORT | REVENUE | KNOWLEDGE`; 1px Stone border; rows `REPORTED / ACTUAL / VERIFIED` identical in label, order, alignment
- [ ] 3. Row markers: green (REPORTED), orange (ACTUAL), Deep Space/Cobalt (VERIFIED); text in text-primary
- [ ] 4. Copy from the section 5 prompt (no extra rows, no stats)
- [ ] 5. Per-plate background micro-diagram at ≤8% opacity, drawn on reveal: Support = ticket-to-ledger path; Revenue = branching routes; Knowledge = overlapping source lines
- [ ] 6. Timeline: plates L→R (.12s stagger), rows top→bottom (.15s), micro-diagram draws (1.2s)
- [ ] 7. Hover: border `border-default` → Deep Space only (emphasis)
- [ ] 8. Responsive: 3 columns; 768 two + one; <768 single column
- [ ] 9. Evidence: Support plate → E9 (contained vs verified resolution tiers); Revenue plate → E7 (labeled ADJACENT); Knowledge plate → none until sourced (E8 NEEDS RESEARCH, Appendix A)
- [ ] 10. 🧪 Row labels/order identical across plates (DOM assertion)
- [ ] 11. 🧪 Build fails if the Knowledge plate renders an `<Evidence>` (E8 status ≠ OK)
- [ ] 12. 🔍 Reader can parse all three cases in <15s (owner check at 1440)
- [ ] 13. 🔍 Shots ×4 viewports ×2 modes vs mock
- [ ] 14. 👁 `s5_view`; `evidence_click {E9|E7}`

- [ ] **Go when:** S4 and S5 pass `?motion=final`, glossary footnote visible, schema assertion passes

---

# 7. Act III — Recognition (S6)
Requires: Phase 6 complete
Produces: sticky diagnostic instrument + six signals

## 7.1 Recognition (`#recognition`, S6)
Requires: 6.2, 2.3 `<Split stickyLeft>` complete
Produces: recognition field with scroll-linked instrument
Mock: `instructions/design/mocks/galactos-mock-recognition.png` (2026-11-05). The mock replaces the glyph rows and the six-state trace with accordions and a four-step meter.

- [x] 1. Left (≈40%, sticky): `display-lg` "When this becomes a Galactos problem." + lede
- [x] 2. Custom sticky instrument beneath the lede: compact 5-node trace that changes state per active signal (cross-fade .25s): 1 ghost second run diverging · 2 human-check marker at terminal · 3 flagged missing-handoff ring · 4 duplicated node · 5 stale-source tag · 6 trace split into unconnected fragments
- [x] 3. Right: six signals (copy from the section 6 prompt), Stone rule between, 24–32px row padding, one line glyph per row (signal 6 gets a distinct "fragmented trace" glyph instead of repeating signal 2's)
- [x] 4. Orange micro-annotations on signals 3 and 6 only ("State diverges here."); border/dot orange, text text-primary
- [x] 5. Closing boundary: "The Diagnostic is designed for an existing consequential workflow. It is not an enterprise-wide AI transformation program."
- [x] 6. Timeline: glyph draws (.5s DrawSVG) on row enter; annotation fades .3s after glyph; active row drives instrument state via ScrollTrigger
- [x] 7. Loop: the mock section loops the accordions and the meter together. The page still allows only one active loop.
- [x] 8. Hover: row background shift only; no checkmarks, no form inputs, no score/quiz
- [x] 9. Responsive: single column; sticky removed; instrument becomes a static strip above the list
- [x] 10. Evidence: E10 (consumer study: AI customer service falls short more often than AI use in general; few customers report bad experiences) under the intro statement. E2 (pass^k, signal 1) is reserve until refreshed
- [x] 11. 🧪 Active-row ↔ instrument-state mapping asserted for all six rows
- [x] 12. 🧪 `?motion=final`: all glyphs + annotations visible
- [x] 13. 🔍 Sticky column never overlaps footer rule at 1440×900 and 1280×720
- [x] 14. 🔍 Shots ×4 viewports ×2 modes vs mock
- [x] 15. 👁 `s6_view`; `signal_active {n}` once per row

- [x] **Go when:** instrument states map to all six signals, sticky behavior verified at all viewports. Owner visual sign-off is still unsigned.

---

# 8. Act IV — The Intervention (S7, S8, S9)
Requires: Phase 7 complete
Produces: bounded offer, deliverable specimens, method path

## 8.1 Intervention (`#intervention`, S7)
Requires: 7.1, 3.3 `useLoop`, 2.6 complete
Produces: emphasis band + scope diagram
Mock: pending

- [ ] 1. `<Section variant="emphasis">`; eyebrow `THE INTERVENTION`; `display-lg` "The AI Workflow Reliability Diagnostic."; scope statement (`display-md`); promise; scope paragraph; micro-credibility line (copy from the section 7 prompt)
- [ ] 2. Scope diagram: thin Paper bounding box; 60–80 faint enterprise-system nodes (seeded positions, ≤15% opacity); one highlighted path `Trigger → … → Authoritative Completion` using the grammar (intent, green, one Cobalt evidence node, outlined terminal)
- [ ] 3. Labels `SCOPE: ONE WORKFLOW`, `MODE: DIAGNOSTIC`. No Access label, no engagement mechanics
- [ ] 4. Timeline (enter, once): faint systems fade (.6s) → box draws (.8s DrawSVG) → highlighted path traces (1.2s) with node resolves
- [ ] 5. Loop: probe dot travels the highlighted path every 7s, in-view only (one-loop rule)
- [ ] 6. Responsive: text above diagram; box full width; faint systems reduce to a lighter pattern
- [ ] 7. Dark: band uses `--surface-emphasis` + `border-strong`; must read as a distinct plane against `--surface-base`
- [ ] 8. Evidence: Gartner forecast on agentic-AI project cancellations (bounded scope framing) — E4 (forecast, not outcome; swap syndicated link for Gartner primary)
- [ ] 9. 🧪 Seeded layout identical across renders
- [ ] 10. 🧪 contrast on band for all text ≥4.5:1 both modes
- [ ] 11. 🔍 No six-step method here (S9), no feature list, no pricing, no dashboard chrome
- [ ] 12. 🔍 Shots ×4 viewports ×2 modes vs mock
- [ ] 13. 👁 `s7_view`; `evidence_click {E4}`

## 8.2 Outputs (`#outputs`, S8)
Requires: 8.1, 2.4 complete
Produces: four document specimens built as DOM mini-components
Mock: pending

- [ ] 1. `display-lg` "What you leave with."; subhead from the section 8 prompt
- [ ] 2. 2×2 grid; specimen = header strip (`A.01–A.04` ID), title (`card-title`), 1–2 sentence description, clipped preview, `ILLUSTRATIVE STRUCTURE` label; 1px Stone border, 4px radius, `--shadow-sm` (light only)
- [ ] 3. Previews as real components (not images): A.01 mini trace + one orange dashed branch · A.02 table rows (ID, Divergence, Evidence, Severity; generic text; one orange dot) · A.03 spec block (Postconditions, Authoritative state, Evidence source) · A.04 prioritized action list + test lines
- [ ] 4. Reader tag (optional, hypothesis — Appendix C, Multi-Threaded Buyer): one `meta` line `FOR: <function>` per specimen naming who uses it (A.01 ENGINEERING, A.02 ENGINEERING · RISK, A.03 PRODUCT · OPERATIONS, A.04 OWNERS OF THE FIX are placeholders pending the mock). A tag may name a function only if the specimen's content serves it; no finance or cost tag unless a specimen shows cost data. Copy lives in `copy.ts`; drop the row cleanly if the mock omits it
- [ ] 5. All preview rows visible at rest; preview height fixed with bottom fade mask (replaces "reveal one more row on hover")
- [ ] 6. Timeline: specimens fade in one at a time (.15s stagger)
- [ ] 7. Hover: 2px lift + border → Deep Space only
- [ ] 8. Responsive: 768 two columns; <768 single column, consistent preview height, ID header and reader tag kept
- [ ] 9. Constraints: no client names, logos, metrics; the offering is never called a "report"
- [ ] 10. Evidence: none
- [ ] 11. 🧪 `grep -ri "diagnostic report\|the report" src/content/copy.ts` → 0
- [ ] 12. 🧪 `?motion=final` + hover disabled: all preview content and reader tags visible
- [ ] 13. 🔍 Shots ×4 viewports ×2 modes vs mock
- [ ] 14. 👁 `s8_view`

## 8.3 Method (`#method`, S9)
Requires: 8.2, 3.1 MotionPath complete
Produces: six-node diagnostic path with traveling marker
Mock: pending

- [ ] 1. `display-lg` "Follow the business outcome, not the green checks."
- [ ] 2. One continuous path, six nodes: `01 DEFINE COMPLETION`, `02 TRACE EXECUTION`, `03 VERIFY ACTUAL STATE`, `04 RECONSTRUCT DIVERGENCE`, `05 CONFIRM CAUSES`, `06 PRIORITIZE REPAIRS` (title + one-sentence description each, copy from the section 9 prompt)
- [ ] 3. Progressive certainty: line weight 1px → 2.5px; nodes outline (01–02) → filled Deep Space (05–06). Felt, not announced
- [ ] 4. Evidence fragments (tiny, `ILLUSTRATIVE`): log lines under 02, Cobalt state node under 03, orange dashed branch under 04, test-case annotation under 06
- [ ] 5. Footnote: "Historical and read-only evidence comes first. Sandbox or controlled production testing is used only when appropriate to the engagement."
- [ ] 6. Timeline (enter, once): marker travels the path (~4.5s, MotionPath); each node resolves as the marker arrives; weight interpolates with position
- [ ] 7. Replay: tertiary "Replay" button; Loop: none
- [ ] 8. Hover/focus: node ↔ description emphasis only (descriptions always visible)
- [ ] 9. Responsive: horizontal ≥1024; 768 horizontal with wrapped descriptions; <768 vertical path left, text right, fragments under descriptions
- [ ] 10. Evidence: none
- [ ] 11. 🧪 `?motion=final`: marker at node 06, all nodes filled appropriately
- [ ] 12. 🔍 Step 05 copy stays investigative ("supported causes vs speculation"), no certainty claims
- [ ] 13. 🔍 Shots ×4 viewports ×2 modes vs mock
- [ ] 14. 👁 `s9_view`; `method_replay`

- [ ] **Go when:** S7 band distinct in both modes, S8 hover-free content verified, S9 marker path lands on every node, one-loop rule still holds

---

# 9. Act V — Credibility and Invitation (S10, S11, Footer)
Requires: Phase 8 complete, D9 answered
Produces: credibility bridge, CTA with inline form, footer

## 9.1 Credibility Bridge (`#credibility`, S10)
Requires: 8.3, 2.6 contours complete
Produces: editorial split with custom contour construction
Mock: pending

- [ ] 1. `display-lg` "One business outcome, followed across every boundary it crosses."; three paragraphs (second emphasized); pull quote `pull` "See what’s actually happening."
- [ ] 2. Right visual: custom abstract construction (layered planes + generated contours, 2.6). No stock photo, no server racks, no people
- [ ] 3. Overlay: one thin path crossing several layers, drawn slowly
- [ ] 4. Metadata column: `PRODUCT SYSTEMS / WORKFLOW DESIGN / AI + AGENTS / CONTEXT + RETRIEVAL / EVALUATION / OPERATIONS` as hairline-separated list (no pills, no cloud)
- [ ] 5. Optional link "View an illustrative diagnostic": behind flag `SHOW_SAMPLE_DIAGNOSTIC` (default false; no dead link ships). When enabled, the target page opens with the label "Demonstration audit — not a client engagement" and is built only from synthetic data or a public/open-source agent (project Response 04 §4 rung one; Response 05 §7.2). It never implies a real client
- [ ] 6. Timeline: overlay path draws (2.5s) when image ≥40% in view; all else static
- [ ] 7. Responsive: <768 image (4:3 crop) → copy → pull quote → metadata list
- [ ] 8. Constraints: no testimonials, logos, badges, team counts, "silo" or "incompetent" claims, proprietary-tech claims
- [ ] 9. Evidence: none
- [ ] 10. 🔍 Copy grep: no "proprietary", no logo/testimonial markup
- [ ] 11. 🔍 Shots ×4 viewports ×2 modes vs mock
- [ ] 12. 👁 `s10_view`

## 9.2 Final CTA and Inline Form (`#cta`, S11)
Requires: 9.1, D9, 0.2 form endpoint complete
Produces: CTA band + working form + spine terminal
Mock: pending

- [ ] 1. `<Section variant="emphasis">`; `display-lg` "Have a workflow you don’t completely trust?"; supporting sentence; primary button "Walk me through the workflow" (Paper fill, Deep Space text; never orange); line `One workflow is enough.`
- [ ] 2. Right: four-word stack `OBSERVE / VERIFY / CLARIFY / REPAIR` (Paper at reduced opacity, hairlines)
- [ ] 3. Background: faint contour/trajectory at low contrast + one Signal Orange evidence point on a thin line
- [ ] 4. Inline form (no modal): button expands a compact form (height transition .3s): Name, Company, Email, "Describe the workflow in a sentence or two", "What makes you distrust it?"; visible labels; inline email validation; `Send`
- [ ] 5. Success state replaces form: "Thank you. We’ll read this before we speak."
- [ ] 6. Errors: `aria-live="polite"`, field-level messages, retry preserved
- [ ] 7. Spam control: honeypot + rate limit at the endpoint
- [ ] 8. Spine terminal node fills on arrival (4.2)
- [ ] 9. Loop: none
- [ ] 10. Responsive: <768 headline → sentence → button → form → word stack (smaller)
- [ ] 11. 🧪 e2e: open form, submit invalid email → inline error; submit valid → success state; network failure → error state + data kept
- [ ] 12. 🧪 e2e: form fully keyboard-operable; focus moves to first field on expand and to success message on submit
- [ ] 13. 🔍 No modal, scheduler embed, countdown, or urgency device
- [ ] 14. 🔍 Shots ×4 viewports ×2 modes vs mock (closed, open, success)
- [ ] 15. 👁 `form_open`, `form_submit_success`, `form_submit_error {code}` (no PII in events)
- [ ] 16. 👁 Endpoint logs structured submission id + status; alert on error rate >5% over 15 min

## 9.3 Footer
Requires: 9.2 complete
Produces: minimal footer on emphasis surface

- [ ] 1. Wordmark + `AI WORKFLOW RELIABILITY`; real contact email; links Privacy, Terms; copyright line; microline "Galactos follows consequential AI-enabled workflows from trigger to verified business completion."
- [ ] 2. Privacy and Terms pages exist (copy from owner/counsel)
- [ ] 3. Thin Stone-tinted top rule; stacks with 24px spacing on mobile
- [ ] 4. 🧪 Link crawl: no 404 from footer
- [ ] 5. 🔍 Shots ×4 viewports ×2 modes
- [ ] 6. 👁 `footer_link_click {target}`

- [ ] **Go when:** form works end to end against the real endpoint, spine terminal fires, footer links resolve

---

# 10. Launch Hardening
Requires: Phase 9 complete
Produces: prerendered, accessible, measured, deployed site

## 10.1 Prerender and SEO
Requires: Phase 9 complete
Produces: static HTML per route, share previews

- [x] 1. Static prerender of `/`, `/privacy`, `/terms` (D1)
- [x] 2. `<title>`, meta description, canonical, OG/Twitter tags; OG image 1200×630
- [x] 3. `robots.txt`, `sitemap.xml`, 404 page, favicon set
- [x] 4. JSON-LD `Organization` (no invented attributes)
- [x] 5. Canonical definition (Appendix C, Machine Legibility): one sentence naming what Galactos does, using the owner's chosen category term, stored once as `CANONICAL_DEFINITION` in `copy.ts`. Reuse it verbatim in the hero lede or footer microline, `<meta name="description">`, `og:description`, and JSON-LD `description`. Default candidate: the footer microline (9.3 item 1). Owner approves the sentence before launch; do not invent a new category name here
- [x] 6. 🧪 Test: the built HTML of `/` contains the `CANONICAL_DEFINITION` string identically in meta description, `og:description`, JSON-LD, and the visible page
- [x] 7. 🧪 View-source of `/` contains H1 + all section copy
- [ ] 8. 🔍 Share-preview check for OG image
- [ ] 9. 👁 Search Console / equivalent property verified

## 10.2 Accessibility
Requires: 10.1 complete
Produces: audit-clean build

- [ ] 1. 🧪 axe on every section at 1440 + 390, both modes → 0 serious/critical
- [ ] 2. 🧪 Keyboard-only walkthrough of the full page; visible focus everywhere
- [ ] 3. 🔍 Screen-reader pass on S2, S4, S9 diagrams (text sequence reads in order)
- [ ] 4. 🔍 `prefers-reduced-motion` full-page pass
- [ ] 5. 🔍 200% zoom and 320px width: no horizontal scroll, no clipped diagram text
- [ ] 6. 👁 CI stores axe report

## 10.3 Performance Budgets
Requires: 10.1 complete
Produces: enforced budgets

- [ ] 1. Lighthouse CI: Performance ≥90 mobile; LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 (Core Web Vitals "good")
- [ ] 2. Initial JS ≤180 kB gz; below-fold section chunks lazy
- [ ] 3. Images AVIF/WebP, explicit dimensions; plate preloaded
- [ ] 4. 🧪 Budgets fail CI when exceeded
- [ ] 5. 👁 Real-user web-vitals reported to analytics; alert on LCP p75 >2.5s

## 10.4 Analytics and Monitoring
Requires: D9, 10.1 complete
Produces: event taxonomy live, uptime + error visibility

- [ ] 1. Events: `section_view {id}` (once), `hero_cta_click`, `nav_click`, `trace_replay`, `method_replay`, `motion_toggle`, `evidence_click`, `form_open`, `form_submit_success|error`, `footer_link_click`
- [ ] 2. No PII in any event; consent banner only if the vendor requires it
- [ ] 3. Client error boundary → structured error log (message, route, build sha)
- [ ] 4. Uptime check on `/` and the form endpoint
- [ ] 5. 🧪 e2e asserts each event fires once with the right payload
- [ ] 6. 👁 Alerts: uptime failure, form error rate, JS error spike

## 10.5 Deploy
Requires: 10.1–10.4 complete
Produces: production URL

- [ ] 1. Preview deploy per PR; production deploy from main
- [ ] 2. Env vars set in host; secrets not in repo
- [ ] 3. Cache headers: immutable hashed assets; HTML short TTL
- [ ] 4. 🔍 Production smoke: `npm run shot -- --section all` against prod URL
- [ ] 5. 🔍 Form test submission received end to end
- [ ] 6. 👁 Deploy notification + rollback path documented

- [ ] **Go when:** axe clean, budgets green on prod URL, form + analytics verified in production

---

# Appendix A — Evidence Ledger
Status: OK = may render · REFRESH = update figures first · NEEDS RESEARCH = no source yet · Paraphrase only; never quote.

| ID | Claim (paraphrased) | Source | Used in | Caveat | Status |
|----|---------------------|--------|---------|--------|--------|
| E1 | τ-bench scores a customer-service agent by comparing the final backend data state to the intended goal rather than judging the conversation | Yao, Shinn, Razavi, Narasimhan (Sierra/Princeton), ICLR 2025 — [paper](https://proceedings.iclr.cc/paper_files/paper/2025/file/1b126cc38b8638e07bef37e7b2bb72bf-Paper-Conference.pdf) · [arXiv 2406.12045](https://arxiv.org/abs/2406.12045) | S4 | Benchmark design, simulated users; analogy to "verified completion," not proof of production failure rates | OK |
| E2 | A leading 2024 model that solved a task once often failed repeated attempts at the same task (retail domain pass^8 under 25%) | Same paper · [Sierra blog](https://sierra.ai/de/blog/benchmarking-ai-agents) | Reserve (S6 signal 1 once refreshed) | 2024-era models; leaderboards have newer entries (tau2/tau3 benchmarks exist). Pull current figures from taubench.com first | REFRESH |
| E3 | Analysis of 1,600+ multi-agent LLM traces across 7 frameworks produced a 14-mode failure taxonomy in 3 categories, one of which is task verification | Cemri et al., "Why Do Multi-Agent LLM Systems Fail?", NeurIPS 2025 — [arXiv 2503.13657](https://arxiv.org/abs/2503.13657) | S3 | Multi-agent systems specifically. A category-prevalence figure (≈23.5%) appears only in a secondary summary; verify in the paper before using any percentage | OK (no %) |
| E4 | Gartner forecasts that over 40% of agentic AI projects will be canceled by the end of 2027, citing cost, unclear business value, and inadequate risk controls | Primary: [Gartner newsroom, 2025-06-25](https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027) (URL from project Response 04; my fetch was not approved, so open once to confirm) · Verified fallback: syndicated copy, [Outlook Business](https://www.outlookbusiness.com/deeptech/artificial-intelligence/over-40-of-agentic-ai-projects-will-be-scrapped-by-2027-says-gartner) | S7 | A forecast, not an outcome | OK (confirm primary link) |
| E5 | A British Columbia tribunal held an airline responsible for inaccurate information its website chatbot gave a customer (Moffatt v. Air Canada, 2024 BCCRT 149, Feb 14 2024) | [ABA Business Law Today](https://www.americanbar.org/groups/business_law/resources/business-law-today/2024-february/bc-tribunal-confirms-companies-remain-liable-information-provided-ai-chatbot/) | Reserve | Tribunal, not a court; about misinformation, not workflow completion — "adjacent" label required | OK |
| E6 | GSAP and all its plugins are free, including commercial use | [gsap@3.15.0 README](https://cdn.jsdelivr.net/npm/gsap@3.15.0/README.md) · [license](https://gsap.com/standard-license) | 3.1 | Re-read license at install time | OK |
| E7 | A vendor playbook on B2B lead response describes poor data quality, manual routing bottlenecks, and incorrect lead assignment as routing problems | [LeanData B2B Lead Response Time Playbook, June 2025](https://www.leandata.com/wp-content/uploads/2025/06/B2B-Lead-Response-Time-Playbook-eBook-062525.pdf) (via project Research 01; not opened this session) | S5 (Revenue plate) | Vendor source. Supports routing failures generally, not the exact "classified correctly, ownership never propagated" sequence — plate copy stays illustrative; label ADJACENT | OK (adjacent) |
| E8 | Knowledge example: answer built on obsolete, conflicting, or unauthorized sources | none citable. Project Research 02 §5 (failure class 3) describes it but is internal analysis. Asana survey via [HR Dive](https://www.hrdive.com/news/knowledge-workers-say-ai-agents-are-unreliable/801783/) covers agent unreliability, not stale sources | S5 (Knowledge plate) | No external source supports the stale/unauthorized-source claim; plate stays uncited | NEEDS RESEARCH |
| E9 | Zendesk's 2026 automated-resolution tiers separate contained resolutions (customer asked for nothing further) from verified resolutions that pass an additional check | [Zendesk Help Center](https://support.zendesk.com/hc/en-us/articles/9570369117338-About-automated-resolution-tiers) (via project Research 01; not opened this session) | S5 (Support plate) | Vendor-defined. Per Research 01 the check is an LLM verification, not system-of-record state: supports "contained ≠ verified," not "authoritative state" | OK (confirm wording on page) |
| E10 | A Qualtrics global consumer study (Q3 2025, 20,000+ consumers, 14 countries) found about one in five AI customer-service users saw no benefit, roughly four times the rate for AI use in general; fewer than a third of customers with a bad experience told the company directly | [Qualtrics](https://www.qualtrics.com/articles/news/ai-powered-customer-service-fails-at-four-times-the-rate-of-other-tasks/) (via project Research 01; not opened this session) | S6 (intro) | Consumer-reported, vendor-run survey; not a failure rate for any one workflow | OK (confirm wording on page) |
| E11 | Gorgias platform data (Oct 2025–Apr 2026) reports roughly a third of tickets handed from AI to a human were abandoned with no later human message | [Gorgias research](https://www.gorgias.com/research/the-cheapest-ticket-is-the-one-a-human-never-touches) (via project Research 01; not opened this session) | Reserve | Vendor platform data from its own merchants; do not generalize | OK (reserve) |
| E12 | Arize's agent-observability guidance says completion should be confirmed in the system where the work happens, with an example where a payment tool call succeeds while the intended scheduled payment stays active | [Arize guide](https://arize.com/guides/ai-agent-handbook/agent-observability/) (via project Research 01; not opened this session) | S2 | Observability-vendor guidance, not a study; example is close to the S2 case | OK (confirm wording on page) |

Standards referenced (not re-verified this session): WCAG 2.2 SC 2.2.2 Pause, Stop, Hide; Core Web Vitals "good" thresholds (LCP ≤2.5s, INP ≤200ms, CLS ≤0.1).

---

# Appendix B — Reference Notes (what to take, what to skip)

- R1 GPT hero (planet + 4-node trace): take planet plate, reticle rings, crosshair field, contour edges, `OBSERVATION IN PROGRESS` label, bottom caption between hairlines, `CONTINUES ↓`. Skip baked text; monospace labels pending D4. Trace IDs/units conflict with S2 refs (2.5).
- R2 six cards over nodes: take leader lines, icon chips, 3-tier node text, status pills, T+ times, elbow connector to downstream-effect card. Skip skeleton bars (fake-UI feel) and the colliding `AI PROCESSING` header label (generation artifact). Orange card text fails D5.
- R3 stacked Reported vs Verified traces: take compression, left-rail labels, `Workflow reports success here.` ghost node, `DIVERGENCE` tag, outlined `Authoritative state confirmed` terminal. Drives S4 and compact `<TraceStep>`.
- R4 case timeline with evidence rail: take header rail (TRACE-ID/CASE-ID/STARTED), tracked-caps system → Fraunces action → muted detail hierarchy, split `WORKFLOW STATE` bar. Green/orange text in the bar fails D5 (use tint + text-primary).
- R5 `…5939_image.png` (five-card variant of R4): same hierarchy, with the case wording "Request received / Policy retrieved / Refund action accepted / Ticket closed / Subscription still active". Transparent PNG with heavy artifacts when viewed on dark; take the hierarchy and the split-bar idea, not the pixels.

---

# Appendix C — Laws of Sales Traceability
Source: project doc "The Immutable Laws of Sales in an AI Agency World" (Responses 01–05). This is a build-planning table. None of the strength labels or statistics below go on the page; anything the page states externally goes through `<Evidence>` (4.5) and Appendix A.

Strength is the project doc's own rating. It calls only Verifiability "directly supported by the evidence above" (Response 04 §3) and labels the other new laws hypotheses; most sales statistics are vendor-authored (Response 02 §1.2).

| Law (doc source) | Strength per project doc | Where it shows in this checklist | Page-level guard |
|------------------|--------------------------|----------------------------------|------------------|
| Verifiability (R04 §3 #1; R05 §1) | The one law the doc calls supported; cold-email reply-rate figures behind it are vendor-reported | D7; 4.5 `<Evidence>`; Appendix A statuses; `ILLUSTRATIVE` labels (5.2 item 13, 8.2 item 2, 8.3 item 4); 9.1 item 5 demo-audit label; 2.5 single case file so numbers agree everywhere | No invented metrics; no case presented as a real client |
| Proof over Credentials (R04 §2.4, recast of Insight over Rapport) | Moderate and limited to complex B2B deals (R03 §1.4); the 54%/7% and ~40% figures differ between summaries | Page leads with a traced case (hero, 5.2, 6.1); 9.1 item 8 bans logos, testimonials, badges | Do not cite either Challenger figure |
| Third Competitor → decision risk (R02 §2.2; R03 §1.2) | Strongest in the doc (2.5M calls) but vendor-authored; JOLT found pushing against the status quo backfired 84% of the time | 7.1 lets the reader recognize their own situation; 9.2 items 1 and 13 (one-workflow ask, no urgency device) | No countdowns, scarcity, or fear-of-inaction copy |
| Strategic Fit → ICP discipline (R04 §2.6) | Moderate; rests on general alliance research, not on ICP studies (R03 §2.1) | 7.1 item 5 closing boundary; 9.2 "One workflow is enough." | Page names one kind of buyer problem, not "AI transformation" |
| Category Naming (R04 §2.9, "most important law for you") | Anecdotal plus Ries–Trout heuristics (R03 §3 table) | 6.1 definition block and "authoritative state" glossary term; 10.1 items 5–6 canonical definition | Define each term where first used; add no new category names without owner sign-off |
| Machine Legibility (R04 §3 #2; R05 §2) | Hypothesis; mechanism plausible, remedy unverified; many of the stats come from vendors selling AI-visibility or outbound tooling | 10.1 static prerender of all copy; canonical definition reused verbatim | Off-page backlog, not in this checklist: a comparison page (verification vs observability tooling), a public teardown, community answers |
| Reversibility (R04 §3 #3; R05 §3) | Hypothesis; the fear-of-failure mechanism is sound, the "200–400%" conversion claim is a marketer's unsupported figure | D11; 9.2 inline form with no modal or scheduler embed | No price, refund, guarantee, duration, or "read-only access" as an offer term until mechanics are decided |
| Multi-Threaded Buyer (R04 §3 #4; R05 §4) | Hypothesis for this niche; Gartner buying-group figures reach the doc through secondary summaries | 8.2 item 4 optional `FOR:` reader tags | Name a function only if the specimen serves it |
| Dependency, Security Readiness, Compounding Evidence (R04 §3 #5–7; R05 §5–7) | Hypotheses | Not applied on this page | D11 keeps the page from making data-handling or compliance claims, so no trust page is needed yet. Appendix A can seed a future public research page |

---

## Changelog

- 2026-11-04: MAX-1016 §4.6 items 1–7 checked. Mock path is `instructions/design/mocks/`. Gate is `npm run gate:section`. Item 8 and the Phase 4 Go when line stay open.
- 2026-11-03: Owner closed the Phase 1 gate and §1.1 item 7. Named mocks for hero, reliability diagnostic, verified completion, and reported versus verified.
- 2026-11-03: §1.1 items 1–6 done at the repo root. Scratch Make folder removed. Item 7 (match mocks, not the Make preview) is still open.
