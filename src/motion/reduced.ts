/* 2026-11-04: MAX-1007. Reduced motion and capture modes finish timelines instead of playing them. */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  const mode = document.documentElement.getAttribute('data-motion')
  if (mode === 'reduced' || mode === 'final') return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function motionDebug(): boolean {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get('debug') === 'motion'
}
