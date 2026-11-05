/* 2026-11-05: legend row under the plates removed.
   2026-11-05: MAX-1021 visual target is galactos-mock-show-proof.png.
   Cards show a domain subtitle, a status rail, and a tinted Actual row.
   2026-11-05: MAX-1021 §6.2. Plates share REPORTED / ACTUAL / VERIFIED.
   Support carries E9, Revenue carries E7, Knowledge renders no Evidence.
   ?motion=final settles every row. s5_view fires once.
   2026-11-04: MAX-1011 carries the Cross-domain reader question and seam from sections.ts.
   2026-11-03: MAX-998 raised font sizes under 12px to 12px.
    2026-11-03: decomposed from the Figma Make landing export into the root app (MAX-993). */
import React, { useEffect, useRef, useState } from 'react';
import { trackSectionView } from '../../analytics/track';
import { storySectionProps } from '../../content/sections';
import { prefersReducedMotion } from '../../motion/reduced';
import { Evidence } from '../Evidence';

/* ── Data ── */
const MODULES = [
  {
    id: 'support',
    index: '01',
    domain: 'Support',
    subtitle: 'Cancellation and refund',
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
    subtitle: 'Lead routing and follow-up',
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
    subtitle: 'Answer generation and citation',
    motif: 'knowledge' as const,
    reported: '"Answer generated."',
    actual:
      'The response relied on obsolete, conflicting, or unauthorized source material.',
    verified:
      'The answer uses the correct authoritative source set, version, and permissions.',
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

function PlateIcon({ type }: { type: MotifType }) {
  if (type === 'support') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M4 7a4 4 0 0 1 8 0v2H4V7Z" stroke="currentColor" strokeWidth="1.2" />
        <path d="M3 9h2v3H3a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1Zm10 0h-2v3h2a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1Z" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    );
  }
  if (type === 'revenue') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <ellipse cx="8" cy="4" rx="5" ry="2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M3 4v4c0 1.1 2.2 2 5 2s5-.9 5-2V4" stroke="currentColor" strokeWidth="1.2" />
        <path d="M3 8v4c0 1.1 2.2 2 5 2s5-.9 5-2V8" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 2 14 5 8 8 2 5 8 2Z" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2 8l6 3 6-3M2 11l6 3 6-3" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

/* ── Single row inside a specimen module ── */
function SpecimenRow({
  label,
  text,
  tone,
  italic,
  resolved,
  last,
}: {
  label: string;
  text: string;
  tone: 'reported' | 'actual' | 'verified';
  italic?: boolean;
  resolved: boolean;
  last?: boolean;
}) {
  const color =
    tone === 'reported'
      ? 'var(--accent-success)'
      : tone === 'actual'
        ? 'var(--accent-divergence)'
        : 'var(--accent-info)';
  return (
    <div
      data-row={label}
      style={{
        display: 'grid',
        gridTemplateColumns: '16px 1fr',
        gap: 10,
        padding: tone === 'actual' ? '12px 10px' : '12px 0',
        marginTop: tone === 'actual' ? 4 : 0,
        borderRadius: tone === 'actual' ? 8 : 0,
        background: tone === 'actual' ? 'color-mix(in srgb, var(--accent-divergence) 10%, transparent)' : 'transparent',
        opacity: resolved ? 1 : 0.2,
        transition: 'opacity 280ms ease',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span
          aria-hidden="true"
          style={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: color,
            color: '#fff',
            fontSize: 10,
            lineHeight: '16px',
            textAlign: 'center',
            fontWeight: 700,
          }}
        >
          {tone === 'actual' ? '×' : '✓'}
        </span>
        {!last && (
          <span aria-hidden="true" style={{ width: 1.5, flex: 1, minHeight: 18, marginTop: 4, background: color, opacity: 0.45 }} />
        )}
      </div>
      <div>
        <div className="text-diagram-system" style={{ color, marginBottom: 4 }}>{label}</div>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 400,
            fontSize: 14,
            lineHeight: 1.5,
            color: 'var(--text-primary)',
            fontStyle: italic ? 'italic' : 'normal',
            margin: 0,
          }}
        >
          {text}
        </p>
      </div>
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
      data-plate={module.id}
    style={{
        position: 'relative',
        backgroundColor: 'var(--surface-raised)',
        border: `1px solid ${hovered ? 'var(--text-primary)' : 'var(--border-default)'}`,
        borderRadius: 12,
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
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span aria-hidden="true" style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--surface-base)', display: 'grid', placeItems: 'center', color: 'var(--text-secondary)' }}>
            <PlateIcon type={module.motif} />
          </span>
          <div>
            <div className="text-diagram-system" style={{ color: 'var(--text-primary)' }}>{module.domain}</div>
            <div className="text-meta">{module.subtitle}</div>
          </div>
        </div>
        <span className="text-meta">{module.index}</span>
      </div>
      <SpecimenRow label="Reported" text={module.reported} tone="reported" italic resolved={rowsResolved[0]} />
      <SpecimenRow label="Actual" text={module.actual} tone="actual" resolved={rowsResolved[1]} />
      <SpecimenRow label="Verified" text={module.verified} tone="verified" resolved={rowsResolved[2]} last />
      {module.id === 'support' && (
        <Evidence
          id="E9"
          plate="support"
          kind="VENDOR · 2026"
          label="A help-desk vendor separates contained resolutions from resolutions that pass an extra check."
          href="https://support.zendesk.com/hc/en-us/articles/9570369117338-About-automated-resolution-tiers"
        />
      )}
      {module.id === 'revenue' && (
        <Evidence
          id="E7"
          plate="revenue"
          kind="ADJACENT · 2025"
          label="A vendor playbook treats bad data, slow routing, and wrong assignment as lead-routing problems."
          href="https://www.leandata.com/wp-content/uploads/2025/06/B2B-Lead-Response-Time-Playbook-eBook-062525.pdf"
        />
      )}
    </div>
  );
}

/* ── Section 5 ── */
export function CrossDomain() {
  const sectionRef = useRef<HTMLElement>(null);
  const settled = typeof window !== 'undefined' && prefersReducedMotion();
  const [moduleVisible, setModuleVisible] = useState(() =>
    settled ? [true, true, true] : [false, false, false],
  );
  const [rowsResolved, setRowsResolved] = useState<boolean[][]>(() =>
    settled
      ? [
          [true, true, true],
          [true, true, true],
          [true, true, true],
        ]
      : [
          [false, false, false],
          [false, false, false],
          [false, false, false],
        ],
  );

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const finish = () => {
      setModuleVisible([true, true, true]);
      setRowsResolved([
        [true, true, true],
        [true, true, true],
        [true, true, true],
      ]);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        trackSectionView('s5_view');
        if (prefersReducedMotion()) {
          finish();
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
    if (prefersReducedMotion()) {
      trackSectionView('s5_view');
      finish();
      return;
    }
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="section-proof"
      {...storySectionProps('section-proof')}
      data-plates={rowsResolved.every((rows) => rows.every(Boolean)) ? 'complete' : 'drawing'}
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
            Cross-domain
          </div>
          <div style={{ height: 1, backgroundColor: 'var(--border-default)' }} />
        </div>

        {/* Headline */}
        <h2 className="text-display-lg" style={{ marginBottom: 16, maxWidth: 720, color: 'var(--text-primary)' }}>
          This problem appears anywhere AI crosses systems.
        </h2>
        <p className="text-lede" style={{ marginTop: 0, marginBottom: 40, maxWidth: 640 }}>
          Work can look complete in one system, while the real business outcome tells a different story.
        </p>

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
      </div>

      <style>{`
        .s5-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          align-items: stretch;
        }
        @media (max-width: 1023px) {
          .s5-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 767px) {
          .s5-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
