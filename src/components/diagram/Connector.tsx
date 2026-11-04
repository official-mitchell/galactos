/* 2026-11-03: MAX-1000 Connector. SVG line from caller coordinates.
   2026-11-04: optional from/to refs are measured with ResizeObserver. Stroke draw is CSS.
   DrawSVG arrives with GSAP in Phase 3. */

import { useEffect, useId, useState } from 'react'
import type { RefObject } from 'react'
import type { DiagramOrientation } from './types'

export type ConnectorKind = 'solid' | 'dashed' | 'divergence' | 'elbow'

type ConnectorProps = {
  kind?: ConnectorKind
  x1?: number
  y1?: number
  x2?: number
  y2?: number
  from?: RefObject<HTMLElement | null>
  to?: RefObject<HTMLElement | null>
  orientation?: DiagramOrientation
}

export function Connector({
  kind = 'solid',
  x1 = 0,
  y1 = 0,
  x2 = 0,
  y2 = 0,
  from,
  to,
  orientation = 'horizontal',
}: ConnectorProps) {
  const markerId = useId().replace(/:/g, '')
  const [measured, setMeasured] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null)

  useEffect(() => {
    const start = from?.current
    const end = to?.current
    if (!start || !end) return
    const measure = () => {
      const a = start.getBoundingClientRect()
      const b = end.getBoundingClientRect()
      const host = start.offsetParent instanceof HTMLElement ? start.offsetParent.getBoundingClientRect() : a
      setMeasured({
        x1: a.left + a.width / 2 - host.left,
        y1: a.top + a.height / 2 - host.top,
        x2: b.left + b.width / 2 - host.left,
        y2: b.top + b.height / 2 - host.top,
      })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(start)
    observer.observe(end)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [from, to])

  const points = measured ?? { x1, y1, x2, y2 }
  const stroke = kind === 'divergence' ? 'var(--accent-divergence)' : 'var(--text-primary)'
  const dash = kind === 'dashed' || kind === 'divergence' ? '4 3' : undefined
  const width = Math.max(points.x1, points.x2, 1) + 8
  const height = Math.max(points.y1, points.y2, 1) + 8

  return (
    <svg
      className={`diagram-connector diagram-part--${orientation}`}
      data-connector-kind={kind}
      data-orientation={orientation}
      width={width}
      height={height}
      aria-hidden="true"
    >
      <defs>
        <marker id={markerId} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0 0 L6 3 L0 6" fill="none" stroke={stroke} />
        </marker>
      </defs>
      {kind === 'elbow' ? (
        <path
          d={`M ${points.x1} ${points.y1} H ${points.x2} V ${points.y2}`}
          fill="none"
          stroke={stroke}
          strokeWidth="1"
          markerEnd={`url(#${markerId})`}
        />
      ) : (
        <line
          x1={points.x1}
          y1={points.y1}
          x2={points.x2}
          y2={points.y2}
          stroke={stroke}
          strokeWidth="1"
          strokeDasharray={dash}
          markerEnd={`url(#${markerId})`}
        />
      )}
    </svg>
  )
}
