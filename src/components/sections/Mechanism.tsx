/* 2026-11-05: Enlarged the local-success diagram: cards, icons, dashed joins, and the obligation circle.
   2026-11-05: Rebuilt the diagram to match galactos-mock-section-3-local-success:
   seven local steps, all OK, dashed gaps, and an unresolved business obligation.
   2026-11-04: MAX-1014 starts the S3→S4 closing line on the shared seam x.
   2026-11-04: MAX-1011 carries the Mechanism reader question and seam from sections.ts.
   2026-11-03: MAX-998 raised font sizes under 12px to 12px.
   2026-11-03: decomposed from the Figma Make landing export into the root app (MAX-993). */
import React, { useRef } from 'react';
import { storySectionProps } from '../../content/sections';
import { SeamAnchor } from '../shell/SeamAnchor';

type Step = {
  id: string;
  label: string;
  status: string;
  icon: 'chip' | 'store' | 'code' | 'queue' | 'gear' | 'person' | 'record';
};

const STEPS: Step[] = [
  { id: 'model', label: 'Model', status: 'OK', icon: 'chip' },
  { id: 'retrieval', label: 'Retrieval', status: 'OK', icon: 'store' },
  { id: 'api', label: 'API', status: 'OK', icon: 'code' },
  { id: 'queue', label: 'Queue', status: 'OK', icon: 'queue' },
  { id: 'automation', label: 'Automation', status: 'OK', icon: 'gear' },
  { id: 'hitl', label: 'HITL approval', status: 'Accepted', icon: 'person' },
  { id: 'record', label: 'System of record', status: 'OK', icon: 'record' },
];

/** Gap labels sit under the dashed joins. Empty slots stay unlabeled. */
const GAPS = ['context loss', '', 'handoff delay', 'retry risk', '', 'approval ambiguity', 'state mismatch'];

function StepIcon({ name }: { name: Step['icon'] }) {
  const common = {
    width: 26,
    height: 26,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };
  if (name === 'chip') {
    return (
      <svg {...common}>
        <rect x="7" y="7" width="10" height="10" rx="1" />
        <path d="M9 3v4M12 3v4M15 3v4M9 17v4M12 17v4M15 17v4M3 9h4M3 12h4M3 15h4M17 9h4M17 12h4M17 15h4" />
      </svg>
    );
  }
  if (name === 'store' || name === 'record') {
    return (
      <svg {...common}>
        <ellipse cx="12" cy="6" rx="7" ry="2.5" />
        <path d="M5 6v6c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6" />
        <path d="M5 12v6c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-6" />
      </svg>
    );
  }
  if (name === 'code') {
    return (
      <svg {...common}>
        <path d="M8 8 4 12l4 4M16 8l4 4-4 4" />
      </svg>
    );
  }
  if (name === 'queue') {
    return (
      <svg {...common}>
        <rect x="4" y="5" width="16" height="5" rx="1.5" />
        <rect x="4" y="14" width="16" height="5" rx="1.5" />
      </svg>
    );
  }
  if (name === 'gear') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6 6l1.6 1.6M16.4 16.4 18 18M18 6l-1.6 1.6M7.6 16.4 6 18" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="8" r="3" />
      <path d="M6.5 19c.6-2.6 2.7-4 5.5-4s4.9 1.4 5.5 4" />
      <path d="m16 11 1.2 1.2 2.3-2.4" />
    </svg>
  );
}

function LocalStep({ step }: { step: Step }) {
  return (
    <article className="s3-step" data-status={step.status}>
      <span className="s3-step-label">{step.label}</span>
      <span className="s3-step-icon">
        <StepIcon name={step.icon} />
      </span>
      <span className="s3-step-status">
        <span className="s3-check" aria-hidden="true" />
        {step.status}
      </span>
    </article>
  );
}

