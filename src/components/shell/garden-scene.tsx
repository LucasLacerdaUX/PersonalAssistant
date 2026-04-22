import { cn } from '@/lib/utils';

/**
 * A tiny horizon scene for the sidebar footer: dashed ground, a sprout,
 * a toadstool, a tulip bud, and a grass tuft. Uses currentColor so it
 * tints to whatever the parent sets.
 */
export function GardenScene({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 56"
      aria-hidden
      className={cn('w-full', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* ground */}
      <path
        d="M8 44 H 232"
        strokeDasharray="2 4"
        opacity="0.55"
      />

      {/* pebble — left */}
      <path
        d="M22 44 c 3 -1 6 -1 8 0"
        strokeWidth={1.2}
        opacity="0.5"
      />

      {/* sprout — like the logo, smaller */}
      <g transform="translate(40 10)">
        <path d="M10 34 V 16" />
        <path
          d="M10 20 c 3 -0.3 4.8 -2.4 5 -5.2 c -2.8 0.3 -4.8 2.2 -5 5.2 Z"
          fill="currentColor"
        />
        <path
          d="M10 24 C 7.8 23 6 22.3 4.8 20.8"
          strokeWidth={1.3}
        />
        <path
          d="M4.8 20.8 c -0.2 -2 0.9 -3.8 2.9 -4.3 c 0.6 2 -0.3 3.8 -2.9 4.3 Z"
          fill="currentColor"
          opacity="0.82"
        />
      </g>

      {/* toadstool */}
      <g transform="translate(86 22)">
        <path d="M12 22 V 14" strokeWidth={1.3} />
        <path
          d="M4 14 c 0 -4.4 3.6 -8 8 -8 s 8 3.6 8 8 z"
          fill="currentColor"
          fillOpacity="0.9"
        />
        <circle cx="9" cy="10.5" r="0.9" fill="var(--surface-sunken)" stroke="none" />
        <circle cx="14.5" cy="9" r="0.7" fill="var(--surface-sunken)" stroke="none" />
        <circle cx="15.5" cy="12" r="0.9" fill="var(--surface-sunken)" stroke="none" />
      </g>

      {/* tulip bud */}
      <g transform="translate(134 8)">
        <path d="M10 36 V 20" strokeWidth={1.3} />
        {/* leaf */}
        <path
          d="M10 28 c -3 -0.8 -5 -2.6 -5.4 -5.2 c 2.8 0 4.9 1.6 5.4 5.2 Z"
          fill="currentColor"
          opacity="0.75"
        />
        {/* bud */}
        <path
          d="M6 20 c 0 -4 1.8 -7 4 -8 c 2.2 1 4 4 4 8 c -1.3 -1.3 -2.7 -2 -4 -2 c -1.3 0 -2.7 0.7 -4 2 Z"
          fill="currentColor"
        />
      </g>

      {/* grass tuft */}
      <g transform="translate(178 20)">
        <path d="M4 24 C 5 16 6.5 12 9 9" />
        <path d="M10 24 C 10 14 11 10 13 6" strokeWidth={1.5} />
        <path d="M16 24 C 15 16 16 13 19 10" />
      </g>

      {/* floating leaf */}
      <path
        d="M208 22 c 3 -0.4 5.2 -2.4 5.4 -5.2 c -2.8 0.2 -5 2.2 -5.4 5.2 Z"
        fill="currentColor"
        fillOpacity="0.65"
        strokeWidth={1.2}
      />
    </svg>
  );
}
