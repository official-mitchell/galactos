/* 2026-11-03: MAX-996 dev-only capture bridge.
   Accepts ?motion=final|reduced|live and exposes window.__galactos.
   No motion library is installed. ScrollTrigger.refresh runs only when that global exists.
   seek() sets data-motion-progress and scrolls within the section. motion=final marks every section at progress 1. */
export function installGalactosHarness(): void {
  if (window.__galactos) return

  const params = new URLSearchParams(location.search)
  const motion = params.get('motion')
  if (motion === 'final' || motion === 'reduced' || motion === 'live') {
    document.documentElement.dataset.motion = motion
  }

  const ready = (async () => {
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
    })
    await document.fonts.ready
    await Promise.all(
      [...document.images].map((img) => (img.decode ? img.decode().catch(() => undefined) : Promise.resolve())),
    )
    const scrollTrigger = window.ScrollTrigger
    if (scrollTrigger && typeof scrollTrigger.refresh === 'function') {
      scrollTrigger.refresh()
      document.documentElement.dataset.scrollTrigger = 'refreshed'
    } else {
      document.documentElement.dataset.scrollTrigger = 'absent'
    }
    if (document.documentElement.dataset.motion === 'final') {
      document.querySelectorAll('section[id^="section-"]').forEach((el) => {
        el.setAttribute('data-motion-progress', '1')
      })
    }
    document.documentElement.dataset.galactosReady = 'true'
  })()

  window.__galactos = {
    ready,
    seek(sectionId, p) {
      const progress = clamp01(p)
      const el = document.getElementById(sectionId)
      if (!el) throw new Error(`Unknown section: ${sectionId}`)
      el.setAttribute('data-motion-progress', String(progress))
      const top = el.getBoundingClientRect().top + window.scrollY
      const travel = Math.max(0, el.offsetHeight - window.innerHeight)
      window.scrollTo({ top: top + travel * progress, left: 0, behavior: 'instant' })
      document.documentElement.dataset.seekSection = sectionId
      document.documentElement.dataset.seekProgress = String(progress)
    },
    setMode(mode) {
      if (mode !== 'light' && mode !== 'dark') throw new Error(`Unknown mode: ${mode}`)
      document.documentElement.classList.toggle('dark', mode === 'dark')
      try {
        localStorage.setItem('galactos-theme', mode)
      } catch {
        /* private mode */
      }
      window.dispatchEvent(new CustomEvent('galactos:set-mode', { detail: mode }))
    },
  }
}

function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0
  return Math.min(1, Math.max(0, value))
}
