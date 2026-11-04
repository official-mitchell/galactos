/* 2026-11-03: MAX-1000 DiagramFrame. Decorative SVG is aria-hidden. Ordered text is visually hidden. */

import type { ReactNode } from 'react'
import type { DiagramOrientation } from './types'

type DiagramFrameProps = {
  title: string
  desc: string
  sequence: string[]
  orientation?: DiagramOrientation
  children: ReactNode
}

export function DiagramFrame({ title, desc, sequence, orientation = 'horizontal', children }: DiagramFrameProps) {
  return (
    <figure className={`diagram-frame diagram-part--${orientation}`} aria-label={title} data-orientation={orientation}>
      <div aria-hidden="true">{children}</div>
      <figcaption className="text-meta">{desc}</figcaption>
      <ol className="visually-hidden">
        {sequence.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </figure>
  )
}
