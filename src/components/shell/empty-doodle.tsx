import { cn } from '@/lib/utils';

/**
 * A small cheerful scene for empty states: a sun peeking over a hill,
 * a sprout, and a little cloud. Uses currentColor.
 */
export function EmptyDoodle({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 112 80"
      aria-hidden
      className={cn('shrink-0', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* cloud — top left */}
      <path
        d="M16 20 a 5 5 0 0 1 9 -2 a 4 4 0 0 1 7 3 a 3 3 0 0 1 -3 3 h -10 a 3.5 3.5 0 0 1 -3 -4 Z"
        fill="currentColor"
        fillOpacity="0.18"
        strokeWidth={1.3}
      />

      {/* sun — gently breathes */}
      <g className="doodle-breathe">
        <circle cx="82" cy="22" r="8" fill="currentColor" fillOpacity="0.22" />
        <circle cx="82" cy="22" r="8" strokeWidth={1.4} />
        <path d="M82 8 v3" />
        <path d="M95 22 h3" />
        <path d="M72 12 l2 2" />
        <path d="M92 32 l2 2" />
        <path d="M72 32 l2 -2" />
      </g>

      {/* horizon */}
      <path
        d="M4 60 Q 30 54 56 58 T 108 56"
        strokeWidth={1.5}
        opacity="0.8"
      />

      {/* sprout — center */}
      <g transform="translate(46 36)">
        <path d="M10 26 V 10" strokeWidth={1.5} />
        <path
          d="M10 14 c 3.2 -0.3 5 -2.5 5.2 -5.4 c -3 0.3 -5 2.3 -5.2 5.4 Z"
          fill="currentColor"
        />
        <path
          d="M10 19 c -2.3 -1 -4.2 -1.7 -5.5 -3.3"
          strokeWidth={1.3}
        />
        <path
          d="M4.5 15.7 c -0.2 -2 0.9 -3.8 2.9 -4.3 c 0.6 2 -0.3 3.8 -2.9 4.3 Z"
          fill="currentColor"
          opacity="0.82"
        />
      </g>

      {/* grass — bottom right */}
      <path d="M82 62 c 1 -4 2 -6 4 -8" opacity="0.75" />
      <path d="M88 62 c 1 -6 2 -8 4 -10" opacity="0.75" />
      <path d="M94 62 c 0.5 -4 1.5 -6 3 -7" opacity="0.75" />

      {/* pebble */}
      <path
        d="M14 62 c 2 -1 5 -1 7 0"
        strokeWidth={1.2}
        opacity="0.6"
      />
    </svg>
  );
}
