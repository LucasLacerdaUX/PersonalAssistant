'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { navItems } from '@/lib/nav';

export function TabBar() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden sticky bottom-0 z-30 border-t border-border/60 bg-background/85 backdrop-blur-md">
      <ul
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${navItems.length}, minmax(0, 1fr))`,
          paddingBottom: 'env(safe-area-inset-bottom, 0.25rem)',
        }}
      >
        {navItems.map((item) => {
          const active = item.matches(pathname);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className="relative flex flex-col items-center justify-center gap-1 py-2.5 text-[11px]"
              >
                {active && (
                  <motion.span
                    layoutId="tab-active-dot"
                    className="absolute top-1 h-1 w-1 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                  />
                )}
                <Icon
                  className={cn(
                    'size-5 transition-colors',
                    active ? 'text-primary' : 'text-muted-foreground',
                  )}
                />
                <span
                  className={cn(
                    'transition-colors',
                    active ? 'text-foreground font-medium' : 'text-muted-foreground',
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
