'use client';

import { MotionConfig } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * Apply app-wide motion defaults.
 * - `reducedMotion="user"` makes every framer-motion animation respect the
 *   OS "reduce motion" preference automatically.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">{children}</MotionConfig>
  );
}
