/* 2026-11-05: Match galactos-mock-done.png. One diagram: local evidence ends at a
   ghost self-report; terminal evidence drops to independent verification.
   Definitions sit in a left column. "Authoritative state" stays a focusable term.
   2026-11-05: MAX-1020 §6.1. Lane labels are diagram-system rails, not a second headline.
   Reported lane ends at a ghost node. Verified lane fills the terminal node.
   "Authoritative state" is a focusable term described by a visible footnote.
   ?motion=final settles both lanes. Evidence E1 sits under the section.
   2026-11-04: MAX-1014 placeholder eyebrow. The S3 closing line and arrow land on this x.
   2026-11-04: MAX-1011 carries the New standard reader question and seam from sections.ts.
   2026-11-03: MAX-998 raised font sizes under 12px to 12px.
    2026-11-03: decomposed from the Figma Make landing export into the root app (MAX-993).
    2026-11-04: MAX-1008 shows the authoritative-state definition in the page. It is not a hover tooltip. */
import React, { useEffect, useRef, useState } from 'react';
import { trackSectionView } from '../../analytics/track';
import { storySectionProps } from '../../content/sections';
import { prefersReducedMotion } from '../../motion/reduced';
import { Evidence } from '../Evidence';
import { SeamAnchor } from '../shell/SeamAnchor';

/* ── Timing ── */
const NODE_DELAYS = [0, 260, 520, 800];
const RIGHT_DELAY = 1900;
const TERMINAL_DELAY = 2300;

/* ── Tooltip ── */
const AUTHORITATIVE_NOTE_ID = 'authoritative-state-note';
const AUTHORITATIVE_NOTE =
  'Authoritative state: the system or evidence source that determines whether the promised business result actually exists.';

function AuthoritativeStateTerm() {
  return (
    <button
      type="button"
      aria-describedby={AUTHORITATIVE_NOTE_ID}
      style={{
        font: 'inherit',
        color: 'inherit',
        fontWeight: 'inherit',
        background: 'none',
        border: 0,
        padding: 0,
        cursor: 'pointer',
        textDecoration: 'underline',
        textDecorationStyle: 'dotted',
        textDecorationColor: 'var(--border-strong)',
        textUnderlineOffset: '3px',
      }}
    >
      authoritative state
    </button>
  );
}

