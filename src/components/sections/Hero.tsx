/* 2026-11-03: decomposed from the Figma Make landing export into the root app (MAX-993).
   2026-11-03: MAX-998 mapped the headline to .text-display-xl and the lede to .text-lede.
   2026-11-03: layout and copy matched to instructions/design/mocks/galactos-mock-hero.png.
   2026-11-04: MAX-1013. Tertiary verification link and primary CTA read sections.ts. */
import React from 'react';
import { trackEvent } from '../../analytics/track';
import { scrollTo, sectionHref } from '../../content/sections';
import { HeroDiagram } from '../diagram/HeroDiagram';

export function Hero() {
  return (
    <section
      id="section-hero"
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
              href={sectionHref('workflow')}
              data-scroll-target={sectionHref('workflow').slice(1)}
              className="btn-primary"
              onClick={(event) => {
                event.preventDefault();
                trackEvent({ name: 'nav_click', target: sectionHref('workflow').slice(1) });
                scrollTo(sectionHref('workflow'));
              }}
            >
              Walk me through the workflow
            </a>
            <a
              href={sectionHref('verification')}
              data-scroll-target={sectionHref('verification').slice(1)}
              className="btn-tertiary"
              onClick={(event) => {
                event.preventDefault();
                trackEvent({ name: 'nav_click', target: sectionHref('verification').slice(1) });
                scrollTo(sectionHref('verification'));
              }}
              style={{ fontSize: 15, paddingLeft: 2, minHeight: 44 }}
            >
              See how verification works →
            </a>
          </div>
        </div>

        <div style={{ position: 'relative', minWidth: 0 }}>
          <HeroDiagram />
        </div>
      </div>
    </section>
  );
}
