/* 2026-11-05: MAX-1024 reader tags, rest preview mask, 768 columns, s8_view.
   2026-11-04: MAX-1011 carries the Outputs reader question from sections.ts.
   2026-11-03: MAX-998 raised font sizes under 12px to 12px.
    2026-11-03: decomposed from the Figma Make landing export into the root app (MAX-993). */
import React, { useEffect, useRef, useState } from 'react';
import { trackSectionView } from '../../analytics/track';
import { storySectionProps } from '../../content/sections';

/* ─────────────────────────────────────────────────────
   A.01 — Workflow + Failure Map
───────────────────────────────────────────────────── */
function TracePreview(_props: { hovered: boolean }) {
  return (
    <div style={{ padding: '12px 14px 0' }}>
      <svg viewBox="0 0 228 96" width="100%" style={{ display: 'block', overflow: 'visible' }} aria-hidden="true">
        {/* Timestamps */}
        {[{ x: 26, t: 'T+0ms' }, { x: 99, t: 'T+142ms' }, { x: 172, t: 'T+388ms' }].map(({ x, t }) => (
          <text key={x} x={x} y={13} fontSize="12" fontFamily="Inter, sans-serif" fontWeight="500"
            letterSpacing="0.09em" fill="var(--text-muted)" textAnchor="middle">{t}</text>
        ))}
        {/* Arrows */}
        <line x1="35" y1="42" x2="87" y2="42" stroke="var(--border-strong)" strokeWidth="0.75" />
        <polyline points="84,38 87,42 84,46" stroke="var(--border-strong)" strokeWidth="0.75" fill="none" />
        <line x1="108" y1="42" x2="160" y2="42" stroke="var(--border-strong)" strokeWidth="0.75" />
        <polyline points="157,38 160,42 157,46" stroke="var(--border-strong)" strokeWidth="0.75" fill="none" />
        {/* Faint continuation right */}
        <line x1="181" y1="42" x2="218" y2="42" stroke="var(--border-default)" strokeWidth="0.7" strokeDasharray="3 2" />
        <polyline points="215,38 218,42 215,46" stroke="var(--border-default)" strokeWidth="0.7" fill="none" />
        {/* Intent node */}
        <circle cx="26" cy="42" r="8.5" stroke="var(--text-primary)" strokeWidth="1" fill="var(--surface-raised)" />
        {/* Success node 1 */}
        <circle cx="99" cy="42" r="8.5" fill="var(--accent-success)" />
        <polyline points="95,42 98,45 104,38" stroke="rgba(10,21,32,0.8)" strokeWidth="1.1" fill="none" />
        {/* Success node 2 */}
        <circle cx="172" cy="42" r="8.5" fill="var(--accent-success)" />
        <polyline points="168,42 171,45 177,38" stroke="rgba(10,21,32,0.8)" strokeWidth="1.1" fill="none" />
        {/* Orange dashed branch */}
        <line x1="172" y1="51" x2="172" y2="74" stroke="var(--accent-divergence)" strokeWidth="0.9" strokeDasharray="3 2" />
        <polyline points="168,71 172,74 176,71" stroke="var(--accent-divergence)" strokeWidth="0.9" fill="none" />
        {/* Anomaly node */}
        <circle cx="172" cy="82" r="7" stroke="var(--accent-divergence)" strokeWidth="1" fill="var(--surface-raised)" />
        <circle cx="172" cy="82" r="2.2" fill="var(--accent-divergence)" opacity="0.55" />
        {/* Labels */}
        <text x="26" y="59" fontSize="12" fill="var(--text-muted)" fontFamily="Inter, sans-serif" textAnchor="middle">Intent</text>
        <text x="99" y="59" fontSize="12" fill="var(--text-muted)" fontFamily="Inter, sans-serif" textAnchor="middle">Success</text>
        <text x="172" y="59" fontSize="12" fill="var(--text-muted)" fontFamily="Inter, sans-serif" textAnchor="middle">Success</text>
        {/* Hover-reveal: anomaly label */}
        <text x="184" y="85" fontSize="12" fontFamily="Inter, sans-serif" fill="var(--accent-divergence)" letterSpacing="0.05em"
          style={{ opacity: 1 }}>
          state mismatch
        </text>
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   A.02 — Evidence-Backed Defect Register
───────────────────────────────────────────────────── */
const DEFECT_ROWS = [
  { id: 'D-001', divergence: 'Subscription state not updated',   evidence: 'Payment ledger (T+2.1s)',     sev: 'HIGH', hi: true  },
  { id: 'D-002', divergence: 'Handoff not recorded',             evidence: 'Audit log: no entry found',   sev: 'MED',  hi: false },
  { id: 'D-003', divergence: 'Retry produced duplicate record',  evidence: 'Event stream: duplicate',     sev: 'LOW',  hi: false },
];

function DefectTablePreview(_props: { hovered: boolean }) {
  return (
    <div style={{ paddingTop: 4 }}>
      {/* Header */}
      <div style={{
        display: 'grid', gridTemplateColumns: '38px 1.2fr 1fr 38px', gap: '0 8px',
        padding: '4px 14px 6px', borderBottom: '1px solid var(--border-default)',
      }}>
        {['ID', 'Divergence', 'Evidence', 'Sev'].map(h => (
          <span key={h} style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 12,
            letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{h}</span>
        ))}
      </div>
      {/* Rows */}
      {DEFECT_ROWS.map((row, i) => (
        <div key={row.id} style={{
          display: 'grid', gridTemplateColumns: '38px 1.2fr 1fr 38px', gap: '0 8px',
          padding: '7px 14px',
          borderBottom: i < 1 ? '1px solid var(--border-default)' : 'none',
          backgroundColor: row.hi ? 'rgba(255,107,0,0.04)' : 'transparent',
          opacity: 1,
          transition: 'opacity 220ms ease',
        }}>
          <span style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 12,
            color: 'var(--text-muted)', letterSpacing: '0.04em', alignSelf: 'center' }}>{row.id}</span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, lineHeight: 1.38,
            color: 'var(--text-secondary)' }}>{row.divergence}</span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, lineHeight: 1.38,
            color: 'var(--text-muted)' }}>{row.evidence}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {row.hi && <div style={{ width: 5, height: 5, borderRadius: '50%',
              backgroundColor: 'var(--accent-divergence)', flexShrink: 0 }} />}
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 12,
              letterSpacing: '0.06em', color: row.hi ? 'var(--accent-divergence)' : 'var(--text-muted)' }}>{row.sev}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   A.03 — Completion Contract
