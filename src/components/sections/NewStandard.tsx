/* 2026-11-03: MAX-998 raised font sizes under 12px to 12px.
    2026-11-03: decomposed from the Figma Make landing export into the root app (MAX-993). */
import React, { useEffect, useRef, useState } from 'react';

/* ── Timing ── */
const NODE_DELAYS   = [0, 320, 640, 960];   // shared 4 nodes
const RIGHT_DELAY   = 960 + 640;            // cobalt node + continuation
const TERMINAL_DELAY = RIGHT_DELAY + 420;

/* ── Tooltip ── */
function AuthoritativeStateTooltip({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const CONTENT =
    'Authoritative state: the system or evidence source that determines whether the promised business result actually exists.';

  return (
    <span style={{ position: 'relative', display: 'inline' }}>
      <button
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        aria-describedby="tooltip-auth-state"
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'help',
          font: 'inherit',
          color: 'inherit',
          fontWeight: 'inherit',
          textDecoration: 'underline',
          textDecorationStyle: 'dotted',
          textDecorationColor: 'var(--border-strong)',
          textUnderlineOffset: '3px',
        }}
      >
        {children}
      </button>

      <span
        id="tooltip-auth-state"
        role="tooltip"
        aria-hidden={!open}
        style={{
          position: 'absolute',
          bottom: 'calc(100% + 10px)',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 80,
          backgroundColor: 'var(--surface-raised)',
          border: '1px solid var(--border-default)',
          borderRadius: 4,
          padding: '10px 14px',
          width: 264,
          pointerEvents: 'none',
          opacity: open ? 1 : 0,
          transition: 'opacity 150ms ease',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {/* Caret */}
        <span
          style={{
            position: 'absolute',
            bottom: -5,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 8,
            height: 8,
            backgroundColor: 'var(--surface-raised)',
            border: '1px solid var(--border-default)',
            borderTop: 'none',
            borderLeft: 'none',
            rotate: '45deg',
          }}
        />
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 400,
            fontSize: 12,
            lineHeight: 1.55,
            color: 'var(--text-primary)',
          }}
        >
          {CONTENT}
        </span>
      </span>
    </span>
  );
}

/* ── Small node ── */
function SmNode({
  resolved,
  type = 'success',
  size = 18,
}: {
  resolved: boolean;
  type?: 'success' | 'cobalt' | 'terminal';
  size?: number;
}) {
  const fills = {
    success: 'var(--accent-success)',
    cobalt: 'var(--accent-info)',
    terminal: 'transparent',
  };
  const borders = {
    success: resolved ? 'var(--accent-success)' : 'var(--border-strong)',
    cobalt: resolved ? 'var(--accent-info)' : 'var(--border-strong)',
    terminal: 'var(--text-primary)',
  };

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        flexShrink: 0,
        backgroundColor: resolved ? fills[type] : 'transparent',
        border: `1.5px solid ${borders[type]}`,
        transition: 'background-color 300ms ease, border-color 260ms ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {type === 'success' && resolved && (
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

/* ── Boundary line ── */
function Boundary({ crossed = false }: { crossed?: boolean }) {
  return (
    <svg
      width="14"
      height="56"
      viewBox="0 0 14 56"
      fill="none"
      style={{ flexShrink: 0, alignSelf: 'flex-start' }}
      aria-hidden="true"
    >
      <line
        x1="7"
        y1="0"
        x2="7"
        y2="56"
        stroke="var(--border-strong)"
        strokeWidth="1"
        strokeDasharray="3 3"
      />
      {crossed && (
        /* crossing tick — short perpendicular mark at mid-point */
        <line x1="1" y1="21" x2="13" y2="21" stroke="var(--border-strong)" strokeWidth="1" />
      )}
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
  type?: 'success' | 'cobalt' | 'terminal';
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

/* ── LEFT trace (stops at boundary) ── */
function LeftTrace({ resolved }: { resolved: boolean[] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflow: 'visible' }}>
      {SHARED_LABELS.map((label, i) => (
        <React.Fragment key={label}>
          <NodeUnit label={label} resolved={resolved[i]} type="success" />
          {i < 3 && <SmArrow visible={resolved[i]} width={32} />}
        </React.Fragment>
      ))}

      {/* Stop arrow pointing at boundary */}
      <div style={{ display: 'flex', alignItems: 'center', paddingBottom: 22 }}>
        <svg
          width="24"
          height="18"
          viewBox="0 0 24 18"
          fill="none"
          style={{ opacity: resolved[3] ? 0.35 : 0, transition: 'opacity 280ms ease' }}
          aria-hidden="true"
        >
          <line x1="0" y1="9" x2="18" y2="9" stroke="var(--text-primary)" strokeWidth="1.2" />
          <polyline points="14,5 22,9 14,13" stroke="var(--text-primary)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
        <Boundary crossed={false} />
      </div>
    </div>
  );
}

/* ── RIGHT trace (continues past boundary) ── */
function RightTrace({
  resolved,
  cobaltResolved,
  terminalResolved,
}: {
  resolved: boolean[];
  cobaltResolved: boolean;
  terminalResolved: boolean;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, overflow: 'visible' }}>
      {SHARED_LABELS.map((label, i) => (
        <React.Fragment key={label}>
          <NodeUnit label={label} resolved={resolved[i]} type="success" />
          {i < 3 && <div style={{ paddingTop: 1 }}><SmArrow visible={resolved[i]} width={32} /></div>}
        </React.Fragment>
      ))}

      {/* Boundary + crossing arrows */}
      <div style={{ display: 'flex', alignItems: 'center', paddingTop: 1 }}>
        <SmArrow visible={resolved[3]} width={18} />
        <Boundary crossed={cobaltResolved} />
        <SmArrow visible={cobaltResolved} width={18} />
      </div>

      {/* Independent check (Cobalt evidence node) */}
      <NodeUnit label="Independent check" resolved={cobaltResolved} type="cobalt" maxW={52} />

      {/* Arrow to terminal */}
      <div style={{ paddingTop: 1 }}>
        <SmArrow visible={cobaltResolved} width={28} />
      </div>

      {/* Terminal node with inline tooltip label */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, flexShrink: 0 }}>
        <SmNode resolved={terminalResolved} type="terminal" size={20} />
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 400,
            fontSize: 12,
            color: 'var(--text-muted)',
            textAlign: 'center',
            lineHeight: 1.3,
            maxWidth: 76,
            opacity: terminalResolved ? 1 : 0,
            transition: 'opacity 280ms ease',
          }}
        >
          <AuthoritativeStateTooltip>Authoritative state</AuthoritativeStateTooltip>{' '}confirmed
        </span>
      </div>
    </div>
  );
}

