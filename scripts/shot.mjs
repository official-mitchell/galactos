/* 2026-11-03: MAX-996 capture script.
   npm run shot -- --section <id|all> [--w 1440] [--h 900] [--mode light|dark|both] [--motion final|reduced|live]
   Omitting --w/--h with --section all runs the four viewports. Default mode is both, default motion is final.
   Waits for fonts, decoded images, and network idle. ScrollTrigger.refresh is skipped when that global is absent
   (recorded on the page as data-scroll-trigger=absent and in the manifest).
   Plausible is fulfilled with an empty script so the third-party beacon cannot fail the console gate.
   Writes .shots/<section>@<w>x<h>.<mode>.png and merges .shots/manifest.json.
   The first run also copies those files to .shots/baseline/ once. Later runs leave the baseline alone.
   A console error or warning fails the process. A near-solid PNG fails the process. */
import { execSync, spawn } from 'node:child_process'
import fs from 'node:fs'
import net from 'node:net'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'
import { PNG } from 'pngjs'
import { VIEWPORTS, readSectionIds } from './sections.mjs'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const shotsDir = path.join(rootDir, '.shots')
const baselineDir = path.join(shotsDir, 'baseline')
const preferredPort = Number(process.env.GALACTOS_PORT || 8443)

const args = parseArgs(process.argv.slice(2))
const sectionArg = args.section
const motion = args.motion ?? 'final'
const modeArg = args.mode ?? (sectionArg === 'all' && !args.w ? 'both' : args.mode ?? 'both')
if (!sectionArg) fail('Pass --section <id|all>.')
if (!['final', 'reduced', 'live'].includes(motion)) fail(`Unknown --motion ${motion}.`)
if (!['light', 'dark', 'both'].includes(modeArg)) fail(`Unknown --mode ${modeArg}.`)

const ids = readSectionIds()
const sections = resolveSections(sectionArg, ids)

const viewports = resolveViewports(args)
const modes = modeArg === 'both' ? ['light', 'dark'] : [modeArg]

const server = await ensureDevServer()
const origin = server.origin
const browser = await chromium.launch()
const gitSha = execSync('git rev-parse HEAD', { cwd: rootDir, encoding: 'utf8' }).trim()
const captures = []
let failed = false

try {
  for (const viewport of viewports) {
    for (const mode of modes) {
      for (const section of sections) {
        const capture = await captureOne(browser, { viewport, mode, section, motion, gitSha })
        captures.push(capture)
        if (capture.consoleErrors.length || capture.consoleWarnings.length || capture.blank) failed = true
      }
    }
  }
} finally {
  await browser.close()
  if (server.child) server.child.kill('SIGTERM')
}

writeManifest(captures)
if (!failed && baselineEmpty()) copyBaseline(captures)

if (failed) {
  const bad = captures.filter((row) => row.consoleErrors.length || row.consoleWarnings.length || row.blank)
  for (const row of bad) {
    console.error(`${row.file}: errors=${row.consoleErrors.length} warnings=${row.consoleWarnings.length} blank=${row.blank}`)
    for (const line of [...row.consoleErrors, ...row.consoleWarnings]) console.error(`  ${line}`)
  }
  process.exit(1)
}

console.log(`Wrote ${captures.length} capture(s) under .shots/`)

async function captureOne(browser, { viewport, mode, section, motion, gitSha }) {
  const started = Date.now()
  const consoleOutput = []
  const consoleErrors = []
  const consoleWarnings = []
  const page = await browser.newPage({
    viewport,
    colorScheme: mode,
    deviceScaleFactor: 1,
  })
  page.on('console', (msg) => {
    const line = `[${msg.type()}] ${msg.text()}`
    consoleOutput.push(line)
    if (msg.type() === 'error') consoleErrors.push(line)
    if (msg.type() === 'warning') consoleWarnings.push(line)
  })
  page.on('pageerror', (err) => {
    const line = `[pageerror] ${err.message}`
    consoleOutput.push(line)
    consoleErrors.push(line)
  })
  await page.route('**/*plausible.io/**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }),
  )

  const networkStarted = Date.now()
  let networkIdleMs = null
  let networkNote = 'idle'
  await page.goto(`${origin}/?motion=${motion}&mode=${mode}&shot=1`, { waitUntil: 'load' })
  try {
    await page.waitForLoadState('networkidle', { timeout: 15_000 })
    networkIdleMs = Date.now() - networkStarted
  } catch {
    networkIdleMs = Date.now() - networkStarted
    networkNote = 'networkidle timed out; continuing after fonts and images. Vite HMR can keep a socket open.'
  }

  await page.waitForFunction(() => document.documentElement.dataset.galactosReady === 'true', undefined, {
    timeout: 20_000,
  })
  const gates = await page.evaluate(async (sectionId) => {
    const fontStart = performance.now()
    await document.fonts.ready
    const fontsMs = Math.round(performance.now() - fontStart)
    const imageStart = performance.now()
    await Promise.all(
      [...document.images].map((img) => (img.decode ? img.decode().catch(() => undefined) : Promise.resolve())),
    )
    const imagesMs = Math.round(performance.now() - imageStart)
    const scrollTrigger = document.documentElement.dataset.scrollTrigger ?? 'absent'
    if (window.ScrollTrigger?.refresh) window.ScrollTrigger.refresh()
    await window.__galactos.ready
    const progress = document.documentElement.dataset.motion === 'reduced' ? 0 : 1
    window.__galactos.seek(sectionId, progress)
    window.__galactos.setMode(document.documentElement.classList.contains('dark') ? 'dark' : 'light')
    return { fontsMs, imagesMs, scrollTrigger }
  }, section)

  const fileName = `${section}@${viewport.width}x${viewport.height}.${mode}.png`
  const filePath = path.join(shotsDir, fileName)
  fs.mkdirSync(shotsDir, { recursive: true })
  const buffer = await page.screenshot({ path: filePath, animations: 'disabled' })
  await page.close()

  return {
    section,
    file: `.shots/${fileName}`,
    gitSha,
    viewport,
    mode,
    motion,
    consoleErrors,
    consoleWarnings,
    console: consoleOutput,
    timings: {
      totalMs: Date.now() - started,
      networkIdleMs,
      networkNote,
      fontsMs: gates.fontsMs,
      imagesMs: gates.imagesMs,
    },
    scrollTrigger: gates.scrollTrigger,
    blank: pngIsBlank(buffer),
  }
}