───────────────────────────────────────────────────── */
const CONTRACT_FIELDS = [
  {
    heading: 'Postconditions',
    lines: ['Subscription record reflects updated status.', 'Status change event logged in audit trail.'],
  },
  {
    heading: 'Authoritative state',
    lines: ['Customer subscription table (primary record)'],
  },
  {
    heading: 'Evidence source',
    lines: ['Payment provider webhook response', 'Internal event ledger sync'],
  },
];
const CONTRACT_EXTRA = { heading: 'Scope', lines: ['Single path: trigger → state update → confirmation'] };

function ContractPreview(_props: { hovered: boolean }) {
  return (
    <div style={{ padding: '12px 14px 0' }}>
      {CONTRACT_FIELDS.map((f, i) => (
        <div key={f.heading} style={{ marginBottom: i < CONTRACT_FIELDS.length - 1 ? 12 : 0 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 12,
            letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>
            {f.heading}
          </div>
          {f.lines.map(l => (
            <div key={l} style={{ display: 'flex', gap: 6, marginBottom: 2 }}>
              <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontSize: 12 }}>—</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, lineHeight: 1.4, color: 'var(--text-secondary)' }}>{l}</span>
            </div>
          ))}
        </div>
      ))}
      {/* Hover-reveal extra field */}
      <div style={{
        marginTop: 12,
        opacity: 1,
        transition: 'opacity 220ms ease',
      }}>
        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 12,
          letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>
          {CONTRACT_EXTRA.heading}
        </div>
        {CONTRACT_EXTRA.lines.map(l => (
          <div key={l} style={{ display: 'flex', gap: 6 }}>
            <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontSize: 12 }}>—</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, lineHeight: 1.4, color: 'var(--text-secondary)' }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   A.04 — Prioritized Repair + Regression Plan