/* ── Mobile vertical trace ── */
function VerticalTrace({
  side,
  resolved,
  cobaltResolved,
  terminalResolved,
}: {
  side: 'left' | 'right';
  resolved: boolean[];
  cobaltResolved: boolean;
  terminalResolved: boolean;
}) {
  const nodes = SHARED_LABELS.map((label, i) => ({ label, resolved: resolved[i] }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {nodes.map((node, i) => (
        <React.Fragment key={node.label}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <SmNode resolved={node.resolved} type="success" size={16} />
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 400,
                fontSize: 12,
                color: 'var(--text-secondary)',
                opacity: node.resolved ? 1 : 0.3,
                transition: 'opacity 240ms ease',
              }}
            >
              {node.label}
            </span>
          </div>
          <div
            style={{
              marginLeft: 7,
              width: 1.5,
              height: 24,
              backgroundColor: 'var(--border-default)',
              opacity: node.resolved ? 0.5 : 0.15,
            }}
          />
        </React.Fragment>
      ))}

      {/* Boundary line (horizontal on mobile) */}
      <div
        style={{
          borderTop: '1px dashed var(--border-strong)',
          marginLeft: 0,
          marginBottom: 12,
          marginTop: 4,
          opacity: resolved[3] ? 1 : 0,
          transition: 'opacity 240ms ease',
        }}
      />

      {side === 'right' && (
        <>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              opacity: cobaltResolved ? 1 : 0,
              transition: 'opacity 280ms ease',
            }}
          >
            <SmNode resolved={cobaltResolved} type="cobalt" size={16} />
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: 12, color: 'var(--text-secondary)' }}>
              Independent check
            </span>
          </div>
          <div style={{ marginLeft: 7, width: 1.5, height: 20, backgroundColor: 'var(--border-default)', opacity: cobaltResolved ? 0.4 : 0, transition: 'opacity 240ms ease' }} />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              opacity: terminalResolved ? 1 : 0,
              transition: 'opacity 280ms ease',
            }}
          >
            <SmNode resolved={terminalResolved} type="terminal" size={18} />
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: 12, color: 'var(--text-secondary)' }}>
              <AuthoritativeStateTooltip>Authoritative state</AuthoritativeStateTooltip> confirmed
            </span>
          </div>
        </>
      )}
    </div>
  );
}

