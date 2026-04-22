'use client';

import { usePathname } from 'next/navigation';
import { navItems } from '@/lib/nav';
import { UserMenu } from './user-menu';
import { Sprout } from './logo';
import { ThemeToggle } from './theme-toggle';

export function MobileHeader({
  email,
  avatarUrl,
}: {
  email: string;
  avatarUrl: string | null;
}) {
  const pathname = usePathname();
  const title = navItems.find((n) => n.matches(pathname))?.label ?? 'Comprinhas';

  return (
    <header className="md:hidden sticky top-0 z-20 flex items-center justify-between gap-3 px-4 py-3 bg-background/85 backdrop-blur-md">
      <div className="flex items-center gap-2.5">
        <div className="size-8 rounded-xl bg-primary/12 text-primary grid place-items-center ring-1 ring-primary/20">
          <Sprout className="size-4" />
        </div>
        <h1 className="font-display text-lg leading-none tracking-[-0.015em]">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle variant="compact" />
        <UserMenu email={email} avatarUrl={avatarUrl} compact />
      </div>
    </header>
  );
}
