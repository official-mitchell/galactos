/* 2026-11-04: MAX-1014 placeholder seam anchors. Start and end share --seam-x.
   Phase 5 replaces these with the real S2 node and the S4 eyebrow. */
import type { ReactNode } from 'react'

type SeamAnchorProps = {
  id: string
  end?: boolean
  role?: 'node' | 'eyebrow'
  label?: ReactNode
}

export function SeamAnchor({ id, end = false, role, label }: SeamAnchorProps) {
  const node = role === 'node'
  return (
    <span
      className={`seam-anchor seam-anchor--${end ? 'end' : 'start'}${node ? ' seam-anchor--node' : ''}`}
      data-seam-start={end ? undefined : id}
      data-seam-end={end ? id : undefined}
      data-seam-placeholder={role}
    >
      {label ? <span className="text-label seam-anchor__label">{label}</span> : null}
    </span>
  )
}
