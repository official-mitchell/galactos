/* 2026-11-04: MAX-1011 §4.1. Eleven questions, named seams, and the product-page ban. */
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import { bannedProductPagePatterns, sections } from '../src/content/sections.ts'

const expected = [
  ["Done isn't done?", 'trace continues down'],
  ['Show me.', 'The business process did not complete.'],
  ['Why does this happen?', "a different standard for 'done'"],
  ['What is the standard?', 'signature line'],
  ['Is this only support?', 'does this apply to us?'],
  ['Is this us?', 'boundary line'],
  ['What is the engagement?', 'scope box'],
  ['What do I leave with?', undefined],
  ['How is it done?', undefined],
  ['Why trust this?', undefined],
  ["What's next?", 'spine terminal node'],
] as const

test('each section has one reader question and the checklist seam', () => {
  assert.equal(sections.length, 11)
  const questions = sections.map((section) => section.readerQuestion)
  assert.equal(new Set(questions).size, 11)
  sections.forEach((section, index) => {
    const [question, seam] = expected[index]
    assert.equal(section.readerQuestion, question)
    assert.equal(section.seam, seam)
  })
})

test('section markup does not use banned product-page class names', () => {
  assert.deepEqual(
    [...bannedProductPagePatterns],
    ['feature-card grids', 'icon-title-text rows', 'pricing-card styling'],
  )
  const dir = join(dirname(fileURLToPath(import.meta.url)), '../src/components/sections')
  const banned = /feature-card|icon-title|pricing-card/
  for (const file of readdirSync(dir)) {
    if (!file.endsWith('.tsx')) continue
    const source = readFileSync(join(dir, file), 'utf8')
    assert.equal(banned.test(source), false, file)
    assert.match(source, /storySectionProps\(/)
  }
})
