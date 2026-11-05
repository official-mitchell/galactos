/* 2026-11-03: Vite client types for the root app.
   2026-11-03: MAX-996 dev capture bridge on window.__galactos.
   2026-11-03: MAX-1003 theme source flag set by the index.html script.
   2026-11-04: MAX-1013. Optional plausible queue used by trackEvent. */
/// <reference types="vite/client" />

interface GalactosHarness {
  ready: Promise<void>
  seek: (sectionId: string, p: number) => void
  setMode: (m: 'light' | 'dark') => void
}

interface Window {
  __galactos?: GalactosHarness
  __galactosThemeSource?: 'stored' | 'system'
  ScrollTrigger?: { refresh: () => void }
  plausible?: (name: string, opts?: { props: Record<string, string> }) => void
}
