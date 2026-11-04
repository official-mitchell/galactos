/* 2026-11-03: decomposed from the Figma Make landing export into the root app (MAX-993). */
import React from 'react';
import { NodeIntent, NodeSuccess, NodeAnomaly, NodeMissing, FlowArrow, DivergencePath } from './diagram/DiagramNodes';

export function LandingPlaceholder() {
  return (
    <div style={{ backgroundColor: 'var(--surface-base)' }}>
      {/* Hero placeholder band */}
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Grid motif */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(var(--border-default) 1px, transparent 1px), linear-gradient(90deg, var(--border-default) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            opacity: 0.12,
          }}
        />

        <div className="container-editorial" style={{ position: 'relative', zIndex: 1, paddingTop: 96, paddingBottom: 96 }}>
          <div className="text-label" style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
            GALACTOS · AI WORKFLOW RELIABILITY
          </div>
          <h1
            className="text-display-xl"
            style={{ color: 'var(--text-primary)', maxWidth: 760, marginBottom: 32 }}
          >
            When done isn't done.
          </h1>
          <p
            className="text-body"
            style={{ color: 'var(--text-secondary)', maxWidth: 520, fontSize: 18, lineHeight: 1.6, marginBottom: 48 }}
          >
            Your AI workflow reported completion. The business outcome remained unresolved.
            This is the divergence gap — and it is growing silently inside your organization.
          </p>

          {/* Inline anomaly diagram */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 48,
              flexWrap: 'wrap',
            }}
          >
            <NodeIntent size={20} />
            <FlowArrow length={40} />
            <NodeSuccess size={20} />
            <div className="text-meta" style={{ fontSize: 12 }}>Workflow reports "done"</div>
            <DivergencePath length={56} />
            <NodeAnomaly size={20} />
            <div className="text-meta" style={{ fontSize: 12, color: 'var(--accent-divergence)' }}>
              Outcome unresolved
            </div>
            <FlowArrow length={40} variant="dashed" />
            <NodeMissing size={20} />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn-primary">Understand the gap →</button>
            <button className="btn-secondary">View our approach</button>
          </div>
        </div>
      </div>

      {/* Section placeholder */}
      <div
        className="surface-emphasis-band"
        style={{ padding: '96px 0' }}
      >
        <div className="container-editorial">
          <div className="text-label" style={{ color: 'rgba(248,246,243,0.45)', marginBottom: 16 }}>
            COMING IN SECTION 02
          </div>
          <div
            className="text-display-md"
            style={{ color: '#F8F6F3', maxWidth: 600 }}
          >
            The next sections will investigate the anomaly, teach a new standard, and introduce Galactos.
          </div>
        </div>
      </div>

      <div style={{ padding: '96px 0' }}>
        <div className="container-editorial">
          <div className="text-label" style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
            FOUNDATION COMPLETE · SECTIONS PENDING
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {[
              'Section 01 — The Anomaly (Hero)',
              'Section 02 — A New Standard for Done',
              'Section 03 — Recognize It In Your Org',
              'Section 04 — The Divergence Gap Explained',
              'Section 05 — What Verification Looks Like',
              'Section 06 — How Galactos Intervenes',
              'Section 07 — The Methodology (Emphasis Band)',
              'Section 08 — What We Don\'t Do',
              'Section 09 — Contact / Engagement',
            ].map(s => (
              <div
                key={s}
                className="card"
                style={{ padding: '12px 16px', flex: '1 1 280px' }}
              >
                <div className="text-body" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
