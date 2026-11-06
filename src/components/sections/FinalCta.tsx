/* 2026-11-06: MAX-1029 footer microline is CANONICAL_DEFINITION. Privacy and Terms link to real routes.
   2026-11-04: MAX-1014 S10→S11 band edge is 1px border-strong. No gradient.
   2026-11-04: MAX-1011 carries the CTA reader question and spine terminal seam from sections.ts.
   2026-11-03: MAX-998 raised font sizes under 12px to 12px.
    2026-11-03: decomposed from the Figma Make landing export into the root app (MAX-993). */
import React, { useState } from 'react';
import { CANONICAL_DEFINITION } from '../../content/copy';
import { storySectionProps } from '../../content/sections';

/* ── Always-dark tokens ── */
const P    = '#F8F6F3';
const P85  = 'rgba(248,246,243,0.85)';
const P55  = 'rgba(248,246,243,0.55)';
const P30  = 'rgba(248,246,243,0.30)';
const P18  = 'rgba(248,246,243,0.18)';
const P10  = 'rgba(248,246,243,0.10)';
const P06  = 'rgba(248,246,243,0.06)';
const DARK = '#0F1E2E';

/* ── Background texture SVG ── */
function BackgroundTexture() {
  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      viewBox="0 0 1200 520"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* Topographic contour lines */}
      {[
        'M 0,90  Q 180,82 360,95  Q 540,108 720,88  Q 900,72  1080,96  L 1200,92',
        'M 0,180 Q 200,172 420,188 Q 620,200 800,180 Q 980,162 1200,185',
        'M 0,270 Q 160,265 380,278 Q 560,290 780,272 Q 960,255 1200,274',
        'M 0,360 Q 220,352 440,368 Q 640,380 860,360 Q 1020,342 1200,365',
        'M 0,450 Q 180,442 380,458 Q 580,472 800,452 Q 980,436 1200,454',
      ].map((d, i) => (
        <path key={i} d={d} stroke={P} strokeWidth="0.5" fill="none" opacity="0.05" />
      ))}

      {/* Radial lines from lower-right origin */}
      {[-70,-50,-30,-10,10,30,50].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const len = 480;
        return (
          <line key={i}
            x1={1080} y1={480}
            x2={1080 + Math.cos(rad) * len}
            y2={480 + Math.sin(rad) * len}
            stroke={P} strokeWidth="0.45" opacity="0.04"
          />
        );
      })}

      {/* Trajectory line */}
      <path
        d="M 40,380 C 200,340 380,320 540,290 C 700,260 860,300 1060,260"
        stroke={P} strokeWidth="0.65" fill="none" opacity="0.08"
      />

      {/* Signal Orange evidence point along trajectory */}
      <circle cx="420" cy="306" r="3.5" fill="var(--accent-divergence)" opacity="0.72" />
      <circle cx="420" cy="306" r="7" stroke="var(--accent-divergence)" strokeWidth="0.7" fill="none" opacity="0.24" />
    </svg>
  );
}

/* ── Form field ── */
function Field({
  id, label, type = 'text', value, onChange, placeholder, multiline, rows = 3, error,
}: {
  id: string; label: string; type?: string;
  value: string; onChange: (v: string) => void;
  placeholder?: string; multiline?: boolean; rows?: number; error?: string;
}) {
  const inputStyle: React.CSSProperties = {
    display: 'block', width: '100%', boxSizing: 'border-box',
    fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: 13,
    color: P85, backgroundColor: P06,
    border: `1px solid ${error ? 'var(--accent-divergence)' : P18}`,
    borderRadius: 3, padding: '9px 12px',
    outline: 'none', resize: 'vertical' as const,
    lineHeight: 1.5,
    transition: 'border-color 140ms ease',
  };

  return (
    <div style={{ marginBottom: 14 }}>
      <label htmlFor={id} style={{
        display: 'block', fontFamily: 'var(--font-body)', fontWeight: 500,
        fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase',
        color: P55, marginBottom: 6,
      }}>
        {label}
      </label>
      {multiline ? (
        <textarea id={id} value={value} rows={rows}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ ...inputStyle }}
          className="s11-field"
        />
      ) : (
        <input id={id} type={type} value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={inputStyle}
          className="s11-field"
        />
      )}
      {error && (
        <div style={{ marginTop: 5, fontFamily: 'var(--font-body)', fontSize: 12,
          color: 'var(--accent-divergence)', letterSpacing: '0.03em' }}>
          {error}
        </div>
      )}
    </div>
  );
}

/* ── Four-word stack ── */
const WORDS = ['Observe', 'Verify', 'Clarify', 'Repair'];

