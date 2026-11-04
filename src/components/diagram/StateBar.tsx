/* 2026-11-03: MAX-1000 StateBar. Success tint, 1px divider, divergence tint. */

import type { DiagramOrientation } from './types'

export function StateBar({ orientation = 'horizontal' }: { orientation?: DiagramOrientation }) {
  return (
    <div
      className={`diagram-part diagram-statebar ${orientation === 'vertical' ? 'diagram-statebar--vertical' : ''}`}
      data-orientation={orientation}
      role="img"
      aria-label="Success and divergence zones"
    >
      <div className="diagram-statebar__success" />
      <div className="diagram-statebar__divider" />
      <div className="diagram-statebar__divergence" />
    </div>
  )
}
