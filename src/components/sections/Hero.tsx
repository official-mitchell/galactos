/* 2026-11-03: decomposed from the Figma Make landing export into the root app (MAX-993). */
import React from 'react';
import { WorkflowTrace } from '../diagram/WorkflowTrace';

function scrollTo(id: string) {
  const el = document.querySelector(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

export function Hero() {
  return (
    <section
      id="section-hero"
      style={{
        position: 'relative',
        minHeight: 'calc(88vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        overflow: 'visible',
        paddingTop: 80,
        paddingBottom: 0,
      }}
    >
      {/* Fine grid — full section */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(var(--border-default) 1px, transparent 1px), linear-gradient(90deg, var(--border-default) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          opacity: 0.07,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />

      <div
        className="container-editorial hero-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '45fr 55fr',
          gap: '0 80px',
          alignItems: 'center',
          width: '100%',
        }}
      >
        {/* ── Left column ── */}
        <div className="hero-left" style={{ paddingBottom: 96 }}>
          {/* Trace ID label */}
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: 10,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: 28,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: 'var(--accent-divergence)',
                flexShrink: 0,
              }}
            />
            Observation in progress
          </div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(40px, 5vw, 72px)',
              lineHeight: 1.04,
              letterSpacing: '-0.025em',
              color: 'var(--text-primary)',
              marginBottom: 28,
              maxWidth: 560,
            }}
          >
            Your AI workflow can say&nbsp;"done" before the work is done.
          </h1>

          {/* Supporting paragraph */}
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              fontSize: 18,
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
              marginBottom: 20,
              maxWidth: 480,
            }}
          >
            Models can answer correctly. APIs can return success. Automations can finish.
            Tickets can close. The business outcome underneath can still be wrong,
            incomplete, duplicated, or unresolved.
          </p>

          {/* Quiet single line */}
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: 14,
              lineHeight: 1.5,
              color: 'var(--text-muted)',
              marginBottom: 44,
              maxWidth: 440,
              letterSpacing: '0.005em',
            }}
          >
            Galactos investigates consequential AI-enabled workflows from trigger
            to verified business completion.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
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
              style={{ fontSize: 14 }}
            >
              See how verification works →
            </button>
          </div>

          {/* Small horizontal rule + footnote */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginTop: 56,
              paddingTop: 24,
              borderTop: '1px solid var(--border-default)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 400,
                fontSize: 11,
                color: 'var(--text-muted)',
                letterSpacing: '0.04em',
              }}
            >
              TRACE-GAL-20260102-0047 &nbsp;·&nbsp; AGENT: workflow-router-v3
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: 10,
                color: 'var(--accent-divergence)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-divergence)',
                }}
              />
              Divergence detected
            </div>
          </div>
        </div>

        {/* ── Right column ── */}
        <div
          style={{
            position: 'relative',
            minHeight: 380,
            overflow: 'visible',
            paddingBottom: 96,
          }}
        >
          <WorkflowTrace orientation="horizontal" />
        </div>
      </div>

    </section>
  );
}
