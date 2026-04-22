'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Sparkles } from 'lucide-react';
import { getSupabaseBrowser } from '@/lib/supabase/browser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-sm"
    >
      <Card className="border-border/60 shadow-xl backdrop-blur-sm bg-card/80">
        <CardHeader className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="size-5 text-amber-500" />
            <span className="font-serif text-lg">Comprinhas</span>
          </div>
          <CardTitle className="font-serif text-2xl font-normal">
            Welcome back
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Your wishlist, plans, and notes — signed in.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={signInWithGoogle}
            disabled={pending}
            variant="outline"
            className="w-full h-11"
          >
            <GoogleIcon />
            Continue with Google
          </Button>

          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-card px-2 text-xs text-muted-foreground">
              or
            </span>
          </div>

          {sent ? (
            <div className="text-center space-y-2 py-2">
              <Mail className="size-6 text-emerald-500 mx-auto" />
              <p className="text-sm">
                Check <span className="font-medium">{email}</span> for a login link.
              </p>
            </div>
          ) : (
            <form onSubmit={sendMagicLink} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                />
              </div>
              <Button type="submit" disabled={pending} className="w-full h-11">
                Send magic link
              </Button>
            </form>
          )}

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}
        </CardContent>
      </Card>
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
