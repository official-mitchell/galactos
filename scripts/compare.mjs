/* 2026-11-03: MAX-996 side-by-side compare.
   npm run compare -- --section <id> [--w 1440] [--h 900] [--mode light]
   Uses an existing mock in instructions/design/mocks/ when the section has one.
   Does not draw or invent mock pixels. Prints a gap when no mock or no shot exists.
   Known mocks: hero, recognition (section-diagnostic), reported-versus-verified (section-cta).
   galactos-mock-component-success.png is a component mock, not a section id, so it is not paired here. */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { chromium } from '@playwright/test'
import { readSectionIds } from './sections.mjs'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const mocksDir = path.join(rootDir, 'instructions/design/mocks')

const MOCK_BY_SECTION = {
  'section-hero': 'galactos-mock-hero.png',
  'section-diagnostic': 'galactos-mock-recognition.png',
  'section-cta': 'galactos-mock-done.png',
  'section-verification': 'galactos-mock-done.png',
  'section-proof': 'galactos-mock-show-proof.png',
  'section-credibility': 'galactos-section-8-approach.png',
}

const args = parseArgs(process.argv.slice(2))
const section = args.section
if (!section) {
  console.error('Pass --section <id>.')
  process.exit(1)
}
const ids = readSectionIds()
const resolved = ids.includes(section)
  ? section
  : ids.filter((id) => id === `section-${section}` || id.endsWith(`-${section}`))
const sectionId = Array.isArray(resolved) ? (resolved.length === 1 ? resolved[0] : null) : resolved
if (!sectionId) {
  console.error(`Unknown section "${section}". Known ids: ${ids.join(', ')}`)
  process.exit(1)
}

const mockName = MOCK_BY_SECTION[sectionId] ?? `${sectionId}.png`
const mockPath = path.join(mocksDir, mockName)
if (!fs.existsSync(mockPath)) {
  console.log(`No mock for ${sectionId}. Looked for instructions/design/mocks/${mockName}. Not inventing pixels.`)
  process.exit(0)
}

const shotsDir = path.join(rootDir, '.shots')
const shots = fs.existsSync(shotsDir)
  ? fs.readdirSync(shotsDir).filter((name) => name.startsWith(`${sectionId}@`) && name.endsWith('.png'))
  : []
const preferred = pickShot(shots, args)
if (!preferred) {
  console.log(`Mock exists (${mockName}) but there is no .shots/${sectionId}@*.png yet. Run npm run shot -- --section ${sectionId} first.`)
  process.exit(1)
}

const shotPath = path.join(shotsDir, preferred)
const outDir = path.join(shotsDir, 'compare')
fs.mkdirSync(outDir, { recursive: true })
const outPng = path.join(outDir, `${path.basename(preferred, '.png')}.side-by-side.png`)

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 })
const mockUrl = pathToFileURL(mockPath).href
const shotUrl = pathToFileURL(shotPath).href
await page.setContent(`<!doctype html>
<meta charset="utf-8" />
<title>${sectionId} compare</title>
<style>
  body { margin: 0; background: #111; color: #f8f6f3; font: 14px/1.4 sans-serif; }
  .row { display: flex; gap: 8px; align-items: flex-start; padding: 8px; }
  figure { margin: 0; flex: 1; min-width: 0; }
  figcaption { margin-bottom: 6px; }
  img { width: 100%; height: auto; background: white; }
</style>
<div class="row">
  <figure><figcaption>mock: ${mockName}</figcaption><img src="${mockUrl}" alt="mock" /></figure>
  <figure><figcaption>shot: ${preferred}</figcaption><img src="${shotUrl}" alt="shot" /></figure>
</div>`)
await page.waitForLoadState('networkidle')
await page.screenshot({ path: outPng, fullPage: true })
await browser.close()

console.log(`Mock: ${path.relative(rootDir, mockPath)}`)
console.log(`Shot: ${path.relative(rootDir, shotPath)}`)
console.log(`Side-by-side: ${path.relative(rootDir, outPng)}`)

function pickShot(names, flags) {
  if (!names.length) return null
  const width = flags.w
  const height = flags.h
  const mode = flags.mode && flags.mode !== 'both' ? flags.mode : null
  const ranked = [...names].sort((a, b) => score(b, width, height, mode) - score(a, width, height, mode))
  return ranked[0]
}

function score(name, width, height, mode) {
  let value = 0
  if (width && height && name.includes(`@${width}x${height}.`)) value += 4
  if (mode && name.endsWith(`.${mode}.png`)) value += 2
  if (name.includes('@1440x900.light')) value += 1
  return value
}

function parseArgs(argv) {
  const out = {}
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i]
    if (!token.startsWith('--')) continue
    const key = token.slice(2)
    const value = argv[i + 1]
    if (!value || value.startsWith('--')) out[key] = 'true'
    else {
      out[key] = value
      i += 1
    }
  }
  return out
}
