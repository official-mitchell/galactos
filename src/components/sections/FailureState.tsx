/* 2026-11-04: MAX-1014 placeholder for S2's first node. The hero drop ends on this x.
   2026-11-04: MAX-1011 carries the Failure state reader question and seam from sections.ts.
   2026-11-03: decomposed from the Figma Make landing export into the root app (MAX-993).
   2026-11-03: MAX-998 raised font sizes under 12px to 12px.
   2026-11-04: removed the invented case rail and case title. */
import React, { useEffect, useRef, useState } from 'react';
import { storySectionProps } from '../../content/sections';
import { SeamAnchor } from '../shell/SeamAnchor';

/* ── Timing ── */
const NODE_DELAYS = [0, 380, 760, 1140];
const BRANCH_DELAY = 1140 + 620;
const NODE5_DELAY = BRANCH_DELAY + 380;

/* ── Animated node ── */
interface AnimNodeProps {
  type: 'intent' | 'success' | 'outline-anomaly';
  resolved: boolean;
  size?: number;
}
function AnimNode({ type, resolved, size = 28 }: AnimNodeProps) {
  const baseStyle: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: '50%',
    flexShrink: 0,
    position: 'relative',
    transition: 'background-color 320ms ease, border-color 280ms ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  if (type === 'intent') {
    return (
      <div
        style={{
          ...baseStyle,
          backgroundColor: resolved ? 'var(--text-primary)' : 'transparent',
          border: `1.5px solid var(--text-primary)`,
        }}
      />
    );
  }

  if (type === 'success') {
    return (
      <div
        style={{
          ...baseStyle,
          backgroundColor: resolved ? 'var(--accent-success)' : 'transparent',
          border: `1.5px solid ${resolved ? 'var(--accent-success)' : 'var(--text-secondary)'}`,
        }}
      >
        {resolved && (
          <svg width={size * 0.48} height={size * 0.48} viewBox="0 0 12 12" fill="none" style={{ opacity: resolved ? 1 : 0, transition: 'opacity 200ms ease 120ms' }}>
            <polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    );
  }

  /* outline-anomaly: outline circle + orange anomaly badge */
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <div
        style={{
          ...baseStyle,
          backgroundColor: 'transparent',
          border: `1.5px solid var(--text-primary)`,
          transition: 'border-color 280ms ease, opacity 280ms ease',
          opacity: resolved ? 1 : 0,
        }}
      />
      {/* Orange anomaly badge */}
      <div
        style={{
          position: 'absolute',
          bottom: -3,
          right: -3,
          width: 12,
          height: 12,
          borderRadius: '50%',
          backgroundColor: 'var(--accent-divergence)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: resolved ? 1 : 0,
          transition: 'opacity 280ms ease 100ms',
          border: '1.5px solid var(--surface-base)',
        }}
      >
        <svg width="5" height="7" viewBox="0 0 5 8" fill="none">
          <rect x="1.5" y="0" width="2" height="4.5" rx="1" fill="#fff" />
          <rect x="1.5" y="6" width="2" height="2" rx="1" fill="#fff" />
        </svg>
      </div>
    </div>
  );
}

/* ── Tag chip ── */
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-block',
        fontFamily: 'var(--font-body)',
        fontWeight: 500,
        fontSize: 12,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        border: '1px solid var(--border-default)',
        borderRadius: 3,
        padding: '1px 5px',
        marginTop: 4,
      }}
    >
      {children}
    </span>
  );
}

/* ── Horizontal arrow SVG ── */
function HArrow({ visible }: { visible: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: 28 }}>
      <svg
        width="60" height="14" viewBox="0 0 60 14" fill="none"
        style={{ opacity: visible ? 1 : 0, transition: 'opacity 240ms ease' }}
        aria-hidden="true"
      >
        <line x1="0" y1="7" x2="51" y2="7" stroke="var(--text-primary)" strokeWidth="1.25" />
        <polyline points="48,3 56,7 48,11" stroke="var(--text-primary)" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    </div>
  );
}

/* ── Orange branch SVG (vertical dashed) ── */
function OrangeBranch({ visible }: { visible: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <svg
        width="28" height="72" viewBox="0 0 28 72" fill="none"
        style={{ opacity: visible ? 1 : 0, transition: 'opacity 300ms ease' }}
        aria-hidden="true"
      >
        <line x1="14" y1="0" x2="14" y2="58" stroke="var(--accent-divergence)" strokeWidth="1.5" strokeDasharray="4 3" />
        <polyline points="10,53 14,65 18,53" stroke="var(--accent-divergence)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    </div>
  );
}

