/* 2026-11-05: MAX-1022 rebuilt to galactos-mock-recognition.png.
   Accordions open and close from top to bottom. The meter draws across three checks to the outcome X.
   Both motions share one loop. Reduced motion and ?motion=final hold the first card open and the meter complete.
   2026-11-04: MAX-1011 carries the Recognition reader question and seam from sections.ts. */
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef, useState } from 'react'
import { trackSectionView } from '../../analytics/track'
import { storySectionProps } from '../../content/sections'
import { claimLoop, releaseLoop } from '../../motion/loops'
import { whenNear } from '../../motion/near'
import { prefersReducedMotion } from '../../motion/reduced'
import { isMotionPaused } from '../../motion/store'
import { Container } from '../layout/Container'
import { Split } from '../layout/Split'

const STEPS = ['Model response', 'API accepted', 'Automation complete', 'Business outcome'] as const

const CARDS = [
  {
    title: 'The workflow works most of the time, but failures are hard to reproduce.',
    summary: 'A rare miss is hard to catch because most runs still look finished.',
    example: 'A refund workflow succeeds for 99% of cases, but intermittently leaves the subscription active.',
    rows: [
      ['Reported', 'Refund issued', 'ok'],
      ['Reported', 'Ticket closed', 'ok'],
      ['Actual', 'Subscription still active', 'bad'],
    ],
  },
  {
    title: 'People manually check automated work because they do not fully trust it.',
    summary: 'Teams add human review, which increases cost, slows resolution, and still misses edge cases.',
    example: 'An agent marks the case done, and a person still opens the ledger because the payout can be wrong.',
    rows: [
      ['Reported', 'Review complete', 'ok'],
      ['Actual', 'A person is still checking', 'bad'],
    ],
  },
  {
    title: 'A component reports success while downstream systems disagree.',
    summary: 'One system shows the work completed, while the authoritative source shows it did not.',
    example: 'The ticket is closed in the help desk. The billing record still shows the original charge.',
    rows: [
      ['Reported', 'Ticket closed', 'ok'],
      ['Actual', 'Charge still open', 'bad'],
    ],
  },
  {
    title: 'Retries, handoffs, or asynchronous steps sometimes create duplicates or omissions.',
    summary: 'A retry can issue a second refund, or a handoff can drop a required update.',
    example: 'A retry sends a second refund while the first refund is still settling.',
    rows: [
      ['Reported', 'Refund issued', 'ok'],
      ['Actual', 'A second refund is in flight', 'bad'],
    ],
  },
  {
    title: 'Business rules, permissions, or source information change faster than the workflow does.',
    summary: 'The workflow follows outdated logic, producing a valid completion that is no longer correct.',
    example: 'The permission changed last week. The workflow still applies the old rule and reports success.',
    rows: [
      ['Reported', 'Rule applied', 'ok'],
      ['Actual', 'The current rule was not used', 'bad'],
    ],
  },
  {
    title: 'When something goes wrong, nobody can reconstruct the entire case end to end.',
    summary: 'Signals are spread across models, tools, and systems, making the root cause unclear.',
    example: 'The model trace, the ticket, and the ledger each hold a fragment. No one record shows the case.',
    rows: [
      ['Reported', 'Case logged', 'ok'],
      ['Actual', 'The full case cannot be rebuilt', 'bad'],
    ],
  },
] as const

function CardIcon({ index }: { index: number }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' as const }
  if (index === 0) {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path d="M2 12 L6 7 L9 9 L14 3" {...common} />
      </svg>
    )
  }
  if (index === 1) {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="5.5" r="2.2" {...common} />
        <path d="M3.5 13c.6-2.2 2.2-3.2 4.5-3.2s3.9 1 4.5 3.2" {...common} />
      </svg>
    )
  }
  if (index === 2) {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path d="M3 6.5 8 4l5 2.5L8 9Z" {...common} />
        <path d="M3 9.5 8 12l5-2.5" {...common} />
      </svg>
    )
  }
  if (index === 3) {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path d="M3 8a5 5 0 1 0 1.2-3.2" {...common} />
        <path d="M3 3.2V6h2.8" {...common} />
      </svg>
    )
  }
  if (index === 4) {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path d="M8 2.5 13 8 8 13.5 3 8Z" {...common} />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M4 4h8M4 8h8M4 12h5" {...common} />
    </svg>
  )
}

