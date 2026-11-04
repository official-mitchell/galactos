/* 2026-11-03: MAX-999 Container. 1200px content width, 24px gutters, 12 columns. */

import type { ReactNode } from 'react'

export function Container({ children }: { children?: ReactNode }) {
  return <div className="layout-container">{children}</div>
}
