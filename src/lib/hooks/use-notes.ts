'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createNote,
  deleteNote,
  updateNote,
} from '@/app/(app)/actions/notes';
import { getSupabaseBrowser } from '@/lib/supabase/browser';
import { qk } from '@/lib/query-keys';
import type { Note } from '@/lib/supabase/types';

export function useNotes(query: string) {
  const q = query.trim();
  return useQuery({
    queryKey: qk.notes(q),
    queryFn: async () => {
      const supabase = getSupabaseBrowser();
      const base = supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false });
      const { data, error } = q
        ? await base.textSearch('search_vector', q.split(/\s+/).join(' & '), {
            type: 'websearch',
            config: 'simple',
          })
        : await base;
      if (error) throw error;
      return (data as Note[]) ?? [];
    },
  });
}

function invalidateAllNotes(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: ['notes'] });
}

export function useCreateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => createNote(),
    onSuccess: (row) => {
      qc.setQueryData<Note[]>(qk.notes(''), (old) => [row, ...(old ?? [])]);
    },
  });
}

export function useUpdateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      patch,
    }: {
      id: string;
      patch: Parameters<typeof updateNote>[1];
    }) => updateNote(id, patch),
    onMutate: async ({ id, patch }) => {
      await qc.cancelQueries({ queryKey: ['notes'] });
      const caches = qc.getQueriesData<Note[]>({ queryKey: ['notes'] });
      caches.forEach(([key, list]) => {
        if (!list) return;
        qc.setQueryData<Note[]>(
          key,
          list.map((n) =>
            n.id === id
              ? { ...n, ...patch, updated_at: new Date().toISOString() }
              : n,
          ),
        );
      });
      return { caches };
    },
    onError: (_err, _vars, ctx) => {
      ctx?.caches.forEach(([key, list]) => qc.setQueryData(key, list));
    },
    onSuccess: (row) => {
      const caches = qc.getQueriesData<Note[]>({ queryKey: ['notes'] });
      caches.forEach(([key, list]) => {
        if (!list) return;
        qc.setQueryData<Note[]>(
          key,
          list.map((n) => (n.id === row.id ? row : n)),
        );
      });
    },
  });
}

export function useDeleteNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteNote,
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: ['notes'] });
      const caches = qc.getQueriesData<Note[]>({ queryKey: ['notes'] });
      caches.forEach(([key, list]) => {
        if (!list) return;
        qc.setQueryData<Note[]>(
          key,
          list.filter((n) => n.id !== id),
        );
      });
      return { caches };
    },
    onError: (_err, _id, ctx) => {
      ctx?.caches.forEach(([key, list]) => qc.setQueryData(key, list));
    },
    onSettled: () => invalidateAllNotes(qc),
  });
}
