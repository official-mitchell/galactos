/* 2026-11-03: MAX-999 SectionHeader.
   Eyebrow is the caller’s string. The page pattern is `NN / LABEL`
   (example: `03 / LOCAL SUCCESS ≠ TERMINAL SUCCESS`). A 1px stone rule sits under it. */

import type { ReactNode } from 'react'

type SectionHeaderProps = {
  eyebrow: string
  title: ReactNode
  lede?: ReactNode
}

export function SectionHeader({ eyebrow, title, lede }: SectionHeaderProps) {
  return (
    <header className="layout-section-header">
      <p className="text-label layout-section-header__eyebrow">{eyebrow}</p>
      <div className="layout-section-header__rule" />
      <h2 className="text-section-title layout-section-header__title">{title}</h2>
      {lede ? <p className="text-body layout-section-header__lede">{lede}</p> : null}
    </header>
  )
}
