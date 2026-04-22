'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { Plus, Search, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCreateNote, useDeleteNote, useNotes } from '@/lib/hooks/use-notes';
import { useTags } from '@/lib/hooks/use-tags';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyDoodle } from '@/components/shell/empty-doodle';
import { NoteEditor } from './note-editor';

export function NotesLayout({
  selectedId,
  query,
}: {
  selectedId?: string;
  query: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState(query);

  const notesQuery = useNotes(query);
  const tagsQuery = useTags();
  const create = useCreateNote();
  const del = useDeleteNote();

  const notes = notesQuery.data ?? [];
  const tags = tagsQuery.data ?? [];
  const tagById = new Map(tags.map((t) => [t.id, t]));

  const selected = selectedId
    ? notes.find((n) => n.id === selectedId) ?? null
    : notes[0] ?? null;

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    router.push(`/notes${params.size ? `?${params}` : ''}`);
  }

  function newNote() {
    create.mutate(undefined, {
      onSuccess: (row) => router.push(`/notes?id=${row.id}`),
    });
  }

  function remove(id: string) {
    if (!confirm('Delete this note?')) return;
    del.mutate(id, {
      onSuccess: () => router.push('/notes'),
    });
  }

  const showEditorOnly = !!selected && typeof window !== 'undefined';

  return (
    <div className="flex-1 min-h-0 px-4 md:px-8 pb-20 md:pb-10">
      <div className="grid md:grid-cols-[300px_1fr] gap-5 md:gap-8 h-full max-w-6xl mx-auto md:mx-0">
        <div
          className={cn(
            'flex flex-col gap-3',
            selected && 'hidden md:flex',
          )}
        >
          <form onSubmit={onSearch} className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search notes…"
              className="pl-10 h-10 rounded-full bg-muted/60 border-0"
            />
          </form>

          <Button onClick={newNote} disabled={create.isPending} className="rounded-full h-10">
            <Plus className="size-4" /> New note
          </Button>

          <div className="flex-1 min-h-0 overflow-y-auto -mx-1 px-1 space-y-1.5 pr-1">
            {notes.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                {notesQuery.isLoading
                  ? 'Loading…'
                  : query
                    ? 'No matches.'
                    : 'No notes yet.'}
              </p>
            ) : (
              notes.map((note) => {
                const active = selected?.id === note.id;
                const tag = note.tag_id ? tagById.get(note.tag_id) : null;
                const preview =
                  note.body.trim().slice(0, 80) || 'Empty note';
                return (
                  <Link
                    key={note.id}
                    href={`/notes?id=${note.id}${query ? `&q=${encodeURIComponent(query)}` : ''}`}
                    className={cn(
                      'block rounded-xl p-3 transition-all',
                      active
                        ? 'bg-card ring-1 ring-foreground/[0.06] shadow-[var(--shadow-paper)]'
                        : 'hover:bg-muted',
                    )}
                  >
                    <p className="text-[14px] font-medium truncate tracking-[-0.005em]">
                      {note.title.trim() || 'Untitled'}
                    </p>
                    <p className="text-[12px] text-muted-foreground line-clamp-2 mt-0.5">
                      {preview}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10.5px] text-muted-foreground tabular-nums">
                        {format(parseISO(note.updated_at), 'MMM d')}
                      </span>
                      {tag && (
                        <span className="inline-flex items-center gap-1 text-[10.5px] text-muted-foreground">
                          <span
                            className="size-1.5 rounded-full"
                            style={{ background: tag.color }}
                          />
                          {tag.name}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>

        <div
          className={cn(
            'min-h-[60vh]',
            !showEditorOnly && 'hidden md:block',
          )}
        >
          {selected ? (
            <div className="flex flex-col h-full">
              <div className="md:hidden mb-2">
                <Link
                  href="/notes"
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground"
                >
                  <ArrowLeft className="size-4" /> All notes
                </Link>
              </div>
              <NoteEditor
                key={selected.id}
                note={selected}
                tags={tags}
                onDelete={() => remove(selected.id)}
              />
            </div>
          ) : (
            <div className="h-full grid place-items-center rounded-3xl bg-muted/30 paper-dots">
              <div className="text-center">
                <EmptyDoodle className="mx-auto mb-3 w-32 text-primary/70" />
                <p className="font-display text-[22px] tracking-[-0.02em]">
                  Pick a note.
                </p>
                <p className="text-[13px] text-muted-foreground mt-1.5">
                  Or tap{' '}
                  <kbd className="px-1.5 py-0.5 rounded bg-card ring-1 ring-foreground/10 text-[11px] font-mono">
                    New note
                  </kbd>{' '}
                  to start one.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
