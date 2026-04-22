import { getSupabaseServer } from '@/lib/supabase/server';
import { HomeView } from './home/home-view';

export default async function HomePage() {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const metaName = user?.user_metadata?.full_name as string | undefined;
  const name =
    (metaName && metaName.split(' ')[0]) ??
    user?.email?.split('@')[0] ??
    'friend';

  return <HomeView name={name} />;
}
