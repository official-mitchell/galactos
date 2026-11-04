/* 2026-11-03: MAX-1000 Annotation. Divergence uses an orange border and dot. Copy stays --text-primary. */

import type { ReactNode } from 'react'
import type { DiagramOrientation } from './types'

type AnnotationProps = {
  tone?: 'default' | 'divergence'
  orientation?: DiagramOrientation
  children: ReactNode
}

export function Annotation({ tone = 'default', orientation = 'horizontal', children }: AnnotationProps) {
  return (
    <div
      className={`diagram-part diagram-annotation diagram-part--${orientation} ${tone === 'divergence' ? 'diagram-annotation--divergence' : ''}`}
      data-orientation={orientation}
    >
      <span className="diagram-annotation__dot" aria-hidden="true" />
      <div className="text-body">{children}</div>
    </div>
  )
}
