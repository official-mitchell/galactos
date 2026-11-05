/* 2026-11-03: decomposed from the Figma Make landing export into the root app (MAX-993).
   2026-11-04: MAX-1008 drops the title tooltip. The accessible name is the aria-label.
   2026-11-04: One borderless icon. Sun in light mode, moon in dark mode. */
import React from 'react';

interface ModeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export function ModeToggle({ isDark, onToggle }: ModeToggleProps) {
  return (
    <button
      type="button"
      className="mode-toggle"
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M10.6 2.2a5.6 5.6 0 1 0 3.2 9.6 4.6 4.6 0 0 1-6.4-6.4 5.6 5.6 0 0 0 3.2-3.2Z"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="2.4" fill="currentColor" />
          <path
            d="M8 1.4v1.6M8 13v1.6M1.4 8h1.6M13 8h1.6M3.2 3.2l1.1 1.1M11.7 11.7l1.1 1.1M3.2 12.8l1.1-1.1M11.7 4.3l1.1-1.1"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
}
