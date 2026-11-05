/* 2026-11-04: MAX-1014 mounts scroll seams beside the spine.
   2026-11-04: MAX-1012 mounts the scroll spine on the landing page only.
   2026-11-03: MAX-998 raised font sizes under 12px to 12px.
    2026-11-03: MAX-994 gates the Preview bar and Style Guide behind import.meta.env.DEV.
   Production keeps the stored-theme / prefers-color-scheme class effect and always shows the landing page.
   2026-11-03: ported from the Figma Make scratch app. Sections imported by job name (MAX-993).
   2026-11-03: MAX-996 honors ?mode= and hides the preview bar when ?shot=1. setMode events stay in dev.
   2026-11-04: MAX-1006 marks main with data-anim so final and reduced captures share one settled state.
   2026-11-04: MAX-1013. Main is the skip-to-content target. */
import React, { useEffect, useState } from 'react';
import { SiteHeader } from './components/shell/SiteHeader';
import { Spine } from './components/shell/Spine';
import { Seams } from './components/shell/Seams';
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
import { MotionLab } from './motion/MotionLab';

type Page = 'landing' | 'styleguide';

function readQueryMode(): 'dark' | 'light' | null {
  try {
    const mode = new URLSearchParams(window.location.search).get('mode');
    if (mode === 'dark' || mode === 'light') return mode;
  } catch {}
  return null;
}

function getInitialDark(): boolean {
  const flagged = typeof window !== 'undefined' ? readQueryMode() : null;
  if (flagged) return flagged === 'dark';
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
  if (!import.meta.env.DEV) return 'landing';
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
  const [showLab, setShowLab] = useState(false);
  useEffect(() => {
    const on = new URLSearchParams(window.location.search).get('fixture') === 'motion';
    setShowLab(on);
  }, []);

  /* Apply dark class + persist */
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', isDark);
    try { localStorage.setItem('galactos-theme', isDark ? 'dark' : 'light'); } catch {}
  }, [isDark]);

  /* Sync hash (dev style guide only; production stays on the landing page) */
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    history.replaceState(null, '', page === 'styleguide' ? '#styleguide' : '#');
  }, [page]);

  /* Dev capture bridge can switch mode without remounting. */
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const onMode = (event: Event) => {
      const mode = (event as CustomEvent<string>).detail;
      if (mode === 'dark' || mode === 'light') setIsDark(mode === 'dark');
    };
    window.addEventListener('galactos:set-mode', onMode);
    return () => window.removeEventListener('galactos:set-mode', onMode);
  }, []);

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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--surface-base)' }}>

      {/* ── Main content ── */}
      {import.meta.env.DEV && page === 'styleguide' ? (
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
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginLeft: 4 }}>
              · Observatory Editorial — Design System
            </span>
          </div>
          <StyleGuide />
        </div>
      ) : (
        /* Landing page with real site header */
        <div className="page-frame">
          <Spine />
          <Seams />
          <SiteHeader isDark={isDark} onToggleMode={() => setIsDark(d => !d)} />
          <main id="content" data-anim="page">
            {showLab ? <MotionLab /> : null}
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
