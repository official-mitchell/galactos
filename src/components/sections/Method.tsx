/* 2026-11-04: MAX-1011 carries the Method reader question from sections.ts.
   2026-11-03: MAX-998 raised font sizes under 12px to 12px.
    2026-11-03: decomposed from the Figma Make landing export into the root app (MAX-993). */
import React, { useEffect, useRef, useState } from 'react';
import { storySectionProps } from '../../content/sections';

/* ── Stage data ── */
const STAGES = [
  {
    num: '01', id: 'define', title: 'Define Completion', weight: 0,
    desc: 'Establish what must actually be true for the business obligation to count as complete.',
    evidence: null as null | 'logs' | 'cobalt' | 'orange' | 'test',
  },
  {
    num: '02', id: 'trace', title: 'Trace Execution', weight: 0,
    desc: 'Reconstruct how representative cases moved across models, systems, handoffs, and human decisions.',
    evidence: 'logs' as const,
  },
  {
    num: '03', id: 'verify', title: 'Verify Actual State', weight: 1,
    desc: 'Compare the workflow\'s reported state with authoritative evidence of what ultimately occurred.',
    evidence: 'cobalt' as const,
  },
  {
    num: '04', id: 'reconstruct', title: 'Reconstruct Divergence', weight: 2,
    desc: 'Follow mismatched cases backward to locate where intended and actual execution separated.',
    evidence: 'orange' as const,
  },
  {
    num: '05', id: 'confirm', title: 'Confirm Causes', weight: 3,
    desc: 'Use available logs, evidence, replay, controlled tests, and system behavior to distinguish supported causes from speculation.',
    evidence: null,
  },
  {
    num: '06', id: 'prioritize', title: 'Prioritize Repairs', weight: 3,
    desc: 'Rank fixes by consequence, recurrence, tractability, and the tests needed to prevent regression.',
    evidence: 'test' as const,
  },
] as const;

type Stage = typeof STAGES[number];

/* ── Progressive visual properties per weight level ── */
const WEIGHT_STYLES = [
  { size: 20, strokeW: 1,   strokeC: 'var(--text-muted)',      fill: 'transparent',      titleW: 500, titleC: 'var(--text-secondary)', descO: 0.65 },
  { size: 20, strokeW: 1,   strokeC: 'var(--text-muted)',      fill: 'transparent',      titleW: 500, titleC: 'var(--text-secondary)', descO: 0.65 },
  { size: 22, strokeW: 1.5, strokeC: 'var(--text-secondary)',  fill: 'transparent',      titleW: 600, titleC: 'var(--text-secondary)', descO: 0.78 },
  { size: 22, strokeW: 2,   strokeC: 'var(--text-primary)',    fill: 'transparent',      titleW: 600, titleC: 'var(--text-primary)',   descO: 0.88 },
  { size: 24, strokeW: 2,   strokeC: 'var(--text-primary)',    fill: 'var(--text-primary)', titleW: 700, titleC: 'var(--text-primary)',   descO: 1.0 },
  { size: 24, strokeW: 2,   strokeC: 'var(--text-primary)',    fill: 'var(--text-primary)', titleW: 700, titleC: 'var(--text-primary)',   descO: 1.0 },
];

const PRE_STYLE = { size: 20, strokeW: 1, strokeC: 'var(--border-default)', fill: 'transparent' };

/* ── Evidence fragments ── */
function LogsEvidence({ full }: { full: boolean }) {
  return (
    <div style={{ marginTop: 10 }}>
      {['→ webhook.received  [T+0ms]', '→ model.inference   [T+142ms]', '→ state.update      [pending…]'].map(l => (
        <div key={l} style={{
          fontFamily: 'monospace', fontSize: 12, lineHeight: 1.8, letterSpacing: '0.02em',
          color: full ? 'var(--text-secondary)' : 'var(--text-muted)',
          transition: 'color 200ms ease',
        }}>{l}</div>
      ))}
    </div>
  );
}

function CobaltEvidence({ full }: { full: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10,
      opacity: full ? 1 : 0.6, transition: 'opacity 200ms ease' }}>
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
        <circle cx="6.5" cy="6.5" r="5.5" fill="var(--accent-info)" />
        <circle cx="6.5" cy="6.5" r="2" fill="rgba(10,21,32,0.65)" />
      </svg>
      <span style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 12,
        letterSpacing: '0.09em', textTransform: 'uppercase', color: 'var(--accent-info)' }}>
        system state
      </span>
    </div>
  );
}

function OrangeEvidence({ full }: { full: boolean }) {
  return (
    <div style={{ marginTop: 10, opacity: full ? 1 : 0.6, transition: 'opacity 200ms ease' }}>
      <svg width="56" height="30" viewBox="0 0 56 30" fill="none" aria-hidden="true">
        {/* Main path */}
        <line x1="0" y1="10" x2="56" y2="10" stroke="var(--border-strong)" strokeWidth="0.85" />
        {/* Fork marker */}
        <circle cx="28" cy="10" r="2.5" fill="var(--accent-divergence)" />
        {/* Diverging dashed branch */}
        <line x1="28" y1="12.5" x2="28" y2="27"
          stroke="var(--accent-divergence)" strokeWidth="0.85" strokeDasharray="2.5 1.5" />
        <polyline points="25,24 28,27 31,24" stroke="var(--accent-divergence)" strokeWidth="0.85" fill="none" />
      </svg>
    </div>
  );
}

