/* 2026-11-04: MAX-1009. Record LCP, INP, and CLS in dev logs and as plausible events in production. */
type Vital = { name: 'LCP' | 'INP' | 'CLS'; value: number }

function report(vital: Vital): void {
  if (import.meta.env.DEV) console.log(`${vital.name} ${vital.value}`)
  const plausible = (window as Window & { plausible?: (name: string, opts?: { props: Record<string, string> }) => void }).plausible
  plausible?.('web_vital', { props: { name: vital.name, value: String(Math.round(vital.value)) } })
}

export function captureWebVitals(): void {
  if (typeof PerformanceObserver === 'undefined') return
  try {
    const lcp = new PerformanceObserver((list) => {
      const last = list.getEntries().at(-1)
      if (last) report({ name: 'LCP', value: last.startTime })
    })
    lcp.observe({ type: 'largest-contentful-paint', buffered: true })

    let cls = 0
    const shifts = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const shift = entry as PerformanceEntry & { value?: number; hadRecentInput?: boolean }
        if (!shift.hadRecentInput && typeof shift.value === 'number') cls += shift.value
      }
      report({ name: 'CLS', value: cls })
    })
    shifts.observe({ type: 'layout-shift', buffered: true })

    const inp = new PerformanceObserver((list) => {
      const last = list.getEntries().at(-1) as PerformanceEntry & { duration?: number }
      if (last && typeof last.duration === 'number') report({ name: 'INP', value: last.duration })
    })
    inp.observe({ type: 'event', buffered: true, durationThreshold: 40 } as PerformanceObserverInit)
  } catch {
    /* observer type unsupported */
  }
}
