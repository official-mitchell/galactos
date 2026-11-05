/* 2026-11-05: MAX-1023 scope labels, seeded field, in-view probe, E4.
   2026-11-04: MAX-1014 S6→S7 band edge is 1px border-strong. No gradient.
   2026-11-04: MAX-1011 carries the Intervention reader question and seam from sections.ts.
   2026-11-03: MAX-998 raised font sizes under 12px to 12px.
    2026-11-03: decomposed from the Figma Make landing export into the root app (MAX-993). */
import React, { useEffect, useRef, useState } from 'react';
import { trackSectionView } from '../../analytics/track';
import { storySectionProps } from '../../content/sections';
import { useLoop } from '../../motion/hooks';
import { Evidence } from '../Evidence';

/* ── Always-dark surface tokens ── */
const P   = '#F8F6F3';                       // Paper
const P85 = 'rgba(248,246,243,0.85)';
const P65 = 'rgba(248,246,243,0.65)';
const P42 = 'rgba(248,246,243,0.42)';
const P28 = 'rgba(248,246,243,0.28)';
const P16 = 'rgba(248,246,243,0.16)';
const P09 = 'rgba(248,246,243,0.09)';
const P05 = 'rgba(248,246,243,0.05)';

/* ── Faint enterprise node positions ── */
function seededField(count: number) {
  let state = 1023
  const next = () => {
    state = (state * 16807) % 2147483647
    return (state - 1) / 2147483646
  }
  return Array.from({ length: count }, () => ({
    cx: 28 + next() * 464,
    cy: 28 + next() * 284,
    outer: next() < 0.18,
  }))
}

const FAINT_NODES = seededField(72)

/* ── Faint edge connections ── */
const FAINT_EDGES = [
  [72, 68, 148, 63], [148, 63, 228, 70], [228, 70, 310, 65], [310, 65, 382, 72],
  [58, 112, 72, 68], [150, 108, 148, 63],
  [65, 228, 148, 234], [148, 234, 232, 226], [232, 226, 320, 231],
  [90, 274, 65, 228], [190, 278, 148, 234], [282, 272, 232, 226],
];

