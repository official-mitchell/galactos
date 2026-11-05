/* 2026-11-04: MAX-1006 / D8. At most one looping element is active. */
let active: object | null = null

export function claimLoop(id: object): boolean {
  if (active && active !== id) return false
  active = id
  return true
}

export function releaseLoop(id: object): void {
  if (active === id) active = null
}

export function activeLoopCount(): number {
  return active ? 1 : 0
}

export function resetLoops(): void {
  active = null
}