function pngIsBlank(buffer) {
  const png = PNG.sync.read(buffer)
  const step = Math.max(1, Math.floor((png.width * png.height) / 4000))
  let min = 255
  let max = 0
  let samples = 0
  for (let i = 0; i < png.data.length; i += 4 * step) {
    const luma = 0.2126 * png.data[i] + 0.7152 * png.data[i + 1] + 0.0722 * png.data[i + 2]
    if (luma < min) min = luma
    if (luma > max) max = luma
    samples += 1
  }
  return samples > 0 && max - min < 4
}

function writeManifest(rows) {
  const manifestPath = path.join(shotsDir, 'manifest.json')
  let existing = { captures: [] }
  if (fs.existsSync(manifestPath)) {
    try {
      existing = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
    } catch {
      existing = { captures: [] }
    }
  }
  const byFile = new Map((existing.captures ?? []).map((row) => [row.file, row]))
  for (const row of rows) byFile.set(row.file, row)
  const body = {
    updatedAt: new Date().toISOString(),
    gitSha: rows[0]?.gitSha ?? null,
    scrollTrigger: 'absent unless a capture reports refreshed',
    captures: [...byFile.values()],
  }
  fs.mkdirSync(shotsDir, { recursive: true })
  fs.writeFileSync(manifestPath, `${JSON.stringify(body, null, 2)}\n`)
}

function baselineEmpty() {
  if (!fs.existsSync(baselineDir)) return true
  return fs.readdirSync(baselineDir).filter((name) => name.endsWith('.png')).length === 0
}

function copyBaseline(rows) {
  fs.mkdirSync(baselineDir, { recursive: true })
  for (const row of rows) {
    const from = path.join(rootDir, row.file)
    fs.copyFileSync(from, path.join(baselineDir, path.basename(row.file)))
  }
  fs.writeFileSync(
    path.join(baselineDir, 'README.md'),
    '# Pre-edit baseline\n\nCopied from the first `npm run shot` run in this worktree. Later shots do not overwrite these files.\n',
  )
  console.log(`Copied ${rows.length} pre-edit baseline file(s) to .shots/baseline/`)
}

async function ensureDevServer() {
  if (await serverIsThisWorktree(preferredPort)) {
    return { child: null, origin: `http://127.0.0.1:${preferredPort}` }
  }
  let port = preferredPort
  if (await portOpen(port)) {
    port = preferredPort === 8443 ? 8456 : preferredPort + 1
    console.error(`Port ${preferredPort} is already serving another checkout. Starting this worktree on ${port}.`)
  }
  const child = spawn('npm', ['run', 'dev', '--', '--port', String(port), '--strictPort', '--host', '127.0.0.1'], {
    cwd: rootDir,
    stdio: 'ignore',
    detached: false,
  })
  const origin = `http://127.0.0.1:${port}`
  const deadline = Date.now() + 60_000
  while (Date.now() < deadline) {
    if (await serverIsThisWorktree(port)) return { child, origin }
    await new Promise((resolve) => setTimeout(resolve, 250))
  }
  child.kill('SIGTERM')
  fail(`Dev server did not open ${origin}.`)
}

async function serverIsThisWorktree(port) {
  if (!(await portOpen(port))) return false
  try {
    const response = await fetch(`http://127.0.0.1:${port}/`)
    const html = await response.text()
    return html.includes('MAX-996 applies')
  } catch {
    return false
  }
}

function portOpen(targetPort) {
  return new Promise((resolve) => {
    const socket = net.connect(targetPort, '127.0.0.1', () => {
      socket.end()
      resolve(true)
    })
    socket.on('error', () => resolve(false))
  })
}

function resolveViewports(flags) {
  if (flags.w || flags.h) {
    const width = Number(flags.w)
    const height = Number(flags.h)
    if (!Number.isFinite(width) || !Number.isFinite(height)) fail('Pass both --w and --h as numbers.')
    return [{ width, height }]
  }
  return VIEWPORTS
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

function resolveSections(token, ids) {
  if (token === 'all') return ids
  if (ids.includes(token)) return [token]
  const matches = ids.filter((id) => id === `section-${token}` || id.endsWith(`-${token}`))
  if (matches.length === 1) return matches
  fail(`Unknown section "${token}". Known ids: ${ids.join(', ')}`)
}

function fail(message) {
  console.error(message)
  process.exit(1)
}