/* ── Bracket label ── */
function BracketLabel({
  text,
  side,
  visible = true,
  orange = false,
}: {
  text: string;
  side: 'top' | 'bottom';
  visible?: boolean;
  orange?: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        opacity: visible ? 1 : 0,
        transition: 'opacity 300ms ease',
        borderTop: side === 'bottom' ? `1px solid ${orange ? 'var(--accent-divergence)' : 'var(--border-default)'}` : undefined,
        borderBottom: side === 'top' ? '1px solid var(--border-default)' : undefined,
        paddingTop: side === 'bottom' ? 8 : 0,
        paddingBottom: side === 'top' ? 8 : 0,
        marginTop: side === 'bottom' ? 12 : 0,
        marginBottom: side === 'top' ? 12 : 0,
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-body)',
          fontWeight: 500,
          fontSize: 12,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: orange ? 'var(--accent-divergence)' : 'var(--text-muted)',
        }}
      >
        {text}
      </span>
    </div>
  );
}

/* ── Desktop horizontal trace ── */
function HorizontalTrace({
  resolved,
  branchVisible,
}: {
  resolved: boolean[];
  branchVisible: boolean;
}) {
  const GRID = '1fr 60px 1fr 60px 1fr 60px 1fr';

  const metaLabels = ['CONVERSATION', 'POLICY', 'PAYMENT API', 'SUPPORT SYSTEM'];
  const labels = ['Request understood.', 'Policy retrieved.', 'Refund action accepted.', 'Ticket closed.'];
  const tags = [null, null, '200 OK', 'Case closed'];
  const types: AnimNodeProps['type'][] = ['intent', 'success', 'success', 'success'];

  return (
    <div>
      {/* Bracket above: WHAT THE WORKFLOW BELIEVES HAPPENED */}
      <BracketLabel text="What the workflow believes happened" side="bottom" />

      {/* Metadata row */}
      <div style={{ display: 'grid', gridTemplateColumns: GRID, marginBottom: 6 }}>
        {metaLabels.map((label, i) => (
          <React.Fragment key={label}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 500,
                  fontSize: 12,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  opacity: resolved[i] ? 1 : 0.3,
                  transition: 'opacity 280ms ease',
                }}
              >
                {label}
              </span>
            </div>
            {i < 3 && <div />}
          </React.Fragment>
        ))}
      </div>

      {/* Nodes + arrows row */}
      <div style={{ display: 'grid', gridTemplateColumns: GRID, alignItems: 'center' }}>
        {types.map((type, i) => (
          <React.Fragment key={i}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <AnimNode type={type} resolved={resolved[i]} size={28} />
            </div>
            {i < 3 && <HArrow visible={resolved[i]} />}
          </React.Fragment>
        ))}
      </div>

      {/* Labels + tags row */}
      <div style={{ display: 'grid', gridTemplateColumns: GRID, marginTop: 8 }}>
        {labels.map((label, i) => (
          <React.Fragment key={label}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 400,
                  fontSize: 12,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.4,
                  opacity: resolved[i] ? 1 : 0.2,
                  transition: 'opacity 280ms ease',
                }}
              >
                {label}
              </span>
              {tags[i] && (
                <div style={{ opacity: resolved[i] ? 1 : 0, transition: 'opacity 280ms ease' }}>
                  <Tag>{tags[i]}</Tag>
                </div>
              )}
            </div>
            {i < 3 && <div />}
          </React.Fragment>
        ))}
      </div>

      {/* Orange branch + node 5 — aligned under column 7 (last node column) */}
      <div style={{ display: 'grid', gridTemplateColumns: GRID }}>
        {/* Spacer columns 1-6 */}
        <div style={{ gridColumn: '1 / 7' }} />

        {/* Column 7: branch + node 5 */}
        <div style={{ gridColumn: 7, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <OrangeBranch visible={branchVisible} />

          {/* Node 5 bracket label */}
          <div
            style={{
              marginBottom: 6,
              opacity: branchVisible ? 1 : 0,
              transition: 'opacity 300ms ease',
              textAlign: 'center',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: 12,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--accent-divergence)',
              }}
            >
              SUBSCRIPTION AUTHORITY
            </span>
          </div>

          {/* Node 5 */}
          <AnimNode type="outline-anomaly" resolved={resolved[4]} size={28} />

          {/* Node 5 labels */}
          <div
            style={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: 4,
              opacity: resolved[4] ? 1 : 0,
              transition: 'opacity 280ms ease',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 400,
                fontSize: 12,
                color: 'var(--text-secondary)',
                lineHeight: 1.4,
              }}
            >
              Subscription still active&nbsp;
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>✕</span>
            </span>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 400,
                fontSize: 12,
                color: 'var(--text-muted)',
                letterSpacing: '0.01em',
              }}
            >
              Next renewal still scheduled.
            </span>
          </div>

          {/* Bracket below node 5 */}
          <div style={{ width: '100%', marginTop: 12, opacity: resolved[4] ? 1 : 0, transition: 'opacity 300ms ease 200ms' }}>
            <BracketLabel text="What the authoritative system says" side="top" orange visible />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Mobile vertical trace ── */