function TestEvidence({ full }: { full: boolean }) {
  return (
    <div style={{ marginTop: 10 }}>
      {['assert(subscription.status)', 'assert(auditLog.contains(id))'].map(l => (
        <div key={l} style={{
          fontFamily: 'monospace', fontSize: 12, lineHeight: 1.8, letterSpacing: '0.02em',
          color: full ? 'var(--text-secondary)' : 'var(--text-muted)',
          transition: 'color 200ms ease',
        }}>{l}</div>
      ))}
    </div>
  );
}

function EvidenceFragment({ type, full }: { type: Stage['evidence']; full: boolean }) {
  if (!type) return null;
  switch (type) {
    case 'logs':   return <LogsEvidence   full={full} />;
    case 'cobalt': return <CobaltEvidence full={full} />;
    case 'orange': return <OrangeEvidence full={full} />;
    case 'test':   return <TestEvidence   full={full} />;
  }
}

/* ── Desktop: one column per stage ── */
function StageColumn({ stage, resolved, index }: { stage: Stage; resolved: boolean; index: number }) {
  const [hovered, setHovered] = useState(false);
  const ws = resolved ? WEIGHT_STYLES[stage.weight] : { ...PRE_STYLE, titleW: 400, titleC: 'var(--text-muted)', descO: 0.35 };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={0}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '0 6px', outline: 'none',
        opacity: resolved ? 1 : 0.4,
        transition: 'opacity 320ms ease',
      }}
    >
      {/* Stage number */}
      <div style={{
        fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 12,
        letterSpacing: '0.14em', color: 'var(--text-muted)',
        marginBottom: 5, height: 14, display: 'flex', alignItems: 'center',
      }}>
        {stage.num}
      </div>

      {/* Circle — sits over the path line */}
      <div style={{
        width: ws.size, height: ws.size, borderRadius: '50%',
        border: `${ws.strokeW}px solid ${ws.strokeC}`,
        backgroundColor: ws.fill,
        position: 'relative', zIndex: 2, flexShrink: 0,
        transform: hovered && resolved ? 'scale(1.14)' : 'scale(1)',
        transition: 'all 240ms ease',
        marginBottom: 14,
      }} />

      {/* Title */}
      <div style={{
        fontFamily: 'var(--font-body)', fontWeight: ws.titleW, fontSize: 12,
        lineHeight: 1.3, textAlign: 'center',
        color: ws.titleC, marginBottom: 6,
        transition: 'all 200ms ease',
        width: '100%',
      }}>
        {stage.title}
      </div>

      {/* Description */}
      <p style={{
        fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: 12,
        lineHeight: 1.5, textAlign: 'center', margin: 0,
        color: 'var(--text-secondary)',
        opacity: ws.descO,
        WebkitLineClamp: hovered ? undefined : 3,
        display: hovered ? 'block' : '-webkit-box',
        WebkitBoxOrient: 'vertical' as const,
        overflow: hovered ? 'visible' : 'hidden',
        transition: 'opacity 200ms ease',
      }}>
        {stage.desc}
      </p>

      {/* Evidence fragment */}
      <EvidenceFragment type={stage.evidence} full={hovered} />
    </div>
  );
}

