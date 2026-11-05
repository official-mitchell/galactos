/* 2026-11-04: MAX-1007. Pause control for looping motion. Persists as galactos-motion. */
import { setMotionPaused } from './store'
import { useMotionPaused } from './hooks'

export function MotionToggle() {
  const paused = useMotionPaused()
  const label = paused ? 'Resume motion' : 'Pause motion'
  return (
    <button
      type="button"
      className="motion-toggle"
      aria-pressed={paused}
      aria-label={label}
      onClick={() => setMotionPaused(!paused)}
    >
      {label}
    </button>
  )
}
