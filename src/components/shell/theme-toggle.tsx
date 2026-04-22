'use client';

import { useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

const KNOB_SPRING = { type: 'spring', duration: 0.32, bounce: 0.15 } as const;
const SWAP_SPRING = { type: 'spring', duration: 0.32, bounce: 0.2 } as const;
const KNOB_TRAVEL = 32; // track 60 – knob 24 – (2 × 2) inset = 32

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function ThemeToggle({
  variant = 'sidebar',
  className,
}: {
  variant?: 'sidebar' | 'compact';
  className?: string;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const shouldReduceMotion = useReducedMotion();

  const isDark = mounted && resolvedTheme === 'dark';
  const next = isDark ? 'light' : 'dark';
  const knobTransition = shouldReduceMotion ? { duration: 0 } : KNOB_SPRING;

  if (variant === 'compact') {
    return (
      <motion.button
        type="button"
        onClick={() => setTheme(next)}
        aria-label={`Switch to ${next} mode`}
        aria-pressed={isDark}
        whileTap={{ scale: 0.92 }}
        transition={{ type: 'spring', duration: 0.22, bounce: 0.25 }}
        className={cn(
          'relative size-9 rounded-full grid place-items-center',
          'bg-card ring-1 ring-foreground/[0.06] shadow-[var(--shadow-paper)]',
          'text-foreground/80 transition-colors duration-150',
          '[@media(hover:hover)]:hover:text-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
          '[touch-action:manipulation]',
          className,
        )}
      >
        <ThemeGlyph
          isDark={isDark}
          mounted={mounted}
          shouldReduceMotion={!!shouldReduceMotion}
        />
      </motion.button>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} mode`}
      aria-pressed={isDark}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', duration: 0.22, bounce: 0.2 }}
      className={cn(
        'group relative flex items-center gap-2 w-full rounded-full p-1 pr-3',
        'bg-muted/70 transition-colors duration-150',
        '[@media(hover:hover)]:hover:bg-muted',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
        '[touch-action:manipulation]',
        className,
      )}
    >
      <span
        aria-hidden
        className="relative h-7 rounded-full bg-card ring-1 ring-foreground/[0.06] shadow-[var(--shadow-paper)] grid grid-cols-2 items-center w-[60px]"
      >
        <motion.span
          initial={false}
          animate={{ x: isDark ? KNOB_TRAVEL : 0 }}
          transition={knobTransition}
          className={cn(
            'absolute top-0.5 left-0.5 size-6 rounded-full',
            'bg-gradient-to-br from-[oklch(0.96_0.02_95)] to-[oklch(0.88_0.08_90)]',
            'dark:from-[oklch(0.35_0.03_250)] dark:to-[oklch(0.22_0.02_245)]',
            'shadow-[0_1px_2px_rgba(0,0,0,0.18)]',
          )}
        />
        <span className="relative grid place-items-center text-[oklch(0.55_0.12_72)] dark:text-foreground/40 transition-colors duration-150">
          <Sun className="size-3.5" strokeWidth={2.2} />
        </span>
        <span className="relative grid place-items-center text-foreground/40 dark:text-[oklch(0.9_0.05_250)] transition-colors duration-150">
          <Moon className="size-3.5" strokeWidth={2.2} />
        </span>
      </span>
      <span className="text-[12px] font-medium tracking-[-0.005em] text-muted-foreground [@media(hover:hover)]:group-hover:text-foreground transition-colors duration-150">
        {mounted ? (isDark ? 'Dark mode' : 'Light mode') : 'Theme'}
      </span>
    </motion.button>
  );
}

function ThemeGlyph({
  isDark,
  mounted,
  shouldReduceMotion,
}: {
  isDark: boolean;
  mounted: boolean;
  shouldReduceMotion: boolean;
}) {
  const key = mounted ? (isDark ? 'moon' : 'sun') : 'placeholder';
  const glyph = isDark ? (
    <Moon className="size-4" strokeWidth={1.9} />
  ) : (
    <Sun className="size-4" strokeWidth={1.9} />
  );

  if (shouldReduceMotion) {
    return <span className="relative size-4 grid place-items-center">{glyph}</span>;
  }

  return (
    <span className="relative size-4 grid place-items-center">
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={key}
          initial={{ rotate: -60, opacity: 0, scale: 0.7 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 60, opacity: 0, scale: 0.7 }}
          transition={SWAP_SPRING}
          className="absolute inset-0 grid place-items-center"
        >
          {glyph}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