function FourWordStack() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {WORDS.map((word, i) => (
        <div key={word} style={{ width: '100%', textAlign: 'center' }}>
          {i > 0 && <div style={{ height: 1, backgroundColor: P18, margin: '0 auto', maxWidth: 120 }} />}
          <div style={{
            padding: '22px 0',
            fontFamily: 'var(--font-display)', fontWeight: 600,
            fontSize: 'clamp(22px, 2.4vw, 32px)', letterSpacing: '-0.015em',
            color: P55,
          }}>
            {word}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Section 11 ── */
export function FinalCta() {
  const [formOpen, setFormOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [name,      setName]      = useState('');
  const [company,   setCompany]   = useState('');
  const [email,     setEmail]     = useState('');
  const [workflow,  setWorkflow]  = useState('');
  const [distrust,  setDistrust]  = useState('');
  const [emailErr,  setEmailErr]  = useState('');

  function validateEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailErr('Please enter a valid email address.');
      return;
    }
    setEmailErr('');
    setSubmitted(true);
  }

  return (
    <section
      id="section-cta"
      className="surface-emphasis-band"
      data-seam-band="s10-s11"
      {...storySectionProps('section-cta')}
      style={{
        backgroundColor: 'var(--surface-emphasis)',
        position: 'relative',
        paddingTop: 128,
        paddingBottom: 88,
        overflow: 'hidden',
      }}
    >
      <BackgroundTexture />

      <div className="container-editorial" style={{ position: 'relative', zIndex: 1 }}>
        <div className="s11-grid">

          {/* ── Left / Center-left ── */}
          <div className="s11-left">
            <h2 style={{
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: 'clamp(28px, 3.8vw, 48px)', lineHeight: 1.08,
              letterSpacing: '-0.025em', color: P, marginBottom: 22,
            }}>
              Have a workflow you don't completely trust?
            </h2>

            <p style={{
              fontFamily: 'var(--font-body)', fontWeight: 400,
              fontSize: 'clamp(15px, 1.4vw, 18px)', lineHeight: 1.6,
              color: P55, marginBottom: 32, maxWidth: 480,
            }}>
              Walk me through what it is supposed to do, where uncertainty
              appears, and what you can currently observe. We can determine
              whether a bounded reliability diagnostic makes sense.
            </p>

            {/* Primary CTA */}
            {!formOpen && (
              <button
                onClick={() => setFormOpen(true)}
                style={{
                  fontFamily: 'var(--font-body)', fontWeight: 600,
                  fontSize: 14, letterSpacing: '0.02em',
                  color: DARK, backgroundColor: P,
                  border: 'none', borderRadius: 3,
                  padding: '13px 24px', cursor: 'pointer',
                  transition: 'opacity 150ms ease, transform 150ms ease',
                  display: 'inline-block',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.88'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
              >
                Walk me through the workflow
              </button>
            )}

            {/* Small line beneath */}
            {!formOpen && (
              <div style={{
                marginTop: 14,
                fontFamily: 'var(--font-body)', fontWeight: 500,
                fontSize: 12, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: P30,
              }}>
                One workflow is enough.
              </div>
            )}

            {/* Inline form — expands on click */}
            <div style={{
              maxHeight: formOpen ? 640 : 0,
              overflow: 'hidden',
              transition: 'max-height 420ms cubic-bezier(0.4,0,0.2,1)',
            }}>
              <div style={{ paddingTop: 4 }}>
                {submitted ? (
                  /* Success state */
                  <div style={{
                    padding: '32px 0',
                    fontFamily: 'var(--font-display)', fontWeight: 600,
                    fontSize: 'clamp(18px, 2vw, 24px)', lineHeight: 1.3,
                    color: P, letterSpacing: '-0.01em',
                  }}>
                    Thank you. We'll read this before we speak.
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate>
                    <div className="s11-form-grid">
                      <Field id="f-name" label="Name" value={name} onChange={setName} />
                      <Field id="f-company" label="Company" value={company} onChange={setCompany} />
                    </div>
                    <Field
                      id="f-email" label="Email" type="email"
                      value={email} onChange={v => { setEmail(v); if (emailErr) setEmailErr(''); }}
                      error={emailErr}
                    />
                    <Field
                      id="f-workflow" label="Describe the workflow in a sentence or two"
                      value={workflow} onChange={setWorkflow}
                      multiline rows={3}
                    />
                    <Field
                      id="f-distrust" label="What makes you distrust it?"
                      value={distrust} onChange={setDistrust}
                      multiline rows={3}
                    />
                    {/* Form actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 4 }}>
                      <button
                        type="submit"
                        style={{
                          fontFamily: 'var(--font-body)', fontWeight: 600,
                          fontSize: 13, letterSpacing: '0.04em',
                          color: P, backgroundColor: 'transparent',
                          border: `1px solid ${P55}`, borderRadius: 3,
                          padding: '10px 22px', cursor: 'pointer',
                          transition: 'background-color 140ms ease',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = P10; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                      >
                        Send
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormOpen(false)}
                        style={{
                          fontFamily: 'var(--font-body)', fontWeight: 400,
                          fontSize: 12, letterSpacing: '0.06em',
                          color: P30, backgroundColor: 'transparent',
                          border: 'none', cursor: 'pointer', padding: 0,
                          textDecoration: 'underline',
                          textDecorationColor: P18,
                          textUnderlineOffset: 2,
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* ── Right: four-word stack ── */}
          <div className="s11-right">
            <FourWordStack />
          </div>

        </div>
      </div>

      <style>{`
        .s11-grid {
          display: grid;
          grid-template-columns: 60fr 40fr;
          gap: 0 64px;
          align-items: center;
        }
        .s11-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0 16px;
        }
        .s11-field:focus {
          border-color: ${P55} !important;
          background-color: ${P10} !important;
        }
        .s11-field::placeholder { color: ${P30}; }

        @media (max-width: 760px) {
          .s11-grid { grid-template-columns: 1fr; gap: 48px 0; }
          .s11-form-grid { grid-template-columns: 1fr; }
          .s11-right { order: 2; }
        }
      `}</style>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   Site Footer
───────────────────────────────────────────────────────────── */
export function SiteFooter() {
  return (
    <footer style={{ backgroundColor: DARK, paddingBottom: 0 }}>
      {/* Stone-tinted top rule */}
      <div style={{ height: 1, backgroundColor: P18 }} />

      <div className="container-editorial">
        {/* Main footer row */}
        <div className="footer-main">

          {/* Left: wordmark */}
          <div className="footer-wordmark">
            {/* Observatory mark */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <svg width="18" height="18" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="10" stroke={P} strokeWidth="1.1" opacity="0.7" />
                <line x1="11" y1="4" x2="11" y2="18" stroke={P} strokeWidth="0.7" opacity="0.4" />
                <line x1="4"  y1="11" x2="18" y2="11" stroke={P} strokeWidth="0.7" opacity="0.4" />
                <circle cx="11" cy="11" r="2.5" fill="var(--accent-info)" opacity="0.85" />
              </svg>
              <span style={{
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17,
                color: P, letterSpacing: '-0.015em',
              }}>
                Galactos
              </span>
            </div>
            <div style={{
              fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 12,
              letterSpacing: '0.14em', textTransform: 'uppercase', color: P30,
            }}>
              AI Workflow Reliability
            </div>
          </div>

          {/* Right: contact + links */}
          <div className="footer-links">
            <a href="mailto:hello@galactos.example" style={{
              display: 'block', fontFamily: 'var(--font-body)', fontWeight: 400,
              fontSize: 13, color: P55,
              textDecoration: 'none', marginBottom: 14,
              transition: 'color 140ms ease',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = P85; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = P55; }}
            >
              hello@galactos.example
            </a>
            <div style={{ display: 'flex', gap: 20 }}>
              {([['Privacy', '/privacy'], ['Terms', '/terms']] as const).map(([label, href]) => (
                <a key={label} href={href} style={{
                  fontFamily: 'var(--font-body)', fontWeight: 400,
                  fontSize: 12, letterSpacing: '0.06em', color: P30,
                  textDecoration: 'none', transition: 'color 140ms ease',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = P55; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = P30; }}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div style={{
          paddingTop: 20,
          paddingBottom: 32,
          borderTop: `1px solid ${P10}`,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}>
          <div style={{
            fontFamily: 'var(--font-body)', fontWeight: 400,
            fontSize: 12, color: P30, letterSpacing: '0.03em',
          }}>
            © {new Date().getFullYear()} Galactos. All rights reserved.
          </div>
          <div style={{
            fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: 12,
            color: P30, lineHeight: 1.5, maxWidth: 560, fontStyle: 'italic',
          }}>
            {CANONICAL_DEFINITION}
          </div>
        </div>
      </div>

      <style>{`
        .footer-main {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 40px 0 28px;
          gap: 40px;
        }
        .footer-links { text-align: right; }

        @media (max-width: 600px) {
          .footer-main { flex-direction: column; gap: 28px; }
          .footer-links { text-align: left; }
        }
      `}</style>
    </footer>
  );
}
