/* 2026-11-03: MAX-998 raised font sizes under 12px to 12px.
   2026-11-03: decomposed from the Figma Make landing export into the root app (MAX-993).
   2026-11-04: MAX-1007 places MotionToggle in the desktop header and the mobile menu.
   2026-11-04: MAX-1013. Anchors come from sections.ts. Scroll border, skip link,
   mobile focus trap, and nav_click. */
import React, { useEffect, useRef, useState } from 'react';
import { trackEvent } from '../../analytics/track';
import { sectionHref, scrollTo, type NavAnchorKey } from '../../content/sections';
import { MotionToggle } from '../../motion/MotionToggle';
import { ModeToggle } from './ModeToggle';

interface SiteHeaderProps {
  isDark: boolean;
  onToggleMode: () => void;
}

const NAV_LINKS: { label: string; key: NavAnchorKey }[] = [
  { label: 'Diagnostic', key: 'diagnostic' },
  { label: 'Method', key: 'method' },
  { label: 'About', key: 'about' },
];

function focusableIn(root: HTMLElement): HTMLElement[] {
  return Array.from(
    root.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
  ).filter((el) => el.getAttribute('aria-hidden') !== 'true');
}

export function SiteHeader({ isDark, onToggleMode }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const workflowHref = sectionHref('workflow');
  const heroHref = sectionHref('hero');

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const root = headerRef.current;
    if (!root) return;
    const previously = document.activeElement as HTMLElement | null;
    const menu = root.querySelector<HTMLElement>('#site-menu');
    const firstLink = menu?.querySelector<HTMLElement>('a[href]');
    firstLink?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        setMenuOpen(false);
        return;
      }
      if (event.key !== 'Tab' || !headerRef.current) return;
      const items = focusableIn(headerRef.current);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      previously?.focus();
    };
  }, [menuOpen]);

  function go(event: React.SyntheticEvent, href: string) {
    event.preventDefault();
    const id = href.slice(1);
    trackEvent({ name: 'nav_click', target: id });
    scrollTo(href);
    setMenuOpen(false);
  }

  function onAnchorKey(event: React.KeyboardEvent<HTMLAnchorElement>, href: string) {
    if (event.key === 'Enter') go(event, href);
  }

  function renderLink(label: string, key: NavAnchorKey, block: boolean) {
    const href = sectionHref(key);
    return (
      <a
        key={label}
        href={href}
        data-scroll-target={href.slice(1)}
        onClick={(event) => go(event, href)}
        onKeyDown={(event) => onAnchorKey(event, href)}
        style={{
          fontFamily: 'var(--font-body)',
          fontWeight: 500,
          fontSize: block ? 15 : 13,
          color: 'var(--text-secondary)',
          textDecoration: 'none',
          padding: block ? '0 0' : '6px 16px',
          letterSpacing: '0.01em',
          transition: 'color 150ms ease',
          minHeight: 44,
          display: block ? 'flex' : 'inline-flex',
          alignItems: 'center',
          borderBottom: block ? '1px solid var(--border-default)' : undefined,
        }}
        onMouseEnter={(event) => (event.currentTarget.style.color = 'var(--text-primary)')}
        onMouseLeave={(event) => (event.currentTarget.style.color = 'var(--text-secondary)')}
      >
        {label}
      </a>
    );
  }

  const cta = (fullWidth: boolean) => (
    <a
      href={workflowHref}
      data-scroll-target={workflowHref.slice(1)}
      className="btn-secondary"
      onClick={(event) => go(event, workflowHref)}
      onKeyDown={(event) => onAnchorKey(event, workflowHref)}
      style={{
        fontSize: fullWidth ? 14 : 13,
        padding: fullWidth ? '10px 16px' : '10px 20px',
        whiteSpace: 'nowrap',
        width: fullWidth ? '100%' : undefined,
        minHeight: 44,
        justifyContent: 'center',
      }}
    >
      Walk me through the workflow
    </a>
  );

  return (
    <header
      ref={headerRef}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 200,
        backgroundColor: 'var(--surface-base)',
        borderBottom: `1px solid ${scrolled ? 'var(--border-strong)' : 'transparent'}`,
        transition: 'background-color 200ms ease, border-color 200ms ease',
      }}
    >
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <div
        className="container-editorial"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 64,
          gap: 12,
        }}
      >
        <a
          href={heroHref}
          data-scroll-target={heroHref.slice(1)}
          onClick={(event) => go(event, heroHref)}
          onKeyDown={(event) => onAnchorKey(event, heroHref)}
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, minHeight: 44 }}
          aria-label="Galactos — home"
        >
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
                letterSpacing: '0.08em',
                lineHeight: 1.2,
                marginTop: 2,
              }}
            >
              AI WORKFLOW RELIABILITY
            </span>
          </div>
        </a>

        <nav
          style={{ display: 'flex', alignItems: 'center', gap: 0 }}
          aria-label="Site navigation"
          className="desktop-nav"
        >
          {NAV_LINKS.map(({ label, key }) => renderLink(label, key, false))}

          <div style={{ width: 1, height: 20, backgroundColor: 'var(--border-default)', margin: '0 16px' }} />

          <ModeToggle isDark={isDark} onToggle={onToggleMode} />
          <MotionToggle />

          <div style={{ width: 12 }} />

          {cta(false)}
        </nav>

        <div className="mobile-nav" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ModeToggle isDark={isDark} onToggle={onToggleMode} />
          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => setMenuOpen((open) => !open)}
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

      <div className="mobile-cta container-editorial" style={{ paddingBottom: 12 }}>
        {cta(true)}
      </div>

      {menuOpen && (
        <div
          id="site-menu"
          role="navigation"
          aria-label="Mobile"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'var(--surface-base)',
            borderBottom: '1px solid var(--border-strong)',
            padding: '8px 24px 24px',
            zIndex: 300,
          }}
        >
          {NAV_LINKS.map(({ label, key }) => renderLink(label, key, true))}
          <div style={{ marginTop: 20 }}>
            <MotionToggle />
          </div>
        </div>
      )}

      <style>{`
        .skip-link {
          position: absolute;
          left: 12px;
          top: 8px;
          z-index: 400;
          padding: 10px 14px;
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          background: var(--surface-base);
          color: var(--text-primary);
          border: 1px solid var(--border-strong);
          text-decoration: none;
          font-family: var(--font-body);
          font-size: 14px;
          transform: translateY(-140%);
        }
        .skip-link:focus {
          transform: none;
        }
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-nav, .mobile-cta { display: none !important; }
        }
        @media (max-width: 767px) {
          .desktop-nav { display: none !important; }
          .mobile-nav { display: flex !important; }
          .mobile-cta { display: block !important; }
        }
      `}</style>
    </header>
  );
}
