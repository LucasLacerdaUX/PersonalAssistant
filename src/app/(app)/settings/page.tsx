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
        eyebrow="Settings"
        title="Preferences."
        subtitle="Tweak your tags, display, and account."
      />
      <div className="px-4 md:px-8 pb-20 md:pb-10 space-y-6 max-w-2xl w-full mx-auto md:mx-0">
        <Section
          title="Tags"
          description="Tags apply across tasks, wishlist, and notes. One per item."
        >
          <TagEditor />
        </Section>

        <Section
          title="Display currency"
          description="The currency we convert prices into when showing totals."
        >
          <DisplayCurrency />
        </Section>

        <Section title="Account" description={email}>
          <p className="text-[13.5px] text-muted-foreground">
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
    <section className="rounded-3xl bg-card p-5 md:p-7 ring-1 ring-foreground/[0.06] shadow-[var(--shadow-paper)] space-y-4">
      <header>
        <h2 className="font-display text-[20px] tracking-[-0.02em] font-medium">
          {title}
        </h2>
        {description && (
          <p className="text-[13px] text-muted-foreground mt-1">{description}</p>
        )}
      </header>
      {children}
    </section>
  );
}