/* ── Diagram SVG ── */
function DiagramSVG({
  nodesVisible, boxDrawn, pathVisible, nodesResolved, prefersReduced,
}: {
  nodesVisible: boolean;
  boxDrawn: boolean;
  pathVisible: boolean;
  nodesResolved: boolean[];
  prefersReduced: boolean;
}) {
  const dur = (ms: number) => (prefersReduced ? '0ms' : `${ms}ms`);

  /* Node x positions along path at y=170 */
  const NX = [100, 186, 272, 358, 444];
  const NY = 170;
  const R  = 8;

  return (
    <svg
      viewBox="0 0 520 340"
      width="100%"
      style={{ display: 'block', overflow: 'visible' }}
      aria-label="Bounded workflow diagnostic diagram"
      data-seed="1023"
    >
      <circle data-probe="" cx="100" cy="170" r="3.5" fill={P} opacity={pathVisible && !prefersReduced ? 0.9 : 0} />
      {/* ── Faint enterprise nodes ── */}
      <g style={{ opacity: nodesVisible ? 1 : 0, transition: `opacity ${dur(600)} ease` }}>
        {FAINT_EDGES.map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={P} strokeWidth="0.4" opacity="0.045" />
        ))}
        {FAINT_NODES.map((n, i) => (
          <circle key={i} cx={n.cx} cy={n.cy} r={4.5}
            stroke={P} strokeWidth="0.65" fill="transparent"
            opacity={n.outer ? 0.04 : 0.12} />
        ))}
      </g>

      {/* ── Bounding box ── */}
      <path
        d="M 40,40 h 440 v 260 h -440 Z"
        stroke={P} strokeWidth="0.85" fill="transparent"
        pathLength="1"
        style={{
          strokeDasharray: 1,
          strokeDashoffset: boxDrawn ? 0 : 1,
          opacity: 0.55,
          transition: `stroke-dashoffset ${dur(720)} ease`,
        }}
      />

      {/* ── Metadata labels ── */}
      <g style={{ opacity: boxDrawn ? 1 : 0, transition: `opacity ${dur(300)} ease ${dur(400)}` }}>
        <text x="44" y="29" fill={P42} fontSize="12" fontFamily="Inter, sans-serif"
          fontWeight="500" letterSpacing="0.12em">SCOPE: ONE WORKFLOW</text>
        <text x="352" y="326" fill={P42} fontSize="12" fontFamily="Inter, sans-serif"
          fontWeight="500" letterSpacing="0.12em">MODE: DIAGNOSTIC</text>
      </g>

      {/* ── Path arrows ── */}
      <g style={{ opacity: pathVisible ? 1 : 0, transition: `opacity ${dur(280)} ease` }}>
        {NX.slice(0, 4).map((x, i) => {
          const x1 = x + R + 1;
          const x2 = NX[i + 1] - R - 1;
          return (
            <g key={i}>
              <line x1={x1} y1={NY} x2={x2} y2={NY} stroke={P42} strokeWidth="0.85" />
              <polyline
                points={`${x2 - 5},${NY - 4} ${x2},${NY} ${x2 - 5},${NY + 4}`}
                stroke={P42} strokeWidth="0.85" fill="none"
              />
            </g>
          );
        })}
        {/* Exit arrow — dashed, after node 5 */}
        <line x1={NX[4] + R + 1} y1={NY} x2="473" y2={NY}
          stroke={P28} strokeWidth="0.85" strokeDasharray="4 3" />
        <polyline
          points={`468,${NY - 4} 473,${NY} 468,${NY + 4}`}
          stroke={P28} strokeWidth="0.85" fill="none"
        />
      </g>

      {/* ── Path labels ── */}
      <g style={{ opacity: pathVisible ? 1 : 0, transition: `opacity ${dur(300)} ease ${dur(200)}` }}>
        <text x={NX[0]} y={NY + 21} textAnchor="middle" fill={P42} fontSize="12"
          fontFamily="Inter, sans-serif" fontWeight="500" letterSpacing="0.1em">TRIGGER</text>
        <text x={NX[4]} y={NY + 21} textAnchor="middle" fill={P42} fontSize="12"
          fontFamily="Inter, sans-serif" fontWeight="500" letterSpacing="0.1em">AUTHORITATIVE</text>
        <text x={NX[4]} y={NY + 31} textAnchor="middle" fill={P42} fontSize="12"
          fontFamily="Inter, sans-serif" fontWeight="500" letterSpacing="0.1em">COMPLETION</text>
      </g>

      {/* ── Highlighted nodes ── */}

      {/* Node 1: Intent — Paper outline, slight fill on resolve */}
      <circle cx={NX[0]} cy={NY} r={R}
        stroke={P} strokeWidth="1.2" fill="transparent"
        style={{ opacity: nodesResolved[0] ? 0.88 : 0, transition: `opacity ${dur(220)} ease` }} />
      {/* Small orange tick inside intent node */}
      <line x1={NX[0] - 3} y1={NY} x2={NX[0] + 3} y2={NY}
        stroke="var(--accent-divergence)" strokeWidth="1.2"
        style={{ opacity: nodesResolved[0] ? 1 : 0, transition: `opacity ${dur(180)} ease ${dur(60)}` }} />

      {/* Node 2: Success green */}
      <circle cx={NX[1]} cy={NY} r={R}
        fill="var(--accent-success)" stroke="none"
        style={{ opacity: nodesResolved[1] ? 1 : 0, transition: `opacity ${dur(220)} ease` }} />
      <polyline
        points={`${NX[1] - 4},${NY} ${NX[1] - 1},${NY + 3} ${NX[1] + 5},${NY - 4}`}
        stroke="rgba(10,21,32,0.85)" strokeWidth="1.2" fill="none"
        style={{ opacity: nodesResolved[1] ? 1 : 0, transition: `opacity ${dur(180)} ease ${dur(60)}` }}
      />

      {/* Node 3: Success green */}
      <circle cx={NX[2]} cy={NY} r={R}
        fill="var(--accent-success)" stroke="none"
        style={{ opacity: nodesResolved[2] ? 1 : 0, transition: `opacity ${dur(220)} ease` }} />
      <polyline
        points={`${NX[2] - 4},${NY} ${NX[2] - 1},${NY + 3} ${NX[2] + 5},${NY - 4}`}
        stroke="rgba(10,21,32,0.85)" strokeWidth="1.2" fill="none"
        style={{ opacity: nodesResolved[2] ? 1 : 0, transition: `opacity ${dur(180)} ease ${dur(60)}` }}
      />

      {/* Node 4: Cobalt evidence */}
      <circle cx={NX[3]} cy={NY} r={R}
        fill="var(--accent-info)" stroke="none"
        style={{ opacity: nodesResolved[3] ? 1 : 0, transition: `opacity ${dur(220)} ease` }} />
      {/* Small dot inside cobalt node */}
      <circle cx={NX[3]} cy={NY} r={2.5}
        fill="rgba(10,21,32,0.7)"
        style={{ opacity: nodesResolved[3] ? 1 : 0, transition: `opacity ${dur(180)} ease ${dur(60)}` }} />

      {/* Node 5: Terminal — Paper outline only */}
      <circle cx={NX[4]} cy={NY} r={R}
        stroke={P} strokeWidth="1.2" fill="transparent"
        style={{ opacity: nodesResolved[4] ? 0.7 : 0, transition: `opacity ${dur(220)} ease` }} />
    </svg>
  );
}

