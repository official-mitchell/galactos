/* 2026-11-03: MAX-1000 IllustrativeTag. Required wherever a diagram shows example case data. */

import type { DiagramOrientation } from './types'

export function IllustrativeTag({ orientation = 'horizontal' }: { orientation?: DiagramOrientation }) {
  return (
    <span className={`diagram-tag text-label diagram-part--${orientation}`} data-orientation={orientation}>
      Illustrative
    </span>
  )
}
