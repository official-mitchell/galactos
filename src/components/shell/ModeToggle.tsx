/* 2026-11-03: decomposed from the Figma Make landing export into the root app (MAX-993).
   2026-11-04: MAX-1008 drops the title tooltip. The accessible name is the aria-label. */
import React from 'react';

interface ModeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export function ModeToggle({ isDark, onToggle }: ModeToggleProps) {
  return (
    <button
      className="mode-toggle"
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Half-filled circle icon */}
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.25" />
        <path
          d="M 8 1.5 A 6.5 6.5 0 0 1 8 14.5 Z"
          fill="currentColor"
        />
      </svg>
      <span className="text-label hidden sm:inline">
        {isDark ? 'Light' : 'Dark'}
      </span>
    </button>
  );
}
