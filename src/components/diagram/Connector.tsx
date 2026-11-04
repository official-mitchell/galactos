/* 2026-11-03: MAX-1000 Connector. SVG line from caller coordinates. No GSAP and no DrawSVG. */

import { useId } from 'react'
import type { DiagramOrientation } from './types'

export type ConnectorKind = 'solid' | 'dashed' | 'divergence' | 'elbow'

type ConnectorProps = {
  kind?: ConnectorKind
  x1: number
  y1: number
  x2: number
  y2: number
  orientation?: DiagramOrientation
}

export function Connector({
  kind = 'solid',
  x1,
  y1,
  x2,
  y2,
  orientation = 'horizontal',
}: ConnectorProps) {
  const markerId = useId().replace(/:/g, '')
  const stroke = kind === 'divergence' ? 'var(--accent-divergence)' : 'var(--text-primary)'
  const dash = kind === 'dashed' || kind === 'divergence' ? '4 3' : undefined
  const width = Math.max(x1, x2, 1) + 8
  const height = Math.max(y1, y2, 1) + 8

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
          d={`M ${x1} ${y1} H ${x2} V ${y2}`}
          fill="none"
          stroke={stroke}
          strokeWidth="1"
          markerEnd={`url(#${markerId})`}
        />
      ) : (
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={stroke}
          strokeWidth="1"
          strokeDasharray={dash}
          markerEnd={`url(#${markerId})`}
        />
      )}
    </svg>
  )
}