/* ── Section 7 ── */
export function Intervention() {
  const sectionRef = useRef<HTMLElement>(null);
  useLoop(sectionRef, (timeline) => {
    const probe = sectionRef.current?.querySelector('[data-probe]')
    if (!probe) return
    timeline.fromTo(probe, { attr: { cx: 100 } }, { attr: { cx: 444 }, duration: 7, ease: 'none' })
  })
  const [nodesVisible,  setNodesVisible]  = useState(false);
  const [boxDrawn,      setBoxDrawn]      = useState(false);
  const [pathVisible,   setPathVisible]   = useState(false);
  const [nodesResolved, setNodesResolved] = useState([false, false, false, false, false]);

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
        trackSectionView('s7_view');

        if (prefersReduced) {
          setNodesVisible(true);
          setBoxDrawn(true);
          setPathVisible(true);
          setNodesResolved([true, true, true, true, true]);
          return;
        }

        setTimeout(() => setNodesVisible(true), 0);
        setTimeout(() => setBoxDrawn(true),     700);
        setTimeout(() => setPathVisible(true),   1300);
        [0, 1, 2, 3, 4].forEach(i => {
          setTimeout(() => {
            setNodesResolved(prev => prev.map((v, j) => j === i ? true : v));
          }, 1520 + i * 280);
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [prefersReduced]);

  return (
    <section
      ref={sectionRef}
      id="section-intervention"
      className="surface-emphasis-band"
      data-seam-band="s6-s7"
      {...storySectionProps('section-intervention')}
      data-variant="emphasis"
      style={{
        backgroundColor: 'var(--surface-emphasis)',
        borderTop: '1px solid var(--border-strong)',
        borderBottom: '1px solid var(--border-strong)',
        paddingTop: 128,
        paddingBottom: 128,
      }}
    >
      <div className="container-editorial">
        <div className="s7-grid">

          {/* ── Left: text ── */}
          <div className="s7-text">
            {/* Eyebrow */}
            <div style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: 12,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: P28,
              marginBottom: 20,
            }}>
              The Intervention
            </div>

            {/* Headline */}
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(30px, 3.6vw, 48px)',
              lineHeight: 1.08,
              letterSpacing: '-0.025em',
              color: P,
              marginBottom: 28,
            }}>
              The AI Workflow Reliability Diagnostic.
            </h2>

            {/* Scope statement — Fraunces 32px */}
            <p style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 400,
              fontSize: 'clamp(20px, 2.4vw, 32px)',
              lineHeight: 1.25,
              letterSpacing: '-0.01em',
              color: P65,
              marginBottom: 32,
            }}>
              One consequential workflow. One defined business outcome.
              A bounded investigation of what actually happens from trigger
              to verified completion.
            </p>

            {/* Hairline rule */}
            <div style={{ height: 1, backgroundColor: P16, marginBottom: 28 }} />

            {/* Promise — Inter 18px */}
            <p style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              fontSize: 'clamp(15px, 1.4vw, 18px)',
              lineHeight: 1.6,
              color: P65,
              marginBottom: 20,
            }}>
              The Diagnostic identifies where reported execution diverges from
              the state the workflow was actually supposed to produce, why the
              divergence occurs, and what should be repaired first.
            </p>

            {/* Scope paragraph — Inter 16px, lower contrast */}
            <p style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              fontSize: 15,
              lineHeight: 1.65,
              color: P42,
              marginBottom: 36,
            }}>
              Depending on the workflow, the investigation may follow model
              behavior, context and retrieval, integrations, queues, permissions,
              retries, system-of-record updates, exception paths, and human
              handoffs. The unit of analysis remains the business outcome, not
              any single component.
            </p>

            {/* Micro-credibility */}
            <div style={{
              paddingTop: 20,
              borderTop: `1px solid ${P16}`,
            }}>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: 12,
                letterSpacing: '0.06em',
                lineHeight: 1.6,
                color: P28,
                margin: 0,
              }}>
                Built from product systems thinking, workflow analysis, AI
                architecture, context systems, evaluation, and operational
                process design.
              </p>
            </div>
          </div>

          {/* ── Right: diagram ── */}
          <div className="s7-diagram">
            {/* Diagram label */}
            <div style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: 12,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: P28,
              marginBottom: 16,
            }}>
              Scope: one workflow · Mode: diagnostic
            </div>
            <DiagramSVG
              nodesVisible={nodesVisible}
              boxDrawn={boxDrawn}
              pathVisible={pathVisible}
              nodesResolved={nodesResolved}
              prefersReduced={prefersReduced}
            />
            {/* Node legend */}
            <div style={{
              display: 'flex',
              gap: 20,
              marginTop: 16,
              flexWrap: 'wrap',
            }}>
              {[
                { label: 'Intent',    color: P65,                    outline: true },
                { label: 'Success',   color: 'var(--accent-success)', outline: false },
                { label: 'Evidence',  color: 'var(--accent-info)',    outline: false },
                { label: 'Terminal',  color: P42,                    outline: true },
              ].map(({ label, color, outline }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <circle cx="6" cy="6" r="5"
                      fill={outline ? 'transparent' : color}
                      stroke={outline ? color : 'none'}
                      strokeWidth="1"
                    />
                  </svg>
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 500,
                    fontSize: 12,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: P28,
                  }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
        <Evidence
          id="E4"
          kind="FORECAST · 2025"
          label="One industry forecast expects many agentic projects to be canceled over cost, value, and risk."
          href="https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027"
        />
      </div>

      <style>{`
        .s7-grid {
          display: grid;
          grid-template-columns: 45fr 55fr;
          gap: 0 72px;
          align-items: center;
        }
        @media (max-width: 900px) {
          .s7-grid {
            grid-template-columns: 1fr;
            gap: 56px 0;
          }
          .s7-diagram {
            max-width: 560px;
          }
        }
      `}</style>
    </section>
  );
}
