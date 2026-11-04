/* 2026-11-03: MAX-1000 Bracket. Divergence tone colors the mark, not the label. */

import type { DiagramOrientation } from './types'

type BracketProps = {
  label: string
  side?: 'top' | 'bottom' | 'left' | 'right'
  tone?: 'default' | 'divergence'
  orientation?: DiagramOrientation
}

export function Bracket({ label, side = 'top', tone = 'default', orientation = 'horizontal' }: BracketProps) {
  return (
    <div
      className={`diagram-part diagram-bracket diagram-part--${orientation} ${tone === 'divergence' ? 'diagram-bracket--divergence' : ''}`}
      data-side={side}
      data-orientation={orientation}
    >
      <span className="diagram-bracket__mark" aria-hidden="true" />
      <span className="text-label">{label}</span>
    </div>
  )
}
