'use client';

import { useRouter } from 'next/navigation';
import { LogOut, Moon, Settings, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { getSupabaseBrowser } from '@/lib/supabase/browser';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function UserMenu({
  email,
  avatarUrl,
  compact = false,
}: {
  email: string;
  avatarUrl: string | null;
  compact?: boolean;
}) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  async function signOut() {
    const supabase = getSupabaseBrowser();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  const initial = email.slice(0, 1).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={
          compact
            ? 'size-9 rounded-full ring-1 ring-border overflow-hidden p-0 bg-transparent'
            : 'flex items-center gap-3 w-full rounded-xl px-2 py-2 hover:bg-sidebar-accent/60 transition-colors bg-transparent'
        }
        aria-label="Open menu"
      >
        {compact ? (
          <Avatar className="size-9">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={email} />}
            <AvatarFallback className="bg-primary/15 text-foreground text-sm">
              {initial}
            </AvatarFallback>
          </Avatar>
        ) : (
          <>
            <Avatar className="size-8">
              {avatarUrl && <AvatarImage src={avatarUrl} alt={email} />}
              <AvatarFallback className="bg-primary/15 text-foreground text-sm">
                {initial}
              </AvatarFallback>
            </Avatar>
            <div className="text-left flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Signed in</p>
              <p className="text-sm truncate">{email}</p>
            </div>
          </>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        <DropdownMenuLabel className="font-normal">
          <p className="text-xs text-muted-foreground">Signed in as</p>
          <p className="text-sm truncate">{email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/settings')}>
          <Settings className="size-4" /> Settings
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
          }}
        >
          {resolvedTheme === 'dark' ? (
            <Sun className="size-4" />
          ) : (
            <Moon className="size-4" />
          )}
          {resolvedTheme === 'dark' ? 'Light mode' : 'Dark mode'}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive">
          <LogOut className="size-4" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
