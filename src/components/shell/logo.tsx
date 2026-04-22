import { cn } from '@/lib/utils';

/**
 * Three-stem sprout — a hand-drawn mark for Comprinhas.
 * Uses currentColor so it can tint to match any surface.
 */
export function Sprout({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 28"
      aria-hidden
      className={cn('shrink-0', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* pot */}
      <path d="M7 22 L9.5 26 h9 L21 22 Z" fill="currentColor" stroke="none" opacity="0.18" />
      {/* center stem */}
      <path d="M14 22 V10" />
      <path d="M14 12.5 c2.6 -0.2 4.2 -2 4.4 -4.4 c-2.4 0.2 -4.2 1.8 -4.4 4.4 Z" fill="currentColor" />
      {/* left stem */}
      <path d="M14 16 C 12 15 10.2 14.4 9 13" />
      <path d="M9 13 c -0.2 -1.8 0.8 -3.4 2.6 -3.8 c 0.5 1.8 -0.3 3.4 -2.6 3.8 Z" fill="currentColor" opacity="0.85" />
      {/* right stem */}
      <path d="M14 18 C 16 17 18 16.6 19.2 15.4" />
      <path d="M19.2 15.4 c 1.8 0.2 3.2 -0.8 3.5 -2.4 c -1.8 -0.4 -3.3 0.4 -3.5 2.4 Z" fill="currentColor" opacity="0.85" />
    </svg>
  );
}