/* ── Small node ── */
function SmNode({
  resolved,
  type = 'success',
  size = 18,
}: {
  resolved: boolean;
  type?: 'success' | 'cobalt' | 'terminal' | 'ghost';
  size?: number;
}) {
  const fills = {
    success: 'var(--accent-success)',
    cobalt: 'var(--accent-info)',
    terminal: 'var(--text-primary)',
    ghost: 'transparent',
  };
  const borders = {
    success: resolved ? 'var(--accent-success)' : 'var(--border-strong)',
    cobalt: resolved ? 'var(--accent-info)' : 'var(--border-strong)',
    terminal: 'var(--text-primary)',
    ghost: 'var(--border-strong)',
  };

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        flexShrink: 0,
        backgroundColor: resolved ? fills[type] : 'transparent',
        border: `1.5px ${type === 'ghost' ? 'dashed' : 'solid'} ${borders[type]}`,
        boxShadow: type === 'terminal' && resolved ? '0 0 0 3px var(--surface-base), 0 0 0 4.5px var(--text-primary)' : undefined,
        transition: 'background-color 300ms ease, border-color 260ms ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {(type === 'success' || type === 'cobalt' || type === 'terminal') && resolved && (
        <svg width={size * 0.52} height={size * 0.52} viewBox="0 0 10 10" fill="none">
          <polyline points="1.5,5 4,7.5 8.5,2.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}

/* ── Inline arrow ── */
function SmArrow({ visible, width = 36 }: { visible: boolean; width?: number }) {
  return (
    <svg
      width={width}
      height={18}
      viewBox={`0 0 ${width} 18`}
      fill="none"
      style={{ flexShrink: 0, opacity: visible ? 1 : 0, transition: 'opacity 240ms ease' }}
      aria-hidden="true"
    >
      <line x1="0" y1="9" x2={width - 7} y2="9" stroke="var(--text-primary)" strokeWidth="1.2" />
      <polyline
        points={`${width - 10},5 ${width - 2},9 ${width - 10},13`}
        stroke="var(--text-primary)"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/* ── Node unit: node + label stacked ── */
function NodeUnit({
  label,
  resolved,
  type = 'success',
  size = 18,
  maxW = 56,
}: {
  label: string;
  resolved: boolean;
  type?: 'success' | 'cobalt' | 'terminal' | 'ghost';
  size?: number;
  maxW?: number;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 7,
        flexShrink: 0,
      }}
    >
      <SmNode resolved={resolved} type={type} size={size} />
      <span
        style={{
          fontFamily: 'var(--font-body)',
          fontWeight: 400,
          fontSize: 12,
          letterSpacing: '0.03em',
          color: 'var(--text-muted)',
          textAlign: 'center',
          lineHeight: 1.3,
          maxWidth: maxW,
          opacity: resolved ? 1 : 0.3,
          transition: 'opacity 240ms ease',
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* ── Shared labels ── */
const SHARED_LABELS = ['Model response', 'API accepted', 'Automation complete', 'Case closed'];

/* ── Done diagram: local row, ghost self-report, terminal drop ── */
function DoneDiagram({
  resolved,
  cobaltResolved,
  terminalResolved,
}: {
  resolved: boolean[];
  cobaltResolved: boolean;
  terminalResolved: boolean;
}) {
  const forkOn = resolved[3];
  return (
    <div className="s4-diagram">
      <div className="s4-flow">
        <div className="s4-local-col">
          <div className="s4-rail s4-rail-local">
            <span>Local evidence</span>
          </div>
          <div className="s4-local">
            {SHARED_LABELS.map((label, i) => (
              <React.Fragment key={label}>
                <NodeUnit label={label} resolved={resolved[i]} type="success" size={40} maxW={84} />
                {i < 3 && (
                  <div className="s4-join">
                    <SmArrow visible={resolved[i]} width={36} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        <svg className="s4-fork" viewBox="0 0 76 156" fill="none" aria-hidden="true">
          <path
            d="M0 20 H68"
            stroke="var(--border-strong)"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            opacity={forkOn ? 1 : 0.25}
          />
          <polyline
            points="60,15 70,20 60,25"
            stroke="var(--border-strong)"
            strokeWidth="1.5"
            fill="none"
            opacity={forkOn ? 1 : 0.25}
          />
          <path
            d="M4 24 C 8 78, 18 112, 62 128"
            stroke="var(--accent-info)"
            strokeWidth="1.75"
            fill="none"
            opacity={cobaltResolved ? 1 : 0.2}
          />
          <polyline
            points="52,122 68,130 54,138"
            stroke="var(--accent-info)"
            strokeWidth="1.75"
            fill="none"
            opacity={cobaltResolved ? 1 : 0.2}
          />
        </svg>
        <div className="s4-outcomes">
          <div className="s4-ghost" style={{ opacity: forkOn ? 1 : 0.35 }}>
            <SmNode resolved={false} type="ghost" size={40} />
            <div>
              <div className="s4-ghost-title">Self-reported completion</div>
              <div className="s4-ghost-note">No independent proof beyond this point.</div>
            </div>
          </div>
          <div className="s4-terminal-block">
            <div className="s4-rail s4-rail-terminal">
              <span>Terminal evidence</span>
            </div>
            <div className="s4-terminal">
              <NodeUnit label="Independent verification" resolved={cobaltResolved} type="cobalt" size={40} maxW={108} />
              <div className="s4-join">
                <SmArrow visible={cobaltResolved} width={36} />
              </div>
              <div className="s4-terminal-node">
                <SmNode resolved={terminalResolved} type="terminal" size={44} />
                <span>Authoritative state confirmed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Section 4 ── */
export function NewStandard() {
  const sectionRef = useRef<HTMLElement>(null);
  const settled = typeof window !== 'undefined' && prefersReducedMotion();
  const [resolved, setResolved] = useState(() =>
    settled ? [true, true, true, true] : [false, false, false, false],
  );
  const [cobaltResolved, setCobaltResolved] = useState(settled);
  const [terminalResolved, setTerminalResolved] = useState(settled);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const settle = () => {
      setResolved([true, true, true, true]);
      setCobaltResolved(true);
      setTerminalResolved(true);
    };
    trackSectionView('s4_view');
    if (prefersReducedMotion()) {
      settle();
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        NODE_DELAYS.forEach((delay, i) => {
          setTimeout(() => setResolved(prev => prev.map((v, j) => (j === i ? true : v))), delay);
        });
        setTimeout(() => setCobaltResolved(true), RIGHT_DELAY);
        setTimeout(() => setTerminalResolved(true), TERMINAL_DELAY);
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="section-verification"
      className="seam-host"
      {...storySectionProps('section-verification')}
      data-lanes={resolved.every(Boolean) && cobaltResolved && terminalResolved ? 'complete' : 'drawing'}
      data-terminal={terminalResolved ? 'filled' : 'open'}
      style={{
        backgroundColor: 'var(--surface-base)',
        paddingTop: 120,
        paddingBottom: 96,
      }}
    >
      <SeamAnchor id="s3-s4" end role="eyebrow" />
      <div className="container-editorial">

        <div className="s4-frame">
          <h2 className="s4-headline">“Done” has two meanings.</h2>
          <div className="s4-split">
            <div className="s4-defs">
              <h3>Reported</h3>
              <p>The workflow, component, or interaction says the work finished.</p>
              <h3>Verified</h3>
              <p>
                The intended business state has been independently checked in the{' '}
                <AuthoritativeStateTerm />.
              </p>
            </div>
            <DoneDiagram
              resolved={resolved}
              cobaltResolved={cobaltResolved}
              terminalResolved={terminalResolved}
            />
          </div>
          <div className="s4-close">
            <p className="s4-close-title">Verification begins where local success ends.</p>
            <p className="s4-close-sub">
              Local evidence can be necessary without being sufficient for completion.
            </p>
            <p id={AUTHORITATIVE_NOTE_ID} className="text-meta s4-note">
              {AUTHORITATIVE_NOTE}
            </p>
          </div>
        </div>

      </div>

      <div className="container-editorial">
        <Evidence
          id="E1"
          kind="RESEARCH · 2025"
          label="A customer-service benchmark scores the agent on the final data state, not the conversation."
          href="https://arxiv.org/abs/2406.12045"
        />
      </div>

      <style>{`
        .s4-frame { border-top: 1px solid var(--border-default); }
        .s4-headline {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: clamp(40px, 4.6vw, 64px);
          line-height: 1.08;
          letter-spacing: -0.02em;
          color: var(--text-primary);
          margin: 0;
          padding: 28px 0 32px;
          border-bottom: 1px solid var(--border-default);
        }
        .s4-split {
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 32px;
          padding: 36px 0 28px;
          border-bottom: 1px solid var(--border-default);
          align-items: start;
        }
        .s4-defs { border-right: 1px solid var(--border-default); padding-right: 24px; }
        .s4-defs h3 {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 28px;
          line-height: 1.2;
          color: var(--text-primary);
          margin: 0 0 8px;
        }
        .s4-defs h3 + p { margin-bottom: 36px; }
        .s4-defs p {
          font-family: var(--font-body);
          font-size: 15px;
          line-height: 1.5;
          color: var(--text-secondary);
          margin: 0;
        }
        .s4-diagram { min-width: 0; }
        .s4-flow { display: flex; align-items: flex-start; gap: 0; }
        .s4-local-col { flex: 1; min-width: 0; }
        .s4-join { margin-top: 11px; flex-shrink: 0; }
        .s4-fork { width: 76px; height: 156px; flex-shrink: 0; margin-top: 28px; }
        .s4-outcomes { width: 248px; flex-shrink: 0; padding-top: 28px; }
        .s4-terminal-block { margin-top: 36px; }
        .s4-rail {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-family: var(--font-body);
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-muted);
        }
        .s4-rail::before, .s4-rail::after {
          content: "";
          flex: 1;
          height: 8px;
          margin-top: 4px;
          border-top: 1px solid var(--border-strong);
        }
        .s4-rail::before { border-left: 1px solid var(--border-strong); }
        .s4-rail::after { border-right: 1px solid var(--border-strong); }
        .s4-rail-local { margin-bottom: 12px; }
        .s4-local { display: flex; align-items: flex-start; justify-content: space-between; gap: 4px; }
        .s4-ghost { display: flex; align-items: flex-start; gap: 12px; min-height: 40px; }
        .s4-ghost-title {
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 500;
          color: var(--text-primary);
          line-height: 1.3;
        }
        .s4-ghost-note {
          font-family: var(--font-body);
          font-size: 12px;
          color: var(--text-muted);
          line-height: 1.4;
          margin-top: 4px;
        }
        .s4-rail-terminal { color: var(--accent-info); margin-bottom: 12px; }
        .s4-rail-terminal::before, .s4-rail-terminal::after { border-color: var(--accent-info); }
        .s4-terminal { display: flex; align-items: flex-start; gap: 4px; }
        .s4-terminal-node {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 7px;
        }
        .s4-terminal-node span {
          font-family: var(--font-body);
          font-size: 12px;
          color: var(--text-muted);
          text-align: center;
          max-width: 110px;
          line-height: 1.3;
        }
        .s4-close { text-align: center; padding: 40px 16px 8px; }
        .s4-close-title {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: clamp(28px, 3vw, 40px);
          line-height: 1.15;
          color: var(--text-primary);
          margin: 0 0 12px;
        }
        .s4-close-sub {
          font-family: var(--font-body);
          font-size: 16px;
          color: var(--text-secondary);
          margin: 0;
        }
        .s4-note { max-width: 520px; margin: 20px auto 0; }
        @media (max-width: 900px) {
          .s4-split { grid-template-columns: 1fr; }
          .s4-defs { border-right: 0; border-bottom: 1px solid var(--border-default); padding: 0 0 24px; }
          .s4-flow { flex-direction: column; gap: 20px; }
          .s4-fork { margin-top: 0; }
          .s4-outcomes { width: 100%; padding-top: 0; }
          .s4-local { flex-wrap: wrap; gap: 12px; }
        }
      `}</style>
    </section>
  );
}
