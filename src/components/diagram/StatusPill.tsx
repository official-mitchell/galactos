/* 2026-11-03: MAX-1000 StatusPill. 4px radius, tint fill, label in --text-primary. */

import type { DiagramOrientation } from './types'

export type StatusPillState = 'completed' | 'ok' | 'closed' | 'not-completed' | 'divergence'

const LABEL: Record<StatusPillState, string> = {
  completed: 'Completed',
  ok: 'OK',
  closed: 'Closed',
  'not-completed': 'Not completed',
  divergence: 'Divergence',
}

type StatusPillProps = {
  state: StatusPillState
  orientation?: DiagramOrientation
}

export function StatusPill({ state, orientation = 'horizontal' }: StatusPillProps) {
  return (
    <span
      className={`diagram-part diagram-status diagram-status--${state} diagram-part--${orientation} text-label`}
      data-status={state}
      data-orientation={orientation}
    >
      <span aria-hidden="true">{state === 'divergence' ? '◌' : '●'}</span>
      {LABEL[state]}
    </span>
  )
}
