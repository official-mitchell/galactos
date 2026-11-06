/* 2026-11-06: Right-side diagram is a fixed chain: bracket over six nodes, side arrow into the outcome.
   2026-11-06: Tuned Approach to galactos-section-8-approach.png line breaks and column rule.
   2026-11-05: Rebuilt as Approach from galactos-section-8-approach.png (MAX-1026).
   Copy, three points, and the bounded-workflow diagram replace the photo split. */
import React from 'react'
import { storySectionProps } from '../../content/sections'

const POINTS = [
  {
    title: 'Bounded scope',
    body: 'One workflow. One defined business outcome.',
    icon: 'scope',
  },
  {
    title: 'Cross-boundary view',
    body: 'Follows the path across tools, systems, and approvals.',
    icon: 'path',
  },
  {
    title: 'Useful output',
    body: 'Clarifies where the workflow diverges and what to repair first.',
    icon: 'bars',
  },
] as const

const NODES = [
  { label: 'Model', icon: 'spark', fault: null },
  { label: 'Context / Retrieval', icon: 'layers', fault: 'context loss' },
  { label: 'Tool / API', icon: 'code', fault: 'handoff delay' },
  { label: 'Queue', icon: 'queue', fault: 'retry risk' },
  { label: 'Human Approval', icon: 'person', fault: 'approval ambiguity' },
  { label: 'System of Record', icon: 'record', fault: 'state mismatch' },
] as const

function PointIcon({ name }: { name: (typeof POINTS)[number]['icon'] }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
  }
  if (name === 'scope') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="7" />
        <circle cx="12" cy="12" r="2" />
        <path d="M12 3v2M12 19v2M3 12h2M19 12h2" />
      </svg>
    )
  }
  if (name === 'path') {
    return (
      <svg {...common}>
        <circle cx="6" cy="7" r="2" />
        <circle cx="18" cy="7" r="2" />
        <circle cx="12" cy="17" r="2" />
        <path d="M8 7h8M7.2 8.6l3.6 6.2M16.8 8.6l-3.6 6.2" />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <path d="M5 19V11M10 19V7M15 19v-5M20 19V9" />
    </svg>
  )
}

