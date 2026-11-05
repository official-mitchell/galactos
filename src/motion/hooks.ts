/* 2026-11-04: MAX-1006 primitives. Every hook runs inside useGSAP so ScrollTrigger is reverted on unmount.
   MAX-1007 finishes one-shots and skips loops when motion is reduced or paused.
   MAX-1009 creates triggers only once the section is within 600px, and does not pin. */
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLayoutEffect, useRef, useSyncExternalStore, type RefObject } from 'react'
import { claimLoop, releaseLoop } from './loops'
import { whenNear } from './near'
import { assertMotionVars, withWillChange } from './performance'
import { motionDebug, prefersReducedMotion } from './reduced'
import { isMotionPaused, subscribeMotion } from './store'
import { DURATION, EASE, REVEAL, STAGGER } from './tokens'
import { traceOrderError, type TraceBeat } from './traceSpec'

export type RevealOptions = { y?: number; stagger?: number; delay?: number }

export function useMotionPaused(): boolean {
  return useSyncExternalStore(subscribeMotion, isMotionPaused, () => false)
}

function finishNow(): boolean {
  return prefersReducedMotion() || isMotionPaused()
}

export function useReveal(ref: RefObject<HTMLElement | null>, options: RevealOptions = {}): void {
  const y = options.y ?? REVEAL.y
  const stagger = options.stagger ?? STAGGER.normal
  const delay = options.delay ?? 0
  const paused = useMotionPaused()

  useGSAP(() => {
    const root = ref.current
    if (!root) return
    const nodes = root.querySelectorAll<HTMLElement>('[data-anim]')
    const targets: gsap.TweenTarget = nodes.length ? nodes : root
    const vars = { y, opacity: 0, duration: REVEAL.duration, ease: EASE.out, stagger, delay }
    assertMotionVars(vars)
    if (finishNow() || paused) {
      gsap.set(targets, { opacity: 1, y: 0 })
      return
    }
    return whenNear(root, () => {
      const tween = gsap.from(targets, {
        ...vars,
        scrollTrigger: { trigger: root, start: 'top 82%', once: true, markers: motionDebug() },
      })
      withWillChange(tween, targets)
    })
  }, { scope: ref, dependencies: [y, stagger, delay, paused] })
}

export type TraceSpec = { beats: TraceBeat[]; trigger: 'enter' | 'load' }

export function useTrace(scope: RefObject<HTMLElement | null>, spec: TraceSpec): { replay: () => void; finish: () => void } {
  const api = { replay: () => {}, finish: () => {} }
  const paused = useMotionPaused()
  const signature = spec.trigger + spec.beats.map((beat) => `${beat.type}:${beat.at}:${beat.dur}:${beat.target}`).join('|')

  useGSAP(() => {
    const root = scope.current
    if (!root) return
    const error = traceOrderError(spec.beats)
    if (error) console.error(error)
    const timeline = gsap.timeline({ paused: true })
    for (const beat of spec.beats) {
      const target = root.querySelector(beat.target)
      if (!target) continue
      const vars = { opacity: 0, duration: beat.dur, ease: EASE.out }
      assertMotionVars(vars)
      const tween = gsap.from(target, { ...vars, paused: true })
      withWillChange(tween, target)
      timeline.add(tween, beat.at)
    }
    api.finish = () => timeline.progress(1).pause()
    api.replay = () => {
      if (finishNow()) {
        api.finish()
        return
      }
      timeline.restart()
    }
    if (finishNow() || paused) {
      api.finish()
      return
    }
    const play = () => timeline.play(0)
    if (spec.trigger === 'load') {
      play()
      return
    }
    return whenNear(root, () => {
      ScrollTrigger.create({
        trigger: root,
        start: 'top 82%',
        once: true,
        markers: motionDebug(),
        onEnter: play,
      })
    })
  }, { scope, dependencies: [signature, paused] })

  return api
}

export function useLoop(scope: RefObject<HTMLElement | null>, build: (timeline: gsap.core.Timeline) => void): void {
  const paused = useMotionPaused()
  const stopRef = useRef<() => void>(() => {})

  useGSAP(() => {
    const root = scope.current
    if (!root) return
    stopRef.current()
    const timeline = gsap.timeline({ paused: true, repeat: -1 })
    build(timeline)
    timeline.progress(1).pause()
    const stops: Array<() => void> = [() => timeline.kill()]
    if (!prefersReducedMotion() && !paused) {
      const stopNear = whenNear(root, () => {
        const id = root
        const trigger = ScrollTrigger.create({
          trigger: root,
          start: 'top bottom',
          end: 'bottom top',
          markers: motionDebug(),
          onEnter: () => {
            if (claimLoop(id)) timeline.play()
          },
          onEnterBack: () => {
            if (claimLoop(id)) timeline.play()
          },
          onLeave: () => {
            timeline.pause()
            releaseLoop(id)
          },
          onLeaveBack: () => {
            timeline.pause()
            releaseLoop(id)
          },
        })
        stops.push(() => {
          trigger.kill()
          releaseLoop(id)
        })
      })
      stops.push(stopNear)
    } else {
      releaseLoop(root)
    }
    stopRef.current = () => {
      stops.forEach((stop) => stop())
      releaseLoop(root)
    }
  }, { scope, dependencies: [paused, build] })

  useLayoutEffect(() => () => stopRef.current(), [])
}

export function useScrollScrub(ref: RefObject<HTMLElement | null>, timeline: gsap.core.Timeline | null): void {
  const paused = useMotionPaused()

  useGSAP(() => {
    const root = ref.current
    if (!root || !timeline) return
    if (finishNow() || paused) {
      timeline.progress(1).pause()
      return
    }
    return whenNear(root, () => {
      ScrollTrigger.create({
        trigger: root,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        animation: timeline,
        pin: false,
        markers: motionDebug(),
      })
    })
  }, { scope: ref, dependencies: [timeline, paused] })
}
