/**
 * MAX-1009: Lighthouse on the production preview. Fails when TBT exceeds 300ms
 * or any long task in the trace summary exceeds 200ms.
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
  const long = report.audits['long-tasks']?.details?.items ?? []
  const worst = long.reduce((max, item) => Math.max(max, item.duration || 0), 0)
  console.log(`TBT ${Math.round(tbt)} ms · longest task ${Math.round(worst)} ms`)
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
