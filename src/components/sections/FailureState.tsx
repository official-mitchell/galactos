/* 2026-11-05: Widened the copy column and enlarged the step cards, icons, and nodes.
   2026-11-05: Rebuilt #section-divergence to match galactos-mock-component-success.png.
   Top: headline plus five step cards ending in the unresolved authoritative state.
   Bottom: “Component success is not evidence of end-to-end completion,” with reported vs verified lanes.
   2026-11-04: MAX-1014 placeholder for S2's first node. The hero drop ends on this x.
   2026-11-04: MAX-1011 carries the Failure state reader question and seam from sections.ts.
   2026-11-03: decomposed from the Figma Make landing export into the root app (MAX-993). */
import React, { useEffect, useState } from 'react';
import { storySectionProps } from '../../content/sections';
import { Icon, type IconName } from '../motifs/Icon';
import { SeamAnchor } from '../shell/SeamAnchor';

type StepKind = 'intent' | 'success' | 'anomaly';

type Step = {
  icon: IconName;
  title: string;
  body: string;
  kind: StepKind;
  action: string;
  detail: string;
  time: string;
};

const REPORTED: Step[] = [
  {
    icon: 'user',
    title: 'User request',
    body: 'Cancellation + refund request received.',
    kind: 'intent',
    action: 'Request understood',
    detail: '',
    time: '',
  },
  {
    icon: 'sparkles',
    title: 'Model response',
    body: 'Intent correctly understood.',
    kind: 'success',
    action: 'Intent classified',
    detail: '',
    time: '',
  },
  {
    icon: 'file-text',
    title: 'Policy system',
    body: 'Correct policy retrieved.',
    kind: 'success',
    action: 'Policy retrieved',
    detail: '',
    time: '',
  },
  {
    icon: 'credit-card',
    title: 'Payment API',
    body: 'Refund call accepted.',
    kind: 'success',
    action: 'Refund action accepted',
    detail: '',
    time: '',
  },
  {
    icon: 'message-square',
    title: 'Support system',
    body: 'Ticket marked as closed.',
    kind: 'success',
    action: 'Ticket closed',
    detail: '',
    time: '',
  },
];

const STEPS: Step[] = [
  {
    icon: 'user',
    title: 'Customer request',
    body: '“I’d like to cancel my subscription and get a refund.”',
    kind: 'intent',
    action: 'Request understood',
    detail: 'Intent classified',
    time: 'T+0s',
  },
  {
    icon: 'file-text',
    title: 'Policy retrieval',
    body: 'Relevant policy found for plan, region, and date.',
    kind: 'success',
    action: 'Policy retrieved',
    detail: 'Policy match, v4.2',
    time: 'T+1.3s',
  },
  {
    icon: 'settings',
    title: 'Refund action',
    body: 'Refund API call accepted by payment provider.',
    kind: 'success',
    action: 'Refund action accepted',
    detail: '200 OK',
    time: 'T+4.0s',
  },
  {
    icon: 'message-square',
    title: 'Case updated',
    body: 'Support ticket marked as closed by the workflow.',
    kind: 'success',
    action: 'Ticket closed',
    detail: 'Case closed',
    time: 'T+6.1s',
  },
  {
    icon: 'database',
    title: 'Authoritative state',
    body: 'Subscription remains active in billing system. Next renewal still scheduled.',
    kind: 'anomaly',
    action: 'Subscription still active',
    detail: 'Unresolved state',
    time: 'T+8.4s',
  },
];

