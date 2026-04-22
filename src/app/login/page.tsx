import { Suspense } from 'react';
import LoginForm from './login-form';

export const metadata = {
  title: 'Sign in · Comprinhas',
};

export default function LoginPage() {
  return (
    <main className="min-h-dvh flex items-center justify-center p-6 bg-gradient-to-br from-amber-50 via-rose-50 to-indigo-100 dark:from-indigo-950 dark:via-purple-950 dark:to-rose-950">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