/* ── Section 4 ── */
export function NewStandard() {
  const sectionRef = useRef<HTMLElement>(null);
  const [resolved, setResolved] = useState([false, false, false, false]);
  const [cobaltResolved, setCobaltResolved] = useState(false);
  const [terminalResolved, setTerminalResolved] = useState(false);
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        if (prefersReduced) {
          setResolved([true, true, true, true]);
          setCobaltResolved(true);
          setTerminalResolved(true);
          return;
        }

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
  }, [prefersReduced]);

  return (
    <section
      ref={sectionRef}
      id="section-verification"
      style={{
        backgroundColor: 'var(--surface-base)',
        paddingTop: 120,
        paddingBottom: 96,
      }}
    >
      <div className="container-editorial">

        {/* Headline */}
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 'clamp(32px, 4vw, 48px)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
            marginBottom: 64,
            maxWidth: 540,
          }}
        >
          "Done" has two meanings.
        </h2>

        {/* ── Side-by-side contrast ── */}
        <div className="s4-grid">

          {/* LEFT: Reported */}
          <div className="s4-col">
            {/* Large word */}
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontStyle: 'italic',
                fontSize: 'clamp(48px, 6vw, 72px)',
                lineHeight: 1,
                letterSpacing: '-0.025em',
                color: 'var(--text-secondary)',
                marginBottom: 16,
              }}
            >
              Reported
            </div>

            {/* Metadata */}
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 400,
                fontSize: 14,
                lineHeight: 1.55,
                color: 'var(--text-secondary)',
                marginBottom: 36,
                maxWidth: 340,
              }}
            >
              Reported completion means the workflow, component, or interaction says
              the work finished.
            </p>

            {/* Desktop trace */}
            <div className="trace-d">
              <LeftTrace resolved={resolved} />
            </div>

            {/* Mobile trace */}
            <div className="trace-m">
              <VerticalTrace side="left" resolved={resolved} cobaltResolved={false} terminalResolved={false} />
            </div>
          </div>

          {/* Vertical divider */}
          <div className="s4-rule" aria-hidden="true">
            <div
              style={{
                width: 1,
                height: '100%',
                backgroundColor: 'var(--border-default)',
                minHeight: 200,
              }}
            />
          </div>

          {/* Horizontal divider (mobile only) */}
          <div className="s4-hrule" aria-hidden="true">
            <div style={{ height: 1, backgroundColor: 'var(--border-default)', width: '100%' }} />
          </div>

          {/* RIGHT: Verified */}
          <div className="s4-col">
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 'clamp(48px, 6vw, 72px)',
                lineHeight: 1,
                letterSpacing: '-0.025em',
                color: 'var(--text-primary)',
                marginBottom: 16,
              }}
            >
              Verified
            </div>

            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 400,
                fontSize: 14,
                lineHeight: 1.55,
                color: 'var(--text-secondary)',
                marginBottom: 36,
                maxWidth: 360,
              }}
            >
              Verified completion means the intended business state has been
              independently checked in the{' '}
              <AuthoritativeStateTooltip>authoritative state</AuthoritativeStateTooltip>
              {' '}— the system or evidence source that can actually prove the outcome.
            </p>

            {/* Desktop trace */}
            <div className="trace-d" style={{ overflow: 'visible' }}>
              <RightTrace
                resolved={resolved}
                cobaltResolved={cobaltResolved}
                terminalResolved={terminalResolved}
              />
            </div>

            {/* Mobile trace */}
            <div className="trace-m">
              <VerticalTrace
                side="right"
                resolved={resolved}
                cobaltResolved={cobaltResolved}
                terminalResolved={terminalResolved}
              />
            </div>
          </div>
        </div>

        {/* ── Definition block ── */}
        <div
          style={{
            marginTop: 80,
            paddingTop: 56,
            borderTop: '1px solid var(--border-default)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 24,
          }}
        >
          <blockquote
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(20px, 2.8vw, 32px)',
              lineHeight: 1.25,
              letterSpacing: '-0.01em',
              color: 'var(--text-primary)',
              maxWidth: 760,
              margin: 0,
            }}
          >
            A workflow is complete only when the intended end state has been
            independently verified — not merely when the components involved
            report success.
          </blockquote>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              fontSize: 15,
              lineHeight: 1.65,
              color: 'var(--text-secondary)',
              maxWidth: 620,
              margin: 0,
            }}
          >
            For consequential workflows, verified completion means the required
            outcome exists correctly, within policy, without unresolved contradiction
            or duplicate side effects, and with evidence sufficient to determine
            what actually happened.
          </p>
        </div>

        {/* ── Signature line ── */}
        <div
          style={{
            marginTop: 56,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div style={{ width: 24, height: 1, backgroundColor: 'var(--border-default)' }} />
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: 12,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
            }}
          >
            See what's actually happening.
          </span>
          <div style={{ width: 24, height: 1, backgroundColor: 'var(--border-default)' }} />
        </div>

      </div>

      <style>{`
        .s4-grid {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 0 48px;
          align-items: start;
        }
        .s4-rule  { display: flex; }
        .s4-hrule { display: none; }
        .trace-d  { display: block; overflow: visible; }
        .trace-m  { display: none; }

        @media (max-width: 860px) {
          .s4-grid {
            grid-template-columns: 1fr;
            gap: 48px 0;
          }
          .s4-rule  { display: none; }
          .s4-hrule { display: block; }
          .trace-d  { display: none; }
          .trace-m  { display: block; }
        }
      `}</style>
    </section>
  );
}
