/* 2026-11-03: single source of section anchors. DOM ids still match the Make export until the revamp.
   2026-11-04: MAX-1011 readerQuestion and seam on each section. Owner read-through stays unsigned.
   2026-11-04: MAX-1013 nav labels resolve through navAnchors (S7, S9, S10, S11, S4). */

export type SectionEntry = {
  number: string
  id: string
  act: 'I' | 'II' | 'III' | 'IV' | 'V'
  label: string
  component: string
  /** The single reader question this section answers. */
  readerQuestion: string
  /** Handoff into the next seam. Absent when the checklist names no seam. */
  seam?: string
}

/** Checklist §4.1 item 12. Do not introduce these layouts in section markup. */
export const bannedProductPagePatterns = [
  'feature-card grids',
  'icon-title-text rows',
  'pricing-card styling',
] as const

/** Checklist §1.1 and §4.1. `id` is the current anchor; do not invent new hashes until shell nav is rebuilt. */
export const sections: SectionEntry[] = [
  {
    number: '01',
    id: 'section-hero',
    act: 'I',
    label: 'Hero',
    component: 'Hero',
    readerQuestion: "Done isn't done?",
    seam: 'trace continues down',
  },
  {
    number: '02',
    id: 'section-divergence',
    act: 'I',
    label: 'Failure state',
    component: 'FailureState',
    readerQuestion: 'Show me.',
    seam: 'The business process did not complete.',
  },
  {
    number: '03',
    id: 'section-mechanism',
    act: 'I',
    label: 'Mechanism',
    component: 'Mechanism',
    readerQuestion: 'Why does this happen?',
    seam: "a different standard for 'done'",
  },
  {
    number: '04',
    id: 'section-verification',
    act: 'II',
    label: 'New standard',
    component: 'NewStandard',
    readerQuestion: 'What is the standard?',
    seam: 'signature line',
  },
  {
    number: '05',
    id: 'section-proof',
    act: 'II',
    label: 'Cross-domain',
    component: 'CrossDomain',
    readerQuestion: 'Is this only support?',
    seam: 'does this apply to us?',
  },
  {
    number: '06',
    id: 'section-diagnostic',
    act: 'III',
    label: 'Recognition',
    component: 'Recognition',
    readerQuestion: 'Is this us?',
    seam: 'boundary line',
  },
  {
    number: '07',
    id: 'section-intervention',
    act: 'IV',
    label: 'Intervention',
    component: 'Intervention',
    readerQuestion: 'What is the engagement?',
    seam: 'scope box',
  },
  {
    number: '08',
    id: 'section-deliverables',
    act: 'IV',
    label: 'Outputs',
    component: 'Outputs',
    readerQuestion: 'What do I leave with?',
  },
  {
    number: '09',
    id: 'section-method',
    act: 'IV',
    label: 'Method',
    component: 'Method',
    readerQuestion: 'How is it done?',
  },
  {
    number: '10',
    id: 'section-credibility',
    act: 'V',
    label: 'Credibility',
    component: 'Credibility',
    readerQuestion: 'Why trust this?',
  },
  {
    number: '11',
    id: 'section-cta',
    act: 'V',
    label: 'Final CTA',
    component: 'FinalCta',
    readerQuestion: "What's next?",
    seam: 'spine terminal node',
  },
]

export function sectionById(id: string): SectionEntry {
  const entry = sections.find((section) => section.id === id)
  if (!entry) throw new Error(`Unknown section id: ${id}`)
  return entry
}

/** DOM markers so a section carries exactly one reader question and its seam handoff. */
export function storySectionProps(id: string): {
  'data-reader-question': string
  'data-seam'?: string
} {
  const entry = sectionById(id)
  return {
    'data-reader-question': entry.readerQuestion,
    ...(entry.seam ? { 'data-seam': entry.seam } : {}),
  }
}

/** Checklist §4.3. Keys are nav labels; values are section numbers (S7 is Intervention). */
const NAV_SECTION_NUMBERS = {
  diagnostic: '07',
  method: '09',
  about: '10',
  workflow: '11',
  verification: '04',
  hero: '01',
} as const

export type NavAnchorKey = keyof typeof NAV_SECTION_NUMBERS

function sectionByNumber(number: string): SectionEntry {
  const entry = sections.find((section) => section.number === number)
  if (!entry) throw new Error(`Missing section ${number}`)
  return entry
}

export const navAnchors: Record<NavAnchorKey, SectionEntry> = {
  diagnostic: sectionByNumber(NAV_SECTION_NUMBERS.diagnostic),
  method: sectionByNumber(NAV_SECTION_NUMBERS.method),
  about: sectionByNumber(NAV_SECTION_NUMBERS.about),
  workflow: sectionByNumber(NAV_SECTION_NUMBERS.workflow),
  verification: sectionByNumber(NAV_SECTION_NUMBERS.verification),
  hero: sectionByNumber(NAV_SECTION_NUMBERS.hero),
}

export function sectionHref(key: NavAnchorKey): string {
  return `#${navAnchors[key].id}`
}

export function scrollTo(href: string): void {
  const id = href.startsWith('#') ? href.slice(1) : href
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}
