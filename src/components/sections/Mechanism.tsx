/* 2026-11-03: MAX-998 raised font sizes under 12px to 12px.
    2026-11-03: decomposed from the Figma Make landing export into the root app (MAX-993). */
import React, { useEffect, useRef, useState } from 'react';

/* ── Timing constants ── */
const TILE_DELAYS = [0, 200, 400, 600, 800]; // ms after intersection
const PATH_DELAY = 1060;
const PATH_DURATION = 900; // ms

/* ── Tile data ── */
const TILES = [
  { id: 'model',    label: 'Model',            success: true  },
  { id: 'tool',     label: 'Tool',             success: true  },
  { id: 'auto',     label: 'Automation',       success: true  },
  { id: 'handoff',  label: 'Handoff',          success: true  },
  { id: 'system',   label: 'System of Record', success: false },
];

/* ── Single instrument tile ── */
function Tile({ label, success, visible }: { label: string; success: boolean; visible: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 72,
        height: 116,
        border: `1px solid var(--border-${success ? 'default' : 'strong'})`,
        borderRadius: 4,
        padding: '10px 6px',
        backgroundColor: 'var(--surface-base)',
        flexShrink: 0,
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(6px)',
        transition: 'opacity 280ms ease, transform 280ms ease',
      }}
    >
      {/* Top label */}
      <span
        style={{
          fontFamily: 'var(--font-body)',
          fontWeight: 500,
          fontSize: 12,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          textAlign: 'center',
          lineHeight: 1.3,
        }}
      >
        {label}
      </span>

      {/* Center micro-detail: faint grid suggesting a panel reading */}
      <div
        style={{
          width: 40,
          height: 34,
          position: 'relative',
          borderTop: '1px solid var(--border-default)',
          borderBottom: '1px solid var(--border-default)',
          opacity: 0.35,
        }}
      >
        {[0, 1, 2].map(i => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: `${(i + 1) * 25}%`,
              height: 1,
              backgroundColor: 'var(--border-default)',
            }}
          />
        ))}
      </div>

      {/* Bottom indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {success ? (
          <>
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                backgroundColor: 'var(--accent-success)',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: 12,
                letterSpacing: '0.06em',
                color: 'var(--text-muted)',
              }}
            >
              OK
            </span>
          </>
        ) : (
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: 12,
              letterSpacing: '0.06em',
              color: 'var(--text-muted)',
            }}
          >
            —
          </span>
        )}
      </div>
    </div>
  );
}

/* ── Business obligation node ── */
function ObligationNode({ visible }: { visible: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        opacity: visible ? 1 : 0,
        transition: 'opacity 320ms ease',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: '50%',
          border: '1.5px solid var(--text-primary)',
          backgroundColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            fontSize: 12,
            letterSpacing: '0.05em',
            color: 'var(--text-muted)',
            textAlign: 'center',
            lineHeight: 1.3,
          }}
        >
          ?
        </span>
      </div>
      <span
        style={{
          fontFamily: 'var(--font-body)',
          fontWeight: 500,
          fontSize: 12,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          textAlign: 'center',
          maxWidth: 54,
          lineHeight: 1.3,
        }}
      >
        Business obligation
      </span>
    </div>
  );
}

