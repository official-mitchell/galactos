/* 2026-11-05: Match galactos-mock-done.png. One diagram: local evidence ends at a
   ghost self-report; terminal evidence drops to independent verification.
   Definitions sit in a wide left column. The fork is a wide sweep, not a short hook.
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
import { SeamAnchor } from '../shell/SeamAnchor';

/* ── Timing ── */
const NODE_DELAYS = [0, 260, 520, 800];
const RIGHT_DELAY = 1900;
const TERMINAL_DELAY = 2300;

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
  align = 'center',
}: {
  label: string;
  resolved: boolean;
  type?: 'success' | 'cobalt' | 'terminal' | 'ghost';
  size?: number;
  maxW?: number;
  align?: 'center' | 'flex-start';
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: align,
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
    <>
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
        <svg className="s4-fork" viewBox="0 0 168 460" fill="none" aria-hidden="true">
          <path
            d="M0 52 H158"
            stroke="var(--border-strong)"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            opacity={forkOn ? 1 : 0.25}
          />
          <polyline
            points="148,46 162,52 148,58"
            stroke="var(--border-strong)"
            strokeWidth="1.5"
            fill="none"
            opacity={forkOn ? 1 : 0.25}
          />
          <path
            d="M8 64 C 18 64, 22 150, 36 210 C 58 290, 100 296, 158 296"
            stroke="var(--accent-info)"
            strokeWidth="1.75"
            fill="none"
            opacity={cobaltResolved ? 1 : 0.2}
          />
          <polyline
            points="146,290 164,296 146,302"
            stroke="var(--accent-info)"
            strokeWidth="1.75"
            fill="none"
            opacity={cobaltResolved ? 1 : 0.2}
          />
        </svg>
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
              <NodeUnit label="Independent verification" resolved={cobaltResolved} type="cobalt" size={40} maxW={108} align="flex-start" />
              <div className="s4-join">
                <SmArrow visible={cobaltResolved} width={84} />
              </div>
              <div className="s4-terminal-node">
                <SmNode resolved={terminalResolved} type="terminal" size={44} />
                <span>Authoritative state confirmed</span>
              </div>
            </div>
          </div>
    </>
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
          <div className="s4-board">
            <div className="s4-def s4-def-reported">
              <h3>Reported</h3>
              <p>The workflow, component, or interaction says the work finished.</p>
            </div>
            <DoneDiagram
              resolved={resolved}
              cobaltResolved={cobaltResolved}
              terminalResolved={terminalResolved}
            />
            <div className="s4-def s4-def-verified">
              <h3>Verified</h3>
              <p>
                The intended business state has been independently checked in the authoritative state.
              </p>
            </div>
          </div>
          <div className="s4-close">
            <p className="s4-close-title">Verification begins where local success ends.</p>
            <p className="s4-close-sub">
              Local evidence can be necessary without being sufficient for completion.
            </p>
          </div>
        </div>

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
        .s4-board {
          display: grid;
          grid-template-columns: 300px minmax(240px, 1fr) 168px minmax(240px, 300px);
          grid-template-rows: 240px 220px;
          padding: 28px 0 8px;
          border-bottom: 1px solid var(--border-default);
        }
        .s4-def { border-right: 1px solid var(--border-default); padding-right: 20px; }
        .s4-def-reported { grid-column: 1; grid-row: 1; }
        .s4-def-verified { grid-column: 1; grid-row: 2; align-self: start; padding-top: 48px; }
        .s4-local-col { grid-column: 2; grid-row: 1; padding-left: 24px; }
        .s4-fork { grid-column: 3; grid-row: 1 / 3; width: 168px; height: 460px; overflow: visible; }
        .s4-terminal-block { margin-top: 8px; }
        .s4-ghost { grid-column: 4; grid-row: 1; padding-top: 32px; }
        .s4-terminal-block { grid-column: 4; grid-row: 2; align-self: start; }
        .s4-def h3 {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 40px;
          line-height: 1.2;
          color: var(--text-primary);
          margin: 0 0 8px;
        }
        .s4-def p {
          font-family: var(--font-body);
          font-size: 18px;
          line-height: 1.5;
          color: var(--text-secondary);
          margin: 0;
        }
        .s4-join { margin-top: 11px; flex-shrink: 0; }
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
        @media (max-width: 900px) {
          .s4-board { grid-template-columns: 1fr; grid-template-rows: auto; }
          .s4-def, .s4-local-col, .s4-fork, .s4-ghost, .s4-terminal-block {
            grid-column: 1;
            grid-row: auto;
          }
          .s4-def { border-right: 0; border-bottom: 1px solid var(--border-default); padding: 0 0 16px; margin-bottom: 16px; }
          .s4-def-verified { padding-top: 28px; }
          .s4-fork { width: 120px; height: 180px; }
          .s4-local { flex-wrap: wrap; gap: 12px; }
        }
      `}</style>
    </section>
  );
}
