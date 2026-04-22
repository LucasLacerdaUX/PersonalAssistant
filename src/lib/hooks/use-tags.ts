'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getSupabaseBrowser } from '@/lib/supabase/browser';
import { qk } from '@/lib/query-keys';
import {
  createTag as createTagAction,
  deleteTag as deleteTagAction,
  updateTag as updateTagAction,
} from '@/app/(app)/actions/settings';
import type { Tag } from '@/lib/supabase/types';

export function useTags() {
  return useQuery({
    queryKey: qk.tags,
    queryFn: async () => {
      const { data, error } = await getSupabaseBrowser()
        .from('tags')
        .select('*')
        .order('created_at', { ascending: true });
      if (error) throw error;
      return (data as Tag[]) ?? [];
    },
    staleTime: 60_000,
  });
}

export function useCreateTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ name, color }: { name: string; color: string }) =>
      createTagAction(name, color),
    onSuccess: (row) => {
      qc.setQueryData<Tag[]>(qk.tags, (old) => [...(old ?? []), row]);
    },
  });
}

export function useUpdateTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      patch,
    }: {
      id: string;
      patch: { name?: string; color?: string };
    }) => updateTagAction(id, patch),
    onMutate: async ({ id, patch }) => {
      await qc.cancelQueries({ queryKey: qk.tags });
      const previous = qc.getQueryData<Tag[]>(qk.tags);
      qc.setQueryData<Tag[]>(qk.tags, (old) =>
        (old ?? []).map((t) => (t.id === id ? { ...t, ...patch } : t)),
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(qk.tags, ctx.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: qk.tags }),
  });
}

export function useDeleteTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTagAction(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: qk.tags });
      const previous = qc.getQueryData<Tag[]>(qk.tags);
      qc.setQueryData<Tag[]>(qk.tags, (old) =>
        (old ?? []).filter((t) => t.id !== id),
      );
      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) qc.setQueryData(qk.tags, ctx.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: qk.tags }),
  });
}
