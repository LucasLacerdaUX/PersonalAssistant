import { cn } from '@/lib/utils';

type IconProps = { className?: string };

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

/** Home — a plump potted plant, the dashboard home. */
export function HomeIcon({ className }: IconProps) {
  return (
    <svg aria-hidden className={cn('shrink-0', className)} {...base}>
      {/* leaves */}
      <path d="M12 14 V 8.5" />
      <path
        d="M12 10.5 c 2.6 -0.2 4.2 -2 4.4 -4.4 c -2.4 0.2 -4.2 1.8 -4.4 4.4 Z"
        fill="currentColor"
      />
      <path
        d="M12 12.5 c -2.4 -0.2 -4 -1.8 -4.3 -4 c 2.3 0 4 1.6 4.3 4 Z"
        fill="currentColor"
        opacity="0.82"
      />
      {/* pot */}
      <path
        d="M6.5 14 H 17.5 L 16 20.3 a 1 1 0 0 1 -1 0.7 H 9 a 1 1 0 0 1 -1 -0.7 Z"
        fill="currentColor"
        fillOpacity="0.18"
      />
      <path d="M6.5 14 H 17.5" strokeWidth="1.6" />
    </svg>
  );
}

/** Today — a friendly sun with a warm filled disc and soft rays. */
export function TodayIcon({ className }: IconProps) {
  return (
    <svg aria-hidden className={cn('shrink-0', className)} {...base}>
      <circle cx="12" cy="12" r="3.6" fill="currentColor" fillOpacity="0.22" />
      <circle cx="12" cy="12" r="3.6" />
      <path d="M12 3.2 v2.1" />
      <path d="M12 18.7 v2.1" />
      <path d="M3.2 12 h2.1" />
      <path d="M18.7 12 h2.1" />
      <path d="M6 6 l1.5 1.5" />
      <path d="M16.5 16.5 l1.5 1.5" />
      <path d="M6 18 l1.5 -1.5" />
      <path d="M16.5 7.5 l1.5 -1.5" />
    </svg>
  );
}

/** Plan — a soft-cornered calendar with a tiny sprout inside. */
export function PlanIcon({ className }: IconProps) {
  return (
    <svg aria-hidden className={cn('shrink-0', className)} {...base}>
      <rect x="3.5" y="5.5" width="17" height="15" rx="2.6" />
      <path d="M8.5 3.5 v3.2" />
      <path d="M15.5 3.5 v3.2" />
      <path d="M3.7 10 h16.6" opacity="0.55" />
      {/* sprout */}
      <path d="M12 17.5 v-3" />
      <path
        d="M12 14.8 c1.55 -0.1 2.5 -1.1 2.7 -2.6 c-1.55 0.1 -2.55 1.05 -2.7 2.6 Z"
        fill="currentColor"
      />
      <path
        d="M12 15.4 c-1.35 -0.15 -2.3 -1.0 -2.5 -2.4 c1.35 0.15 2.35 0.95 2.5 2.4 Z"
        fill="currentColor"
        opacity="0.82"
      />
    </svg>
  );
}

/** Wishlist — a heart that reads plump, with a tiny leaf on top. */
export function WishlistIcon({ className }: IconProps) {
  return (
    <svg aria-hidden className={cn('shrink-0', className)} {...base}>
      <path
        d="M12 20.2 C 7.4 17.4 4 14.5 4 10.6 A 3.9 3.9 0 0 1 11 8.3 A 3.9 3.9 0 0 1 20 10.6 C 20 14.5 16.6 17.4 12 20.2 Z"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <path d="M12 8.3 V 6.1" />
      <path
        d="M12 6.4 c 1.6 0.2 2.7 -0.7 2.9 -2.3 c -1.6 -0.2 -2.7 0.7 -2.9 2.3 Z"
        fill="currentColor"
        opacity="0.9"
        strokeWidth="1.4"
      />
    </svg>
  );
}

/** Notes — a rounded notebook with a leaf-shaped bookmark poking out. */
export function NotesIcon({ className }: IconProps) {
  return (
    <svg aria-hidden className={cn('shrink-0', className)} {...base}>
      {/* spine */}
      <path d="M6.2 4.2 V 19.8" />
      {/* book body */}
      <path d="M6.2 4.2 H 17.5 a 1.7 1.7 0 0 1 1.7 1.7 V 19.8 a 0 0 0 0 1 0 0 H 7.9 a 1.7 1.7 0 0 1 -1.7 -1.7 Z" />
      {/* rings */}
      <circle cx="6.2" cy="8" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="6.2" cy="12" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="6.2" cy="16" r="0.6" fill="currentColor" stroke="none" />
      {/* lines */}
      <path d="M10 9 h5.5" opacity="0.55" />
      <path d="M10 12.2 h4.5" opacity="0.55" />
      {/* leaf bookmark */}
      <path
        d="M14.6 4.2 c 0.3 2 1.6 3 3.6 3.1 c -0.2 -2 -1.5 -3 -3.6 -3.1 Z"
        fill="currentColor"
        fillOpacity="0.85"
        strokeWidth="1.3"
      />
    </svg>
  );
}
