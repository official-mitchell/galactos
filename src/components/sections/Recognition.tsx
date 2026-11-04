/* 2026-11-03: MAX-998 raised font sizes under 12px to 12px.
    2026-11-03: decomposed from the Figma Make landing export into the root app (MAX-993). */
import React, { useEffect, useRef, useState } from 'react';

/* ── Signal data ── */
const SIGNALS = [
  {
    id: 's1',
    text: 'The workflow works most of the time, but failures are hard to reproduce.',
    glyph: 'divergent' as const,
    annotation: null,
  },
  {
    id: 's2',
    text: 'People manually check automated work because they do not fully trust it.',
    glyph: 'unresolved' as const,
    annotation: null,
  },
  {
    id: 's3',
    text: 'A component reports success while downstream systems disagree.',
    glyph: 'missing' as const,
    annotation: 'State diverges here.',
  },
  {
    id: 's4',
    text: 'Retries, handoffs, or asynchronous steps sometimes create duplicates or omissions.',
    glyph: 'duplicate' as const,
    annotation: null,
  },
  {
    id: 's5',
    text: 'Business rules, permissions, or source information change faster than the workflow does.',
    glyph: 'stale' as const,
    annotation: null,
  },
  {
    id: 's6',
    text: 'When something goes wrong, nobody can reconstruct the entire case end to end.',
    glyph: 'unresolved' as const,
    annotation: 'Reconstruction is the gap.',
  },
] as const;

type GlyphType = 'divergent' | 'unresolved' | 'missing' | 'duplicate' | 'stale';

/* ── Glyph components ── */
const GLYPH_DUR = '420ms';

function GlyphDivergent({ drawn }: { drawn: boolean }) {
  const t = (delay: string): React.CSSProperties => ({
    strokeDasharray: 1,
    strokeDashoffset: drawn ? 0 : 1,
    transition: `stroke-dashoffset ${GLYPH_DUR} ease ${delay}`,
  });
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      {/* Stem */}
      <line x1="2" y1="11" x2="11" y2="11" stroke="var(--text-primary)" strokeWidth="1.3"
        pathLength="1" style={t('0ms')} />
      {/* Upper fork — solid */}
      <line x1="11" y1="11" x2="20" y2="5" stroke="var(--text-primary)" strokeWidth="1.3"
        pathLength="1" style={t('80ms')} />
      {/* Lower fork — orange dashed (divergent) */}
      <line x1="11" y1="11" x2="20" y2="17"
        stroke="var(--accent-divergence)" strokeWidth="1.3" strokeDasharray="3 2"
        style={{ opacity: drawn ? 1 : 0, transition: `opacity 260ms ease 220ms` }} />
    </svg>
  );
}

function GlyphUnresolved({ drawn }: { drawn: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="8.5" stroke="var(--text-primary)" strokeWidth="1.3"
        pathLength="1"
        style={{ strokeDasharray: 1, strokeDashoffset: drawn ? 0 : 1, transition: `stroke-dashoffset 500ms ease` }} />
    </svg>
  );
}

function GlyphMissing({ drawn }: { drawn: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="8.5" stroke="var(--text-secondary)" strokeWidth="1.3"
        strokeDasharray="3.5 2.5"
        style={{ opacity: drawn ? 0.65 : 0, transition: `opacity 320ms ease` }} />
      {/* Small gap marker */}
      <line x1="11" y1="3" x2="11" y2="6" stroke="var(--accent-divergence)" strokeWidth="1.3"
        style={{ opacity: drawn ? 1 : 0, transition: `opacity 200ms ease 260ms` }} />
    </svg>
  );
}

function GlyphDuplicate({ drawn }: { drawn: boolean }) {
  const t = (delay: string): React.CSSProperties => ({
    strokeDasharray: 1,
    strokeDashoffset: drawn ? 0 : 1,
    transition: `stroke-dashoffset ${GLYPH_DUR} ease ${delay}`,
  });
  return (
    <svg width="26" height="22" viewBox="0 0 26 22" fill="none" aria-hidden="true">
      <circle cx="9" cy="11" r="7.5" stroke="var(--text-primary)" strokeWidth="1.3"
        pathLength="1" style={t('0ms')} />
      <circle cx="17" cy="11" r="7.5" stroke="var(--text-primary)" strokeWidth="1.3"
        pathLength="1" style={t('120ms')} />
    </svg>
  );
}

function GlyphStale({ drawn }: { drawn: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      {/* Diamond — stale/changed source */}
      <polygon points="11,2 20,11 11,20 2,11" stroke="var(--text-primary)" strokeWidth="1.3" fill="none"
        pathLength="1"
        style={{ strokeDasharray: 1, strokeDashoffset: drawn ? 0 : 1, transition: `stroke-dashoffset 500ms ease` }} />
      {/* Small centre dot suggesting modified state */}
      <circle cx="11" cy="11" r="1.8" fill="var(--text-muted)"
        style={{ opacity: drawn ? 0.5 : 0, transition: `opacity 200ms ease 340ms` }} />
    </svg>
  );
}

