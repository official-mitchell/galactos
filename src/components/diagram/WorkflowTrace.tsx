/* 2026-11-03: MAX-998 raised font sizes under 12px to 12px.
   2026-11-03: decomposed from the Figma Make landing export into the root app (MAX-993).
   2026-11-03: MAX-1001 uses the same trace id as the hero, in milliseconds. */
import React, { useEffect, useRef, useState } from 'react';
import { IllustrativeTag } from './IllustrativeTag';

interface TraceNode {
  id: string;
  label: string;
  meta: string;
  type: 'intent' | 'success';
  delay: number;
}

const NODES: TraceNode[] = [
  { id: 'n0', label: 'Trigger received', meta: 'T+0ms', type: 'intent', delay: 300 },
  { id: 'n1', label: 'API response: 200', meta: 'T+142ms', type: 'success', delay: 700 },
  { id: 'n2', label: 'Record updated', meta: 'T+388ms', type: 'success', delay: 1100 },
];

interface AnimatedNodeProps {
  type: 'intent' | 'success';
  resolved: boolean;
  size?: number;
}

function AnimatedNode({ type, resolved, size = 28 }: AnimatedNodeProps) {
  const fillColor = type === 'intent' ? 'var(--text-primary)' : 'var(--accent-success)';

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        flexShrink: 0,
        position: 'relative',
        transition: 'background-color 350ms ease, border-color 300ms ease',
        backgroundColor: resolved ? fillColor : 'transparent',
        border: `1.5px solid ${resolved ? fillColor : 'var(--text-primary)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {type === 'success' && resolved && (
        <svg
          width={size * 0.5}
          height={size * 0.5}
          viewBox="0 0 12 12"
          fill="none"
          style={{ transition: 'opacity 250ms ease 150ms', opacity: resolved ? 1 : 0 }}
        >
          <polyline
            points="2,6 5,9 10,3"
            stroke="#fff"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}

interface WorkflowTraceProps {
  orientation?: 'horizontal' | 'vertical';
}

export function WorkflowTrace({ orientation = 'horizontal' }: WorkflowTraceProps) {
  const [resolved, setResolved] = useState<boolean[]>([false, false, false]);
  const prefersReduced = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    if (prefersReduced.current) {
      setResolved([true, true, true]);
      return;
    }
    const timers = NODES.map((node, i) =>
      setTimeout(() => {
        setResolved(prev => prev.map((v, j) => (j === i ? true : v)));
      }, node.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  if (orientation === 'vertical') {
    return <VerticalTrace resolved={resolved} />;
  }

  return <HorizontalTrace resolved={resolved} />;
}

function HorizontalTrace({ resolved }: { resolved: boolean[] }) {
  const NODE_SIZE = 28;
  const ARROW_W = 80;
  const NODE_GAP = 32;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: 320,
        overflow: 'visible',
      }}
    >
      {/* Architectural curve motif */}
      <svg
        style={{
          position: 'absolute',
          right: -60,
          top: -40,
          opacity: 0.055,
          pointerEvents: 'none',
        }}
        width="520"
        height="480"
        viewBox="0 0 520 480"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M520 80 Q 360 80 280 200 Q 200 320 80 360 Q 0 400 -40 460"
          stroke="var(--text-primary)"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M520 140 Q 340 140 260 260 Q 180 380 60 420"
          stroke="var(--text-primary)"
          strokeWidth="0.75"
          fill="none"
        />
        <path
          d="M520 200 Q 400 180 340 280 Q 280 380 200 420 Q 140 450 80 460"
          stroke="var(--text-primary)"
          strokeWidth="0.5"
          fill="none"
        />
        {/* Light form — elliptical arc suggesting a lens or aperture */}
        <ellipse cx="460" cy="120" rx="80" ry="140" stroke="var(--text-primary)" strokeWidth="0.5" fill="none" transform="rotate(-20, 460, 120)" />
        <ellipse cx="460" cy="120" rx="50" ry="90" stroke="var(--text-primary)" strokeWidth="0.4" fill="none" transform="rotate(-20, 460, 120)" />
      </svg>

      {/* Fine grid texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(var(--border-default) 1px, transparent 1px), linear-gradient(90deg, var(--border-default) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          opacity: 0.1,
          pointerEvents: 'none',
        }}
      />

      {/* Trace label */}
      <div
        style={{
          position: 'absolute',
          top: 32,
          left: 0,
          fontFamily: 'var(--font-body)',
          fontWeight: 500,
          fontSize: 12,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
        }}
      >
        <IllustrativeTag /> Workflow trace
      </div>

      {/* Trace row */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          left: 0,
          right: -80,
          display: 'flex',
          alignItems: 'center',
          gap: 0,
        }}
      >
        {NODES.map((node, i) => (
          <React.Fragment key={node.id}>
            {/* Node with label */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                flexShrink: 0,
              }}
            >
              <AnimatedNode type={node.type} resolved={resolved[i]} size={NODE_SIZE} />
              <div style={{ textAlign: 'center', maxWidth: 90 }}>
                <div
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 500,
                    fontSize: 12,
                    color: 'var(--text-primary)',
                    lineHeight: 1.3,
                    transition: 'opacity 300ms ease',
                    opacity: resolved[i] ? 1 : 0.35,
                  }}
                >
                  {node.label}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 400,
                    fontSize: 12,
                    color: 'var(--text-muted)',
                    letterSpacing: '0.05em',
                    marginTop: 2,
                    transition: 'opacity 300ms ease',
                    opacity: resolved[i] ? 1 : 0,
                  }}
                >
                  {node.meta}
                </div>
              </div>
            </div>

            {/* Arrow */}
            {i < NODES.length - 1 && (
              <TraceArrow
                length={ARROW_W}
                visible={resolved[i]}
                style={{ flexShrink: 0, margin: `0 ${NODE_GAP * 0.5}px`, marginBottom: 34 }}
              />
            )}

            {/* Trailing arrow — bleeds right */}
            {i === NODES.length - 1 && (
              <TraceArrow
                length={120}
                visible={resolved[i]}
                trailing
                style={{ flexShrink: 0, marginLeft: 32, marginBottom: 34 }}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Vertical continuation arrow (bleeds down into Section 2) */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: -60,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <svg
          width="28"
          height="100"
          viewBox="0 0 28 100"
          fill="none"
          style={{
            opacity: resolved[2] ? 0.35 : 0,
            transition: 'opacity 400ms ease 300ms',
          }}
          aria-hidden="true"
        >
          <line x1="14" y1="0" x2="14" y2="85" stroke="var(--text-primary)" strokeWidth="1.25" strokeDasharray="4 3" />
          <polyline points="10,80 14,92 18,80" stroke="var(--text-primary)" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            fontSize: 12,
            color: 'var(--text-muted)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginTop: 4,
            opacity: resolved[2] ? 1 : 0,
            transition: 'opacity 400ms ease 500ms',
          }}
        >
          Continues ↓
        </div>
      </div>

      {/* Secondary trace row — a faint parallel trace suggesting scale */}
      <div
        style={{
          position: 'absolute',
          top: 200,
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          opacity: 0.18,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        {[0, 1, 2, 3].map(i => (
          <React.Fragment key={i}>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                backgroundColor: i === 0 ? 'var(--text-primary)' : 'var(--accent-success)',
                flexShrink: 0,
              }}
            />
            {i < 3 && (
              <div
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: 'var(--text-primary)',
                }}
              />
            )}
          </React.Fragment>
        ))}
        <div style={{ flex: 2, height: 1, backgroundColor: 'var(--text-primary)' }} />
      </div>
    </div>
  );
}

function VerticalTrace({ resolved }: { resolved: boolean[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0, paddingTop: 48 }}>
      {NODES.map((node, i) => (
        <React.Fragment key={node.id}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <AnimatedNode type={node.type} resolved={resolved[i]} size={22} />
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 500,
                  fontSize: 13,
                  color: 'var(--text-primary)',
                  transition: 'opacity 300ms ease',
                  opacity: resolved[i] ? 1 : 0.35,
                }}
              >
                {node.label}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  color: 'var(--text-muted)',
                  letterSpacing: '0.04em',
                  transition: 'opacity 300ms ease',
                  opacity: resolved[i] ? 1 : 0,
                }}
              >
                {node.meta}
              </div>
            </div>
          </div>
          {i < NODES.length - 1 && (
            <div style={{ marginLeft: 10, width: 2, height: 32, backgroundColor: 'var(--border-default)' }} />
          )}
          {i === NODES.length - 1 && (
            <div
              style={{
                marginLeft: 10,
                width: 1.5,
                height: 48,
                backgroundColor: 'var(--text-primary)',
                opacity: resolved[2] ? 0.25 : 0,
                transition: 'opacity 400ms ease 300ms',
              }}
            />
          )}
        </React.Fragment>
      ))}
      <div
        style={{
          marginLeft: 10,
          fontFamily: 'var(--font-body)',
          fontWeight: 500,
          fontSize: 12,
          color: 'var(--text-muted)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          opacity: resolved[2] ? 1 : 0,
          transition: 'opacity 400ms ease 500ms',
        }}
      >
        Continues ↓
      </div>
    </div>
  );
}

function TraceArrow({
  length,
  visible,
  trailing = false,
  style = {},
}: {
  length: number;
  visible: boolean;
  trailing?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width={length}
      height={16}
      viewBox={`0 0 ${length} 16`}
      fill="none"
      style={{
        ...style,
        opacity: visible ? (trailing ? 0.3 : 1) : 0,
        transition: 'opacity 300ms ease',
      }}
      aria-hidden="true"
    >
      <line
        x1="0"
        y1="8"
        x2={trailing ? length : length - 6}
        y2="8"
        stroke="var(--text-primary)"
        strokeWidth="1.25"
        strokeDasharray={trailing ? '4 3' : undefined}
      />
      {!trailing && (
        <polyline
          points={`${length - 10},4 ${length - 2},8 ${length - 10},12`}
          stroke="var(--text-primary)"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      )}
    </svg>
  );
}
