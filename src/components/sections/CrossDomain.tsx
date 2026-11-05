/* 2026-11-04: MAX-1011 carries the Cross-domain reader question and seam from sections.ts.
   2026-11-03: MAX-998 raised font sizes under 12px to 12px.
    2026-11-03: decomposed from the Figma Make landing export into the root app (MAX-993). */
import React, { useEffect, useRef, useState } from 'react';
import { storySectionProps } from '../../content/sections';

/* ── Data ── */
const MODULES = [
  {
    id: 'support',
    index: '01',
    domain: 'Support',
    motif: 'support' as const,
    reported: '"Refund issued."',
    actual:
      'The refund request was accepted, but settlement failed or the subscription remained active.',
    verified:
      'The authoritative payment and subscription states confirm the requested remedy.',
  },
  {
    id: 'revenue',
    index: '02',
    domain: 'Revenue',
    motif: 'revenue' as const,
    reported: '"Lead qualified and routed."',
    actual:
      'The lead was classified correctly, but ownership failed to propagate or no follow-up was created.',
    verified:
      'The correct owner receives the lead and the required downstream action exists in the CRM.',
  },
  {
    id: 'knowledge',
    index: '03',
    domain: 'Knowledge',
    motif: 'knowledge' as const,
    reported: '"Answer generated."',
    actual:
      'The response relied on obsolete, conflicting, or unauthorized source material.',
    verified:
      'The answer uses the correct authoritative source set, version, and permissions for that user and request.',
  },
] as const;

type MotifType = 'support' | 'revenue' | 'knowledge';

/* ── Timing ── */
// Wave: module i appears at i*200ms; each row within it at +200, +400, +600ms
function getDelay(moduleIdx: number, rowIdx: number) {
  return moduleIdx * 200 + (rowIdx + 1) * 200;
}
function getModuleDelay(moduleIdx: number) {
  return moduleIdx * 200;
}

/* ── Faint background motifs ── */
function Motif({ type }: { type: MotifType }) {
  const style: React.CSSProperties = {
    position: 'absolute',
    bottom: 0,
    right: 0,
    pointerEvents: 'none',
    color: 'var(--text-primary)',
    opacity: 0.055,
  };

  if (type === 'support') {
    return (
      <svg style={style} width="160" height="120" viewBox="0 0 160 120" fill="none" aria-hidden="true">
        {/* Ticket */}
        <rect x="4" y="44" width="48" height="60" rx="2" stroke="currentColor" strokeWidth="0.8" />
        <line x1="10" y1="56" x2="46" y2="56" stroke="currentColor" strokeWidth="0.7" />
        <line x1="10" y1="64" x2="46" y2="64" stroke="currentColor" strokeWidth="0.7" />
        <line x1="10" y1="72" x2="36" y2="72" stroke="currentColor" strokeWidth="0.7" />
        {/* Curved path to ledger */}
        <path d="M 52 74 Q 80 74 80 50 Q 80 30 108 24" stroke="currentColor" strokeWidth="0.7" strokeDasharray="3 2" fill="none" />
        {/* Ledger */}
        <rect x="108" y="8" width="48" height="60" rx="2" stroke="currentColor" strokeWidth="0.8" />
        <line x1="114" y1="20" x2="150" y2="20" stroke="currentColor" strokeWidth="0.7" />
        <line x1="114" y1="28" x2="150" y2="28" stroke="currentColor" strokeWidth="0.7" />
        <line x1="114" y1="36" x2="150" y2="36" stroke="currentColor" strokeWidth="0.7" />
        <line x1="114" y1="44" x2="150" y2="44" stroke="currentColor" strokeWidth="0.7" />
        <line x1="114" y1="52" x2="140" y2="52" stroke="currentColor" strokeWidth="0.7" />
      </svg>
    );
  }

  if (type === 'revenue') {
    return (
      <svg style={style} width="160" height="120" viewBox="0 0 160 120" fill="none" aria-hidden="true">
        {/* Input node */}
        <circle cx="16" cy="60" r="5" stroke="currentColor" strokeWidth="0.8" />
        {/* Stem */}
        <line x1="21" y1="60" x2="60" y2="60" stroke="currentColor" strokeWidth="0.8" />
        {/* Fork point */}
        <circle cx="60" cy="60" r="3" fill="currentColor" />
        {/* Upper branch */}
        <line x1="60" y1="60" x2="100" y2="28" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="100" cy="28" r="5" stroke="currentColor" strokeWidth="0.8" />
        {/* Upper branch continuation */}
        <line x1="105" y1="28" x2="152" y2="14" stroke="currentColor" strokeWidth="0.6" strokeDasharray="3 2" />
        <line x1="105" y1="28" x2="152" y2="42" stroke="currentColor" strokeWidth="0.6" strokeDasharray="3 2" />
        {/* Lower branch */}
        <line x1="60" y1="60" x2="100" y2="92" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="100" cy="92" r="5" stroke="currentColor" strokeWidth="0.8" />
        <line x1="105" y1="92" x2="152" y2="78" stroke="currentColor" strokeWidth="0.6" strokeDasharray="3 2" />
        <line x1="105" y1="92" x2="152" y2="106" stroke="currentColor" strokeWidth="0.6" strokeDasharray="3 2" />
      </svg>
    );
  }

  /* knowledge */
  return (
    <svg style={style} width="160" height="120" viewBox="0 0 160 120" fill="none" aria-hidden="true">
      {/* Overlapping document-source circles */}
      <ellipse cx="52" cy="56" rx="36" ry="46" stroke="currentColor" strokeWidth="0.8" />
      <ellipse cx="88" cy="44" rx="32" ry="40" stroke="currentColor" strokeWidth="0.8" />
      <ellipse cx="112" cy="70" rx="36" ry="38" stroke="currentColor" strokeWidth="0.8" />
      {/* Faint connection lines between centers */}
      <line x1="52" y1="56" x2="88" y2="44" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
      <line x1="88" y1="44" x2="112" y2="70" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
      <line x1="112" y1="70" x2="52" y2="56" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
    </svg>
  );
}