export function Mechanism() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      id="section-mechanism"
      className="seam-host"
      {...storySectionProps('section-mechanism')}
    >
      <div className="container-editorial s3">
        <p className="s3-kicker">Local success ≠ terminal success</p>

        <div className="s3-grid">
          <div className="s3-copy">
            <h2>Every component can report success while the workflow still fails.</h2>
            <p>
              Component success tells you that a local step behaved as expected. It does not
              necessarily tell you that the business state the workflow was supposed to create now
              exists.
            </p>
            <p>
              The gap becomes harder to see when work crosses models, retrieval systems, APIs,
              queues, automation platforms, HITL approvals, and systems of record.
            </p>
            <p className="s3-close">
              Reliability therefore requires a different standard for “done.”
            </p>
          </div>

          <div className="s3-diagram" aria-label="Local component signals beside an unresolved business obligation">
            <div className="s3-bands">
              <span className="s3-band">Local evidence</span>
              <span className="s3-band">Terminal evidence</span>
            </div>

            <div className="s3-flow">
              {STEPS.map((step, index) => (
                <React.Fragment key={step.id}>
                  <LocalStep step={step} />
                  {index < STEPS.length - 1 ? (
                    <div className="s3-gap" style={{ transitionDelay: `${180 + index * 70}ms` }}>
                      <span className="s3-gap-line" />
                      {GAPS[index] ? <span className="s3-gap-label">{GAPS[index]}</span> : null}
                    </div>
                  ) : null}
                </React.Fragment>
              ))}
              <div className="s3-gap s3-gap-last" aria-hidden="true">
                <span className="s3-gap-line" />
              </div>
              <div className="s3-obligation">
                <div className="s3-obligation-mark">
                  <span>Business obligation</span>
                  <strong>?</strong>
                </div>
                <p>Local signals do not prove the intended business outcome was achieved.</p>
              </div>
            </div>

            <p className="s3-legend">
              <span className="s3-legend-dash" aria-hidden="true" />
              Observed success at each local component does not automatically compose into verified
              completion.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        #section-mechanism {
          background: var(--surface-base);
          padding: clamp(96px, 11vw, 160px) 0;
        }
        .s3-kicker {
          margin: 0 0 20px;
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--text-secondary);
        }
        .s3-grid {
          display: grid;
          grid-template-columns: minmax(260px, 360px) minmax(0, 1fr);
          gap: 24px 32px;
          align-items: start;
        }
        .s3-copy { min-width: 0; }
        .s3-diagram { min-width: 0; }
        .s3-copy h2 {
          margin: 0 0 28px;
          max-width: 100%;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: clamp(32px, 3.2vw, 48px);
          line-height: 1.08;
          letter-spacing: -0.02em;
          color: var(--text-primary);
        }
        .s3-copy p {
          margin: 0 0 16px;
          max-width: none;
          font-family: var(--font-body);
          font-size: 16px;
          line-height: 1.55;
          color: var(--text-secondary);
        }
        .s3-close {
          margin-top: 28px !important;
          padding-top: 20px;
          border-top: 1px solid var(--border-default);
          max-width: none !important;
          font-family: var(--font-display) !important;
          font-size: clamp(22px, 2vw, 28px) !important;
          font-weight: 700 !important;
          line-height: 1.2 !important;
          letter-spacing: -0.015em;
          color: var(--text-primary) !important;
        }
        .s3-diagram { min-width: 0; }
        .s3-bands {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 24px;
          margin-bottom: 14px;
        }
        .s3-band {
          border-bottom: 1px solid var(--border-default);
          padding-bottom: 6px;
          font-family: var(--font-body);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-secondary);
        }
        .s3-flow {
          position: relative;
          display: flex;
          align-items: center;
          gap: 0;
          overflow: visible;
          padding-bottom: 72px;
        }
        .s3-flow::before {
          content: "";
          position: absolute;
          left: 0;
          right: 56px;
          top: 84px;
          border-top: 2px dashed var(--accent-divergence);
          z-index: 0;
        }
        .s3-step {
          position: relative;
          z-index: 1;
          flex: 1 1 0;
          min-width: 72px;
          height: 168px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 14px 8px 12px;
          border: 1px solid var(--border-default);
          border-radius: 4px;
          background: var(--surface-raised);
          text-align: center;
          box-sizing: border-box;
        }
        .s3-step-label {
          min-height: 2.6em;
          font-family: var(--font-body);
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          line-height: 1.25;
          color: var(--text-muted);
        }
        .s3-step-icon { color: var(--text-primary); display: flex; }
        .s3-step-status {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          max-width: 100%;
          font-family: var(--font-body);
          font-size: 12px;
          font-weight: 500;
          color: var(--text-secondary);
        }
        .s3-check {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--accent-success);
          display: inline-grid;
          place-items: center;
        }
        .s3-check::after {
          content: "";
          width: 6px;
          height: 3px;
          border-left: 1.5px solid #fff;
          border-bottom: 1.5px solid #fff;
          transform: rotate(-45deg) translate(0, -1px);
        }
        .s3-gap {
          position: relative;
          z-index: 0;
          flex: 0 0 18px;
          height: 168px;
          display: flex;
          align-items: center;
        }
        .s3-gap-line { display: none; }
        .s3-gap-label {
          position: absolute;
          top: 176px;
          left: 50%;
          width: 76px;
          transform: translateX(-50%);
          font-family: var(--font-body);
          font-size: 12px;
          line-height: 1.25;
          text-align: center;
          color: var(--text-muted);
        }
        .s3-gap-last { flex-basis: 16px; }
        .s3-gap-last .s3-gap-label {
          left: 0;
          width: 64px;
          transform: none;
        }
        .s3-obligation {
          position: relative;
          z-index: 1;
          flex: 0 0 136px;
          height: 168px;
          justify-content: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .s3-obligation-mark {
          width: 128px;
          height: 128px;
          border-radius: 50%;
          border: 3px solid var(--accent-divergence);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
          text-align: center;
          color: var(--accent-divergence);
          background: var(--surface-base);
        }
        .s3-obligation-mark span {
          max-width: 9ch;
          font-family: var(--font-body);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          line-height: 1.2;
        }
        .s3-obligation-mark strong {
          font-family: var(--font-display);
          font-size: 32px;
          font-weight: 600;
          line-height: 1;
        }
        .s3-obligation p {
          position: absolute;
          top: 176px;
          left: 50%;
          margin: 0;
          width: 132px;
          transform: translateX(-50%);
          text-align: center;
          font-family: var(--font-body);
          font-size: 13px;
          line-height: 1.4;
          color: var(--text-muted);
        }
        .s3-legend {
          display: flex;
          align-items: flex-start;
          justify-content: flex-end;
          gap: 12px;
          margin: 4px 0 0 auto;
          max-width: 46ch;
          padding-top: 12px;
          border-top: 1px solid var(--border-default);
          font-family: var(--font-body);
          font-size: 15px;
          font-weight: 600;
          line-height: 1.35;
          color: var(--accent-divergence);
        }
        .s3-legend-dash {
          flex: 0 0 48px;
          margin-top: 0.45em;
          border-top: 2px dashed var(--accent-divergence);
        }
        @media (max-width: 980px) {
          .s3-grid { grid-template-columns: 1fr; }
          .s3-copy h2, .s3-close { max-width: 22ch; }
          .s3-flow { overflow-x: auto; padding-bottom: 12px; }
          .s3-step { flex: 0 0 104px; width: 104px; min-width: 104px; height: 156px; }
          .s3-obligation { flex: 0 0 180px; }
          .s3-obligation-mark { width: 132px; height: 132px; }
        }
      `}</style>
      <SeamAnchor id="s3-s4" />
    </section>
  );
}
