/* 2026-11-04: MAX-1017 hero_cta_click and hero_view.
   2026-11-04: MAX-1013 nav_click and MAX-1015 evidence_click.
   nav_click and hero events forward to window.plausible when that script is present.
   evidence_click is queued on window.dataLayer. No new vendor. */

export type AnalyticsEvent =
  | { name: 'nav_click'; target: string }
  | { name: 'hero_cta_click'; id: string }
  | { name: 'hero_view' }

export type EvidenceClickEvent = {
  event: 'evidence_click'
  id: string
}

type PlausibleFn = (name: string, opts?: { props: Record<string, string> }) => void

export function trackEvent(event: AnalyticsEvent): void {
  if (typeof window === 'undefined') return
  const props: Record<string, string> =
    event.name === 'hero_view' ? {} : event.name === 'hero_cta_click' ? { id: event.id } : { target: event.target }
  const plausible = (window as Window & { plausible?: PlausibleFn }).plausible
  plausible?.(event.name, { props })
  window.dispatchEvent(new CustomEvent('galactos:analytics', { detail: { name: event.name, ...props } }))
}

export function trackEvidenceClick(id: string): void {
  if (typeof window === 'undefined') return
  const target = window as Window & { dataLayer?: EvidenceClickEvent[] }
  target.dataLayer = target.dataLayer ?? []
  target.dataLayer.push({ event: 'evidence_click', id })
}
