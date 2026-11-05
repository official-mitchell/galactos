/* 2026-11-03: MAX-998 raised font sizes under 12px to 12px.
    2026-11-03: decomposed from the Figma Make landing export into the root app (MAX-993).
    2026-11-04: MAX-1007 places MotionToggle in the desktop header and the mobile menu. */
import React, { useEffect, useRef, useState } from 'react';
import { MotionToggle } from '../../motion/MotionToggle';
import { ModeToggle } from './ModeToggle';

interface SiteHeaderProps {
  isDark: boolean;
  onToggleMode: () => void;
}

const NAV_LINKS = [
  { label: 'Diagnostic', href: '#section-diagnostic' },
  { label: 'Method', href: '#section-method' },
  { label: 'About', href: '#section-about' },
];

function scrollTo(id: string) {
  const el = document.querySelector(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

export function SiteHeader({ isDark, onToggleMode }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  function handleCTA(e: React.MouseEvent) {
    e.preventDefault();
    scrollTo('#section-cta');
    setMenuOpen(false);
  }

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 200,
        backgroundColor: 'var(--surface-base)',
        borderBottom: `1px solid ${scrolled ? 'var(--border-default)' : 'transparent'}`,
        transition: 'background-color 200ms ease, border-color 200ms ease',
      }}
    >
      <div
        className="container-editorial"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 64,
        }}
      >
        {/* Wordmark */}
        <a
          href="#"
          onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}
          aria-label="Galactos — home"
        >
          {/* Observatory mark */}
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="10" stroke="var(--text-primary)" strokeWidth="1.2" />
            <circle cx="11" cy="11" r="9.5" stroke="var(--text-primary)" strokeWidth="0.3" strokeDasharray="2 3" />
            <circle cx="11" cy="11" r="2.5" fill="var(--accent-info)" />
            <line x1="11" y1="1" x2="11" y2="5.5" stroke="var(--text-primary)" strokeWidth="1.2" />
            <line x1="11" y1="16.5" x2="11" y2="21" stroke="var(--text-primary)" strokeWidth="1.2" />
            <line x1="1" y1="11" x2="5.5" y2="11" stroke="var(--text-primary)" strokeWidth="1.2" />
            <line x1="16.5" y1="11" x2="21" y2="11" stroke="var(--text-primary)" strokeWidth="1.2" />
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 18,
                color: 'var(--text-primary)',
                letterSpacing: '-0.015em',
                lineHeight: 1,
              }}
            >
              Galactos
            </span>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: 12,
                color: 'var(--text-muted)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                lineHeight: 1.2,
                marginTop: 2,
              }}
            >
              AI Workflow Reliability
            </span>
          </div>
        </a>

        {/* Desktop nav */}
        <nav
          style={{ display: 'flex', alignItems: 'center', gap: 0 }}
          aria-label="Site navigation"
          className="desktop-nav"
        >
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={e => { e.preventDefault(); scrollTo(href); }}
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: 13,
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                padding: '6px 16px',
                letterSpacing: '0.01em',
                transition: 'color 150ms ease',
                minHeight: 44,
                display: 'inline-flex',
                alignItems: 'center',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              {label}
            </a>
          ))}

          <div style={{ width: 1, height: 20, backgroundColor: 'var(--border-default)', margin: '0 16px' }} />

          <ModeToggle isDark={isDark} onToggle={onToggleMode} />
          <MotionToggle />

          <div style={{ width: 12 }} />

          <a
            href="#section-cta"
            className="btn-secondary"
            onClick={handleCTA}
            style={{ fontSize: 13, padding: '10px 20px', whiteSpace: 'nowrap' }}
          >
            Walk me through the workflow
          </a>
        </nav>

        {/* Mobile controls */}
        <div
          className="mobile-nav"
          style={{ display: 'flex', alignItems: 'center', gap: 10 }}
        >
          <ModeToggle isDark={isDark} onToggle={onToggleMode} />
          <button
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(o => !o)}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-default)',
              borderRadius: 4,
              width: 44,
              height: 44,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 5,
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                display: 'block',
                width: 18,
                height: 1.5,
                backgroundColor: 'var(--text-primary)',
                transition: 'transform 200ms ease, opacity 200ms ease',
                transform: menuOpen ? 'translateY(3.5px) rotate(45deg)' : 'none',
              }}
            />
            <span
              style={{
                display: 'block',
                width: 18,
                height: 1.5,
                backgroundColor: 'var(--text-primary)',
                transition: 'opacity 200ms ease',
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                display: 'block',
                width: 18,
                height: 1.5,
                backgroundColor: 'var(--text-primary)',
                transition: 'transform 200ms ease, opacity 200ms ease',
                transform: menuOpen ? 'translateY(-3.5px) rotate(-45deg)' : 'none',
              }}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'var(--surface-base)',
            borderBottom: '1px solid var(--border-default)',
            padding: '8px 24px 24px',
            zIndex: 300,
          }}
        >
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={e => { e.preventDefault(); scrollTo(href); setMenuOpen(false); }}
              style={{
                display: 'block',
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: 15,
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                padding: '14px 0',
                borderBottom: '1px solid var(--border-default)',
                letterSpacing: '0.01em',
              }}
            >
              {label}
            </a>
          ))}
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <MotionToggle />
            <a
              href="#section-cta"
              className="btn-secondary"
              onClick={handleCTA}
              style={{ width: '100%', justifyContent: 'center', fontSize: 14 }}
            >
              Walk me through the workflow
            </a>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-nav { display: none !important; }
        }
        @media (max-width: 767px) {
          .desktop-nav { display: none !important; }
          .mobile-nav { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
