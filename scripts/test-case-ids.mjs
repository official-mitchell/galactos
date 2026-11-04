/* 2026-11-03: MAX-1001. Fails when a GAL- literal remains under src/components. */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const root = join(process.cwd(), 'src/components')
const hits = []

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) {
      walk(path)
      continue
    }
    const text = readFileSync(path, 'utf8')
    if (text.includes('GAL-')) hits.push(path)
  }
}

walk(root)

if (hits.length) {
  console.error('GAL- literals under src/components:\n' + hits.join('\n'))
  process.exit(1)
}

console.log('test:case-ids ok')
