import { Suspense } from 'react';
import LoginForm from './login-form';

export const metadata = {
  title: 'Sign in · Comprinhas',
};

export default function LoginPage() {
  return (
    <main className="relative min-h-dvh flex items-center justify-center p-6 overflow-hidden bg-background">
      {/* Soft blurred blobs — garden palette */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-24 size-[420px] rounded-full blur-3xl opacity-60"
        style={{ background: 'var(--chip-sage)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-24 size-[460px] rounded-full blur-3xl opacity-55"
        style={{ background: 'var(--chip-butter)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 right-1/4 size-[260px] rounded-full blur-3xl opacity-40"
        style={{ background: 'var(--chip-periwinkle)' }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 paper-dots opacity-[0.35]" />

      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
