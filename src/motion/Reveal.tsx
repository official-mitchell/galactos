/* 2026-11-04: MAX-1006. Reveal wrapper. `as` chooses the element, `delay` offsets the fade. */
import { useRef, type ElementType, type ReactNode, type RefObject } from 'react'
import { useReveal, type RevealOptions } from './hooks'

type RevealProps = RevealOptions & {
  as?: ElementType
  children: ReactNode
  className?: string
}

export function Reveal({ as: Tag = 'div', children, className, y, stagger, delay }: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref as RefObject<HTMLElement | null>, { y, stagger, delay })
  return (
    <Tag ref={ref} className={className} data-anim="reveal">
      {children}
    </Tag>
  )
}
