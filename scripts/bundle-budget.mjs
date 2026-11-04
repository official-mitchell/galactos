/**
 * MAX-1004: log gzipped GSAP core + plugins, and fail when initial JS exceeds 180 kB gz.
 */
import { gzipSync } from 'node:zlib'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const BUDGET = 180 * 1024

const gsapFiles = [
  'node_modules/gsap/dist/gsap.min.js',
  'node_modules/gsap/dist/ScrollTrigger.min.js',
  'node_modules/gsap/dist/DrawSVGPlugin.min.js',
  'node_modules/gsap/dist/MotionPathPlugin.min.js',
]

function gzBytes(file) {
  return gzipSync(fs.readFileSync(file)).length
}

function kb(bytes) {
  return `${(bytes / 1024).toFixed(1)} kB`
}

let gsapTotal = 0
const lines = ['## GSAP gzip', '']
for (const rel of gsapFiles) {
  const bytes = gzBytes(path.join(root, rel))
  gsapTotal += bytes
  lines.push(`- \`${rel}\`: ${kb(bytes)} gz`)
}
lines.push(`- core + plugins: ${kb(gsapTotal)} gz`, '')

const assets = path.join(root, 'dist/assets')
const jsFiles = fs.readdirSync(assets).filter((name) => name.endsWith('.js')).sort()
let initial = 0
lines.push('## Initial JS gzip', '')
for (const name of jsFiles) {
  const bytes = gzBytes(path.join(assets, name))
  initial += bytes
  lines.push(`- \`dist/assets/${name}\`: ${kb(bytes)} gz`)
}
lines.push(`- total: ${kb(initial)} gz`, `- budget: ${kb(BUDGET)} gz`, '')

const report = lines.join('\n')
fs.writeFileSync(path.join(root, 'dist/bundle-budget.md'), report)
console.log(report)

if (initial > BUDGET) {
  console.error(`Initial JS ${kb(initial)} gz exceeds ${kb(BUDGET)} gz`)
  process.exit(1)
}
