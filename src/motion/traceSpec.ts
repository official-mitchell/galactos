/* 2026-11-04: MAX-1006. Beat order for useTrace. Divergence waits DIVERGENCE_LAG after the last success beat. */
import { DIVERGENCE_LAG } from './tokens.ts'

export const BEAT_TYPES = ['node', 'connector', 'label', 'pill', 'hold', 'divergence'] as const

export type BeatType = (typeof BEAT_TYPES)[number]

export type TraceBeat = {
  type: BeatType
  target: string
  at: number
  dur: number
}

const SUCCESS = new Set<BeatType>(['node', 'connector', 'label', 'pill', 'hold'])

/** Returns an error string, or null when the spec is playable. */
export function traceOrderError(beats: TraceBeat[]): string | null {
  let lastAt = -Infinity
  let lastSuccessEnd = -Infinity
  let sawSuccess = false
  for (const beat of beats) {
    if (!BEAT_TYPES.includes(beat.type)) return `unknown beat ${beat.type}`
    if (beat.at < lastAt) return `beat ${beat.target} starts before the previous beat`
    lastAt = beat.at
    if (SUCCESS.has(beat.type)) {
      sawSuccess = true
      lastSuccessEnd = Math.max(lastSuccessEnd, beat.at + beat.dur)
    }
    if (beat.type === 'divergence') {
      if (!sawSuccess) return 'divergence beat has no success beat before it'
      if (beat.at + 1e-9 < lastSuccessEnd + DIVERGENCE_LAG) {
        return `divergence beat is earlier than the last success beat + ${DIVERGENCE_LAG}s`
      }
    }
  }
  return null
}
