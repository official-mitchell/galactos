/* 2026-11-03: MAX-1000 TraceStep. compact hides detail; full shows it. */

import { StatusPill, type StatusPillState } from './StatusPill'
import type { DiagramOrientation } from './types'

type TraceStepProps = {
  system: string
  action: string
  detail?: string
  time: string
  status: StatusPillState
  density?: 'compact' | 'full'
  orientation?: DiagramOrientation
}

export function TraceStep({
  system,
  action,
  detail,
  time,
  status,
  density = 'full',
  orientation = 'horizontal',
}: TraceStepProps) {
  return (
    <div className={`diagram-part diagram-trace diagram-part--${orientation}`} data-orientation={orientation} data-density={density}>
      <div className="diagram-trace__chip" aria-hidden="true" />
      {orientation === 'vertical' ? <div className="diagram-trace__leader" /> : null}
      <div>
        <div className="text-label">{system}</div>
        <div className="text-card-title">{action}</div>
        {density === 'full' && detail ? <p className="text-body">{detail}</p> : null}
        <div className="text-meta">{time}</div>
        <StatusPill state={status} orientation={orientation} />
      </div>
    </div>
  )
}
