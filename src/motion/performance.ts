/* 2026-11-04: MAX-1009. Tweens may only use transform, opacity, stroke-dashoffset, and clip-path.
   will-change is set while a tween runs and cleared when it ends. No pinned sections. */
import gsap from 'gsap'

export const MOTION_PROPS = ['x', 'y', 'scale', 'rotation', 'opacity', 'strokeDashoffset', 'clipPath'] as const

const TIMING = new Set(['duration', 'ease', 'stagger', 'delay', 'paused', 'repeat', 'overwrite'])

export function assertMotionVars(vars: object): void {
  for (const key of Object.keys(vars)) {
    if (TIMING.has(key)) continue
    if (!(MOTION_PROPS as readonly string[]).includes(key)) {
      throw new Error(`Motion may not animate "${key}"`)
    }
  }
}

export function withWillChange<T extends gsap.core.Animation>(animation: T, targets: gsap.TweenTarget): T {
  const previousStart = animation.eventCallback('onStart') as (() => void) | undefined
  const previousComplete = animation.eventCallback('onComplete') as (() => void) | undefined
  animation.eventCallback('onStart', () => {
    gsap.set(targets, { willChange: 'transform, opacity' })
    previousStart?.()
  })
  animation.eventCallback('onComplete', () => {
    gsap.set(targets, { willChange: 'auto' })
    previousComplete?.()
  })
  return animation
}
