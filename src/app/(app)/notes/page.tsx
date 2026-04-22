import { PageHeader } from '@/components/page-header';
import { NotesLayout } from './notes-layout';

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; q?: string }>;
}) {
  const { id, q } = await searchParams;
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        eyebrow="Notes"
        title="Think out loud."
        subtitle="Drafts, scraps, half-formed ideas."
      />
      <NotesLayout selectedId={id} query={q ?? ''} />
    </div>
  );
}