───────────────────────────────────────────────────── */
const REPAIR_ITEMS = [
  {
    priority: 'P1',
    action: 'Repair state propagation on confirmed success path',
    test: 'Trigger confirmed cancellation; verify subscription status within defined window',
  },
  {
    priority: 'P2',
    action: 'Add logging at each external handoff boundary',
    test: 'Confirm audit entry present at all handoff points after trigger',
  },
];
const REPAIR_EXTRA = {
  priority: 'P3',
  action: 'Establish regression baseline for affected paths',
  test: 'Replay historical traces; compare output against expected terminal state',
};

function RepairPreview(_props: { hovered: boolean }) {
  return (
    <div style={{ padding: '12px 14px 0' }}>
      {REPAIR_ITEMS.map((item, i) => (
        <div key={item.priority} style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 4 }}>
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12,
              letterSpacing: '0.06em', color: 'var(--text-primary)', flexShrink: 0 }}>{item.priority}</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, lineHeight: 1.4,
              color: 'var(--text-secondary)' }}>{item.action}</span>
          </div>
          <div style={{ paddingLeft: 22, display: 'flex', gap: 5, alignItems: 'baseline' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-muted)', flexShrink: 0 }}>↳</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, lineHeight: 1.45,
              color: 'var(--text-muted)', fontStyle: 'italic' }}>Test: {item.test}</span>
          </div>
        </div>
      ))}
      {/* Hover-reveal */}
      <div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 4 }}>
          <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12,
            letterSpacing: '0.06em', color: 'var(--text-primary)', flexShrink: 0 }}>{REPAIR_EXTRA.priority}</span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, lineHeight: 1.4,
            color: 'var(--text-secondary)' }}>{REPAIR_EXTRA.action}</span>
        </div>
        <div style={{ paddingLeft: 22, display: 'flex', gap: 5, alignItems: 'baseline' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-muted)', flexShrink: 0 }}>↳</span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, lineHeight: 1.45,
            color: 'var(--text-muted)', fontStyle: 'italic' }}>Test: {REPAIR_EXTRA.test}</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   Specimen card shell
───────────────────────────────────────────────────── */
type PreviewFC = React.FC<{ hovered: boolean }>;

const SPECIMENS: { id: string; title: string; description: string; reader: string; Preview: PreviewFC }[] = [
  {
    id: 'A.01',
    reader: 'Engineering',
    title: 'Workflow + Failure Map',
    description: 'Reconstructs the intended end-to-end path, systems, handoffs, state transitions, and meaningful failure points.',
    Preview: TracePreview,
  },
  {
    id: 'A.02',
    reader: 'Engineering · Risk',
    title: 'Evidence-Backed Defect Register',
    description: 'Documents each material divergence with the observable evidence behind it, consequence, likely cause where supportable, and priority.',
    Preview: DefectTablePreview,
  },
  {
    id: 'A.03',
    reader: 'Product · Operations',
    title: 'Completion Contract',
    description: 'Defines the testable conditions required before the workflow may truthfully be considered "done," including the terminal state and evidence source.',
    Preview: ContractPreview,
  },
  {
    id: 'A.04',
    reader: 'Owners of the fix',
    title: 'Prioritized Repair + Regression Plan',
    description: 'Translates findings into what should be corrected first and what tests should demonstrate that the corrected workflow continues to behave correctly.',
    Preview: RepairPreview,
  },
];

