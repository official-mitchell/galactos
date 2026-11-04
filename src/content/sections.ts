/* 2026-11-03: single source of section anchors. DOM ids still match the Make export until the revamp. */

export type SectionEntry = {
  number: string
  id: string
  act: 'I' | 'II' | 'III' | 'IV' | 'V'
  label: string
  component: string
}

/** Checklist §1.1. `id` is the current anchor; do not invent new hashes until shell nav is rebuilt. */
export const sections: SectionEntry[] = [
  { number: '01', id: 'section-hero', act: 'I', label: 'Hero', component: 'Hero' },
  { number: '02', id: 'section-divergence', act: 'I', label: 'Failure state', component: 'FailureState' },
  { number: '03', id: 'section-mechanism', act: 'I', label: 'Mechanism', component: 'Mechanism' },
  { number: '04', id: 'section-verification', act: 'II', label: 'New standard', component: 'NewStandard' },
  { number: '05', id: 'section-proof', act: 'II', label: 'Cross-domain', component: 'CrossDomain' },
  { number: '06', id: 'section-diagnostic', act: 'III', label: 'Recognition', component: 'Recognition' },
  { number: '07', id: 'section-intervention', act: 'IV', label: 'Intervention', component: 'Intervention' },
  { number: '08', id: 'section-deliverables', act: 'IV', label: 'Outputs', component: 'Outputs' },
  { number: '09', id: 'section-method', act: 'IV', label: 'Method', component: 'Method' },
  { number: '10', id: 'section-credibility', act: 'V', label: 'Credibility', component: 'Credibility' },
  { number: '11', id: 'section-cta', act: 'V', label: 'Final CTA', component: 'FinalCta' },
]
