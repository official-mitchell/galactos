/* 2026-11-05: MAX-1023–1025 s7_view, s8_view, s9_view, method_replay.
   2026-11-05: MAX-1022 s6_view and signal_active.
   2026-11-05: MAX-1020 s4_view and MAX-1021 s5_view on the same analytics event.
   2026-11-04: MAX-1013 nav_click and MAX-1015 evidence_click.
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

export function trackSectionView(name: 's4_view' | 's5_view' | 's6_view' | 's7_view' | 's8_view' | 's9_view'): void {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent('galactos:analytics', { detail: { name } }))
}

export function trackMethodReplay(): void {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent('galactos:analytics', { detail: { name: 'method_replay' } }))
}

export function trackSignalActive(n: number): void {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent('galactos:analytics', { detail: { name: 'signal_active', n } }))
}

export function trackEvidenceClick(id: string): void {
  if (typeof window === 'undefined') return
  const target = window as Window & { dataLayer?: EvidenceClickEvent[] }
  target.dataLayer = target.dataLayer ?? []
  target.dataLayer.push({ event: 'evidence_click', id })
}