/* ── Row marker dot ── */
function RowMarker({ color }: { color: string }) {
  return (
    <div
      style={{
        width: 7,
        height: 7,
        borderRadius: '50%',
        backgroundColor: color,
        flexShrink: 0,
        marginTop: 1,
      }}
    />
  );
}

/* ── Single row inside a specimen module ── */
function SpecimenRow({
  label,
  text,
  markerColor,
  italic,
  resolved,
  last,
}: {
  label: string;
  text: string;
  markerColor: string;
  italic?: boolean;
  resolved: boolean;
  last?: boolean;
}) {
  return (
    <div
      style={{
        paddingTop: 16,
        paddingBottom: 16,
        borderBottom: last ? 'none' : '1px solid var(--border-default)',
        opacity: resolved ? 1 : 0.2,
        transition: 'opacity 280ms ease',
      }}
    >
      {/* Label row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
        <RowMarker color={markerColor} />
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            fontSize: 12,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}
        >
          {label}
        </span>
      </div>
      {/* Text content */}
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontWeight: 400,
          fontSize: 13,
          lineHeight: 1.55,
          color: 'var(--text-secondary)',
          fontStyle: italic ? 'italic' : 'normal',
          margin: 0,
          paddingLeft: 14,
        }}
      >
        {text}
      </p>
    </div>
  );
}

