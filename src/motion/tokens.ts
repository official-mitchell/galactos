/* 2026-11-04: MAX-1005. JS motion tokens. CSS mirrors stay in src/styles/tokens.css
   (--dur-*, --ease-out, --ease-in-out, --ease-none). Do not add a second ease set. */

export const DURATION = {
  xs: 0.15,
  sm: 0.25,
  md: 0.4,
  lg: 0.6,
  xl: 0.9,
} as const

/** GSAP ease names. CSS mirrors are the cubic-bezier values already in tokens.css. */
export const EASE = {
  out: 'power2.out',
  inOut: 'power2.inOut',
  none: 'none',
} as const

export const STAGGER = {
  tight: 0.08,
  normal: 0.12,
} as const

export const REVEAL = {
  y: 16,
  duration: DURATION.lg,
} as const

/** Seconds after the last green beat before orange may appear. */
export const DIVERGENCE_LAG = 0.6
