/* 2026-11-03: MAX-1002. Faint grid, contour, crosshair, and arc motifs.
   Opacity comes from --motif-opacity (8%). Crosshairs are seeded, 10 marks, 10–14px. */

import contourA from "../../../public/motifs/contours-a.svg?raw";
import contourB from "../../../public/motifs/contours-b.svg?raw";
import contourC from "../../../public/motifs/contours-c.svg?raw";

export type MotifKind = "grid" | "contour" | "crosshair" | "arc";

const CONTOURS = { a: contourA, b: contourB, c: contourC } as const;

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CROSSHAIR_SEED = 1002;
const SIZES = [10, 12, 14] as const;

function crosshairs() {
  const rng = mulberry32(CROSSHAIR_SEED);
  const marks = [];
  for (let i = 0; i < 10; i += 1) {
    marks.push({
      x: 8 + rng() * 84,
      y: 8 + rng() * 84,
      size: SIZES[Math.floor(rng() * SIZES.length)],
    });
  }
  return marks;
}

const MARKS = crosshairs();

type MotifProps = {
  kind: MotifKind;
  variant?: keyof typeof CONTOURS;
  className?: string;
};

export function Motif({ kind, variant = "a", className }: MotifProps) {
  const cls = ["motif", className].filter(Boolean).join(" ");

  if (kind === "grid") {
    return <div className={`${cls} motif-grid`} aria-hidden="true" />;
  }

  if (kind === "contour") {
    return (
      <div
        className={`${cls} motif-contour`}
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: CONTOURS[variant] }}
      />
    );
  }

  if (kind === "crosshair") {
    return (
      <div className={`${cls} motif-crosshair`} aria-hidden="true">
        {MARKS.map((mark, i) => (
          <svg
            key={i}
            className="motif-crosshair-mark"
            width={mark.size}
            height={mark.size}
            viewBox={`0 0 ${mark.size} ${mark.size}`}
            fill="none"
            style={{ left: `${mark.x}%`, top: `${mark.y}%` }}
          >
            <path
              d={`M0 ${mark.size / 2} H${mark.size} M${mark.size / 2} 0 V${mark.size}`}
              stroke="currentColor"
              strokeWidth="0.75"
            />
          </svg>
        ))}
      </div>
    );
  }

  return (
    <svg className={`${cls} motif-arc`} viewBox="0 0 200 120" fill="none" aria-hidden="true">
      <path d="M8 100 A 90 90 0 0 1 192 100" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3" />
      <path d="M28 108 A 70 70 0 0 1 172 108" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2 3" />
    </svg>
  );
}
