/* 2026-11-03: decomposed from the Figma Make landing export into the root app (MAX-993). */
import React, { useEffect, useRef, useState } from 'react';

const IMAGE_URL =
  'https://images.unsplash.com/photo-1704972806322-3bdc80ac03f9?w=900&h=720&fit=crop&auto=format&q=80';

/* ── Overlay path SVG (weaves across structural layers) ── */
function OverlayPath({ drawn }: { drawn: boolean }) {
  return (
    <svg
      viewBox="0 0 480 600"
      width="100%"
      height="100%"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Layered horizontal reference lines (very faint) */}
      {[120, 240, 360, 480].map(y => (
        <line key={y} x1="0" y1={y} x2="480" y2={y}
          stroke="rgba(248,246,243,0.08)" strokeWidth="0.5" />
      ))}

      {/* Main traversal path — crosses three structural planes */}
      <path
        d="M -4,180
           C 60,180 80,240 160,240
           C 240,240 260,320 340,320
           C 400,320 430,360 484,360"
        stroke="rgba(248,246,243,0.70)"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
        pathLength="1"
        style={{
          strokeDasharray: 1,
          strokeDashoffset: drawn ? 0 : 1,
          transition: drawn ? 'stroke-dashoffset 2400ms ease' : 'none',
        }}
      />

      {/* Small node markers at each plane crossing */}
      {[[160, 240], [340, 320]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="4"
          fill="rgba(248,246,243,0.65)"
          stroke="none"
          style={{
            opacity: drawn ? 1 : 0,
            transition: drawn ? `opacity 200ms ease ${800 + i * 800}ms` : 'none',
          }}
        />
      ))}

      {/* Plane crossing tick marks */}
      {[[160, 226, 254], [340, 306, 334]].map(([x, y1, y2], i) => (
        <line key={i} x1={x} y1={y1} x2={x} y2={y2}
          stroke="rgba(248,246,243,0.35)"
          strokeWidth="0.7"
          style={{
            opacity: drawn ? 1 : 0,
            transition: drawn ? `opacity 200ms ease ${900 + i * 800}ms` : 'none',
          }}
        />
      ))}
    </svg>
  );
}