function SpecimenCard({
  spec,
  visible,
}: {
  spec: typeof SPECIMENS[number];
  visible: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const { Preview } = spec;

  return (
    <div style={{
      position: 'relative',
      paddingRight: 7,
      paddingBottom: 7,
      opacity: 1,
      transform: 'none',
      transition: 'opacity 340ms ease, transform 340ms ease',
    }}>
      {/* Paper layer 2 — furthest back */}
      <div style={{
        position: 'absolute',
        top: 7, left: 7, right: 0, bottom: 0,
        border: '1px solid var(--border-default)',
        borderRadius: 4,
        backgroundColor: 'var(--surface-base)',
        opacity: 0.55,
        pointerEvents: 'none',
      }} />
      {/* Paper layer 1 */}
      <div style={{
        position: 'absolute',
        top: 3.5, left: 3.5, right: 3.5, bottom: 3.5,
        border: '1px solid var(--border-default)',
        borderRadius: 4,
        backgroundColor: 'var(--surface-raised)',
        opacity: 0.7,
        pointerEvents: 'none',
      }} />
      {/* Main card */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative',
          backgroundColor: 'var(--surface-raised)',
          border: `1px solid ${hovered ? 'var(--text-primary)' : 'var(--border-default)'}`,
          borderRadius: 4,
          transform: hovered ? 'translateY(-2px)' : 'none',
          boxShadow: hovered
            ? '0 4px 16px rgba(0,0,0,0.1)'
            : '0 1px 4px rgba(0,0,0,0.06)',
          transition: 'transform 180ms ease, border-color 150ms ease, box-shadow 180ms ease',
          overflow: 'hidden',
        }}
      >
        {/* Header strip */}
        <div style={{
          padding: '9px 14px',
          borderBottom: '1px solid var(--border-default)',
          backgroundColor: 'var(--surface-base)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            fontSize: 12,
            letterSpacing: '0.08em',
            color: 'var(--text-muted)',
          }}>
            {spec.id}
          </span>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            fontSize: 12,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}>
            For: {spec.reader}
          </span>
        </div>

        {/* Body: title + description */}
        <div style={{ padding: '14px 14px 12px' }}>
          <h3 style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            fontSize: 14,
            lineHeight: 1.3,
            color: 'var(--text-primary)',
            marginBottom: 7,
          }}>
            {spec.title}
          </h3>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 400,
            fontSize: 12,
            lineHeight: 1.55,
            color: 'var(--text-secondary)',
            margin: 0,
          }}>
            {spec.description}
          </p>
        </div>

        {/* Preview area */}
        <div style={{
          position: 'relative',
          overflow: 'hidden',
          height: 168,
          borderTop: '1px solid var(--border-default)',
        }}>
          {/* "ILLUSTRATIVE STRUCTURE" label */}
          <div style={{
            position: 'absolute',
            top: 9,
            right: 12,
            zIndex: 2,
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            fontSize: 12,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}>
            Illustrative structure
          </div>

          {/* Preview content */}
          <Preview hovered={hovered} />

          {/* Gradient fade — hides on hover */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 60,
            background: `linear-gradient(to bottom, transparent, var(--surface-raised))`,
            opacity: 1,
            transition: 'opacity 200ms ease',
            pointerEvents: 'none',
          }} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   Section 8
───────────────────────────────────────────────────── */
export function Outputs() {
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      trackSectionView('s8_view');
    }, { threshold: 0.15 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="section-deliverables"
      {...storySectionProps('section-deliverables')}
      style={{
        backgroundColor: 'var(--surface-base)',
        paddingTop: 120,
        paddingBottom: 128,
      }}
    >
      <div className="container-editorial">

        {/* Section label */}
        <div style={{ marginBottom: 48 }}>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            fontSize: 12,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            marginBottom: 12,
          }}>
            Outputs
          </div>
          <div style={{ height: 1, backgroundColor: 'var(--border-default)' }} />
        </div>

        {/* Headline + subhead */}
        <div style={{ maxWidth: 740, marginBottom: 64 }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 'clamp(28px, 4vw, 48px)',
            lineHeight: 1.08,
            letterSpacing: '-0.025em',
            color: 'var(--text-primary)',
            marginBottom: 18,
          }}>
            What you leave with.
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 400,
            fontSize: 'clamp(15px, 1.4vw, 18px)',
            lineHeight: 1.55,
            color: 'var(--text-secondary)',
            margin: 0,
          }}>
            A compact evidentiary account of what the workflow is supposed to do,
            where it diverges, and what should happen next.
          </p>
        </div>

        {/* 2 × 2 specimen grid */}
        <div className="s8-grid">
          {SPECIMENS.map((spec, i) => (
            <SpecimenCard key={spec.id} spec={spec} visible />
          ))}
        </div>

      </div>

      <style>{`
        .s8-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
          align-items: start;
        }
        @media (max-width: 767px) {
          .s8-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
