'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { navItems } from '@/lib/nav';
import { UserMenu } from './user-menu';
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
    <aside className="hidden md:flex md:w-60 lg:w-64 shrink-0 flex-col border-r border-border/60 bg-sidebar text-sidebar-foreground">
      <div className="px-5 py-5 flex items-center gap-2">
        <div className="size-8 rounded-xl bg-primary/15 grid place-items-center">
          <Sparkles className="size-4 text-primary" />
        </div>
        <div>
          <p className="font-serif text-base leading-tight">Comprinhas</p>
          <p className="text-[11px] text-muted-foreground leading-tight">
            Your life, organized.
          </p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1">
        {navItems.map((item) => {
          const active = item.matches(pathname);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors',
                active
                  ? 'text-sidebar-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60',
              )}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 rounded-xl bg-sidebar-accent"
                  transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                />
              )}
              <Icon className="relative size-4" />
              <span className="relative font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {tags.length > 0 && (
        <div className="px-5 py-4 border-t border-border/60">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
            Tags
          </p>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs bg-muted/60"
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

      <div className="px-4 py-4 border-t border-border/60">
        <UserMenu email={email} avatarUrl={avatarUrl} />
      </div>
    </aside>
  );
}
