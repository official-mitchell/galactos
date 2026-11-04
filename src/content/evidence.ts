/* 2026-11-03: MAX-1001 citation placeholders. Not a client record. */

export type EvidenceCitation = {
  id: string
  sectionId: string
  label: string
  note: string
}

export const evidenceCitations: EvidenceCitation[] = [
  {
    id: 'cite-divergence-1',
    sectionId: 'section-divergence',
    label: 'Citation placeholder',
    note: 'Illustrative source. Replace when a real citation is approved.',
  },
]
