import { redirect } from 'next/navigation';
import { getSupabaseServer } from '@/lib/supabase/server';
import { Sidebar } from '@/components/shell/sidebar';
import { MobileHeader } from '@/components/shell/mobile-header';
import { TabBar } from '@/components/shell/tab-bar';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await getSupabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const user = session.user;
  const email = user.email ?? '';
  const avatarUrl =
    (user.user_metadata?.avatar_url as string | undefined) ?? null;

  return (
    <div className="flex flex-1 min-h-dvh">
      <Sidebar email={email} avatarUrl={avatarUrl} />
      <div className="flex flex-col flex-1 min-w-0">
        <MobileHeader email={email} avatarUrl={avatarUrl} />
        <main className="flex-1 min-h-0">{children}</main>
        <TabBar />
      </div>
    </div>
  );
}
