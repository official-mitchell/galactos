/* 2026-11-04: MAX-1006 fixture. Two loops in view. Only the first may play. */
import gsap from 'gsap'
import { useRef } from 'react'
import { useLoop } from './hooks'
import { EASE } from './tokens'

function spin(ref: { current: HTMLElement | null }) {
  return (timeline: gsap.core.Timeline) => {
    const target = ref.current
    if (!target) return
    timeline.to(target, { rotation: 8, duration: 1.2, ease: EASE.none })
  }
}

export function MotionLab() {
  const first = useRef<HTMLDivElement>(null)
  const second = useRef<HTMLDivElement>(null)
  useLoop(first, spin(first))
  useLoop(second, spin(second))
  return (
    <section id="motion-lab" data-anim="lab" style={{ display: 'flex', gap: 16, padding: 24 }}>
      <div ref={first} data-anim="loop" data-loop="a" style={{ width: 48, height: 48, border: '1px solid var(--border-default)' }}>
        Loop A
      </div>
      <div ref={second} data-anim="loop" data-loop="b" style={{ width: 48, height: 48, border: '1px solid var(--border-default)' }}>
        Loop B
      </div>
    </section>
  )
}
