import { cn } from '@/lib/utils';

/**
 * Cheerful sprout mascot + surrounding leaves for the dashboard hero.
 * Stroke uses currentColor; filled leaves use CSS vars so they read
 * against the warm gradient background.
 */
export function HeroIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 200"
      aria-hidden
      className={cn('shrink-0', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* background trailing vine — top-left */}
      <g opacity="0.7" stroke="var(--leaf-ink)">
        <path d="M4 12 C 20 20 30 36 36 54" strokeWidth="1.3" />
        <path
          d="M30 28 c 4 -3 4 -8 1 -12 c -4 1 -5 6 -1 12 Z"
          fill="var(--leaf-fill)"
          strokeWidth="1.2"
        />
        <path
          d="M34 48 c 5 -2 7 -7 5 -12 c -5 0 -7 6 -5 12 Z"
          fill="var(--leaf-fill)"
          strokeWidth="1.2"
        />
      </g>

      {/* background daisies — bottom */}
      <g opacity="0.85">
        <Daisy cx={34} cy={178} />
        <Daisy cx={78} cy={184} scale={0.85} />
      </g>

      {/* plant pot — right */}
      <g transform="translate(150 54)">
        {/* leaves cluster */}
        <path d="M28 78 C 28 58 24 44 16 32" stroke="var(--leaf-ink)" />
        <path
          d="M28 52 c -6 -3 -10 -9 -11 -17 c 6 1 11 7 11 17 Z"
          fill="var(--leaf-fill-strong)"
          stroke="var(--leaf-ink)"
        />
        <path
          d="M28 66 c 7 -2 12 -8 13 -16 c -7 0 -12 5 -13 16 Z"
          fill="var(--leaf-fill)"
          stroke="var(--leaf-ink)"
        />
        <path
          d="M28 80 c -6 -2 -10 -7 -11 -14 c 6 0 11 4 11 14 Z"
          fill="var(--leaf-fill)"
          stroke="var(--leaf-ink)"
        />
        {/* pot */}
        <path
          d="M8 82 H 48 L 42 112 a 2 2 0 0 1 -2 1.6 H 16 a 2 2 0 0 1 -2 -1.6 Z"
          fill="var(--pot-fill)"
          stroke="var(--pot-ink)"
        />
        <path d="M8 82 H 48" stroke="var(--pot-ink)" strokeWidth="1.8" />
      </g>

      {/* sprout mascot — center-left */}
      <g transform="translate(58 58)">
        {/* leaf ears */}
        <path
          d="M38 18 c 10 -2 16 -10 17 -22 c -11 1 -17 9 -17 22 Z"
          fill="var(--mascot-leaf-strong)"
          stroke="var(--leaf-ink)"
          strokeWidth="1.5"
        />
        <path
          d="M30 18 c -10 -2 -16 -10 -17 -22 c 11 1 17 9 17 22 Z"
          fill="var(--mascot-leaf)"
          stroke="var(--leaf-ink)"
          strokeWidth="1.5"
        />

        {/* body — round bean shape */}
        <path
          d="M34 16
             C 50 16 58 30 58 44
             C 58 60 48 72 34 72
             C 20 72 10 60 10 44
             C 10 30 18 16 34 16 Z"
          fill="var(--mascot-body)"
          stroke="var(--leaf-ink)"
          strokeWidth="1.8"
        />

        {/* cheeks */}
        <ellipse cx="22" cy="50" rx="3.4" ry="2.4" fill="var(--mascot-cheek)" stroke="none" />
        <ellipse cx="46" cy="50" rx="3.4" ry="2.4" fill="var(--mascot-cheek)" stroke="none" />

        {/* eyes — happy closed arcs */}
        <path d="M24 44 q 2 -3 4 0" stroke="var(--leaf-ink)" strokeWidth="1.9" />
        <path d="M40 44 q 2 -3 4 0" stroke="var(--leaf-ink)" strokeWidth="1.9" />

        {/* smile */}
        <path d="M30 55 q 4 4 8 0" stroke="var(--leaf-ink)" strokeWidth="1.6" />

        {/* little waving arm */}
        <path
          d="M10 46 c -6 -1 -10 -5 -11 -10 c 2 -1 5 -1 8 1"
          stroke="var(--leaf-ink)"
          strokeWidth="1.8"
        />

        {/* heart */}
        <path
          d="M64 10 c 2 -2 5 -1 5 2 c 0 3 -5 6 -5 6 s -5 -3 -5 -6 c 0 -3 3 -4 5 -2 Z"
          fill="var(--heart)"
          stroke="none"
        />
      </g>

      {/* pot for mascot */}
      <g transform="translate(66 124)">
        <path
          d="M2 0 H 58 L 52 30 a 2 2 0 0 1 -2 1.6 H 10 a 2 2 0 0 1 -2 -1.6 Z"
          fill="var(--pot-fill)"
          stroke="var(--pot-ink)"
          strokeWidth="1.8"
        />
        <path d="M2 0 H 58" stroke="var(--pot-ink)" strokeWidth="1.8" />
      </g>
    </svg>
  );
}

function Daisy({
  cx,
  cy,
  scale = 1,
}: {
  cx: number;
  cy: number;
  scale?: number;
}) {
  const petal = (angle: number) => {
    const rad = (angle * Math.PI) / 180;
    const r = 5 * scale;
    return { x: cx + Math.cos(rad) * r, y: cy + Math.sin(rad) * r };
  };
  return (
    <g>
      {[0, 72, 144, 216, 288].map((a) => {
        const p = petal(a);
        return (
          <ellipse
            key={a}
            cx={p.x}
            cy={p.y}
            rx={2.2 * scale}
            ry={3.6 * scale}
            fill="var(--daisy-petal)"
            stroke="none"
            transform={`rotate(${a} ${p.x} ${p.y})`}
          />
        );
      })}
      <circle cx={cx} cy={cy} r={2.2 * scale} fill="var(--daisy-center)" stroke="none" />
    </g>
  );
}
