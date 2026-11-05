/* 2026-11-04: MAX-1006 store, MAX-1007 pause toggle. Key: galactos-motion. */
export type MotionState = 'paused' | 'live'

const KEY = 'galactos-motion'
const listeners = new Set<() => void>()

function readStored(): MotionState {
  try {
    return localStorage.getItem(KEY) === 'paused' ? 'paused' : 'live'
  } catch {
    return 'live'
  }
}

let state: MotionState = typeof localStorage === 'undefined' ? 'live' : readStored()

export function motionState(): MotionState {
  return state
}

export function isMotionPaused(): boolean {
  return state === 'paused'
}

export function subscribeMotion(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function setMotionPaused(paused: boolean): void {
  state = paused ? 'paused' : 'live'
  try {
    localStorage.setItem(KEY, state)
  } catch {
    /* private mode */
  }
  const plausible = (window as Window & { plausible?: (name: string, opts?: { props: Record<string, string> }) => void }).plausible
  plausible?.('motion_toggle', { props: { state } })
  listeners.forEach((listener) => listener())
}
