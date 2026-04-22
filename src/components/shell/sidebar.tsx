'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { navItems, type NavAccent } from '@/lib/nav';
import { UserMenu } from './user-menu';
import { Sprout } from './logo';
import { ThemeToggle } from './theme-toggle';
import { GardenScene } from './garden-scene';
import { useTags } from '@/lib/hooks/use-tags';

export function Sidebar({
  email,
  avatarUrl,
}: {
  email: string;
  avatarUrl: string | null;
}) {
  const pathname = usePathname();
  const { data: tags = [] } = useTags();

  return (
    <aside className="hidden md:flex md:w-60 lg:w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground">
      <div className="px-5 pt-6 pb-5 flex items-center gap-2.5">
        <div className="size-9 rounded-2xl bg-primary/12 text-primary grid place-items-center ring-1 ring-primary/20">
          <Sprout className="size-5" />
        </div>
        <div>
          <p className="font-display text-[17px] leading-[1.1] font-medium">
            Comprinhas
          </p>
          <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
            a quiet garden of plans
          </p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {navItems.map((item) => {
          const active = item.matches(pathname);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group relative flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm',
                'transition-[color,transform] duration-150 active:scale-[0.98]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
                '[touch-action:manipulation]',
                active
                  ? 'text-sidebar-accent-foreground'
                  : 'text-muted-foreground [@media(hover:hover)]:hover:text-foreground',
              )}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 rounded-xl bg-sidebar-accent"
                  transition={{ type: 'spring', duration: 0.28, bounce: 0.08 }}
                />
              )}
              <AccentSquare accent={item.accent} active={active}>
                <Icon className="size-[18px]" />
              </AccentSquare>
              <span className="relative font-medium tracking-[-0.005em]">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {tags.length > 0 && (
        <div className="px-5 py-4">
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2.5">
            Tags
          </p>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] bg-muted text-foreground/80"
              >
                <span
                  className="size-2 rounded-full"
                  style={{ background: tag.color }}
                />
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="px-3 pt-2">
        <GardenScene className="pointer-events-none text-primary/55" />
      </div>

      <div className="px-4 pt-1 pb-3">
        <ThemeToggle />
      </div>

      <div className="px-4 pb-4">
        <UserMenu email={email} avatarUrl={avatarUrl} />
      </div>
    </aside>
  );
}

function AccentSquare({
  accent,
  active,
  children,
}: {
  accent: NavAccent;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        'relative size-8 rounded-[10px] grid place-items-center',
        'transition-[background-color,color] duration-200 ease-out',
        !active && 'text-current',
      )}
      style={
        active
          ? {
              background: `var(--chip-${accent})`,
              color: `var(--chip-${accent}-ink)`,
            }
          : undefined
      }
    >
      {children}
    </span>
  );
}
