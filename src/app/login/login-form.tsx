'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { getSupabaseBrowser } from '@/lib/supabase/browser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Sprout } from '@/components/shell/logo';

export default function LoginForm() {
  const params = useSearchParams();
  const next = params.get('next') ?? '/';
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const siteUrl =
    (typeof window !== 'undefined' && window.location.origin) ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'http://localhost:3000';

  async function signInWithGoogle() {
    setError(null);
    setPending(true);
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) {
      setError(error.message);
      setPending(false);
    }
  }

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setError(null);
    setPending(true);
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${siteUrl}/auth/confirm?next=${encodeURIComponent(next)}`,
      },
    });
    setPending(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-10 w-full max-w-sm"
    >
      <div className="rounded-3xl bg-card/85 backdrop-blur-xl p-7 ring-1 ring-foreground/[0.06] shadow-[var(--shadow-lift)]">
        <div className="flex flex-col items-center text-center space-y-3 pb-5">
          <div className="size-12 rounded-2xl bg-primary/12 text-primary grid place-items-center ring-1 ring-primary/20">
            <Sprout className="size-7" />
          </div>
          <div className="space-y-1.5">
            <h1 className="font-display text-[28px] tracking-[-0.025em] font-medium leading-tight">
              Welcome back
            </h1>
            <p className="text-[13.5px] text-muted-foreground">
              Your wishlist, plans, and notes — in one quiet place.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Button
            onClick={signInWithGoogle}
            disabled={pending}
            variant="outline"
            className="w-full h-11 rounded-xl"
          >
            <GoogleIcon />
            Continue with Google
          </Button>

          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-card px-2.5 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              or
            </span>
          </div>

          {sent ? (
            <div className="text-center space-y-2 py-2">
              <div className="mx-auto size-10 rounded-full bg-success/15 text-success grid place-items-center">
                <Mail className="size-5" />
              </div>
              <p className="text-[13.5px]">
                Check <span className="font-medium">{email}</span> for a login link.
              </p>
            </div>
          ) : (
            <form onSubmit={sendMagicLink} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs text-muted-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 rounded-xl"
                />
              </div>
              <Button type="submit" disabled={pending} className="w-full h-11 rounded-xl">
                Send magic link
              </Button>
            </form>
          )}

          {error && (
            <p className="text-[13px] text-destructive text-center">{error}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function GoogleIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M21.35 11.1h-9.17v2.92h5.27c-.23 1.26-1.51 3.69-5.27 3.69-3.17 0-5.76-2.63-5.76-5.88s2.59-5.88 5.76-5.88c1.8 0 3.01.77 3.7 1.43l2.52-2.44C16.76 3.34 14.74 2.5 12.18 2.5 6.88 2.5 2.6 6.78 2.6 12.08s4.28 9.58 9.58 9.58c5.52 0 9.18-3.88 9.18-9.34 0-.63-.07-1.11-.01-1.22z"
        fill="currentColor"
      />
    </svg>
  );
}
