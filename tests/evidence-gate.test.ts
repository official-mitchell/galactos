/* 2026-11-04: MAX-1015. The build gate rejects missing ids and statuses other than OK.
   Changelog: 2026-11-04 added the evidence gate cases. */

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { evidenceLedger } from '../src/content/evidence.ts'
import { auditEvidence, parseEvidenceUsages } from '../scripts/check-evidence.ts'

const e1 = evidenceLedger.find((row) => row.id === 'E1')!

test('OK citation passes', () => {
  const usages = parseEvidenceUsages(
    'src/components/sections/NewStandard.tsx',
    `<Evidence id="E1" kind="${e1.kind}" label="${e1.label}" href="${e1.href}" />`,
  )
  assert.deepEqual(auditEvidence(usages, evidenceLedger), [])
})

test('missing id fails', () => {
  const errors = auditEvidence(
    [{ file: 'src/components/sections/Hero.tsx', id: 'E99' }],
    evidenceLedger,
  )
  assert.match(errors.join('\n'), /not in evidence\.ts/)
})

test('REFRESH and NEEDS RESEARCH fail', () => {
  const errors = auditEvidence(
    [
      { file: 'src/components/sections/Recognition.tsx', id: 'E2' },
      { file: 'src/components/sections/CrossDomain.tsx', id: 'E8', plate: 'knowledge' },
    ],
    evidenceLedger,
  )
  assert.match(errors.join('\n'), /E2 status is REFRESH/)
  assert.match(errors.join('\n'), /E8 status is NEEDS RESEARCH/)
})

test('two footnotes in one section fail; two plates do not', () => {
  const doubled = auditEvidence(
    [
      { file: 'src/components/sections/FailureState.tsx', id: 'E12' },
      { file: 'src/components/sections/FailureState.tsx', id: 'E12' },
    ],
    evidenceLedger,
  )
  assert.match(doubled.join('\n'), /one Evidence per section file/)

  const plates = auditEvidence(
    [
      { file: 'src/components/sections/CrossDomain.tsx', id: 'E9', plate: 'support' },
      { file: 'src/components/sections/CrossDomain.tsx', id: 'E7', plate: 'revenue' },
    ],
    evidenceLedger,
  )
  assert.deepEqual(plates, [])
})
