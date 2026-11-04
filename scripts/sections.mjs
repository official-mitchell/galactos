/* 2026-11-03: MAX-996 reads section ids from src/content/sections.ts. One source of truth. */
import fs from 'node:fs'

export function readSectionIds() {
  const source = fs.readFileSync(new URL('../src/content/sections.ts', import.meta.url), 'utf8')
  const ids = [...source.matchAll(/id:\s*'([^']+)'/g)].map((match) => match[1])
  if (ids.length !== 11) {
    throw new Error(`Expected 11 section ids in src/content/sections.ts, found ${ids.length}: ${ids.join(', ')}`)
  }
  return ids
}

export const VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 1280, height: 720 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
]
