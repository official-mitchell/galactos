/* 2026-11-03: decomposed from the Figma Make landing export into the root app (MAX-993). */
import React from 'react';

interface NodeProps {
  size?: number;
  className?: string;
}

/* Intent node — filled Deep Space / Paper in dark */
export function NodeIntent({ size = 20, className = '' }: NodeProps) {
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: 'var(--text-primary)',
        flexShrink: 0,
      }}
      aria-label="Intent node"
    />
  );
}

/* Success node — green circle with check */
export function NodeSuccess({ size = 20, className = '' }: NodeProps) {
  const iconSize = Math.round(size * 0.55);
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: 'var(--accent-success)',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      aria-label="Success node"
    >
      <svg width={iconSize} height={iconSize} viewBox="0 0 12 12" fill="none">
        <polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/* Expected state — thin outline circle */
export function NodeExpected({ size = 20, className = '' }: NodeProps) {
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: '1.5px solid var(--text-primary)',
        background: 'transparent',
        flexShrink: 0,
      }}
      aria-label="Expected state node"
    />
  );
}

/* Evidence node — Cobalt filled */
export function NodeEvidence({ size = 20, className = '' }: NodeProps) {
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: 'var(--accent-info)',
        flexShrink: 0,
      }}
      aria-label="Evidence node"
    />
  );
}

/* Anomaly node — orange with exclamation */
export function NodeAnomaly({ size = 20, className = '' }: NodeProps) {
  const iconSize = Math.round(size * 0.5);
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: 'var(--accent-divergence)',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      aria-label="Anomaly node"
    >
      <svg width={iconSize} height={iconSize} viewBox="0 0 10 14" fill="none">
        <rect x="4" y="0" width="2" height="8" rx="1" fill="#fff" />
        <rect x="4" y="11" width="2" height="2" rx="1" fill="#fff" />
      </svg>
    </div>
  );
}

/* Missing handoff — dashed outline */
export function NodeMissing({ size = 20, className = '' }: NodeProps) {
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: '1.5px dashed var(--border-default)',
        background: 'transparent',
        flexShrink: 0,
        opacity: 0.7,
      }}
      aria-label="Missing handoff node"
    />
  );
}

/* ── Flow arrows as SVG ── */
interface ArrowProps {
  length?: number;
  direction?: 'right' | 'down';
  variant?: 'solid' | 'dashed';
  color?: string;
  className?: string;
}

export function FlowArrow({
  length = 48,
  direction = 'right',
  variant = 'solid',
  color,
  className = '',
}: ArrowProps) {
  const arrowColor = color || 'var(--text-primary)';
  const dashArray = variant === 'dashed' ? '4 3' : undefined;

  if (direction === 'right') {
    return (
      <svg
        className={className}
        width={length}
        height={16}
        viewBox={`0 0 ${length} 16`}
        fill="none"
        aria-hidden="true"
      >
        <line
          x1="0"
          y1="8"
          x2={length - 6}
          y2="8"
          stroke={arrowColor}
          strokeWidth="1.5"
          strokeDasharray={dashArray}
        />
        <polyline
          points={`${length - 10},4 ${length - 2},8 ${length - 10},12`}
          stroke={arrowColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    );
  }

  return (
    <svg
      className={className}
      width={16}
      height={length}
      viewBox={`0 0 16 ${length}`}
      fill="none"
      aria-hidden="true"
    >
      <line
        x1="8"
        y1="0"
        x2="8"
        y2={length - 6}
        stroke={arrowColor}
        strokeWidth="1.5"
        strokeDasharray={dashArray}
      />
      <polyline
        points={`4,${length - 10} 8,${length - 2} 12,${length - 10}`}
        stroke={arrowColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/* ── Divergence path (orange dashed SVG line) ── */
export function DivergencePath({ length = 80, className = '' }: { length?: number; className?: string }) {
  return (
    <svg
      className={className}
      width={length}
      height={24}
      viewBox={`0 0 ${length} 24`}
      fill="none"
      aria-hidden="true"
    >
      <path
        d={`M 0 12 Q ${length / 3} 0 ${length / 2} 12 Q ${(2 * length) / 3} 24 ${length} 12`}
        stroke="var(--accent-divergence)"
        strokeWidth="1.5"
        strokeDasharray="5 3"
        fill="none"
      />
    </svg>
  );
}