function startResolved(): boolean {
  if (typeof document === 'undefined') return false;
  const motion = document.documentElement.dataset.motion;
  if (motion === 'final' || motion === 'reduced') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function StepNode({ kind, on }: { kind: StepKind; on: boolean }) {
  if (kind === 'anomaly') {
    return (
      <span className={`divergence-node divergence-node--alert${on ? ' is-on' : ''}`} role="img" aria-label="Unresolved state">
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
          <path d="M7 3.2v4.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="7" cy="10.4" r="0.9" fill="currentColor" />
        </svg>
      </span>
    );
  }
  if (kind === 'intent') {
    return <span className={`divergence-node divergence-node--intent${on ? ' is-on' : ''}`} role="img" aria-label="Intent classified" />;
  }
  return (
    <span className={`divergence-node divergence-node--ok${on ? ' is-on' : ''}`} role="img" aria-label="Local success">
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
        <polyline points="2,6 5,9 10,3" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function FailureState() {
  const [shown, setShown] = useState(startResolved);

  useEffect(() => {
    if (shown) return;
    const el = document.getElementById('section-divergence');
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setShown(true);
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [shown]);

  return (
    <section
      id="section-divergence"
      className="seam-host divergence"
      {...storySectionProps('section-divergence')}
    >
      <SeamAnchor id="hero-s2" end role="node" />
      <div className="container-editorial divergence__frame">
        <header className="divergence__copy">
          <p className="divergence__case">Case: customer requests cancellation + refund</p>
          <h2 className="divergence__headline">
            The workflow reported success. The business process did not complete.
          </h2>
        </header>

        <figure className="divergence__trace" aria-label="Cancellation workflow that reports success while the subscription stays active">
          <ol className="divergence__steps">
            {STEPS.map((step, index) => (
              <li key={step.title} className={`divergence__step${step.kind === 'anomaly' ? ' divergence__step--alert' : ''}`}>
                <article className="divergence__card">
                  <Icon name={step.icon} size={26} className="divergence__icon" />
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </article>
                <div className="divergence__rail" aria-hidden={index === STEPS.length - 1 ? undefined : true}>
                  {index < STEPS.length - 1 ? <span className={`divergence__arrow${shown ? ' is-on' : ''}`} /> : null}
                  <StepNode kind={step.kind} on={shown} />
                </div>
                <p className="divergence__action">{step.action}</p>
                <p className="divergence__detail">{step.detail}</p>
                <p className="divergence__time">{step.time}</p>
              </li>
            ))}
          </ol>
        </figure>
      </div>

      <div className="container-editorial contrast">
        <header className="contrast__copy">
          <p className="divergence__case">Reported vs. verified completion</p>
          <h2 className="divergence__headline">Component success is not evidence of end-to-end completion.</h2>
          <p className="contrast__body">
            Reported completion means the workflow, component, or interaction says the work finished. Verified completion means the intended business state has been independently checked in the authoritative system that can actually prove the outcome.
          </p>
        </header>

        <figure className="contrast__board" aria-label="Reported completion stops at the ticket. Verified completion still shows the subscription active.">
          <div className="contrast__lane">
            <p className="contrast__lane-label">Reported completion</p>
            <ol className="contrast__steps">
              {REPORTED.map((step, index) => (
                <li key={step.title} className="contrast__step">
                  <article className="contrast__card">
                    <Icon name={step.icon} size={26} className="divergence__icon" />
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </article>
                  <div className="contrast__rail">
                    {index < REPORTED.length - 1 ? <span className={`divergence__arrow contrast__arrow${shown ? ' is-on' : ''}`} /> : null}
                    <StepNode kind={step.kind} on={shown} />
                  </div>
                  <p className="divergence__action">{step.action}</p>
                </li>
              ))}
            </ol>
            <p className={`contrast__ghost${shown ? ' is-on' : ''}`}>Workflow reports success here.</p>
          </div>

          <div className="contrast__verified">
            <p className="contrast__lane-label">Verified completion</p>
            <div className="contrast__fork">
              <div className="contrast__check">
                <StepNode kind="anomaly" on={shown} />
                <div>
                  <p className="divergence__action contrast__alert">Verify actual state</p>
                  <p className="contrast__note">Check subscription status in billing system.</p>
                  <p className="divergence__action contrast__alert">Subscription still active</p>
                  <p className="contrast__note">Next renewal scheduled</p>
                  <p className="contrast__tag">Divergence</p>
                </div>
              </div>
              <span className={`contrast__dash${shown ? ' is-on' : ''}`} aria-hidden="true" />
              <article className="contrast__terminal">
                <span className="divergence-node contrast__empty" role="img" aria-label="Authoritative state confirmed, still open" />
                <h3>Verified completion</h3>
                <p>Would require confirmed cancellation and refund status in authoritative systems.</p>
                <p className="divergence__action">Authoritative state confirmed</p>
              </article>
            </div>
          </div>
        </figure>
      </div>

      <style>{`
        .divergence {
          background: var(--surface-base);
          padding: clamp(72px, 8vw, 120px) 0;
        }
        .divergence__frame {
          display: grid;
          grid-template-columns: minmax(280px, 460px) minmax(0, 1fr);
          gap: 40px;
          align-items: start;
        }
        .divergence__case {
          margin: 0 0 16px;
          font-family: var(--font-body);
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-muted);
        }
        .divergence__headline {
          margin: 0;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: clamp(32px, 3vw, 48px);
          line-height: 1.12;
          letter-spacing: -0.02em;
          color: var(--text-primary);
        }
        .divergence__trace {
          margin: 0;
        }
        .divergence__steps {
          list-style: none;
          margin: 0;
          padding: 8px 4px 8px;
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 12px;
        }
        .divergence__card {
          height: 210px;
          box-sizing: border-box;
          padding: 18px 14px 18px;
          background: var(--surface-raised);
          border: 1px solid var(--border-default);
          border-radius: 8px;
          box-shadow: 0 1px 2px rgba(15, 30, 46, 0.06);
        }
        .dark .divergence__card { box-shadow: none; }
        .divergence__step--alert .divergence__card {
          border-color: var(--accent-divergence);
          background: color-mix(in srgb, var(--accent-divergence) 8%, var(--surface-raised));
        }
        .divergence__icon { color: var(--text-secondary); display: block; margin-bottom: 10px; }
        .divergence__step--alert .divergence__icon { color: var(--accent-divergence); }
        .divergence__card h3 {
          margin: 0 0 8px;
          font-family: var(--font-body);
          font-size: 16px;
          font-weight: 600;
          line-height: 1.3;
          color: var(--text-primary);
        }
        .divergence__card p {
          margin: 0;
          font-family: var(--font-body);
          font-size: 12px;
          line-height: 1.45;
          color: var(--text-secondary);
        }
        .divergence__rail {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 10px -8px 10px;
          min-height: 52px;
          background: linear-gradient(180deg, transparent 0%, var(--tint-success) 28%, var(--tint-success) 72%, transparent 100%);
        }
        .divergence__step--alert .divergence__rail {
          background: linear-gradient(180deg, transparent 0%, var(--tint-divergence) 28%, var(--tint-divergence) 72%, transparent 100%);
        }
        .divergence__arrow {
          position: absolute;
          left: calc(50% + 16px);
          right: calc(-50% - 4px);
          top: 13px;
          height: 1.5px;
          background: var(--text-primary);
          opacity: 0;
        }
        .divergence__arrow.is-on { opacity: 0.85; }
        .divergence__arrow::after {
          content: '';
          position: absolute;
          right: -1px;
          top: -3.5px;
          border: 4px solid transparent;
          border-left: 6px solid var(--text-primary);
        }
        .divergence-node {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1.5px solid var(--text-primary);
          background: transparent;
          color: #fff;
          position: relative;
          z-index: 1;
        }
        .divergence-node--intent.is-on { background: var(--text-primary); }
        .divergence-node--ok { border-color: var(--border-default); }
        .divergence-node--ok.is-on {
          background: var(--accent-success);
          border-color: var(--accent-success);
        }
        .divergence-node--ok svg { opacity: 0; }
        .divergence-node--ok.is-on svg { opacity: 1; }
        .divergence-node--alert {
          border-color: var(--accent-divergence);
          color: var(--accent-divergence);
          background: var(--surface-raised);
        }
        .divergence-node--alert.is-on {
          background: var(--accent-divergence);
          color: #fff;
        }
        .divergence__action,
        .divergence__detail,
        .divergence__time {
          margin: 0;
          text-align: center;
          font-family: var(--font-body);
        }
        .divergence__action {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.3;
        }
        .divergence__step--alert .divergence__action { color: var(--accent-divergence); }
        .divergence__detail {
          margin-top: 4px;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--text-muted);
        }
        .divergence__step--alert .divergence__detail { color: var(--accent-divergence); }
        .divergence__time {
          margin-top: 2px;
          font-size: 12px;
          color: var(--text-muted);
        }
        .contrast {
          display: grid;
          grid-template-columns: minmax(280px, 460px) minmax(0, 1fr);
          gap: 36px;
          align-items: start;
          margin-top: 72px;
          padding-top: 56px;
          border-top: 1px solid var(--border-default);
        }
        .contrast__body {
          margin: 16px 0 0;
          max-width: 46ch;
          font-family: var(--font-body);
          font-size: 15px;
          line-height: 1.55;
          color: var(--text-secondary);
        }
        .contrast__board { margin: 0; }
        .contrast__lane-label {
          margin: 0 0 12px;
          font-family: var(--font-body);
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-muted);
        }
        .contrast__steps {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 10px;
        }
        .contrast__card {
          height: 168px;
          box-sizing: border-box;
          padding: 12px;
          background: var(--surface-raised);
          border: 1px solid var(--border-default);
          border-radius: 8px;
        }
        .dark .contrast__card { box-shadow: none; }
        .contrast__card h3 {
          margin: 0 0 6px;
          font-family: var(--font-body);
          font-size: 15px;
          font-weight: 600;
          color: var(--text-primary);
        }
        .contrast__card p,
        .contrast__note,
        .contrast__terminal p {
          margin: 0;
          font-family: var(--font-body);
          font-size: 14px;
          line-height: 1.4;
          color: var(--text-secondary);
        }
        .contrast__rail {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 44px;
          margin-top: 8px;
        }
        .contrast__arrow { top: 50%; }
        .contrast__ghost {
          margin: 4px 0 0;
          text-align: right;
          font-family: var(--font-body);
          font-size: 12px;
          color: var(--text-muted);
          opacity: 0.35;
        }
        .contrast__ghost.is-on { opacity: 1; }
        .contrast__verified { margin-top: 8px; }
        .contrast__fork {
          display: grid;
          grid-template-columns: minmax(220px, 1.2fr) 72px minmax(180px, 0.8fr);
          gap: 12px;
          align-items: center;
        }
        .contrast__check {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          padding: 12px;
          border-radius: 8px;
          background: var(--tint-divergence);
        }
        .contrast__alert { text-align: left; color: var(--accent-divergence); }
        .contrast__note { margin-top: 2px; }
        .contrast__tag {
          display: inline-block;
          margin: 8px 0 0;
          padding: 2px 8px;
          border-radius: 4px;
          background: var(--accent-divergence);
          color: #fff;
          font-family: var(--font-body);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .contrast__dash {
          height: 0;
          border-top: 1.5px dashed var(--accent-divergence);
          opacity: 0;
        }
        .contrast__dash.is-on { opacity: 1; }
        .contrast__terminal {
          padding: 12px;
          background: var(--surface-raised);
          border: 1px solid var(--border-default);
          border-radius: 8px;
        }
        .contrast__terminal h3 {
          margin: 8px 0 6px;
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
        }
        .contrast__empty {
          background: transparent;
          border-style: dashed;
        }
        .contrast__terminal .divergence__action { text-align: left; margin-top: 8px; }
        @media (max-width: 1023px) {
          .divergence__frame { grid-template-columns: 1fr; gap: 28px; }
          .contrast { grid-template-columns: 1fr; margin-top: 48px; padding-top: 36px; }
        }
        @media (max-width: 767px) {
          .divergence__steps,
          .contrast__steps {
            display: flex;
            flex-direction: column;
            gap: 0;
            padding: 0;
          }
          .divergence__step,
          .contrast__step {
            display: grid;
            grid-template-columns: 36px minmax(0, 1fr);
            column-gap: 12px;
            align-items: start;
          }
          .divergence__card,
          .contrast__card {
            grid-column: 2;
            grid-row: 1;
            min-height: 0;
            padding: 12px;
          }
          .divergence__action,
          .divergence__detail,
          .divergence__time {
            grid-column: 2;
            text-align: left;
            margin-left: 0;
          }
          .divergence__action { margin-top: 8px; }
          .divergence__rail,
          .contrast__rail {
            grid-column: 1;
            grid-row: 1 / span 4;
            align-self: stretch;
            flex-direction: column;
            justify-content: flex-start;
            margin: 0;
            min-height: 0;
            background: none;
            padding-top: 14px;
          }
          .divergence__rail::after,
          .contrast__rail::after {
            content: '';
            width: 1.5px;
            flex: 1;
            min-height: 18px;
            margin-top: 4px;
            background: var(--text-primary);
            opacity: 0.45;
          }
          .divergence__step:last-child .divergence__rail::after { display: none; }
          .contrast__step:last-child .contrast__rail::after {
            background: var(--accent-divergence);
            opacity: 1;
          }
          .divergence__step--alert .divergence__rail::after { background: var(--accent-divergence); opacity: 1; }
          .divergence__arrow,
          .contrast__arrow { display: none; }
          .contrast__ghost { text-align: left; margin: 8px 0 16px 48px; }
          .contrast__fork {
            grid-template-columns: 36px minmax(0, 1fr);
            gap: 0 12px;
            align-items: stretch;
          }
          .contrast__check { grid-column: 1 / -1; }
          .contrast__dash {
            display: block;
            grid-column: 1;
            width: 0;
            height: 28px;
            margin: 4px 0 4px 17px;
            border-top: 0;
            border-left: 1.5px dashed var(--accent-divergence);
            justify-self: start;
          }
          .contrast__terminal { grid-column: 2; align-self: center; }
        }
      `}</style>
    </section>
  );
}
