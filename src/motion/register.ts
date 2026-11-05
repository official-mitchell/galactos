/* 2026-11-04: MAX-1004. Register GSAP plugins once. Import this module from main.tsx only.
   2026-11-04: MAX-1007 matchMedia, MAX-1009 refresh, MAX-1006 debug overlay. */
import gsap from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { mountMotionDebug } from './debug'
import { activeLoopCount, claimLoop, releaseLoop, resetLoops } from './loops'
import { bindScrollTriggerRefresh } from './refresh'
import { setMotionPaused } from './store'

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, MotionPathPlugin)

if (typeof window !== 'undefined') {
  gsap.matchMedia().add('(prefers-reduced-motion: reduce)', () => {
    document.documentElement.dataset.reducedMotion = '1'
    return () => {
      delete document.documentElement.dataset.reducedMotion
    }
  })
  bindScrollTriggerRefresh()
  mountMotionDebug()
  if (import.meta.env.DEV) {
    ;(window as unknown as { __galactosMotion: object }).__galactosMotion = {
      claimLoop,
      releaseLoop,
      activeLoopCount,
      resetLoops,
      setMotionPaused,
    }
  }
}
