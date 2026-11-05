/* 2026-11-04: MAX-1009. Below-fold triggers are created only within 600px of the viewport. */
const MARGIN = '600px'

export function whenNear(el: Element, run: () => void): () => void {
  if (typeof IntersectionObserver === 'undefined') {
    run()
    return () => {}
  }
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return
      observer.disconnect()
      run()
    },
    { rootMargin: MARGIN },
  )
  observer.observe(el)
  return () => observer.disconnect()
}
