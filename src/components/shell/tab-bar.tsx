'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { navItems } from '@/lib/nav';

export function TabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden sticky bottom-0 z-30 bg-background/90 backdrop-blur-lg"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <ul
        className="grid mx-3 mb-2 p-1 rounded-full bg-card shadow-[var(--shadow-float)] ring-1 ring-foreground/5"
        style={{
          gridTemplateColumns: `repeat(${navItems.length}, minmax(0, 1fr))`,
        }}
      >
        {navItems.map((item) => {
          const active = item.matches(pathname);
          const Icon = item.icon;
          return (
            <li key={item.href} className="relative">
              <Link
                href={item.href}
                className={cn(
                  'relative flex flex-col items-center justify-center gap-0.5 py-2 text-[10.5px]',
                  'transition-transform duration-150 active:scale-[0.94]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded-full',
                  '[touch-action:manipulation]',
                  active && `chip chip-${item.accent} !bg-transparent !rounded-full !px-0 !py-2`,
                )}
                style={active ? { color: 'var(--chip-fg)' } : undefined}
              >
                {active && (
                  <motion.span
                    layoutId="tab-active-bg"
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'var(--chip-bg)' }}
                    transition={{ type: 'spring', duration: 0.28, bounce: 0.08 }}
                  />
                )}
                <Icon
                  className={cn(
                    'relative size-[20px] transition-colors',
                    active ? '' : 'text-muted-foreground',
                  )}
                />
                <span
                  className={cn(
                    'relative transition-colors tracking-tight',
                    active ? 'font-medium' : 'text-muted-foreground',
                  )}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
