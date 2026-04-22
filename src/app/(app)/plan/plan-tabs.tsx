'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const tabs = [
  { href: '/plan', label: 'Week', match: (p: string) => p === '/plan' },
  {
    href: '/plan/year',
    label: 'Year',
    match: (p: string) => p.startsWith('/plan/year'),
  },
];

export function PlanTabs() {
  const pathname = usePathname();
  return (
    <div className="inline-flex items-center rounded-full bg-muted p-1 text-[13px] relative">
      {tabs.map((tab) => {
        const active = tab.match(pathname);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              'relative rounded-full px-4 py-1.5 transition-colors',
              active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {active && (
              <motion.span
                layoutId="plan-tab-active"
                className="absolute inset-0 rounded-full bg-card shadow-[var(--shadow-paper)] ring-1 ring-foreground/[0.06]"
                transition={{ type: 'spring', stiffness: 500, damping: 44 }}
              />
            )}
            <span className="relative font-medium tracking-tight">{tab.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