/* ── Specimen module card ── */
function SpecimenModule({
  module,
  moduleVisible,
  rowsResolved,
}: {
  module: typeof MODULES[number];
  moduleVisible: boolean;
  rowsResolved: boolean[];
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        backgroundColor: 'var(--surface-raised)',
        border: `1px solid ${hovered ? 'var(--text-primary)' : 'var(--border-default)'}`,
        borderRadius: 4,
        padding: '24px 24px 20px',
        overflow: 'hidden',
        opacity: moduleVisible ? 1 : 0,
        transform: moduleVisible ? 'none' : 'translateY(8px)',
        transition: 'opacity 320ms ease, transform 320ms ease, border-color 160ms ease',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Background motif */}
      <Motif type={module.motif} />

      {/* Domain label */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 4,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            fontSize: 12,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--text-primary)',
          }}
        >
          {module.domain}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 400,
            fontSize: 12,
            letterSpacing: '0.06em',
            color: 'var(--text-muted)',
          }}
        >
          {module.index}
        </span>
      </div>

      {/* Hairline below domain label */}
      <div style={{ height: 1, backgroundColor: 'var(--border-default)', marginBottom: 0 }} />

      {/* Three rows */}
      <SpecimenRow
        label="Reported"
        text={module.reported}
        markerColor="var(--accent-success)"
        italic
        resolved={rowsResolved[0]}
      />
      <SpecimenRow
        label="Actual"
        text={module.actual}
        markerColor="var(--accent-divergence)"
        resolved={rowsResolved[1]}
      />
      <SpecimenRow
        label="Verified"
        text={module.verified}
        markerColor="var(--accent-info)"
        resolved={rowsResolved[2]}
        last
      />
    </div>
  );
}

/* ── Section 5 ── */
export function CrossDomain() {
  const sectionRef = useRef<HTMLElement>(null);
  const [moduleVisible, setModuleVisible] = useState([false, false, false]);
  const [rowsResolved, setRowsResolved] = useState<boolean[][]>([
    [false, false, false],
    [false, false, false],
    [false, false, false],
  ]);
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
          setModuleVisible([true, true, true]);
          setRowsResolved([
            [true, true, true],
            [true, true, true],
            [true, true, true],
          ]);
          return;
        }

        // Modules fade in
        [0, 1, 2].forEach(mi => {
          setTimeout(() => {
            setModuleVisible(prev => prev.map((v, i) => (i === mi ? true : v)));
          }, getModuleDelay(mi));
        });

        // Rows resolve in a wave
        [0, 1, 2].forEach(mi => {
          [0, 1, 2].forEach(ri => {
            setTimeout(() => {
              setRowsResolved(prev =>
                prev.map((module, mi2) =>
                  mi2 === mi ? module.map((v, ri2) => (ri2 === ri ? true : v)) : module
                )
              );
            }, getDelay(mi, ri));
          });
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [prefersReduced]);

  return (
    <section
      ref={sectionRef}
      id="section-proof"
      {...storySectionProps('section-proof')}
      style={{
        backgroundColor: 'var(--surface-base)',
        paddingTop: 120,
        paddingBottom: 120,
      }}
    >
      <div className="container-editorial">

        {/* Section label */}
        <div style={{ marginBottom: 48 }}>
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: 12,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: 12,
            }}
          >
            05&nbsp;&nbsp;/&nbsp;&nbsp;Cross-domain
          </div>
          <div style={{ height: 1, backgroundColor: 'var(--border-default)' }} />
        </div>

        {/* Headline */}
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 'clamp(28px, 4vw, 48px)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
            marginBottom: 56,
            maxWidth: 680,
          }}
        >
          This problem appears anywhere AI crosses systems.
        </h2>

        {/* Specimen grid */}
        <div className="s5-grid">
          {MODULES.map((module, i) => (
            <SpecimenModule
              key={module.id}
              module={module}
              moduleVisible={moduleVisible[i]}
              rowsResolved={rowsResolved[i]}
            />
          ))}
        </div>

        {/* Footer note */}
        <div
          style={{
            marginTop: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: 'var(--accent-success)', flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Reported</span>
          </div>
          <span style={{ color: 'var(--border-strong)', fontSize: 12 }}>·</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: 'var(--accent-divergence)', flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Actual (divergence)</span>
          </div>
          <span style={{ color: 'var(--border-strong)', fontSize: 12 }}>·</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: 'var(--accent-info)', flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Verified (requirement)</span>
          </div>
        </div>
      </div>

      <style>{`
        .s5-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          align-items: stretch;
        }
        @media (max-width: 960px) {
          .s5-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 580px) {
          .s5-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