function NodeIcon({ name }: { name: (typeof NODES)[number]['icon'] }) {
  const common = {
    width: 32,
    height: 32,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
  }
  if (name === 'spark') {
    return (
      <svg {...common}>
        <path d="M12 3.5l1.4 5.1L18.5 10l-5.1 1.4L12 16.5l-1.4-5.1L5.5 10l5.1-1.4L12 3.5z" />
      </svg>
    )
  }
  if (name === 'layers') {
    return (
      <svg {...common}>
        <path d="M4 8l8-3.5L20 8l-8 3.5L4 8z" />
        <path d="M4 12l8 3.5L20 12" />
        <path d="M4 16l8 3.5L20 16" />
      </svg>
    )
  }
  if (name === 'code') {
    return (
      <svg {...common}>
        <path d="M9 8l-4 4 4 4M15 8l4 4-4 4" />
      </svg>
    )
  }
  if (name === 'queue') {
    return (
      <svg {...common}>
        <rect x="4" y="6" width="16" height="3.2" rx="0.6" />
        <rect x="4" y="11" width="16" height="3.2" rx="0.6" />
        <rect x="4" y="16" width="12" height="3.2" rx="0.6" />
      </svg>
    )
  }
  if (name === 'person') {
    return (
      <svg {...common}>
        <circle cx="12" cy="8" r="2.4" />
        <path d="M6.5 18.5c.8-2.8 2.8-4.2 5.5-4.2s4.7 1.4 5.5 4.2" />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <ellipse cx="12" cy="7" rx="6" ry="2.4" />
      <path d="M6 7v8c0 1.3 2.7 2.4 6 2.4s6-1.1 6-2.4V7" />
      <path d="M6 11c0 1.3 2.7 2.4 6 2.4s6-1.1 6-2.4" />
    </svg>
  )
}

const DASHED_LINKS = new Set([1, 2])

function WorkflowDiagram() {
  return (
    <div className="approach-diagram" role="img" aria-label="One bounded workflow under investigation, from model through system of record to a verified business outcome.">
      <div className="approach-banner">One bounded workflow under investigation</div>
      <div className="approach-track">
        <div className="approach-slots">
          <span className="approach-rail" aria-hidden="true" />
          {NODES.map((node, index) => (
            <React.Fragment key={node.label}>
              <div className="approach-node">
                <span className="approach-stem" aria-hidden="true" />
                <div className="approach-card">
                  <NodeIcon name={node.icon} />
                  <span>{node.label}</span>
                </div>
                {node.fault ? (
                  <span className={node.fault === 'state mismatch' ? 'approach-fault approach-fault--return' : 'approach-fault'}>
                    {node.fault}
                  </span>
                ) : (
                  <span className="approach-fault approach-fault--spacer" />
                )}
              </div>
              {index < NODES.length - 1 ? (
                <span className={DASHED_LINKS.has(index) ? 'approach-link approach-link--dashed' : 'approach-link'} aria-hidden="true">
                  <i />
                  <span className="approach-dot" />
                  <i />
                </span>
              ) : null}
            </React.Fragment>
          ))}
        </div>
        <span className="approach-link approach-link--arrow" aria-hidden="true">
          <i />
          <span className="approach-arrow" />
        </span>
        <div className="approach-finish">
          <div className="approach-verified-label">
            Verified completion
            <svg width="16" height="26" viewBox="0 0 16 26" aria-hidden="true">
              <path d="M8 1v20M3 15l5 9 5-9" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </div>
          <div className="approach-outcome">
            <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path d="M8 12.2l2.6 2.6L16.2 9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <span>Verified Business Outcome</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Credibility() {
  return (
    <section
      id="section-credibility"
      className="approach"
      {...storySectionProps('section-credibility')}
    >
      <div className="container-editorial approach-frame">
        <div className="approach-kicker">
          <span>Approach</span>
          <span className="approach-kicker-rule" />
        </div>
        <div className="approach-split">
          <div className="approach-copy">
            <h2 className="text-display-lg approach-title">
              One business outcome,<br />
              followed across<br />
              every boundary<br />
              it crosses.
            </h2>
            <p className="approach-lede">
              Galactos investigates one consequential workflow horizontally across models, integrations, systems, and human handoffs so the real business outcome can be verified.
            </p>
            <ul className="approach-points">
              {POINTS.map((point) => (
                <li key={point.title}>
                  <span className="approach-point-icon">
                    <PointIcon name={point.icon} />
                  </span>
                  <span>
                    <strong>{point.title}</strong>
                    <span>{point.body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <WorkflowDiagram />
        </div>
      </div>
      <style>{`
        .approach {
          background: var(--surface-base);
          color: var(--text-primary);
          padding: clamp(72px, 8vw, 112px) 0;
        }
        .approach .container-editorial {
          max-width: 1560px;
        }
        .approach-frame { display: flex; flex-direction: column; gap: 40px; }
        .approach-kicker {
          display: flex;
          align-items: center;
          gap: 16px;
          font-family: var(--font-body);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--text-primary);
        }
        .approach-kicker-rule { flex: 1; height: 1px; background: var(--text-primary); }
        .approach-split {
          display: grid;
          grid-template-columns: minmax(420px, 460px) minmax(0, 1fr);
          column-gap: 40px;
          align-items: center;
        }
        .approach-copy {
          border-right: 1px solid var(--border-default);
          padding-right: 32px;
          min-height: 100%;
        }
        .approach-title {
          font-size: clamp(36px, 3.15vw, 48px);
          line-height: 1.02;
          letter-spacing: -0.032em;
          margin: 0 0 22px;
          max-width: 11.2ch;
        }
        .approach-lede {
          margin: 0 0 36px;
          max-width: 46ch;
          font-size: 15px;
          line-height: 1.55;
          color: var(--text-secondary);
        }
        .approach-points {
          list-style: none;
          margin: 28px 0 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .approach-points li {
          display: grid;
          grid-template-columns: 40px 1fr;
          gap: 12px;
          align-items: center;
        }
        .approach-point-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: var(--surface-raised);
          border: 1px solid var(--border-default);
          display: grid;
          place-items: center;
          color: var(--text-primary);
          box-shadow: 0 1px 2px color-mix(in srgb, var(--text-primary) 6%, transparent);
        }
        .approach-points strong {
          display: block;
          font-family: var(--font-body);
          font-size: 15px;
          font-weight: 650;
        }
        .approach-points li span span {
          display: block;
          margin-top: 2px;
          font-size: 13px;
          line-height: 1.4;
          color: var(--text-secondary);
        }
        .approach-diagram {
          min-width: 0;
          color: var(--text-primary);
          padding-top: 4px;
        }
        .approach-banner {
          display: block;
          width: max-content;
          margin: 0 auto -12px;
          background: color-mix(in srgb, var(--accent-divergence) 18%, var(--surface-raised));
          color: var(--text-primary);
          border-radius: 999px;
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 600;
          position: relative;
          z-index: 1;
        }
        .approach-track {
          display: flex;
          align-items: flex-start;
          width: 100%;
        }
        .approach-slots {
          position: relative;
          flex: 1 1 auto;
          display: flex;
          align-items: flex-start;
          min-width: 0;
        }
        .approach-rail { display: none; }
        .approach-node {
          position: relative;
          flex: 1 1 0;
          min-width: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .approach-node::before,
        .approach-link::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1.5px;
          background: var(--text-primary);
        }
        .approach-node:first-child::before { left: 50%; }
        .approach-node:last-child::before { right: 50%; }
        .approach-link { position: relative; }
        .approach-link::before { top: -18px; }
        .approach-link--arrow::before { display: none; }
        .approach-stem {
          width: 1.5px;
          height: 18px;
          background: var(--text-primary);
        }
        .approach-card {
          width: min(100%, 112px);
          height: 116px;
          border: 1.5px solid var(--text-primary);
          border-radius: 14px;
          background: var(--surface-base);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 10px 8px;
          text-align: center;
          font-size: 14px;
          font-weight: 650;
          line-height: 1.15;
        }
        .approach-link {
          flex: 1 1 32px;
          min-width: 28px;
          max-width: 48px;
          height: 116px;
          margin-top: 18px;
          display: flex;
          align-items: center;
        }
        .approach-link i {
          flex: 1 1 auto;
          height: 0;
          border-top: 1.5px solid var(--text-primary);
        }
        .approach-link--dashed i { border-top-style: dashed; }
        .approach-dot {
          width: 10px;
          height: 10px;
          flex: 0 0 10px;
          border-radius: 50%;
          background: var(--accent-divergence);
        }
        .approach-link--arrow { flex: 0 0 40px; width: 40px; max-width: 40px; }
        .approach-arrow {
          width: 0;
          height: 0;
          flex: 0 0 auto;
          border-top: 7px solid transparent;
          border-bottom: 7px solid transparent;
          border-left: 10px solid var(--text-primary);
        }
        .approach-fault {
          margin-top: 22px;
          max-width: 11ch;
          min-height: 34px;
          font-size: 13px;
          line-height: 1.25;
          text-align: center;
          color: var(--text-secondary);
          font-style: italic;
          position: relative;
        }
        .approach-fault::before {
          content: "";
          position: absolute;
          left: 50%;
          top: -22px;
          height: 20px;
          border-left: 1.5px dashed color-mix(in srgb, var(--text-primary) 45%, transparent);
        }
        .approach-fault--spacer::before { display: none; }
        .approach-fault--return::after {
          content: "";
          position: absolute;
          left: calc(50% - 4px);
          top: -24px;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-bottom: 6px solid color-mix(in srgb, var(--text-primary) 55%, transparent);
        }
        .approach-finish {
          position: relative;
          flex: 0 0 148px;
          width: 148px;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 11px;
        }
        .approach-verified-label {
          position: absolute;
          top: -42px;
          left: 0;
          right: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          font-size: 13px;
          line-height: 1.15;
          text-align: center;
          color: color-mix(in srgb, var(--accent-success) 70%, var(--text-primary));
        }
        .approach-outcome {
          width: 148px;
          height: 132px;
          border-radius: 16px;
          border: 1.5px solid color-mix(in srgb, var(--accent-success) 62%, var(--text-primary));
          background: color-mix(in srgb, var(--accent-success) 16%, var(--surface-base));
          color: color-mix(in srgb, var(--accent-success) 68%, var(--text-primary));
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          text-align: center;
          font-size: 16px;
          font-weight: 700;
          line-height: 1.15;
        }
        @media (max-width: 980px) {
          .approach-split { grid-template-columns: 1fr; }
          .approach-copy { border-right: 0; padding-right: 0; }
          .approach-banner { white-space: normal; }
          .approach-diagram { overflow-x: auto; }
          .approach-track { min-width: 760px; }
        }
      `}</style>
    </section>
  )
}
