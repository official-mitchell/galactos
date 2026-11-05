/* 2026-11-04: MAX-1013. Typed analytics-style events. Forwards to the existing
   window.plausible queue when that script is present. No new vendor. */

export type AnalyticsEvent = {
  name: 'nav_click'
  target: string
}

type PlausibleFn = (name: string, opts?: { props: Record<string, string> }) => void

export function trackEvent(event: AnalyticsEvent): void {
  if (typeof window === 'undefined') return
  const props = { target: event.target }
  const plausible = (window as Window & { plausible?: PlausibleFn }).plausible
  plausible?.(event.name, { props })
  window.dispatchEvent(new CustomEvent('galactos:analytics', { detail: { name: event.name, ...props } }))
}
