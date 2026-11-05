/* 2026-11-04: MAX-1013 nav_click and MAX-1015 evidence_click.
   nav_click forwards to window.plausible when that script is present.
   evidence_click is queued on window.dataLayer. No new vendor. */

export type AnalyticsEvent = {
  name: 'nav_click'
  target: string
}

export type EvidenceClickEvent = {
  event: 'evidence_click'
  id: string
}

type PlausibleFn = (name: string, opts?: { props: Record<string, string> }) => void

export function trackEvent(event: AnalyticsEvent): void {
  if (typeof window === 'undefined') return
  const props = { target: event.target }
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