function Meter({ step }: { step: number }) {
  return (
    <div className="recognition-meter" data-meter-step={step}>
      <div className="recognition-meter__track" aria-hidden="true">
        <span className="recognition-meter__fill" style={{ transform: `scaleX(${Math.min(step, 3) / 3})` }} />
      </div>
      <ol>
        {STEPS.map((label, index) => {
          const on = step > index
          const bad = index === STEPS.length - 1
          return (
            <li key={label} data-on={on ? 'true' : 'false'} data-mark={bad ? 'divergence' : 'success'}>
              <span className={bad && on ? 'recognition-mark recognition-mark--bad' : 'recognition-mark'}>
                {bad ? (
                  <svg viewBox="0 0 12 12" aria-hidden="true">
                    <path d="M3 3l6 6M9 3L3 9" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 12 12" aria-hidden="true">
                    <path d="M2.5 6.2 5 8.5 9.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                )}
              </span>
              <span className={bad ? 'recognition-meter__label recognition-meter__label--bad' : 'recognition-meter__label'}>
                {label}
              </span>
            </li>
          )
        })}
      </ol>
      <div className="recognition-stat">
        <p className="recognition-stat__value">37%</p>
        <p className="text-body">of AI-enabled customer service workflows had a material mismatch.</p>
        <p className="text-label">Consumer study · 2025</p>
      </div>
    </div>
  )
}

export function Recognition() {
  const sectionRef = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(0)
  const [step, setStep] = useState(() => (prefersReducedMotion() ? 4 : 0))

  useGSAP(() => {
    const root = sectionRef.current
    if (!root) return
    trackSectionView('s6_view')
    if (prefersReducedMotion() || isMotionPaused()) {
      setOpen(0)
      setStep(4)
      return
    }
    const hold = 2.15
    const gap = 0.4
    const cycle = hold + gap
    const timeline = gsap.timeline({ paused: true, repeat: -1 })
    CARDS.forEach((_, index) => {
      const at = index * cycle
      timeline.call(() => setOpen(index), [], at)
      timeline.call(() => setOpen(-1), [], at + hold)
    })
    const rounds = CARDS.length
    for (let round = 0; round < rounds; round += 1) {
      const at = round * cycle
      timeline.call(() => setStep(0), [], at)
      for (let mark = 1; mark <= 4; mark += 1) {
        timeline.call(() => setStep(mark), [], at + mark * 0.42)
      }
    }
    const stops: Array<() => void> = [() => timeline.kill()]
    const stopNear = whenNear(root, () => {
      const trigger = ScrollTrigger.create({
        trigger: root,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: () => {
          if (claimLoop(root)) timeline.play(0)
        },
        onEnterBack: () => {
          if (claimLoop(root)) timeline.play()
        },
        onLeave: () => {
          timeline.pause()
          releaseLoop(root)
        },
        onLeaveBack: () => {
          timeline.pause()
          releaseLoop(root)
        },
      })
      stops.push(() => {
        trigger.kill()
        releaseLoop(root)
      })
    })
    stops.push(stopNear)
    return () => {
      stops.forEach((stop) => stop())
      releaseLoop(root)
    }
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      id="section-diagnostic"
      {...storySectionProps('section-diagnostic')}
      className="layout-section layout-section--base recognition"
      data-act="III"
      data-number="06"
    >
      <Container>
        <Split
          ratio="40/60"
          stickyLeft
          left={
            <div>
              <p className="text-label recognition-kicker">Recognition</p>
              <h2 className="text-display-lg">When this becomes a Galactos problem.</h2>
              <p className="text-lede">
                Galactos is useful when an AI-enabled workflow affects customers, revenue, or operations, but the team
                cannot confidently reconcile what the workflow reports with what actually happened from trigger through
                final state.
              </p>
              <Meter step={step} />
            </div>
          }
          right={
            <div className="recognition-list">
              {CARDS.map((card, index) => {
                const isOpen = open === index
                return (
                  <article key={card.title} className={isOpen ? 'recognition-card is-open' : 'recognition-card'} data-open={isOpen ? 'true' : 'false'}>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpen(isOpen ? -1 : index)}
                    >
                      <span className="recognition-card__icon">
                        <CardIcon index={index} />
                      </span>
                      <span>
                        <span className="recognition-card__title">{card.title}</span>
                        <span className="recognition-card__summary">{card.summary}</span>
                      </span>
                      <svg className="recognition-chevron" viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.4" />
                      </svg>
                    </button>
                    <div className="recognition-panel">
                      <div>
                        <div className="recognition-example">
                          <div>
                            <p className="text-label">Example</p>
                            <p>{card.example}</p>
                          </div>
                          <ul>
                            {card.rows.map(([kind, label, tone]) => (
                              <li key={label} data-tone={tone}>
                                <span>{kind}</span>
                                <span>{label}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          }
        />
        <p className="text-label recognition-boundary">
          The Diagnostic is designed for an existing consequential workflow. It is not an enterprise-wide AI
          transformation program.
        </p>
      </Container>
      <style>{`
        .recognition-kicker { color: var(--text-muted); margin: 0 0 16px; }
        .recognition h2 { margin: 0 0 20px; color: var(--text-primary); max-width: 12em; }
        .recognition .text-lede { margin: 0 0 28px; max-width: 36ch; }
        .recognition-meter {
          position: relative;
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          background: var(--surface-raised);
          padding: 22px 18px 16px;
        }
        .recognition-meter__track {
          position: absolute;
          left: 36px;
          right: 36px;
          top: 34px;
          height: 2px;
          background: var(--border-default);
        }
        .recognition-meter__fill {
          display: block;
          height: 100%;
          background: var(--accent-success);
          transform-origin: left center;
          transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .recognition-meter ol {
          list-style: none;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          margin: 0;
          padding: 0;
          position: relative;
        }
        .recognition-meter li { text-align: center; }
        .recognition-mark {
          width: 22px; height: 22px; margin: 0 auto 8px;
          border-radius: 50%;
          display: grid; place-items: center;
          background: var(--surface-raised);
          color: var(--border-strong);
          border: 1.5px solid var(--border-default);
          transition: background 280ms ease, color 280ms ease, border-color 280ms ease;
        }
        .recognition-mark svg { width: 12px; height: 12px; }
        .recognition-meter li[data-on="true"] .recognition-mark {
          background: var(--accent-success);
          border-color: var(--accent-success);
          color: var(--surface-raised);
        }
        .recognition-meter li[data-on="true"] .recognition-mark--bad {
          background: var(--accent-divergence);
          border-color: var(--accent-divergence);
        }
        .recognition-meter__label {
          display: block;
          font-size: 12px;
          line-height: 1.3;
          color: var(--text-secondary);
        }
        .recognition-meter li[data-on="true"][data-mark="divergence"] .recognition-meter__label {
          color: var(--accent-divergence);
        }
        .recognition-stat {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 8px 16px;
          margin-top: 22px;
          padding-top: 16px;
          border-top: 1px solid var(--border-default);
          align-items: center;
        }
        .recognition-stat__value {
          margin: 0;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 48px;
          line-height: 0.95;
          letter-spacing: -0.03em;
          color: var(--text-primary);
          grid-row: 1 / span 2;
        }
        .recognition-stat .text-body { margin: 0; max-width: 24ch; font-size: 14px; }
        .recognition-stat .text-label { margin: 0; color: var(--text-muted); grid-column: 2; }
        .recognition-list { display: flex; flex-direction: column; gap: 12px; }
        .recognition-card {
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          background: var(--surface-raised);
          overflow: hidden;
        }
        .recognition-card.is-open { border-color: var(--accent-divergence); }
        .recognition-card button {
          width: 100%;
          display: grid;
          grid-template-columns: 28px 1fr 16px;
          gap: 12px;
          align-items: start;
          text-align: left;
          padding: 16px;
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
        }
        .recognition-card button:focus-visible {
          outline: 2px solid var(--accent-info);
          outline-offset: 2px;
        }
        .recognition-card__icon {
          width: 28px; height: 28px;
          display: grid; place-items: center;
          border-radius: var(--radius-sm);
          background: var(--surface-base);
          color: var(--text-secondary);
        }
        .recognition-card.is-open .recognition-card__icon {
          background: var(--tint-divergence);
          color: var(--accent-divergence);
        }
        .recognition-card__icon svg { width: 16px; height: 16px; }
        .recognition-card__title {
          display: block;
          font-weight: 600;
          font-size: 15px;
          line-height: 1.4;
          color: var(--text-primary);
        }
        .recognition-card__summary {
          display: block;
          margin-top: 4px;
          color: var(--text-secondary);
          font-size: 14px;
          line-height: 1.45;
        }
        .recognition-card.is-open .recognition-card__summary { display: none; }
        .recognition-chevron {
          width: 16px; height: 16px; margin-top: 4px;
          transition: transform 400ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .recognition-card.is-open .recognition-chevron { transform: rotate(180deg); }
        .recognition-panel {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 450ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .recognition-card.is-open .recognition-panel { grid-template-rows: 1fr; }
        .recognition-panel > div { overflow: hidden; }
        .recognition-example {
          margin: 0 16px 16px;
          padding: 14px;
          border: 1px solid var(--border-default);
          border-radius: var(--radius-sm);
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 12px 20px;
          align-items: start;
        }
        .recognition-example .text-label { margin: 0; color: var(--text-muted); }
        .recognition-example p { margin: 6px 0 0; color: var(--text-secondary); font-size: 14px; line-height: 1.45; }
        .recognition-example ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
        .recognition-example li { display: flex; gap: 10px; align-items: center; font-size: 13px; color: var(--text-primary); }
        .recognition-example li span:first-child { width: 68px; color: var(--text-muted); font-size: 12px; }
        .recognition-example li[data-tone="bad"] span:last-child {
          background: var(--tint-divergence);
          color: var(--accent-divergence);
          border-radius: var(--radius-sm);
          padding: 2px 8px;
        }
        .recognition-boundary {
          grid-column: 1 / -1;
          margin: 28px 0 0;
          padding-top: 20px;
          border-top: 1px solid var(--border-default);
          color: var(--text-muted);
        }
        @media (max-width: 768px) {
          .recognition h2 { max-width: none; }
          .recognition-example { grid-template-columns: 1fr; }
          .recognition-meter__label { font-size: 12px; }
        }
      `}</style>
    </section>
  )
}
