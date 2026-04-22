'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createTask,
  deleteTask,
  toggleTask,
  updateTask,
} from '@/app/(app)/actions/tasks';
import { getSupabaseBrowser } from '@/lib/supabase/browser';
import { qk } from '@/lib/query-keys';
import type { Task, TaskTimeframe } from '@/lib/supabase/types';

export function useTasks(timeframe: TaskTimeframe, periodStart: string) {
  return useQuery({
    queryKey: qk.tasks(timeframe, periodStart),
    queryFn: async () => {
      const { data, error } = await getSupabaseBrowser()
        .from('tasks')
        .select('*')
        .eq('timeframe', timeframe)
        .eq('period_start', periodStart)
        .order('completed', { ascending: true })
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true });
      if (error) throw error;
      return (data as Task[]) ?? [];
    },
  });
}

export function useTasksInRange(
  timeframe: TaskTimeframe,
  fromYMD: string,
  toYMD: string,
) {
  return useQuery({
    queryKey: qk.tasksRange(timeframe, fromYMD, toYMD),
    queryFn: async () => {
      const { data, error } = await getSupabaseBrowser()
        .from('tasks')
        .select('*')
        .eq('timeframe', timeframe)
        .gte('period_start', fromYMD)
        .lte('period_start', toYMD)
        .order('period_start', { ascending: true })
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true });
      if (error) throw error;
      return (data as Task[]) ?? [];
    },
  });
}

export function useParentOptions(weekStart: string, monthStart: string) {
  return useQuery({
    queryKey: ['parent-options', weekStart, monthStart],
    queryFn: async () => {
      const { data, error } = await getSupabaseBrowser()
        .from('tasks')
        .select('id, title, timeframe')
        .in('timeframe', ['weekly', 'monthly'])
        .or(`period_start.eq.${weekStart},period_start.eq.${monthStart}`)
        .eq('completed', false)
        .order('timeframe', { ascending: true });
      if (error) throw error;
      return (data ?? []) as {
        id: string;
        title: string;
        timeframe: TaskTimeframe;
      }[];
    },
  });
}

export function useParentTitles(parentIds: string[]) {
  const ids = Array.from(new Set(parentIds)).sort();
  return useQuery({
    queryKey: ['parent-titles', ids],
    enabled: ids.length > 0,
    queryFn: async () => {
      const { data, error } = await getSupabaseBrowser()
        .from('tasks')
        .select('id, title')
        .in('id', ids);
      if (error) throw error;
      const map = new Map<string, string>();
      (data ?? []).forEach((p) => map.set(p.id, p.title));
      return map;
    },
  });
}

type Listish = readonly (string | number)[];

function invalidateTasks(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: ['tasks'] });
  qc.invalidateQueries({ queryKey: ['parent-options'] });
}

export function useCreateTask(queryKey: Listish) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onMutate: async (input) => {
      await qc.cancelQueries({ queryKey });
      const previous = qc.getQueryData<Task[]>(queryKey);
      const now = new Date().toISOString();
      const temp: Task = {
        id: `temp-${crypto.randomUUID()}`,
        user_id: 'pending',
        tag_id: input.tag_id ?? null,
        parent_id: input.parent_id ?? null,
        title: input.title,
        notes: input.notes ?? null,
        timeframe: input.timeframe,
        period_start: input.period_start,
        completed: false,
        completed_at: null,
        sort_order: 0,
        created_at: now,
        updated_at: now,
      };
      qc.setQueryData<Task[]>(queryKey, (old) => [...(old ?? []), temp]);
      return { previous, tempId: temp.id };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(queryKey, ctx.previous);
    },
    onSuccess: (row, _vars, ctx) => {
      qc.setQueryData<Task[]>(queryKey, (old) =>
        (old ?? []).map((t) => (t.id === ctx?.tempId ? row : t)),
      );
    },
    onSettled: () => invalidateTasks(qc),
  });
}

export function useToggleTask(queryKey: Listish) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      toggleTask(id, completed),
    onMutate: async ({ id, completed }) => {
      await qc.cancelQueries({ queryKey });
      const previous = qc.getQueryData<Task[]>(queryKey);
      qc.setQueryData<Task[]>(queryKey, (old) =>
        (old ?? []).map((t) =>
          t.id === id
            ? {
                ...t,
                completed,
                completed_at: completed ? new Date().toISOString() : null,
              }
            : t,
        ),
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(queryKey, ctx.previous);
    },
    onSettled: () => invalidateTasks(qc),
  });
}

export function useUpdateTask(queryKey: Listish) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      patch,
    }: {
      id: string;
      patch: Parameters<typeof updateTask>[1];
    }) => updateTask(id, patch),
    onMutate: async ({ id, patch }) => {
      await qc.cancelQueries({ queryKey });
      const previous = qc.getQueryData<Task[]>(queryKey);
      qc.setQueryData<Task[]>(queryKey, (old) =>
        (old ?? []).map((t) => (t.id === id ? { ...t, ...patch } : t)),
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(queryKey, ctx.previous);
    },
    onSettled: () => invalidateTasks(qc),
  });
}

export function useDeleteTask(queryKey: Listish) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteTask,
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey });
      const previous = qc.getQueryData<Task[]>(queryKey);
      qc.setQueryData<Task[]>(queryKey, (old) =>
        (old ?? []).filter((t) => t.id !== id),
      );
      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) qc.setQueryData(queryKey, ctx.previous);
    },
    onSettled: () => invalidateTasks(qc),
  });
}
