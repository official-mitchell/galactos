/* 2026-11-04: MAX-1015 typed event helper. No analytics vendor is installed yet.
   Changelog: 2026-11-04 added track() and evidence_click. */

export type EvidenceClickEvent = {
  event: 'evidence_click'
  id: string
}

type TrackEvent = EvidenceClickEvent

export function track(payload: TrackEvent): void {
  if (typeof window === 'undefined') return
  const target = window as Window & { dataLayer?: TrackEvent[] }
  target.dataLayer = target.dataLayer ?? []
  target.dataLayer.push(payload)
}

export function trackEvidenceClick(id: string): void {
  track({ event: 'evidence_click', id })
}
