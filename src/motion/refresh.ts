/* 2026-11-04: MAX-1009. Recalculate ScrollTrigger after fonts and image decode. */
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function bindScrollTriggerRefresh(): void {
  const refresh = () => ScrollTrigger.refresh()
  void document.fonts?.ready.then(refresh)
  window.addEventListener('load', () => {
    document.querySelectorAll('img').forEach((img) => {
      if (img.complete) return
      void img.decode?.().then(refresh).catch(() => {})
    })
  })
}
