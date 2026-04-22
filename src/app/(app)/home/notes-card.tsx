'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { Plus } from 'lucide-react';
import { useNotes, useCreateNote } from '@/lib/hooks/use-notes';

export function NotesCard() {
  const router = useRouter();
  const { data: notes = [] } = useNotes('');
  const create = useCreateNote();
  const latest = notes[0];

  function newNote() {
    create.mutate(undefined, {
      onSuccess: (row) => router.push(`/notes?id=${row.id}`),
    });
  }

  const preview = latest
    ? (latest.body.trim().slice(0, 180) || 'Empty note')
    : '';

  return (
    <section className="relative overflow-hidden rounded-3xl bg-card ring-1 ring-foreground/[0.05] shadow-[var(--shadow-paper)] p-5">
      <LeafDoodle className="pointer-events-none absolute -right-2 -bottom-2 w-24 text-primary/20" />

      <header className="flex items-center justify-between relative">
        <h2 className="font-display text-[17px] tracking-[-0.012em] font-medium">
          Notes
        </h2>
      </header>

      {latest ? (
        <Link
          href={`/notes?id=${latest.id}`}
          className="relative block mt-3 rounded-2xl bg-muted/40 px-4 py-3 ring-1 ring-foreground/[0.04] [@media(hover:hover)]:hover:bg-muted/60 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
        >
          <p className="text-[13px] font-medium tracking-[-0.005em] truncate">
            {latest.title.trim() || 'Untitled'}
          </p>
          <p className="mt-1 text-[12.5px] text-muted-foreground leading-[1.55] line-clamp-3">
            {preview}
          </p>
          <p className="mt-2 text-[10.5px] text-muted-foreground tabular-nums">
            Updated {format(parseISO(latest.updated_at), 'MMM d')}
          </p>
        </Link>
      ) : (
        <p className="relative mt-3 text-[13px] text-muted-foreground bg-muted/40 rounded-xl py-6 text-center">
          No notes yet.
        </p>
      )}

      <button
        type="button"
        onClick={newNote}
        disabled={create.isPending}
        className="relative mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-primary [@media(hover:hover)]:hover:text-foreground transition-colors duration-150 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 disabled:opacity-60 [touch-action:manipulation]"
      >
        <Plus className="size-3.5" strokeWidth={2.4} />
        New note
      </button>
    </section>
  );
}

function LeafDoodle({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 80 C 38 70 58 56 78 38" />
      <path
        d="M68 42 c 8 -2 13 -8 14 -18 c -8 0 -13 6 -14 18 Z"
        fill="currentColor"
        fillOpacity="0.8"
      />
      <path
        d="M52 58 c 8 -2 13 -8 14 -18 c -8 0 -13 6 -14 18 Z"
        fill="currentColor"
        fillOpacity="0.6"
      />
      <path
        d="M36 72 c 7 -2 12 -7 13 -16 c -7 0 -12 5 -13 16 Z"
        fill="currentColor"
        fillOpacity="0.45"
      />
    </svg>
  );
}
