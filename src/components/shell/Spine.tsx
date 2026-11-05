/* 2026-11-04: MAX-1012 scroll spine. Page-long 1.5px trace in the left margin.
   Intent node at the hero (Act I, success green). One node at each later act boundary.
   Dashed orange only across S2–S3. Solid Deep Space from S4. S11 terminal fills on arrival.
   Draw and node fill go through useScrollScrub. */
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useLayoutEffect, useRef, useState } from 'react'
import { sections } from '../../content/sections'
import { Node } from '../diagram/Node'
import { useScrollScrub } from '../../motion/hooks'
import { assertMotionVars } from '../../motion/performance'
import { EASE } from '../../motion/tokens'

type Mark = {
  id: string
  role: 'intent' | 'act' | 'terminal'
  tone: 'success' | 'space'
  top: number
  at: number
}

type Layout = {
  key: string
  green: number
  orange: number
  space: number
  greenTop: number
  orangeTop: number
  spaceTop: number
  marks: Mark[]
}

const TERMINAL_ID = 'section-cta'
const DIVERGENCE_ID = 'section-divergence'
const AFTER_DIVERGENCE_ID = 'section-verification'

function actBoundaries(): string[] {
  const ids: string[] = []
  let act = ''
  for (const entry of sections) {
    if (entry.act === act) continue
    ids.push(entry.id)
    act = entry.act
  }
  return ids
}

function measure(root: HTMLElement): Layout | null {
  const frame = root.offsetParent instanceof HTMLElement ? root.offsetParent : root.parentElement
  if (!frame) return null
  const frameTop = frame.getBoundingClientRect().top + window.scrollY
  const yOf = (id: string, align: 'top' | 'bottom'): number | null => {
    const el = document.getElementById(id)
    if (!el) return null
    const rect = el.getBoundingClientRect()
    const top = rect.top + window.scrollY - frameTop
    return align === 'bottom' ? top + rect.height : top
  }

  const hero = yOf('section-hero', 'top')
  const divergence = yOf(DIVERGENCE_ID, 'top')
  const after = yOf(AFTER_DIVERGENCE_ID, 'top')
  const end = yOf(TERMINAL_ID, 'bottom')
  if (hero == null || divergence == null || after == null || end == null) return null

  const origin = hero + 48
  const orangeTop = Math.max(divergence, origin + 1)
  const spaceTop = Math.max(after, orangeTop + 1)
  const lineEnd = Math.max(end - 24, spaceTop + 1)
  const total = lineEnd - origin
  if (total <= 0) return null

  const boundaries = actBoundaries()
  const marks: Mark[] = []
  for (const id of boundaries) {
    const top = yOf(id, 'top')
    if (top == null) continue
    const center = id === 'section-hero' ? origin : top + 48
    const at = Math.min(1, Math.max(0, (center - origin) / total))
    const actI = id === 'section-hero'
    marks.push({
      id,
      role: actI ? 'intent' : 'act',
      tone: actI ? 'success' : 'space',
      top: center,
      at: actI ? 0 : at,
    })
  }
  const terminalTop = yOf(TERMINAL_ID, 'top')
  if (terminalTop != null) {
    const center = terminalTop + 48
    marks.push({
      id: TERMINAL_ID,
      role: 'terminal',
      tone: 'space',
      top: center,
      at: Math.min(1, Math.max(0, (center - origin) / total)),
    })
  }

  return {
    key: marks.map((mark) => `${mark.id}:${Math.round(mark.top)}`).join('|') + `:${Math.round(total)}`,
    green: orangeTop - origin,
    orange: spaceTop - orangeTop,
    space: lineEnd - spaceTop,
    greenTop: origin,
    orangeTop,
    spaceTop,
    marks,
  }
}

export function Spine() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [layout, setLayout] = useState<Layout | null>(null)
  const [timeline, setTimeline] = useState<gsap.core.Timeline | null>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    const update = () => {
      const next = measure(root)
      setLayout((current) => (current && next && current.key === next.key ? current : next))
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(document.body)
    window.addEventListener('resize', update)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [])

  useGSAP(() => {
    const root = rootRef.current
    if (!root || !layout) return
    const timeline = gsap.timeline({ paused: true })
    const weights = [layout.green, layout.orange, layout.space]
    const total = weights.reduce((sum, value) => sum + value, 0)
    const segments = [...root.querySelectorAll<HTMLElement>('[data-spine-segment]')]
    segments.forEach((segment, index) => {
      const duration = total === 0 ? 0 : weights[index] / total
      const vars = { clipPath: 'inset(0% 0% 0% 0%)', duration, ease: EASE.none }
      assertMotionVars(vars)
      timeline.fromTo(segment, { clipPath: 'inset(0% 0% 100% 0%)' }, vars, index === 0 ? 0 : '>')
    })
    root.querySelectorAll<HTMLElement>('[data-spine-fill]').forEach((fill) => {
      const at = Number(fill.dataset.spineAt ?? 0)
      if (at <= 0) {
        timeline.set(fill, { opacity: 1 }, 0)
        return
      }
      const start = Math.min(Math.max(0, at - 0.02), 0.96)
      const vars = { opacity: 1, duration: Math.min(0.04, 1 - start), ease: EASE.none }
      assertMotionVars(vars)
      timeline.fromTo(fill, { opacity: 0 }, vars, start)
    })
    const publish = () => {
      const progress = timeline.progress()
      root.dataset.spineProgress = progress.toFixed(3)
      root.dataset.spineDrawn = progress >= 0.999 ? 'true' : 'false'
      const terminal = root.querySelector<HTMLElement>('[data-spine-role="terminal"]')
      const terminalFill = terminal?.querySelector<HTMLElement>('[data-spine-fill]')
      if (terminal) {
        terminal.dataset.spineTerminal = Number(terminalFill?.style.opacity ?? 0) >= 0.99 ? 'filled' : 'outline'
      }
    }
    timeline.eventCallback('onUpdate', publish)
    setTimeline(timeline)
    return () => {
      timeline.kill()
      setTimeline(null)
    }
  }, { scope: rootRef, dependencies: [layout] })

  useScrollScrub(rootRef, timeline)

  return (
    <div ref={rootRef} className="spine" data-spine aria-hidden="true">
      {layout ? (
        <>
          <span
            className="spine__segment spine__segment--success"
            data-spine-segment="act-i"
            style={{ top: layout.greenTop, height: layout.green }}
          />
          <span
            className="spine__segment spine__segment--divergence"
            data-spine-segment="divergence"
            style={{ top: layout.orangeTop, height: layout.orange }}
          />
          <span
            className="spine__segment spine__segment--space"
            data-spine-segment="deep-space"
            style={{ top: layout.spaceTop, height: layout.space }}
          />
          {layout.marks.map((mark) => (
            <span
              key={`${mark.role}-${mark.id}`}
              className="spine__node"
              data-spine-node={mark.role}
              data-spine-role={mark.role}
              data-spine-tone={mark.tone}
              data-spine-section={mark.id}
              style={{ top: mark.top }}
            >
              <Node
                kind={mark.tone === 'success' ? 'success' : 'expected'}
                size="sm"
                state="outline"
              />
              <span className="spine__node-fill" data-spine-fill data-spine-at={mark.at} />
            </span>
          ))}
        </>
      ) : null}
    </div>
  )
}