/* ── Desktop diagram ── */
function DesktopDiagram({ tileVisible, pathAnimating }: { tileVisible: boolean[]; pathAnimating: boolean }) {
  /*
    SVG overlay path: weaves through the 5 tile positions then stops short of the obligation node.
    Tile centers at x: 36, 118, 200, 282, 364  (72px wide, 10px gap each)
    y oscillates ±12 around 58.
    Path stops at x≈430; obligation node at cx=494.
  */
  const PATH = `
    M -4,58
    C 16,58 24,46 36,46
    C 48,46 60,68 77,68
    C 94,68 106,46 118,46
    C 130,46 142,68 159,68
    C 176,68 188,46 200,46
    C 212,46 224,68 241,68
    C 258,68 270,46 282,46
    C 294,46 306,68 323,68
    C 340,68 352,46 364,46
    C 376,46 392,50 430,50
  `;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
      }}
    >
      {/* Tile row + obligation node — relative container for SVG overlay */}
      <div style={{ position: 'relative' }}>
        {/* Tiles */}
        <div
          style={{
            display: 'flex',
            gap: 10,
            alignItems: 'flex-start',
          }}
        >
          {TILES.map((tile, i) => (
            <Tile key={tile.id} label={tile.label} success={tile.success} visible={tileVisible[i]} />
          ))}

          {/* Gap indicator — tick mark area */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              height: 116,
              paddingLeft: 12,
              opacity: pathAnimating ? 1 : 0,
              transition: 'opacity 200ms ease',
            }}
          >
            {/* Tick mark (gap indicator) */}
            <svg width="10" height="20" viewBox="0 0 10 20" fill="none" aria-hidden="true">
              <line x1="5" y1="0" x2="5" y2="20" stroke="var(--border-strong)" strokeWidth="1" />
            </svg>
          </div>

          {/* Obligation node */}
          <div style={{ display: 'flex', alignItems: 'center', height: 116 }}>
            <ObligationNode visible={tileVisible[4]} />
          </div>
        </div>

        {/* SVG overlay for orange trajectory — absolutely positioned over the tile row */}
        <svg
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: 116,
            pointerEvents: 'none',
            overflow: 'visible',
          }}
          viewBox="0 0 530 116"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d={PATH}
            stroke="var(--accent-divergence)"
            strokeWidth="1.5"
            strokeDasharray="5 3"
            fill="none"
            strokeLinecap="round"
            pathLength="1"
            style={{
              strokeDashoffset: pathAnimating ? '0' : '1',
              transition: pathAnimating
                ? `stroke-dashoffset ${PATH_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`
                : 'none',
            }}
          />
        </svg>
      </div>
    </div>
  );
}

