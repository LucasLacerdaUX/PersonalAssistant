'use client';

import { usePathname } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { navItems } from '@/lib/nav';
import { UserMenu } from './user-menu';

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
    <header className="md:hidden sticky top-0 z-20 flex items-center justify-between gap-3 px-4 py-3 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <div className="size-7 rounded-lg bg-primary/15 grid place-items-center">
          <Sparkles className="size-3.5 text-primary" />
        </div>
        <h1 className="font-serif text-lg leading-none">{title}</h1>
      </div>
      <UserMenu email={email} avatarUrl={avatarUrl} compact />
    </header>
  );
}
