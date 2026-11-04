/* 2026-11-03: decomposed from the Figma Make landing export into the root app (MAX-993).
   2026-11-03: MAX-998 raised font sizes under 12px to 12px.
   2026-11-03: MAX-999 layout fixture and MAX-1000 diagram kit samples. */
import React from 'react';
import {
  NodeIntent, NodeSuccess, NodeExpected, NodeEvidence, NodeAnomaly, NodeMissing,
  FlowArrow, DivergencePath
} from './diagram/DiagramNodes';
import { Annotation } from './diagram/Annotation';
import { Bracket } from './diagram/Bracket';
import { Connector } from './diagram/Connector';
import { DiagramFrame } from './diagram/DiagramFrame';
import { EvidenceRail } from './diagram/EvidenceRail';
import { IllustrativeTag } from './diagram/IllustrativeTag';
import { Node, type NodeKind, type NodeState } from './diagram/Node';
import { StateBar } from './diagram/StateBar';
import { StatusPill, type StatusPillState } from './diagram/StatusPill';
import { TraceStep } from './diagram/TraceStep';
import { LayoutFixture } from './layout/LayoutFixture';
import { caseFile } from '../content/caseFile';
import { evidenceCitations } from '../content/evidence';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 64 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <span className="text-label" style={{ color: 'var(--text-muted)' }}>{title}</span>
        <div className="divider" style={{ flex: 1 }} />
      </div>
      {children}
    </section>
  );
}

function Swatch({ hex, name, token, dark }: { hex: string; name: string; token: string; dark?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div
        style={{
          width: 80,
          height: 56,
          borderRadius: 4,
          backgroundColor: hex,
          border: '1px solid var(--border-default)',
        }}
      />
      <div>
        <div className="text-card-title" style={{ fontSize: 13, color: 'var(--text-primary)' }}>{name}</div>
        <div className="text-meta" style={{ fontSize: 12 }}>{hex}</div>
        <div className="text-meta" style={{ fontSize: 12, letterSpacing: '0.06em' }}>{token}</div>
      </div>
    </div>
  );
}