function Glyph({ type, drawn }: { type: GlyphType; drawn: boolean }) {
  switch (type) {
    case 'divergent': return <GlyphDivergent drawn={drawn} />;
    case 'unresolved': return <GlyphUnresolved drawn={drawn} />;
    case 'missing':    return <GlyphMissing drawn={drawn} />;
    case 'duplicate':  return <GlyphDuplicate drawn={drawn} />;
    case 'stale':      return <GlyphStale drawn={drawn} />;
  }
}

/* ── Signal row ── */
function SignalRow({
  signal,
  isLast,
  prefersReduced,
}: {
  signal: typeof SIGNALS[number];
  isLast: boolean;
  prefersReduced: boolean;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(prefersReduced);

  useEffect(() => {
    if (prefersReduced) return;
    const el = rowRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [prefersReduced]);

  return (
    <div
      ref={rowRef}
      className="signal-row"
      style={{
        display: 'flex',
        gap: 20,
        alignItems: 'flex-start',
        padding: '28px 12px',
        borderBottom: isLast ? 'none' : '1px solid var(--border-default)',
        borderRadius: 2,
        transition: 'background-color 160ms ease',
        margin: '0 -12px',
      }}
    >
      {/* Glyph */}
      <div style={{ flexShrink: 0, marginTop: 1 }}>
        <Glyph type={signal.glyph} drawn={drawn} />
      </div>

      {/* Text + annotation */}
      <div style={{ flex: 1 }}>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 400,
            fontSize: 16,
            lineHeight: 1.55,
            color: 'var(--text-primary)',
            margin: 0,
          }}
        >
          {signal.text}
        </p>

        {signal.annotation && (
          <div
            style={{
              marginTop: 8,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              opacity: drawn ? 1 : 0,
              transition: 'opacity 280ms ease 300ms',
            }}
          >
            {/* Small orange reading mark */}
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
              <circle cx="4" cy="4" r="3" stroke="var(--accent-divergence)" strokeWidth="1" />
            </svg>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: 12,
                letterSpacing: '0.06em',
                color: 'var(--accent-divergence)',
                textTransform: 'uppercase',
              }}
            >
              {signal.annotation}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Section 6 ── */
export function Recognition() {
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <section
      id="section-diagnostic"
      style={{
        backgroundColor: 'var(--surface-base)',
        paddingTop: 120,
        paddingBottom: 0,
      }}
    >
      <div className="container-editorial">
        <div className="s6-grid">

          {/* ── LEFT: sticky headline + intro ── */}
          <div className="s6-left">
            {/* Section label */}
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: 12,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginBottom: 20,
              }}
            >
              06&nbsp;&nbsp;/&nbsp;&nbsp;Recognition
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 'clamp(28px, 3.6vw, 48px)',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)',
                marginBottom: 28,
              }}
            >
              When this becomes a Galactos problem.
            </h2>

            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 400,
                fontSize: 16,
                lineHeight: 1.6,
                color: 'var(--text-secondary)',
                marginBottom: 0,
                maxWidth: 360,
              }}
            >
              Galactos is useful when an AI-enabled workflow affects customers,
              revenue, or operations, but the team cannot confidently reconcile
              what the workflow reports with what actually happened from trigger
              through final state.
            </p>

            {/* Faint signal count */}
            <div
              style={{
                marginTop: 40,
                paddingTop: 20,
                borderTop: '1px solid var(--border-default)',
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: 12,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
              }}
            >
              {SIGNALS.length} recognition signals
            </div>
          </div>

          {/* ── RIGHT: signal list ── */}
          <div className="s6-right">
            {/* Top rule */}
            <div style={{ height: 1, backgroundColor: 'var(--border-default)', marginBottom: 0 }} />

            {SIGNALS.map((signal, i) => (
              <SignalRow
                key={signal.id}
                signal={signal}
                isLast={i === SIGNALS.length - 1}
                prefersReduced={prefersReduced}
              />
            ))}

            {/* Closing boundary */}
            <div
              style={{
                paddingTop: 28,
                paddingBottom: 56,
                marginTop: 0,
                borderTop: '1px solid var(--border-default)',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 500,
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: 'var(--text-muted)',
                  margin: 0,
                  maxWidth: 480,
                  letterSpacing: '0.01em',
                }}
              >
                The Diagnostic is designed for an existing consequential workflow.
                It is not an enterprise-wide AI transformation program.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .s6-grid {
          display: grid;
          grid-template-columns: 2fr 3fr;
          gap: 0 80px;
          align-items: start;
        }
        .s6-left {
          position: sticky;
          top: 108px;
        }
        .signal-row:hover {
          background-color: var(--surface-raised);
        }

        @media (max-width: 860px) {
          .s6-grid {
            grid-template-columns: 1fr;
            gap: 48px 0;
          }
          .s6-left {
            position: static;
          }
        }
      `}</style>
    </section>
  );
}