/* ── Desktop horizontal layout ── */
function DesktopPath({ resolved, animated }: { resolved: boolean[]; animated: boolean }) {
  /* Node centers at: (2i+1)/12 * 100%, i=0..5 */
  /* Approximate y-center of circles from container top: num(14)+margin(5)+r(~11) = ~30px */
  const Y = 29;

  return (
    <div style={{ position: 'relative' }}>
      {/* Faint background path line */}
      <div style={{
        position: 'absolute', top: Y - 0.5, left: '8.33%', right: '8.33%',
        height: 1, backgroundColor: 'var(--border-default)', zIndex: 0,
      }} />

      {/* Active path overlay — draws in via scaleX */}
      <div style={{
        position: 'absolute', top: Y - 0.75, left: '8.33%', width: '83.34%',
        height: 1.5, backgroundColor: 'var(--text-primary)',
        transformOrigin: 'left center',
        transform: animated ? 'scaleX(1)' : 'scaleX(0)',
        transition: animated ? 'transform 2800ms linear' : 'none',
        zIndex: 1,
      }} />

      {/* Observation marker */}
      <div style={{
        position: 'absolute',
        top: Y - 6,
        left: animated ? '91.67%' : '8.33%',
        width: 12, height: 12, borderRadius: '50%',
        backgroundColor: 'var(--accent-info)',
        border: '2px solid var(--surface-raised)',
        transform: 'translateX(-50%)',
        zIndex: 4,
        transition: animated ? 'left 2800ms linear' : 'none',
        pointerEvents: 'none',
      }} />

      {/* Stage columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)' }}>
        {STAGES.map((stage, i) => (
          <StageColumn key={stage.id} stage={stage} resolved={resolved[i]} index={i} />
        ))}
      </div>
    </div>
  );
}

/* ── Mobile: vertical left-side path ── */
function MobileStageItem({
  stage, resolved, isLast,
}: {
  stage: Stage; resolved: boolean; isLast: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const ws = resolved ? WEIGHT_STYLES[stage.weight] : { ...PRE_STYLE, titleW: 400, titleC: 'var(--text-muted)', descO: 0.35 };

  return (
    <div style={{ display: 'flex', gap: 16, opacity: resolved ? 1 : 0.4, transition: 'opacity 320ms ease' }}>
      {/* Left: circle + vertical connector */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 24 }}>
        <div style={{
          width: ws.size, height: ws.size, borderRadius: '50%',
          border: `${ws.strokeW}px solid ${ws.strokeC}`,
          backgroundColor: ws.fill, flexShrink: 0,
          transition: 'all 240ms ease',
        }} />
        {!isLast && (
          <div style={{
            width: 1, flex: 1, minHeight: 24,
            backgroundColor: 'var(--border-default)', marginTop: 4,
          }} />
        )}
      </div>

      {/* Right: text */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ flex: 1, paddingBottom: isLast ? 0 : 28 }}
      >
        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 12,
          letterSpacing: '0.14em', color: 'var(--text-muted)', marginBottom: 4 }}>
          {stage.num}
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontWeight: ws.titleW, fontSize: 15,
          lineHeight: 1.3, color: ws.titleC, marginBottom: 6, transition: 'all 200ms ease' }}>
          {stage.title}
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: 13,
          lineHeight: 1.55, color: 'var(--text-secondary)', opacity: ws.descO,
          margin: 0, transition: 'opacity 200ms ease' }}>
          {stage.desc}
        </p>
        {stage.evidence && (
          <div style={{ marginTop: 8 }}>
            <EvidenceFragment type={stage.evidence} full={hovered} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Section 9 ── */
export function Method() {
  const sectionRef = useRef<HTMLElement>(null);
  const [resolved,  setResolved]  = useState([false, false, false, false, false, false]);
  const [animated,  setAnimated]  = useState(false);

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
          setResolved([true, true, true, true, true, true]);
          setAnimated(true);
          return;
        }

        /* Marker starts immediately; each node resolves as it arrives */
        setAnimated(true); // triggers CSS path + marker transition (2800ms total)
        const STEP = 2800 / 5;
        [0, 1, 2, 3, 4, 5].forEach(i => {
          setTimeout(() => {
            setResolved(prev => prev.map((v, j) => j === i ? true : v));
          }, Math.round(i * STEP));
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
      id="section-method"
      {...storySectionProps('section-method')}
      style={{ backgroundColor: 'var(--surface-base)', paddingTop: 120, paddingBottom: 128 }}
    >
      <div className="container-editorial">

        {/* Section label */}
        <div style={{ marginBottom: 48 }}>
          <div style={{
            fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 12,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'var(--text-muted)', marginBottom: 12,
          }}>
            Method
          </div>
          <div style={{ height: 1, backgroundColor: 'var(--border-default)' }} />
        </div>

        {/* Headline */}
        <h2 style={{
          fontFamily: 'var(--font-display)', fontWeight: 700,
          fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: 1.08,
          letterSpacing: '-0.025em', color: 'var(--text-primary)',
          marginBottom: 64, maxWidth: 680,
        }}>
          Follow the business outcome, not the green checks.
        </h2>

        {/* Desktop horizontal path */}
        <div className="s9-desktop">
          <DesktopPath resolved={resolved} animated={animated} />
        </div>

        {/* Mobile vertical path */}
        <div className="s9-mobile">
          {STAGES.map((stage, i) => (
            <MobileStageItem
              key={stage.id}
              stage={stage}
              resolved={resolved[i]}
              isLast={i === STAGES.length - 1}
            />
          ))}
        </div>

        {/* Footnote */}
        <div style={{
          marginTop: 56,
          paddingTop: 20,
          borderTop: '1px solid var(--border-default)',
        }}>
          <p style={{
            fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: 12,
            lineHeight: 1.6, color: 'var(--text-muted)', margin: 0,
            maxWidth: 560, fontStyle: 'italic',
          }}>
            Historical and read-only evidence comes first. Sandbox or controlled
            production testing is used only when appropriate to the engagement.
          </p>
        </div>

      </div>

      <style>{`
        .s9-desktop { display: block; }
        .s9-mobile  { display: none; }

        @media (max-width: 760px) {
          .s9-desktop { display: none; }
          .s9-mobile  { display: block; }
        }
      `}</style>
    </section>
  );
}
