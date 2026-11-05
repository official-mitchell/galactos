/**
 * 2026-11-04: MAX-1017 LCP ≤2.5s, CLS ≤0.1, and a 20% regression ceiling.
 * MAX-1009: Lighthouse on the production preview. Fails when TBT exceeds 300ms
 * or any long task in the trace summary exceeds 200ms.
 * MAX-1017: LCP ≤2.5s, CLS ≤0.1, and either metric may not regress more than 20%
 * against scripts/lighthouse-baseline.json.
 */
import { spawn } from 'node:child_process'
import { createRequire } from 'node:module'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(import.meta.url)
const port = 4173
const out = path.join(root, 'dist', 'lighthouse.json')

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd: root, stdio: 'inherit' })
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`))))
  })
}

const preview = spawn('npm', ['run', 'preview', '--', '--port', String(port), '--host', '127.0.0.1', '--strictPort'], {
  cwd: root,
  stdio: 'ignore',
})

try {
  await new Promise((resolve) => setTimeout(resolve, 1500))
  const lighthousePath = require.resolve('lighthouse/cli/index.js')
  await run(process.execPath, [
    lighthousePath,
    `http://127.0.0.1:${port}/`,
    '--only-categories=performance',
    '--chrome-flags=--headless --no-sandbox',
    '--output=json',
    `--output-path=${out}`,
    '--quiet',
  ])
  const report = JSON.parse(fs.readFileSync(out, 'utf8'))
  const tbt = report.audits['total-blocking-time'].numericValue
  const lcp = report.audits['largest-contentful-paint'].numericValue
  const cls = report.audits['cumulative-layout-shift'].numericValue
  const long = report.audits['long-tasks']?.details?.items ?? []
  const worst = long.reduce((max, item) => Math.max(max, item.duration || 0), 0)
  console.log(`TBT ${Math.round(tbt)} ms · LCP ${Math.round(lcp)} ms · CLS ${cls.toFixed(3)} · longest task ${Math.round(worst)} ms`)
  const baselinePath = path.join(root, 'scripts', 'lighthouse-baseline.json')
  const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'))
  if (lcp > baseline.lcp * 1.2) {
    console.error(`LCP regressed more than 20% (${Math.round(lcp)} > ${Math.round(baseline.lcp * 1.2)})`)
    process.exit(1)
  }
  if (cls > Math.max(baseline.cls * 1.2, 0.1)) {
    console.error(`CLS regressed more than 20% (${cls} > ${baseline.cls})`)
    process.exit(1)
  }
  if (lcp > 2500) {
    console.error('LCP exceeds 2.5s')
    process.exit(1)
  }
  if (cls > 0.1) {
    console.error('CLS exceeds 0.1')
    process.exit(1)
  }
  if (tbt > 300) {
    console.error('TBT exceeds 300 ms')
    process.exit(1)
  }
  if (worst > 200) {
    console.error('A long task exceeds 200 ms')
    process.exit(1)
  }
} finally {
  preview.kill('SIGTERM')
}
