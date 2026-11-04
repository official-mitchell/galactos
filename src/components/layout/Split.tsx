/* 2026-11-03: MAX-999 Split. One column at max-width 768px. stickyLeft pins the first column. */

import type { ReactNode } from 'react'

export type SplitRatio = '45/55' | '40/60' | '50/50'

const ratioClass: Record<SplitRatio, string> = {
  '45/55': 'layout-split--45-55',
  '40/60': 'layout-split--40-60',
  '50/50': 'layout-split--50-50',
}

type SplitProps = {
  ratio?: SplitRatio
  stickyLeft?: boolean
  left: ReactNode
  right: ReactNode
}

export function Split({ ratio = '50/50', stickyLeft = false, left, right }: SplitProps) {
  return (
    <div className={`layout-split ${ratioClass[ratio]}`}>
      <div className={stickyLeft ? 'layout-split__sticky' : undefined}>{left}</div>
      <div>{right}</div>
    </div>
  )
}
