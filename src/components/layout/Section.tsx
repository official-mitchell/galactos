/* 2026-11-03: MAX-999 Section. Variant sets the surface; scroll-margin uses --header-offset. */

import type { ReactNode } from 'react'

export type SectionVariant = 'base' | 'emphasis'

type SectionProps = {
  id: string
  act: string
  number: string
  variant?: SectionVariant
  children?: ReactNode
}

export function Section({ id, act, number, variant = 'base', children }: SectionProps) {
  return (
    <section
      id={id}
      data-act={act}
      data-number={number}
      data-variant={variant}
      data-layout-section=""
      className={`layout-section layout-section--${variant}`}
    >
      {children}
    </section>
  )
}
