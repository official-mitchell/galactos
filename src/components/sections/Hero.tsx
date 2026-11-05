/* 2026-11-04: MAX-1011 carries the Hero reader question and seam from sections.ts.
   2026-11-03: decomposed from the Figma Make landing export into the root app (MAX-993).
   2026-11-03: MAX-998 mapped the headline to .text-display-xl and the lede to .text-lede.
   2026-11-03: layout and copy matched to instructions/design/mocks/galactos-mock-hero.png. */
import React from 'react';
import { storySectionProps } from '../../content/sections';
import { HeroDiagram } from '../diagram/HeroDiagram';

function scrollTo(id: string) {
  const el = document.querySelector(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

export function Hero() {
  return (
    <section
      id="section-hero"
      {...storySectionProps('section-hero')}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        overflow: 'visible',
        paddingTop: 96,
        paddingBottom: 64,
      }}
    >
      <div
        className="container-editorial hero-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 0.95fr) minmax(0, 1.2fr)',
          gap: '32px 40px',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <div className="hero-left" style={{ position: 'relative', zIndex: 1 }}>
          <h1
            className="text-display-xl"
            style={{
              fontSize: 'clamp(34px, 3.1vw, 46px)',
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              marginBottom: 22,
              maxWidth: 440,
            }}
          >
            Your AI workflow can say ‘done’ before the real work is done.
          </h1>

          <p className="text-lede" style={{ marginBottom: 16, maxWidth: 400, fontSize: 17 }}>
            Business outcomes can be wrong, incomplete, duplicated, or unresolved.
          </p>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              fontSize: 16,
              lineHeight: 1.55,
              color: 'var(--text-secondary)',
              marginBottom: 28,
              maxWidth: 420,
            }}
          >
            Galactos investigates consequential AI-enabled workflows from trigger to verified business completion.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
            <a
              href="#section-cta"
              className="btn-primary"
              onClick={e => { e.preventDefault(); scrollTo('#section-cta'); }}
            >
              Walk me through the workflow
            </a>
            <button
              className="btn-tertiary"
              onClick={() => scrollTo('#section-verification')}
              style={{ fontSize: 15, paddingLeft: 2 }}
            >
              See how verification works →
            </button>
          </div>
        </div>

        <div style={{ position: 'relative', minWidth: 0 }}>
          <HeroDiagram />
        </div>
      </div>
    </section>
  );
}
