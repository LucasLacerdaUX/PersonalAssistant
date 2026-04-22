import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

export default function AuthErrorPage() {
  return (
    <main className="min-h-dvh flex items-center justify-center p-6">
      <div className="max-w-sm w-full text-center space-y-4">
        <h1 className="font-serif text-3xl">Something went sideways.</h1>
        <p className="text-muted-foreground">
          That sign-in link didn&apos;t work. It may have expired — let&apos;s try again.
        </p>
        <Link href="/login" className={buttonVariants()}>
          Back to sign in
        </Link>
      </div>
    </main>
  );
}
