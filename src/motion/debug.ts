/* 2026-11-04: MAX-1006. ?debug=motion shows ScrollTrigger markers and the active tween count. */
import gsap from 'gsap'
import { motionDebug } from './reduced'
import { activeLoopCount } from './loops'

export function mountMotionDebug(): void {
  if (!motionDebug()) return
  const panel = document.createElement('div')
  panel.setAttribute('data-motion-debug', '')
  panel.style.cssText = 'position:fixed;right:8px;bottom:8px;z-index:300;font:12px/1.4 Inter,sans-serif;background:var(--surface-raised);color:var(--text-primary);padding:8px;border:1px solid var(--border-default)'
  document.body.appendChild(panel)
  gsap.ticker.add(() => {
    const tweens = gsap.globalTimeline.getChildren(true, true, false).filter((child) => child.isActive()).length
    panel.textContent = `tweens ${tweens} · loops ${activeLoopCount()}`
  })
}
