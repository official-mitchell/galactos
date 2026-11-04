/* 2026-11-03: MAX-1000 EvidenceRail. Labels and values are props. Case data arrives in MAX-1001. */

import type { DiagramOrientation } from './types'

export type EvidenceItem = { label: string; value: string }

type EvidenceRailProps = {
  items: EvidenceItem[]
  orientation?: DiagramOrientation
}

export function EvidenceRail({ items, orientation = 'horizontal' }: EvidenceRailProps) {
  return (
    <div
      className={`diagram-part diagram-rail ${orientation === 'vertical' ? 'diagram-rail--vertical' : ''}`}
      data-orientation={orientation}
    >
      {items.map((item) => (
        <div key={item.label}>
          <span className="text-label">{item.label}</span>{' '}
          <span className="text-meta">{item.value}</span>
        </div>
      ))}
    </div>
  )
}
