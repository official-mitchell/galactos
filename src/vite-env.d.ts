/* 2026-11-03: Vite client types for the root app.
   2026-11-03: MAX-996 dev capture bridge on window.__galactos. */
/// <reference types="vite/client" />

interface GalactosHarness {
  ready: Promise<void>
  seek: (sectionId: string, p: number) => void
  setMode: (m: 'light' | 'dark') => void
}

interface Window {
  __galactos?: GalactosHarness
  ScrollTrigger?: { refresh: () => void }
}