/* ── Mobile diagram ── */
function MobileDiagram({ tileVisible, pathAnimating }: { tileVisible: boolean[]; pathAnimating: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {TILES.map((tile, i) => (
        <div key={tile.id} style={{ display: 'flex', alignItems: 'stretch', gap: 14 }}>
          {/* Left side: orange line + indicator dot */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flexShrink: 0,
              width: 24,
            }}
          >
            {/* Indicator dot */}
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                flexShrink: 0,
                marginTop: 20,
                backgroundColor: tile.success ? 'var(--accent-success)' : 'transparent',
                border: tile.success ? 'none' : '1.5px solid var(--border-strong)',
                opacity: tileVisible[i] ? 1 : 0,
                transition: 'opacity 280ms ease',
              }}
            />
            {/* Orange connector line below (except last item before obligation) */}
            {i < 4 && (
              <div
                style={{
                  flex: 1,
                  width: 1.5,
                  backgroundColor: 'var(--accent-divergence)',
                  opacity: pathAnimating ? 0.7 : 0,
                  transition: `opacity 200ms ease ${PATH_DELAY + i * 80}ms`,
                  marginTop: 4,
                  marginBottom: 4,
                  borderLeft: '1.5px dashed var(--accent-divergence)',
                  background: 'none',
                }}
              />
            )}
          </div>

          {/* Row content */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              paddingTop: 14,
              paddingBottom: 14,
              borderBottom: i < 4 ? '1px solid var(--border-default)' : 'none',
              flex: 1,
              opacity: tileVisible[i] ? 1 : 0.2,
              transition: 'opacity 280ms ease',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: 12,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--text-secondary)',
                flex: 1,
              }}
            >
              {tile.label}
            </span>
            {tile.success && (
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 500,
                  fontSize: 12,
                  letterSpacing: '0.06em',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--accent-success)' }} />
                200 OK
              </span>
            )}
          </div>
        </div>
      ))}

      {/* Gap + tick + obligation node */}
      <div style={{ display: 'flex', alignItems: 'stretch', gap: 14, marginTop: 8 }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: 24,
            flexShrink: 0,
          }}
        >
          {/* Tick mark (gap indicator) */}
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 1,
              border: '1px solid var(--border-strong)',
              opacity: pathAnimating ? 0.6 : 0,
              transition: 'opacity 200ms ease',
              marginTop: 4,
              marginBottom: 6,
            }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            paddingTop: 8,
            paddingBottom: 8,
            opacity: tileVisible[4] ? 1 : 0,
            transition: 'opacity 320ms ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                border: '1.5px solid var(--text-primary)',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: 12,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
              }}
            >
              Business obligation
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Section 3 ── */
export function Mechanism() {
  const sectionRef = useRef<HTMLElement>(null);
  const [tileVisible, setTileVisible] = useState([false, false, false, false, false]);
  const [pathAnimating, setPathAnimating] = useState(false);
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
          setTileVisible([true, true, true, true, true]);
          setPathAnimating(true);
          return;
        }

        TILE_DELAYS.forEach((delay, i) => {
          setTimeout(() => {
            setTileVisible(prev => prev.map((v, j) => (j === i ? true : v)));
          }, delay);
        });
        setTimeout(() => setPathAnimating(true), PATH_DELAY);
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [prefersReduced]);

  return (
    <section
      ref={sectionRef}
      id="section-mechanism"
      style={{
        backgroundColor: 'var(--surface-base)',
        paddingTop: 120,
        paddingBottom: 120,
      }}
    >
      <div className="container-editorial">
        {/* Section label + rule */}
        <div style={{ marginBottom: 64 }}>
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
            03&nbsp;&nbsp;/&nbsp;&nbsp;Local success&nbsp;&nbsp;≠&nbsp;&nbsp;Terminal success
          </div>
          <div
            style={{
              height: 1,
              backgroundColor: 'var(--border-default)',
              width: '100%',
            }}
          />
        </div>

        {/* Split layout */}
        <div className="s3-grid">
          {/* Left: headline + body */}
          <div className="s3-left">
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 'clamp(28px, 4vw, 48px)',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)',
                marginBottom: 40,
                maxWidth: 460,
              }}
            >
              Every component can report success while the workflow still fails.
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 440 }}>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 400,
                  fontSize: 16,
                  lineHeight: 1.6,
                  color: 'var(--text-secondary)',
                  margin: 0,
                }}
              >
                Component success tells you that a local step behaved as expected.
                It does not necessarily tell you that the business state the workflow
                was supposed to create now exists.
              </p>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 400,
                  fontSize: 16,
                  lineHeight: 1.6,
                  color: 'var(--text-secondary)',
                  margin: 0,
                }}
              >
                The gap becomes harder to see when work crosses models, retrieval
                systems, APIs, queues, automation platforms, human approvals, and
                systems of record.
              </p>

              <div
                style={{
                  borderTop: '1px solid var(--border-default)',
                  paddingTop: 20,
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 600,
                    fontSize: 16,
                    lineHeight: 1.6,
                    color: 'var(--text-primary)',
                    margin: 0,
                    marginBottom: 24,
                  }}
                >
                  Reliability therefore requires a different standard for&nbsp;"done."
                </p>

                {/* Down-arrow toward next section */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg
                    width="14"
                    height="24"
                    viewBox="0 0 14 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <line x1="7" y1="0" x2="7" y2="18" stroke="var(--text-muted)" strokeWidth="1.25" />
                    <polyline
                      points="3,14 7,22 11,14"
                      stroke="var(--text-muted)"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
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
                    A new standard
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: diagram */}
          <div className="s3-right">
            {/* Diagram labels above tiles */}
            <div style={{ marginBottom: 12 }}>
              <div
                style={{
                  display: 'flex',
                  gap: 6,
                  alignItems: 'center',
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
                    color: 'var(--text-muted)',
                  }}
                >
                  Local evidence
                </span>
                <div style={{ flex: 1, height: 1, backgroundColor: 'var(--border-default)' }} />
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
                  Terminal evidence
                </span>
              </div>
            </div>

            {/* Desktop diagram */}
            <div className="diagram-desktop">
              <DesktopDiagram tileVisible={tileVisible} pathAnimating={pathAnimating} />
            </div>

            {/* Mobile diagram */}
            <div className="diagram-mobile">
              <MobileDiagram tileVisible={tileVisible} pathAnimating={pathAnimating} />
            </div>

            {/* Annotation below diagram */}
            <div
              style={{
                marginTop: 20,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                opacity: pathAnimating ? 1 : 0,
                transition: 'opacity 400ms ease 600ms',
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 0,
                  flexShrink: 0,
                  marginTop: 8,
                  borderTop: '1.5px dashed var(--accent-divergence)',
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 400,
                  fontSize: 12,
                  color: 'var(--text-muted)',
                  lineHeight: 1.5,
                  letterSpacing: '0.01em',
                }}
              >
                The observed state from each local component does not compose into
                a verified terminal outcome.
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .s3-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0 80px;
          align-items: start;
        }
        .diagram-desktop { display: block; }
        .diagram-mobile  { display: none; }
        @media (max-width: 900px) {
          .s3-grid {
            grid-template-columns: 1fr;
            gap: 56px 0;
          }
        }
        @media (max-width: 767px) {
          .diagram-desktop { display: none; }
          .diagram-mobile  { display: block; }
        }
        @media (min-width: 768px) {
          .diagram-mobile  { display: none; }
          .diagram-desktop { display: block; }
        }
      `}</style>
    </section>
  );
}
