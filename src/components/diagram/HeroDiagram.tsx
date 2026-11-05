/* 2026-11-04: MAX-1017 load trace on the mock diagram. Hover emphasizes a node and its label.
   2026-11-03: hero outcome diagram matched to instructions/design/mocks/galactos-mock-hero.png. */
import React, { useRef } from 'react';
import { useTrace } from '../../motion/hooks';
import type { TraceBeat } from '../../motion/traceSpec';

const CARDS: {
  title: string;
  body: string;
  foot: string;
  tone: 'success' | 'divergence';
  pill?: string;
  highlight?: string;
}[] = [
  {
    title: 'Request understood',
    body: 'Cancel my Pro plan and refund the duplicate charge.',
    foot: 'Intent recognized: cancellation + refund',
    tone: 'success',
  },
  {
    title: 'Refund request accepted',
    body: 'Refund: $49.00\nStatus: Accepted',
    foot: '',
    tone: 'success',
    pill: '200 OK',
  },
  {
    title: 'Workflow step completed',
    body: 'Refund reference written to support case.',
    foot: 'Cancellation workflow marked complete.',
    tone: 'success',
  },
  {
    title: 'Case closed',
    body: 'Resolution: cancellation + refund completed.',
    foot: 'Customer notification sent.',
    tone: 'success',
  },
  {
    title: 'Actual business state',
    body: '',
    foot: 'Next renewal: scheduled\nRefund request: accepted\nCancellation: not confirmed',
    tone: 'divergence',
    highlight: 'Subscription still active',
  },
];

const STEPS = ['Model response', 'API accepted', 'Automation complete', 'Ticket closed', 'Business outcome'];
const FLAGS = ['Wrong', 'Incomplete', 'Duplicated', 'Unresolved'];

function Mark({ tone }: { tone: 'success' | 'divergence' }) {
  const ok = tone === 'success';
  return (
    <span
      aria-hidden="true"
      style={{
        width: 18,
        height: 18,
        borderRadius: '50%',
        background: ok ? 'var(--accent-success)' : 'var(--accent-divergence)',
        color: 'var(--on-accent)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12,
        fontWeight: 700,
        lineHeight: 1,
        flexShrink: 0,
      }}
    >
      {ok ? '✓' : '×'}
    </span>
  );
}

const HERO_TRACE: TraceBeat[] = [
  { type: 'node', target: '[data-hero="card-0"]', at: 0.3, dur: 0.35 },
  { type: 'node', target: '[data-hero="card-1"]', at: 0.7, dur: 0.35 },
  { type: 'connector', target: '[data-hero="steps"]', at: 1.0, dur: 0.3 },
  { type: 'node', target: '[data-hero="card-2"]', at: 1.1, dur: 0.35 },
  { type: 'node', target: '[data-hero="card-3"]', at: 1.5, dur: 0.35 },
  { type: 'divergence', target: '[data-hero="card-4"]', at: 2.45, dur: 0.4 },
];

export function HeroDiagram() {
  const rootRef = useRef<HTMLDivElement>(null);
  useTrace(rootRef, { trigger: 'load', beats: HERO_TRACE });

  return (
    <div ref={rootRef} className="hero-diagram" style={{ position: 'relative', width: '100%' }}>
      <svg
        aria-hidden="true"
        viewBox="0 0 640 640"
        style={{
          position: 'absolute',
          left: '-22%',
          top: '-6%',
          width: '70%',
          height: '118%',
          pointerEvents: 'none',
        }}
      >
        <circle cx="40" cy="320" r="300" fill="none" stroke="var(--text-primary)" strokeWidth="1.25" opacity="0.08" />
      </svg>

      <div className="hero-diagram-grid">
        <div className="hero-bracket hero-bracket-success">
          <div className="hero-bracket-label">Local success signals</div>
          <div className="hero-bracket-bar" />
        </div>
        <div className="hero-bracket hero-bracket-divergence">
          <div className="hero-bracket-label">Actual business outcome</div>
          <div className="hero-bracket-bar" />
        </div>

        {CARDS.map((card, index) => (
          <article key={card.title} data-hero={`card-${index}`} className={`hero-card hero-card-${card.tone}`}>
            <div className="hero-card-title">
              <Mark tone={card.tone} />
              <span>{card.title}</span>
            </div>
            {card.body ? <p className="hero-card-body">{card.body}</p> : null}
            {card.highlight ? (
              <div className="hero-card-highlight">
                {card.highlight} <span aria-hidden="true">×</span>
              </div>
            ) : null}
            {card.pill ? <span className="hero-card-pill">{card.pill}</span> : null}
            {card.foot ? <p className="hero-card-foot">{card.foot}</p> : null}
          </article>
        ))}
      </div>

      <div className="hero-steps" data-hero="steps">
        <div className="hero-step-line" aria-hidden="true" />
        {STEPS.map((label, i) => {
          const failed = i === STEPS.length - 1;
          return (
            <div key={label} className="hero-step">
              <span className={failed ? 'hero-step-mark is-fail' : 'hero-step-mark'}>{failed ? '×' : '✓'}</span>
              <span className="hero-step-label">{label}</span>
              {failed ? (
                <div className="hero-flags">
                  {FLAGS.map(flag => (
                    <span key={flag} className="hero-flag">{flag}</span>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
