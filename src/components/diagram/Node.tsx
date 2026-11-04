/* 2026-11-03: MAX-1000 Node. pending is outline plus a dashed reticle. Sizes sm 16 / md 24 / lg 32. */

import type { DiagramOrientation } from './types'

export type NodeKind = 'intent' | 'success' | 'expected' | 'evidence' | 'anomaly' | 'missing' | 'pending'
export type NodeSize = 'sm' | 'md' | 'lg'
export type NodeState = 'outline' | 'resolved'

const SIZE: Record<NodeSize, number> = { sm: 16, md: 24, lg: 32 }

const FILL: Record<NodeKind, string> = {
  intent: 'var(--node-intent)',
  success: 'var(--accent-success)',
  expected: 'var(--node-outline)',
  evidence: 'var(--accent-info)',
  anomaly: 'var(--accent-divergence)',
  missing: 'var(--text-muted)',
  pending: 'transparent',
}

type NodeProps = {
  kind: NodeKind
  size?: NodeSize
  state?: NodeState
  orientation?: DiagramOrientation
}

export function Node({ kind, size = 'md', state = 'outline', orientation = 'horizontal' }: NodeProps) {
  const px = SIZE[size]
  const pending = kind === 'pending'
  const outlined = state === 'outline' || pending
  const box = pending ? px + 20 : px
  const stroke = FILL[kind] === 'transparent' ? 'var(--node-outline)' : FILL[kind]

  return (
    <span
      className={`diagram-part diagram-node diagram-part--${orientation}`}
      data-node-kind={kind}
      data-node-state={pending ? 'outline' : state}
      data-orientation={orientation}
      style={{ width: box, height: box }}
      role="img"
      aria-label={`${kind} node ${pending ? 'outline' : state}`}
    >
      {pending ? (
        <svg className="diagram-node__reticle" viewBox="0 0 52 52" aria-hidden="true">
          <circle cx="26" cy="26" r="22" fill="none" stroke="var(--node-outline)" strokeWidth="1" strokeDasharray="3 3" />
          <path d="M26 2 V8 M26 44 V50 M2 26 H8 M44 26 H50" stroke="var(--node-outline)" strokeWidth="1" />
        </svg>
      ) : null}
      <span
        className="diagram-node__core"
        style={{
          width: px,
          height: px,
          background: outlined ? 'transparent' : FILL[kind],
          border: `1.5px ${kind === 'missing' ? 'dashed' : 'solid'} ${stroke}`,
        }}
      />
    </span>
  )
}