export function StyleGuide() {
  return (
    <div
      className="container-editorial"
      style={{ paddingTop: 64, paddingBottom: 96 }}
    >
      {/* Header */}
      <div style={{ marginBottom: 64 }}>
        <div className="text-label" style={{ color: 'var(--text-muted)', marginBottom: 12 }}>
          Design System
        </div>
        <h1 className="text-display-lg" style={{ color: 'var(--text-primary)', marginBottom: 16 }}>
          Galactos Observatory Editorial
        </h1>
        <p className="text-body" style={{ color: 'var(--text-secondary)', maxWidth: 520 }}>
          Tokens, components, diagram grammar, and rules for the Galactos marketing site.
          Every later section inherits from this foundation.
        </p>
        <div
          className="text-meta"
          style={{ marginTop: 16, fontFamily: 'var(--font-body)', letterSpacing: '0.06em' }}
        >
          Version 1.0.0
        </div>
      </div>

      <hr className="divider" style={{ marginBottom: 64 }} />

      {/* Colors */}
      <Section title="COLOR TOKENS">
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 40 }}>
          <Swatch hex="#F8F6F3" name="Paper" token="surface/base (light)" />
          <Swatch hex="#FFFFFF" name="White" token="surface/raised (light)" />
          <Swatch hex="#0F1E2E" name="Deep Space" token="surface/emphasis" />
          <Swatch hex="#D6D1C9" name="Stone" token="border/default" />
          <Swatch hex="#374151" name="Graphite" token="text/secondary" />
        </div>
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 40 }}>
          <Swatch hex="#3882F6" name="Cobalt" token="accent/info" />
          <Swatch hex="#F97316" name="Signal Orange" token="accent/divergence" />
          <Swatch hex="#22C55E" name="Success Green" token="accent/success" />
        </div>
        <div style={{ marginBottom: 32 }}>
          <div className="text-label" style={{ color: 'var(--text-muted)', marginBottom: 12 }}>DARK MODE</div>
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            <Swatch hex="#0A1520" name="Abyss" token="surface/base (dark)" />
            <Swatch hex="#0F1E2E" name="Deep Space" token="surface/raised (dark)" />
            <Swatch hex="#162A3F" name="Midnight" token="surface/emphasis (dark)" />
            <Swatch hex="#243649" name="—" token="border/default (dark)" />
            <Swatch hex="#35495E" name="—" token="border/strong (dark)" />
          </div>
        </div>
        <div
          className="card"
          style={{ padding: 20, maxWidth: 560 }}
        >
          <div className="text-card-title" style={{ marginBottom: 8, color: 'var(--text-primary)' }}>Semantic rules</div>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              'Success Green = local success states only',
              'Signal Orange = divergence, anomaly, broken handoff only',
              'Never use red',
              'Orange/green are graphic colors — never set body text in them on Paper',
              'Pair with icon or shape; keep label in Deep Space or Graphite',
            ].map(rule => (
              <li key={rule} className="text-body" style={{ fontSize: 14, color: 'var(--text-secondary)', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--accent-info)', fontWeight: 600, flexShrink: 0 }}>—</span>
                {rule}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Typography */}
      <Section title="TYPOGRAPHY">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div>
            <div className="text-label" style={{ color: 'var(--text-muted)', marginBottom: 8 }}>DISPLAY XL · Fraunces Bold 700 · 72px</div>
            <div className="text-display-xl" style={{ color: 'var(--text-primary)' }}>When done isn't done.</div>
          </div>
          <div>
            <div className="text-label" style={{ color: 'var(--text-muted)', marginBottom: 8 }}>DISPLAY LG · Fraunces Bold 700 · 48px</div>
            <div className="text-display-lg" style={{ color: 'var(--text-primary)' }}>A new standard for reliability.</div>
          </div>
          <div>
            <div className="text-label" style={{ color: 'var(--text-muted)', marginBottom: 8 }}>DISPLAY MD · Fraunces Bold 700 · 32px</div>
            <div className="text-display-md" style={{ color: 'var(--text-primary)' }}>The divergence gap grows silently.</div>
          </div>
          <div>
            <div className="text-label" style={{ color: 'var(--text-muted)', marginBottom: 8 }}>SECTION TITLE · Fraunces SemiBold 600 · 24px</div>
            <div className="text-section-title" style={{ color: 'var(--text-primary)' }}>Observe, measure, verify.</div>
          </div>
          <hr className="divider" />
          <div>
            <div className="text-label" style={{ color: 'var(--text-muted)', marginBottom: 8 }}>BODY · Inter Regular 400 · 16px / 1.55</div>
            <p className="text-body" style={{ color: 'var(--text-secondary)', maxWidth: 560 }}>
              AI workflows can report completion while the underlying business outcome remains unresolved.
              The gap between a model's confidence signal and actual state is where reliability failures accumulate.
            </p>
          </div>
          <div>
            <div className="text-label" style={{ color: 'var(--text-muted)', marginBottom: 8 }}>CARD TITLE · Inter SemiBold 600 · 16px</div>
            <div className="text-card-title" style={{ color: 'var(--text-primary)' }}>Verification Layer Architecture</div>
          </div>
          <div>
            <div className="text-label" style={{ color: 'var(--text-muted)', marginBottom: 8 }}>LABEL · Inter Medium 500 · 12px / 0.08em</div>
            <div className="text-label" style={{ color: 'var(--text-secondary)' }}>SYSTEM STATE · OBSERVED · DIVERGENCE DETECTED</div>
          </div>
          <div>
            <div className="text-label" style={{ color: 'var(--text-muted)', marginBottom: 8 }}>METADATA / TRACE ID · Inter Regular 400 · 13px</div>
            <div className="text-meta">AGENT: workflow-router-v3 · STATUS: unresolved</div>
          </div>
        </div>
      </Section>

      {/* Spacing & Shape */}
      <Section title="SPACING, RADIUS & SHADOW">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div>
            <div className="text-label" style={{ color: 'var(--text-muted)', marginBottom: 16 }}>SPACING SCALE</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
              {[4, 8, 16, 24, 32, 48].map(n => (
                <div key={n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: n, height: n, backgroundColor: 'var(--accent-info)', opacity: 0.4, borderRadius: 2 }} />
                  <div className="text-meta" style={{ fontSize: 12 }}>{n}px</div>
                </div>
              ))}
              <div className="text-meta" style={{ marginLeft: 8 }}>+ 96–160px macro</div>
            </div>
          </div>
          <div>
            <div className="text-label" style={{ color: 'var(--text-muted)', marginBottom: 16 }}>RADIUS</div>
            <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
              {[{ r: 4, label: 'sm · 4px' }, { r: 8, label: 'md · 8px' }, { r: 12, label: 'lg · 12px' }].map(({ r, label }) => (
                <div key={r} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      width: 64,
                      height: 40,
                      borderRadius: r,
                      border: '1px solid var(--border-default)',
                      backgroundColor: 'var(--surface-raised)',
                    }}
                  />
                  <div className="text-meta" style={{ fontSize: 12 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-label" style={{ color: 'var(--text-muted)', marginBottom: 16 }}>SHADOW (light mode only)</div>
            <div style={{ display: 'flex', gap: 32 }}>
              {[
                { shadow: '0 1px 2px rgba(15,30,46,0.06)', label: 'sm' },
                { shadow: '0 8px 24px rgba(15,30,46,0.08)', label: 'md' },
              ].map(({ shadow, label }) => (
                <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      width: 80,
                      height: 48,
                      borderRadius: 8,
                      backgroundColor: 'var(--surface-raised)',
                      boxShadow: shadow,
                      border: '1px solid var(--border-default)',
                    }}
                  />
                  <div className="text-meta" style={{ fontSize: 12 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Diagram Grammar */}
      <Section title="DIAGRAM GRAMMAR">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Node inventory */}
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            {[
              { Node: NodeIntent, label: 'Intent', description: 'Filled Deep Space / Paper (dark)' },
              { Node: NodeSuccess, label: 'Success', description: 'Success Green with check' },
              { Node: NodeExpected, label: 'Expected state', description: 'Deep Space / Stone outline' },
              { Node: NodeEvidence, label: 'Evidence', description: 'Cobalt filled' },
              { Node: NodeAnomaly, label: 'Anomaly', description: 'Signal Orange with exclamation' },
              { Node: NodeMissing, label: 'Missing handoff', description: 'Dashed border' },
            ].map(({ Node, label, description }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <Node size={28} />
                <div style={{ textAlign: 'center' }}>
                  <div className="text-card-title" style={{ fontSize: 12, color: 'var(--text-primary)' }}>{label}</div>
                  <div className="text-meta" style={{ fontSize: 12 }}>{description}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Arrows */}
          <div style={{ display: 'flex', gap: 48, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <FlowArrow length={64} variant="solid" />
              <div className="text-meta" style={{ fontSize: 12 }}>Intended flow</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <FlowArrow length={64} variant="dashed" />
              <div className="text-meta" style={{ fontSize: 12 }}>Missing handoff</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <DivergencePath length={80} />
              <div className="text-meta" style={{ fontSize: 12 }}>Divergence path</div>
            </div>
          </div>

          {/* Example diagram */}
          <div className="card" style={{ padding: 32 }}>
            <div className="text-label" style={{ color: 'var(--text-muted)', marginBottom: 24 }}>EXAMPLE FLOW — REPORT STATUS vs ACTUAL STATE</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <NodeIntent size={24} />
              <div className="text-meta" style={{ fontSize: 12 }}>Workflow starts</div>
              <FlowArrow length={48} />
              <NodeSuccess size={24} />
              <div className="text-meta" style={{ fontSize: 12 }}>Model reports "done"</div>
              <DivergencePath length={64} />
              <NodeAnomaly size={24} />
              <div className="text-meta" style={{ fontSize: 12, color: 'var(--accent-divergence)' }}>Outcome unresolved</div>
              <FlowArrow length={48} variant="dashed" />
              <NodeMissing size={24} />
              <div className="text-meta" style={{ fontSize: 12 }}>Missing verification</div>
            </div>
            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <NodeEvidence size={16} />
              <div className="text-meta" style={{ fontSize: 12 }}>External evidence source (Cobalt)</div>
            </div>
          </div>
        </div>
      </Section>

      {/* Buttons */}
      <Section title="BUTTONS">
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
            <button className="btn-primary">Primary action</button>
            <div className="text-meta" style={{ fontSize: 12 }}>Primary — Deep Space fill, Paper text</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
            <button className="btn-secondary">Secondary action</button>
            <div className="text-meta" style={{ fontSize: 12 }}>Secondary — 1px outline</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
            <button className="btn-tertiary">Learn more →</button>
            <div className="text-meta" style={{ fontSize: 12 }}>Tertiary — underline draws on hover</div>
          </div>
        </div>
      </Section>

      {/* Cards */}
      <Section title="CARDS & SURFACES">
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div className="card" style={{ padding: 24, width: 240 }}>
            <div className="text-label" style={{ color: 'var(--text-muted)', marginBottom: 8 }}>CARD · surface/raised</div>
            <div className="text-card-title" style={{ color: 'var(--text-primary)', marginBottom: 6 }}>Verification specimen</div>
            <div className="text-body" style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              Paper surface, 1px Stone border, sm shadow in light mode.
            </div>
          </div>
          <div
            className="surface-emphasis-band"
            style={{ padding: 24, width: 240, borderRadius: 8 }}
          >
            <div className="text-label" style={{ color: 'rgba(248,246,243,0.5)', marginBottom: 8 }}>EMPHASIS BAND</div>
            <div className="text-card-title" style={{ color: '#F8F6F3', marginBottom: 6 }}>Sections 7 & 11</div>
            <div className="text-body" style={{ fontSize: 14, color: 'rgba(214,209,201,0.85)' }}>
              Deep Space fill, 1px strong border. Distinct raised plane in dark mode.
            </div>
          </div>
        </div>
      </Section>

      {/* Background motifs */}
      <Section title="BACKGROUND MOTIFS">
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {[
            { label: 'Fine grid', style: { backgroundImage: 'linear-gradient(var(--border-default) 1px, transparent 1px), linear-gradient(90deg, var(--border-default) 1px, transparent 1px)', backgroundSize: '32px 32px' } },
            { label: 'Topographic contour', style: { backgroundImage: 'radial-gradient(ellipse at 50% 50%, transparent 30%, var(--border-default) 31%, var(--border-default) 32%, transparent 33%, transparent 60%, var(--border-default) 61%, var(--border-default) 62%, transparent 63%)', backgroundSize: '64px 64px' } },
            { label: 'Radial construction', style: { backgroundImage: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, var(--border-default) 1deg, transparent 2deg, transparent 30deg, var(--border-default) 31deg, transparent 32deg)', backgroundSize: '64px 64px' } },
          ].map(({ label, style }) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div
                style={{
                  width: 160,
                  height: 96,
                  borderRadius: 8,
                  border: '1px solid var(--border-default)',
                  position: 'relative',
                  overflow: 'hidden',
                  backgroundColor: 'var(--surface-base)',
                }}
              >
                <div style={{ position: 'absolute', inset: 0, opacity: 0.18, ...style }} />
              </div>
              <div className="text-meta" style={{ fontSize: 12 }}>{label}</div>
            </div>
          ))}
        </div>
        <div className="card" style={{ padding: 16, marginTop: 16, maxWidth: 480 }}>
          <p className="text-body" style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
            Motifs always run at very low contrast — opacity 0.06–0.18 on light, Paper lines at 6–10% opacity on dark.
            Never the focal point.
          </p>
        </div>
      </Section>

      {/* Avoid */}
      <Section title="AVOID LIST">
        <div className="surface-emphasis-band" style={{ padding: 32, borderRadius: 8 }}>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              'Glossy gradients or translucent floating cards',
              'Cartoon AI imagery — glowing robots, network globes',
              'Stock team photography',
              'Generic SaaS dashboard chrome',
              'Oversized pill buttons',
              'Fake product screenshots or invented metrics',
              'Testimonials, client logos, or company-scale claims',
              'Glow, neon, or bloom effects in dark mode',
              'Red (use Signal Orange for errors and divergence)',
              'Body-size orange or green text on Paper or dark surfaces',
              'Hard-coded hex values — always reference semantic tokens',
              'Graphite #374151 as text on dark surfaces (fails contrast)',
            ].map(item => (
              <li key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <NodeAnomaly size={16} />
                <span className="text-body" style={{ fontSize: 14, color: '#F8F6F3' }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Motion rules */}
      <Section title="MOTION RULES">
        <div className="card" style={{ padding: 24 }}>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { rule: 'Lines trace into existence on scroll', type: 'allowed' },
              { rule: 'Nodes resolve from outline to filled on scroll', type: 'allowed' },
              { rule: 'Orange divergence appears slightly after green nodes', type: 'allowed' },
              { rule: 'Dark mode switches with 200ms color crossfade only', type: 'allowed' },
              { rule: 'prefers-reduced-motion: show final static state immediately', type: 'allowed' },
              { rule: 'No bounce, no spring physics', type: 'forbidden' },
              { rule: 'No parallax spectacle', type: 'forbidden' },
              { rule: 'No looping animation', type: 'forbidden' },
              { rule: 'No sliding or sweeping mode transitions', type: 'forbidden' },
            ].map(({ rule, type }) => (
              <li key={rule} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                {type === 'allowed'
                  ? <NodeSuccess size={18} />
                  : <NodeAnomaly size={18} />
                }
                <span className="text-body" style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Layout grid */}
      <Section title="LAYOUT SYSTEM">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { label: 'Desktop (1440px)', detail: '12 columns · 1200px max content · 24px gutters' },
            { label: 'Tablet (768px)', detail: '8 columns · fluid · 24px gutters' },
            { label: 'Mobile (390px)', detail: '4 columns · fluid · 16px gutters' },
          ].map(({ label, detail }) => (
            <div key={label} className="card" style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
              <div className="text-card-title" style={{ color: 'var(--text-primary)' }}>{label}</div>
              <div className="text-meta">{detail}</div>
            </div>
          ))}
          <div className="card" style={{ padding: 16 }}>
            <div className="text-meta" style={{ marginBottom: 4 }}>ACCESSIBILITY</div>
            <p className="text-body" style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0 }}>
              44px minimum touch targets · 2px Cobalt (#6FA6F8 dark) focus outline with 2px offset · 4.5:1 body text AA · 3:1 graphics
            </p>
          </div>
        </div>
      </Section>

      <Section title="DIAGRAM KIT">
        <IllustrativeTag />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 16 }}>
          {(['intent', 'success', 'expected', 'evidence', 'anomaly', 'missing', 'pending'] as NodeKind[]).flatMap((kind) =>
            (['outline', 'resolved'] as NodeState[])
              .filter((state) => kind !== 'pending' || state === 'outline')
              .map((state) => (
                <div key={`${kind}-${state}`} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Node kind={kind} state={state} size="md" />
                  <span className="text-meta">{kind} · {state}</span>
                </div>
              )),
          )}
        </div>
        <div style={{ marginTop: 24 }}>
          <Connector kind="solid" x1={4} y1={12} x2={80} y2={12} />
          <Connector kind="dashed" x1={4} y1={12} x2={80} y2={12} />
          <Connector kind="divergence" x1={4} y1={12} x2={80} y2={12} />
          <Connector kind="elbow" x1={4} y1={8} x2={48} y2={28} />
        </div>
        <TraceStep system="PAYMENT API" action="Refund action accepted." detail="Local success." time="T+388ms" status="ok" />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
          {(['completed', 'ok', 'closed', 'not-completed', 'divergence'] as StatusPillState[]).map((state) => (
            <StatusPill key={state} state={state} />
          ))}
        </div>
        <EvidenceRail
          items={[
            { label: 'CASE-ID', value: caseFile.trace.caseId },
            { label: 'STARTED', value: caseFile.trace.started },
            { label: 'OBSERVER', value: caseFile.trace.observer },
          ]}
        />
        {evidenceCitations.map((cite) => (
          <p key={cite.id} className="text-meta">{cite.label}: {cite.note}</p>
        ))}
        <StateBar />
        <Bracket label="What the workflow believes happened" side="bottom" />
        <Annotation tone="divergence">Authoritative system still shows the renewal.</Annotation>
        <DiagramFrame title="Sample trace" desc="Illustrative nodes." sequence={['Intent', 'Success']} orientation="horizontal">
          <svg className="diagram-frame__svg" width="48" height="16" aria-hidden="true">
            <circle cx="8" cy="8" r="4" fill="var(--node-intent)" />
          </svg>
        </DiagramFrame>
      </Section>

      <LayoutFixture />
    </div>
  );
}
