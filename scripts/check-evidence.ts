/* 2026-11-04: MAX-1015 build gate. Fails when an Evidence id is missing or not OK.
   Changelog: 2026-11-04 added the evidence id and status audit. */

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { evidenceLedger, wordCount, type EvidenceRecord } from '../src/content/evidence.ts'

export type EvidenceUsage = {
  file: string
  id: string
  kind?: string
  label?: string
  href?: string
  plate?: string
}

const TAG = /<Evidence\b([^>]*)\/?>/g
const ATTR = /([\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g

export function parseEvidenceUsages(file: string, source: string): EvidenceUsage[] {
  const usages: EvidenceUsage[] = []
  for (const match of source.matchAll(TAG)) {
    const attrs: Record<string, string> = {}
    for (const attr of match[1].matchAll(ATTR)) {
      attrs[attr[1]] = attr[2] ?? attr[3] ?? ''
    }
    if (!attrs.id) {
      usages.push({ file, id: '' })
      continue
    }
    usages.push({
      file,
      id: attrs.id,
      kind: attrs.kind,
      label: attrs.label,
      href: attrs.href,
      plate: attrs.plate,
    })
  }
  return usages
}

function walk(dir: string, out: string[]) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) {
      walk(path, out)
      continue
    }
    if (path.endsWith('.tsx')) out.push(path)
  }
}

export function collectEvidenceUsages(root: string): EvidenceUsage[] {
  const files: string[] = []
  walk(root, files)
  return files.flatMap((file) => parseEvidenceUsages(file, readFileSync(file, 'utf8')))
}

export function auditEvidence(usages: EvidenceUsage[], ledger: EvidenceRecord[]): string[] {
  const byId = new Map(ledger.map((record) => [record.id, record]))
  const errors: string[] = []

  for (const record of ledger) {
    if (record.status === 'OK' && wordCount(record.label) > 25) {
      errors.push(`${record.id} label is ${wordCount(record.label)} words (max 25)`)
    }
    if (record.status === 'OK' && !record.href.startsWith('https://')) {
      errors.push(`${record.id} OK row needs an https href`)
    }
  }

  const seen = new Map<string, number>()

  for (const usage of usages) {
    const where = `${usage.file} id=${usage.id || '(missing)'}`
    if (!usage.id) {
      errors.push(`${where} has no id`)
      continue
    }
    const record = byId.get(usage.id)
    if (!record) {
      errors.push(`${where} is not in evidence.ts`)
      continue
    }
    if (record.status !== 'OK') {
      errors.push(`${where} status is ${record.status}`)
      continue
    }
    if (usage.kind !== undefined && usage.kind !== record.kind) {
      errors.push(`${where} kind does not match evidence.ts`)
    }
    if (usage.label !== undefined && usage.label !== record.label) {
      errors.push(`${where} label does not match evidence.ts`)
    }
    if (usage.label !== undefined && wordCount(usage.label) > 25) {
      errors.push(`${where} label is over 25 words`)
    }
    if (usage.href !== undefined && usage.href !== record.href) {
      errors.push(`${where} href does not match evidence.ts`)
    }

    const bucket = usage.plate ? `${usage.file}#${usage.plate}` : usage.file
    const count = (seen.get(bucket) ?? 0) + 1
    seen.set(bucket, count)
    if (count > 1) {
      errors.push(`${where} exceeds one Evidence per ${usage.plate ? 'plate' : 'section file'}`)
    }
  }

  return errors
}

const isMain = process.argv[1]?.endsWith('check-evidence.ts')

if (isMain) {
  const root = join(process.cwd(), 'src')
  const errors = auditEvidence(collectEvidenceUsages(root), evidenceLedger)
  if (errors.length) {
    console.error('evidence gate failed:\n' + errors.map((line) => `- ${line}`).join('\n'))
    process.exit(1)
  }
  console.log('evidence gate ok')
}
