/* 2026-11-04: MAX-1015 Appendix A ledger. Paraphrases only. REFRESH and NEEDS RESEARCH must not render.
   2026-11-03: MAX-1001 citation placeholders. Not a client record.
   Changelog: 2026-11-04 replaced placeholders with Appendix A ids and statuses. */

export type EvidenceStatus = 'OK' | 'REFRESH' | 'NEEDS RESEARCH'

export type EvidenceRecord = {
  id: string
  status: EvidenceStatus
  /** diagram-system label, for example RESEARCH · 2025 */
  kind: string
  /** One paraphrased sentence. Never a quotation. At most 25 words. */
  label: string
  href: string
  sectionId: string
  plate?: 'support' | 'revenue' | 'knowledge'
}

export const evidenceLedger: EvidenceRecord[] = [
  {
    id: 'E1',
    status: 'OK',
    kind: 'RESEARCH · 2025',
    label: 'A customer-service benchmark scores the agent on the final data state, not the conversation.',
    href: 'https://arxiv.org/abs/2406.12045',
    sectionId: 'section-standard',
  },
  {
    id: 'E2',
    status: 'REFRESH',
    kind: 'RESEARCH · 2024',
    label: 'A 2024 model that solved a task once often failed the same task on later tries.',
    href: 'https://sierra.ai/de/blog/benchmarking-ai-agents',
    sectionId: 'section-recognition',
  },
  {
    id: 'E3',
    status: 'OK',
    kind: 'RESEARCH · 2025',
    label: 'A review of multi-agent traces lists task verification as one failure category.',
    href: 'https://arxiv.org/abs/2503.13657',
    sectionId: 'section-mechanism',
  },
  {
    id: 'E4',
    status: 'OK',
    kind: 'FORECAST · 2025',
    label: 'One industry forecast expects many agentic projects to be canceled over cost, value, and risk.',
    href: 'https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027',
    sectionId: 'section-intervention',
  },
  {
    id: 'E5',
    status: 'OK',
    kind: 'ADJACENT · 2024',
    label: 'A tribunal held a company responsible for wrong information its website chatbot gave a customer.',
    href: 'https://www.americanbar.org/groups/business_law/resources/business-law-today/2024-february/bc-tribunal-confirms-companies-remain-liable-information-provided-ai-chatbot/',
    sectionId: 'reserve',
  },
  {
    id: 'E6',
    status: 'OK',
    kind: 'LICENSE · 2025',
    label: 'The animation library and its plugins are free to use, including in commercial products.',
    href: 'https://gsap.com/standard-license',
    sectionId: 'build',
  },
  {
    id: 'E7',
    status: 'OK',
    kind: 'ADJACENT · 2025',
    label: 'A vendor playbook treats bad data, slow routing, and wrong assignment as lead-routing problems.',
    href: 'https://www.leandata.com/wp-content/uploads/2025/06/B2B-Lead-Response-Time-Playbook-eBook-062525.pdf',
    sectionId: 'section-cross-domain',
    plate: 'revenue',
  },
  {
    id: 'E8',
    status: 'NEEDS RESEARCH',
    kind: 'UNSOURCED',
    label: 'A knowledge answer can rest on stale, conflicting, or unauthorized sources.',
    href: '',
    sectionId: 'section-cross-domain',
    plate: 'knowledge',
  },
  {
    id: 'E9',
    status: 'OK',
    kind: 'VENDOR · 2026',
    label: 'A help-desk vendor separates contained resolutions from resolutions that pass an extra check.',
    href: 'https://support.zendesk.com/hc/en-us/articles/9570369117338-About-automated-resolution-tiers',
    sectionId: 'section-cross-domain',
    plate: 'support',
  },
  {
    id: 'E10',
    status: 'OK',
    kind: 'SURVEY · 2025',
    label: 'A consumer study found AI customer service missed more often than AI use in general.',
    href: 'https://www.qualtrics.com/articles/news/ai-powered-customer-service-fails-at-four-times-the-rate-of-other-tasks/',
    sectionId: 'section-recognition',
  },
  {
    id: 'E11',
    status: 'OK',
    kind: 'RESERVE · 2026',
    label: 'A vendor sample found many tickets passed from AI to a person were later abandoned.',
    href: 'https://www.gorgias.com/research/the-cheapest-ticket-is-the-one-a-human-never-touches',
    sectionId: 'reserve',
  },
  {
    id: 'E12',
    status: 'OK',
    kind: 'GUIDANCE · 2025',
    label: 'Completion should be checked in the system that holds the work, not only in the tool reply.',
    href: 'https://arize.com/guides/ai-agent-handbook/agent-observability/',
    sectionId: 'section-divergence',
  },
]

export const evidenceById: Record<string, EvidenceRecord> = Object.fromEntries(
  evidenceLedger.map((record) => [record.id, record]),
)

export function wordCount(text: string): number {
  const trimmed = text.trim()
  if (!trimmed) return 0
  return trimmed.split(/\s+/).length
}