/* ── Image panel (shared between desktop + mobile instances) ── */
function ImagePanel({ drawn, mobileAspect }: { drawn: boolean; mobileAspect?: boolean }) {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: mobileAspect ? undefined : '100%',
      aspectRatio: mobileAspect ? '4/3' : undefined,
      minHeight: mobileAspect ? undefined : 480,
      overflow: 'hidden',
      borderRadius: 2,
      backgroundColor: 'var(--surface-emphasis)',
    }}>
      <img
        src={IMAGE_URL}
        alt="Intersecting concrete planes — structural geometry"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          display: 'block',
          opacity: 0.88,
          filter: 'grayscale(20%) contrast(1.05)',
        }}
      />
      {/* Very faint dark vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(160deg, rgba(10,21,32,0.08) 0%, transparent 50%, rgba(10,21,32,0.18) 100%)',
        pointerEvents: 'none',
      }} />
      <OverlayPath drawn={drawn} />
    </div>
  );
}

/* ── Metadata column ── */
const META_ITEMS = [
  'Product Systems',
  'Workflow Design',
  'AI + Agents',
  'Context + Retrieval',
  'Evaluation',
  'Operations',
];

function MetadataList() {
  return (
    <div style={{ paddingTop: 20 }}>
      {META_ITEMS.map((item, i) => (
        <div key={item}>
          <div style={{ height: 1, backgroundColor: 'var(--border-default)' }} />
          <div style={{
            padding: '10px 0',
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            fontSize: 9.5,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}>
            {item}
          </div>
          {i === META_ITEMS.length - 1 && (
            <div style={{ height: 1, backgroundColor: 'var(--border-default)' }} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Section 10 ── */
export function Credibility() {
  const imageRef = useRef<HTMLDivElement>(null);
  const [pathDrawn, setPathDrawn] = useState(false);

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (prefersReduced) { setPathDrawn(true); return; }
    const el = imageRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPathDrawn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [prefersReduced]);

  return (
    <section
      id="section-credibility"
      style={{ backgroundColor: 'var(--surface-base)', paddingTop: 120, paddingBottom: 0 }}
    >
      <div className="container-editorial">

        {/* Section label */}
        <div style={{ marginBottom: 56 }}>
          <div style={{
            fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 10,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'var(--text-muted)', marginBottom: 12,
          }}>
            10&nbsp;&nbsp;/&nbsp;&nbsp;Approach
          </div>
          <div style={{ height: 1, backgroundColor: 'var(--border-default)' }} />
        </div>

        {/* Mobile: image appears above copy */}
        <div className="s10-mobile-img-wrap" ref={imageRef}>
          <ImagePanel drawn={pathDrawn} mobileAspect />
        </div>

        {/* Main grid */}
        <div className="s10-grid">

          {/* ── Left: copy ── */}
          <div className="s10-left">
            <h2 style={{
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: 'clamp(28px, 3.6vw, 48px)', lineHeight: 1.08,
              letterSpacing: '-0.025em', color: 'var(--text-primary)',
              marginBottom: 32,
            }}>
              One business outcome, followed across every boundary it crosses.
            </h2>

            {/* Paragraph 1 */}
            <p style={{
              fontFamily: 'var(--font-body)', fontWeight: 400,
              fontSize: 'clamp(14px, 1.2vw, 16px)', lineHeight: 1.65,
              color: 'var(--text-secondary)', marginBottom: 20,
            }}>
              Galactos brings together product systems thinking, workflow and
              service design, AI and agent architecture, context and retrieval
              systems, evaluation, and operational analysis. The Diagnostic
              follows one business outcome horizontally through the models,
              integrations, systems, and human handoffs involved.
            </p>

            {/* Paragraph 2: slightly emphasized */}
            <p style={{
              fontFamily: 'var(--font-body)', fontWeight: 500,
              fontSize: 'clamp(14px, 1.2vw, 16px)', lineHeight: 1.65,
              color: 'var(--text-primary)', marginBottom: 20,
              paddingLeft: 16,
              borderLeft: '2px solid var(--border-strong)',
            }}>
              The work complements the teams that build and operate those
              components by giving the entire business obligation one bounded
              unit of investigation.
            </p>

            {/* Paragraph 3 */}
            <p style={{
              fontFamily: 'var(--font-body)', fontWeight: 400,
              fontSize: 'clamp(14px, 1.2vw, 16px)', lineHeight: 1.65,
              color: 'var(--text-secondary)', marginBottom: 32,
            }}>
              Findings distinguish observed evidence from interpretation, document
              gaps where evidence is unavailable, and prioritize the smallest set
              of repairs and tests needed to increase confidence.
            </p>

            {/* Optional link */}
            <div style={{ marginBottom: 0 }}>
              <a
                href="#"
                aria-label="View an illustrative diagnostic (placeholder)"
                style={{
                  fontFamily: 'var(--font-body)', fontWeight: 400,
                  fontSize: 13, color: 'var(--text-muted)',
                  textDecoration: 'underline',
                  textDecorationColor: 'var(--border-default)',
                  textUnderlineOffset: 3,
                  letterSpacing: '0.01em',
                  opacity: 0.7,
                  transition: 'opacity 140ms ease, color 140ms ease',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.opacity = '1';
                  (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.opacity = '0.7';
                  (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
                }}
              >
                View an illustrative diagnostic →
              </a>
            </div>

            {/* Mobile: metadata appears after copy */}
            <div className="s10-mobile-meta" style={{ marginTop: 40 }}>
              <MetadataList />
            </div>
          </div>

          {/* ── Right: image + metadata ── */}
          <div className="s10-right" ref={imageRef}>
            {/* Desktop image */}
            <div className="s10-desktop-img">
              <ImagePanel drawn={pathDrawn} />
            </div>

            {/* Desktop metadata */}
            <div className="s10-desktop-meta">
              <MetadataList />
            </div>
          </div>

        </div>

        {/* Pull quote — full width, generous spacing */}
        <div style={{
          paddingTop: 96,
          paddingBottom: 104,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
        }}>
          {/* Flanking hairlines */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, width: '100%', maxWidth: 560 }}>
            <div style={{ flex: 1, height: 1, backgroundColor: 'var(--border-default)' }} />
            <blockquote style={{
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: 'clamp(28px, 4vw, 56px)', lineHeight: 1.05,
              letterSpacing: '-0.03em', color: 'var(--text-primary)',
              textAlign: 'center', margin: 0, flex: '0 1 auto',
            }}>
              See what's actually happening.
            </blockquote>
            <div style={{ flex: 1, height: 1, backgroundColor: 'var(--border-default)' }} />
          </div>
        </div>

      </div>

      <style>{`
        .s10-grid {
          display: grid;
          grid-template-columns: 55fr 45fr;
          gap: 0 80px;
          align-items: start;
        }
        .s10-right {
          display: flex;
          flex-direction: column;
          gap: 0;
          height: 100%;
        }
        .s10-desktop-img {
          display: block;
          flex: 1;
        }
        .s10-mobile-img-wrap { display: none; }
        .s10-desktop-meta { display: block; }
        .s10-mobile-meta { display: none; }

        @media (max-width: 860px) {
          .s10-grid { grid-template-columns: 1fr; gap: 40px 0; }
          .s10-mobile-img-wrap { display: block; margin-bottom: 40px; }
          .s10-desktop-img { display: none; }
          .s10-desktop-meta { display: none; }
          .s10-mobile-meta { display: block; }
        }
      `}</style>
    </section>
  );
}
