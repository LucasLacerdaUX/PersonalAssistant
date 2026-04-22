import { getSupabaseServer } from '@/lib/supabase/server';
import { PageHeader } from '@/components/page-header';
import { TagEditor } from './tag-editor';
import { DisplayCurrency } from './display-currency';

export default async function SettingsPage() {
  const supabase = await getSupabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const email = session?.user.email ?? '';

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Settings"
        subtitle="Tweak your tags, preferences, and account."
      />
      <div className="px-4 md:px-8 pb-8 space-y-8 max-w-2xl w-full mx-auto md:mx-0">
        <Section
          title="Tags"
          description="Tags apply across tasks, wishlist items, and notes. One tag per item."
        >
          <TagEditor />
        </Section>

        <Section
          title="Display currency"
          description="The currency we convert wishlist prices into when showing totals."
        >
          <DisplayCurrency />
        </Section>

        <Section title="Account" description={email}>
          <p className="text-sm text-muted-foreground">
            Sign out from the avatar menu.
          </p>
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border/60 bg-card p-5 md:p-6 space-y-4">
      <header>
        <h2 className="font-serif text-xl">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        )}
      </header>
      {children}
    </section>
  );
}
