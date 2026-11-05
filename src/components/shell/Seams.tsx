/* 2026-11-04: MAX-1014 seam lines. Hero→S2 is a dashed drop scrubbed with scroll.
   S3→S4 is a closing line with an arrow. Both end on the paired data-seam-end anchor.
   Band edges stay in CSS (1px border-strong, no gradient). */
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useLayoutEffect, useRef, useState } from 'react'
import { useScrollScrub } from '../../motion/hooks'
import { assertMotionVars } from '../../motion/performance'
import { EASE } from '../../motion/tokens'

type SeamKind = 'dashed' | 'arrow'

type SeamBox = {
  id: string
  kind: SeamKind
  top: number
  height: number
  left: number
}

const PAIRS: { id: string; kind: SeamKind }[] = [
  { id: 'hero-s2', kind: 'dashed' },
  { id: 's3-s4', kind: 'arrow' },
]

function measure(root: HTMLElement): SeamBox[] {
  const frame = root.getBoundingClientRect()
  const frameTop = frame.top + window.scrollY
  const boxes: SeamBox[] = []
  for (const pair of PAIRS) {
    const start = document.querySelector<HTMLElement>(`[data-seam-start="${pair.id}"]`)
    const end = document.querySelector<HTMLElement>(`[data-seam-end="${pair.id}"]`)
    if (!start || !end) continue
    const startBox = start.getBoundingClientRect()
    const endBox = end.getBoundingClientRect()
    const top = startBox.top + startBox.height / 2 + window.scrollY - frameTop
    const bottom = endBox.top + endBox.height / 2 + window.scrollY - frameTop
    const height = bottom - top
    if (height < 1) continue
    boxes.push({
      id: pair.id,
      kind: pair.kind,
      top,
      height,
      left: startBox.left + startBox.width / 2 - frame.left,
    })
  }
  return boxes
}

function SeamTrace({ box }: { box: SeamBox }) {
  const ref = useRef<HTMLDivElement>(null)
  const [timeline, setTimeline] = useState<gsap.core.Timeline | null>(null)

  useGSAP(() => {
    const root = ref.current
    const graphic = root?.querySelector('svg')
    if (!root || !graphic) return
    const next = gsap.timeline({ paused: true })
    const vars = { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: EASE.none }
    assertMotionVars(vars)
    next.fromTo(graphic, { clipPath: 'inset(0% 0% 100% 0%)' }, vars, 0)
    const publish = () => {
      const progress = next.progress()
      root.dataset.seamProgress = progress.toFixed(3)
      root.dataset.seamDrawn = progress >= 0.999 ? 'true' : 'false'
    }
    next.eventCallback('onUpdate', publish)
    publish()
    setTimeline(next)
    return () => {
      next.kill()
      setTimeline(null)
    }
  }, { scope: ref, dependencies: [box.top, box.height, box.left] })

  useScrollScrub(ref, timeline)

  const arrow = box.kind === 'arrow'
  return (
    <div
      ref={ref}
      className={`seam-line seam-line--${box.kind}`}
      data-seam-line={box.id}
      data-seam-kind={box.kind}
      style={{ top: box.top, height: box.height, left: box.left }}
    >
      <svg aria-hidden="true">
        {arrow ? (
          <defs>
            <marker
              id={`seam-arrow-${box.id}`}
              markerWidth="7"
              markerHeight="7"
              refX="6"
              refY="3.5"
              orient="auto"
            >
              <path d="M0 0 L7 3.5 L0 7" fill="none" stroke="var(--text-primary)" strokeWidth="1" />
            </marker>
          </defs>
        ) : null}
        <line
          x1="6"
          y1="0"
          x2="6"
          y2="100%"
          strokeDasharray={arrow ? undefined : '4 6'}
          markerEnd={arrow ? `url(#seam-arrow-${box.id})` : undefined}
        />
      </svg>
    </div>
  )
}

export function Seams() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [boxes, setBoxes] = useState<SeamBox[]>([])

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    const update = () => {
      const next = measure(root)
      setBoxes((current) => {
        if (current.length === next.length && current.every((box, index) => {
          const other = next[index]
          return other
            && box.id === other.id
            && Math.abs(box.top - other.top) < 0.5
            && Math.abs(box.height - other.height) < 0.5
            && Math.abs(box.left - other.left) < 0.5
        })) return current
        return next
      })
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

  return (
    <div ref={rootRef} className="seams" data-seams="">
      {boxes.map((box) => <SeamTrace key={box.id} box={box} />)}
    </div>
  )
}