function VerticalTrace({
  resolved,
  branchVisible,
}: {
  resolved: boolean[];
  branchVisible: boolean;
}) {
  const nodes = [
    { type: 'intent' as const, meta: 'CONVERSATION', label: 'Request understood.', tag: null },
    { type: 'success' as const, meta: 'POLICY', label: 'Policy retrieved.', tag: null },
    { type: 'success' as const, meta: 'PAYMENT API', label: 'Refund action accepted.', tag: '200 OK' },
    { type: 'success' as const, meta: 'SUPPORT SYSTEM', label: 'Ticket closed.', tag: 'Case closed' },
  ];

  return (
    <div>
      <BracketLabel text="What the workflow believes happened" side="bottom" />
      <div style={{ display: 'flex', flexDirection: 'column', paddingTop: 4 }}>
        {nodes.map((node, i) => (
          <React.Fragment key={node.meta}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <AnimNode type={node.type} resolved={resolved[i]} size={24} />
                {/* vertical connector below each node (except node 5) */}
                {i < 3 && (
                  <div
                    style={{
                      width: 1.5,
                      height: 36,
                      backgroundColor: 'var(--border-default)',
                      opacity: resolved[i] ? 0.5 : 0.15,
                      transition: 'opacity 280ms ease',
                    }}
                  />
                )}
                {/* Orange dashed connector below node 4 toward node 5 */}
                {i === 3 && (
                  <svg
                    width="24" height="44" viewBox="0 0 24 44" fill="none"
                    style={{ opacity: branchVisible ? 1 : 0, transition: 'opacity 280ms ease' }}
                    aria-hidden="true"
                  >
                    <line x1="12" y1="0" x2="12" y2="36" stroke="var(--accent-divergence)" strokeWidth="1.5" strokeDasharray="4 3" />
                    <polyline points="9,30 12,40 15,30" stroke="var(--accent-divergence)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                )}
              </div>
              <div style={{ paddingBottom: i < 3 ? 36 : 0, opacity: resolved[i] ? 1 : 0.2, transition: 'opacity 280ms ease' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 500,
                    fontSize: 12,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    marginBottom: 3,
                  }}
                >
                  {node.meta}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 400,
                    fontSize: 14,
                    color: 'var(--text-secondary)',
                    lineHeight: 1.4,
                  }}
                >
                  {node.label}
                </div>
                {node.tag && <Tag>{node.tag}</Tag>}
              </div>
            </div>
          </React.Fragment>
        ))}

        {/* Dashed orange line between node 4 and node 5 (rendered as part of node4's connector) */}

        {/* Node 5 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 14,
            opacity: branchVisible ? 1 : 0,
            transition: 'opacity 300ms ease',
          }}
        >
          <AnimNode type="outline-anomaly" resolved={resolved[4]} size={24} />
          <div>
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: 12,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--accent-divergence)',
                marginBottom: 3,
              }}
            >
              SUBSCRIPTION AUTHORITY
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Subscription still active&nbsp;
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>✕</span>
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>
              Next renewal still scheduled.
            </div>
          </div>
        </div>

        <div style={{ marginTop: 16, opacity: resolved[4] ? 1 : 0, transition: 'opacity 280ms ease 200ms' }}>
          <BracketLabel text="What the authoritative system says" side="top" orange visible />
        </div>
      </div>
    </div>
  );
}

/* ── Main section ── */
export function FailureState() {
  const sectionRef = useRef<HTMLElement>(null);
  const [resolved, setResolved] = useState([false, false, false, false, false]);
  const [branchVisible, setBranchVisible] = useState(false);
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
          setResolved([true, true, true, true, true]);
          setBranchVisible(true);
          return;
        }

        NODE_DELAYS.forEach((delay, i) => {
          setTimeout(() => {
            setResolved(prev => prev.map((v, j) => (j === i ? true : v)));
          }, delay);
        });
        setTimeout(() => setBranchVisible(true), BRANCH_DELAY);
        setTimeout(() => {
          setResolved(prev => prev.map((v, j) => (j === 4 ? true : v)));
        }, NODE5_DELAY);
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [prefersReduced]);

  return (
    <section
      ref={sectionRef}
      id="section-divergence"
      className="seam-host"
      {...storySectionProps('section-divergence')}
      style={{
        backgroundColor: 'var(--surface-base)',
        paddingTop: 96,
        paddingBottom: 120,
      }}
    >
      <SeamAnchor id="hero-s2" end role="node" />
      <div className="container-editorial">
        {/* Desktop trace */}
        <div className="trace-desktop">
          <HorizontalTrace resolved={resolved} branchVisible={branchVisible} />
        </div>

        {/* Mobile trace */}
        <div className="trace-mobile">
          <VerticalTrace resolved={resolved} branchVisible={branchVisible} />
        </div>

        {/* Conclusion line */}
        <div style={{ marginTop: 72, borderTop: '1px solid var(--border-default)', paddingTop: 48 }}>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(22px, 3vw, 32px)',
              lineHeight: 1.2,
              letterSpacing: '-0.01em',
              color: 'var(--text-primary)',
              maxWidth: 720,
              margin: 0,
            }}
          >
            The workflow reported success. The business process did not complete.
          </p>
        </div>
      </div>

      <style>{`
        .trace-desktop { display: block; }
        .trace-mobile  { display: none; }
        @media (max-width: 767px) {
          .trace-desktop { display: none; }
          .trace-mobile  { display: block; }
        }
      `}</style>
    </section>
  );
}
