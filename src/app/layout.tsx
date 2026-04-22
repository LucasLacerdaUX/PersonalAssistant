import type { Metadata, Viewport } from 'next';
import { Hanken_Grotesk, Bricolage_Grotesque, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { MotionProvider } from '@/components/motion-provider';
import { QueryProvider } from '@/lib/query-provider';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

const body = Hanken_Grotesk({
  variable: '--font-hanken',
  subsets: ['latin'],
  display: 'swap',
});

const display = Bricolage_Grotesque({
  variable: '--font-bricolage',
  subsets: ['latin'],
  display: 'swap',
});

const mono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Comprinhas',
  description: 'Your wishlist, plans, and notes — all in one place.',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f9f4' },
    { media: '(prefers-color-scheme: dark)', color: '#1b201d' },
  ],
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${body.variable} ${display.variable} ${mono.variable} h-full`}
    >
      <body className="min-h-dvh flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MotionProvider>
            <QueryProvider>
              {children}
              <Toaster position="top-center" richColors />
            </QueryProvider>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
