/* 2026-11-03: ported from the Figma Make scratch app. Sections imported by job name (MAX-993). */
import React, { useEffect, useState } from 'react';
import { SiteHeader } from './components/shell/SiteHeader';
import { Hero } from './components/sections/Hero';
import { FailureState } from './components/sections/FailureState';
import { Mechanism } from './components/sections/Mechanism';
import { NewStandard } from './components/sections/NewStandard';
import { CrossDomain } from './components/sections/CrossDomain';
import { Recognition } from './components/sections/Recognition';
import { Intervention } from './components/sections/Intervention';
import { Outputs } from './components/sections/Outputs';
import { Method } from './components/sections/Method';
import { Credibility } from './components/sections/Credibility';
import { FinalCta } from './components/sections/FinalCta';
import { SiteFooter } from './components/shell/SiteFooter';
import { StyleGuide } from './components/StyleGuide';

type Page = 'landing' | 'styleguide';

function getInitialDark(): boolean {
  try {
    const stored = localStorage.getItem('galactos-theme');
    if (stored === 'dark') return true;
    if (stored === 'light') return false;
  } catch {}
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
}

function getInitialPage(): Page {
  try {
    if (window.location.hash === '#styleguide') return 'styleguide';
  } catch {}
  return 'landing';
}

export default function App() {
  const [isDark, setIsDark] = useState<boolean>(() =>
    typeof window !== 'undefined' ? getInitialDark() : false
  );
  const [page, setPage] = useState<Page>(() =>
    typeof window !== 'undefined' ? getInitialPage() : 'landing'
  );

  /* Apply dark class + persist */
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', isDark);
    try { localStorage.setItem('galactos-theme', isDark ? 'dark' : 'light'); } catch {}
  }, [isDark]);

  /* Sync hash */
  useEffect(() => {
    history.replaceState(null, '', page === 'styleguide' ? '#styleguide' : '#');
  }, [page]);

  /* System preference */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      try {
        if (!localStorage.getItem('galactos-theme')) setIsDark(e.matches);
      } catch { setIsDark(e.matches); }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  function switchPage(p: Page) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--surface-base)' }}>

      {/* ── Dev utility bar (does not appear in production) ── */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 300,
          backgroundColor: 'var(--surface-emphasis)',
          borderBottom: '1px solid var(--border-strong)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          height: 36,
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: 9,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(248,246,243,0.4)',
            }}
          >
            Preview
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Page toggle */}
          {(['landing', 'styleguide'] as Page[]).map(p => (
            <button
              key={p}
              onClick={() => switchPage(p)}
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: 10,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '4px 12px',
                border: '1px solid',
                borderColor: page === p ? 'rgba(248,246,243,0.5)' : 'rgba(248,246,243,0.15)',
                borderRadius: 3,
                backgroundColor: page === p ? 'rgba(248,246,243,0.12)' : 'transparent',
                color: page === p ? 'rgba(248,246,243,0.9)' : 'rgba(248,246,243,0.4)',
                cursor: 'pointer',
                height: 24,
              }}
            >
              {p === 'landing' ? 'Landing' : 'Style Guide'}
            </button>
          ))}

          {/* Divider */}
          <div style={{ width: 1, height: 16, backgroundColor: 'rgba(248,246,243,0.15)' }} />

          {/* Dark mode toggle */}
          <button
            onClick={() => setIsDark(d => !d)}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: 10,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '4px 10px',
              border: '1px solid rgba(248,246,243,0.15)',
              borderRadius: 3,
              backgroundColor: 'transparent',
              color: 'rgba(248,246,243,0.5)',
              cursor: 'pointer',
              height: 24,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.25" />
              <path d="M 8 1.5 A 6.5 6.5 0 0 1 8 14.5 Z" fill="currentColor" />
            </svg>
            {isDark ? 'Light' : 'Dark'}
          </button>
        </div>
      </div>

      {/* ── Main content ── */}
      {page === 'styleguide' ? (
        /* Style guide gets its own minimal chrome */
        <div>
          <div
            style={{
              backgroundColor: 'var(--surface-base)',
              borderBottom: '1px solid var(--border-default)',
              padding: '0 24px',
              height: 48,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="10" stroke="var(--text-primary)" strokeWidth="1.2" />
              <circle cx="11" cy="11" r="2.5" fill="var(--accent-info)" />
            </svg>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
              Galactos
            </span>
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginLeft: 4 }}>
              · Observatory Editorial — Design System
            </span>
          </div>
          <StyleGuide />
        </div>
      ) : (
        /* Landing page with real site header */
        <div>
          <SiteHeader isDark={isDark} onToggleMode={() => setIsDark(d => !d)} />
          <main>
            <Hero />
            <FailureState />
            <Mechanism />
            <NewStandard />
            <CrossDomain />
            <Recognition />
            <Intervention />
            <Outputs />
            <Method />
            <Credibility />
            <FinalCta />
          </main>
          <SiteFooter />
        </div>
      )}
    </div>
  );
}
