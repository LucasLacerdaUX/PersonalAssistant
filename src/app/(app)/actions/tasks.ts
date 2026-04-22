'use server';

import { getSupabaseServer } from '@/lib/supabase/server';
import type { Task, TaskTimeframe } from '@/lib/supabase/types';

async function requireUser() {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  return { supabase, user };
}

export async function createTask(input: {
  title: string;
  timeframe: TaskTimeframe;
  period_start: string;
  tag_id?: string | null;
  parent_id?: string | null;
  notes?: string | null;
}): Promise<Task> {
  const { supabase, user } = await requireUser();
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      user_id: user.id,
      title: input.title.trim(),
      timeframe: input.timeframe,
      period_start: input.period_start,
      tag_id: input.tag_id ?? null,
      parent_id: input.parent_id ?? null,
      notes: input.notes ?? null,
    })
    .select('*')
    .single();
  if (error) throw error;
  return data as Task;
}

export async function toggleTask(id: string, completed: boolean): Promise<Task> {
  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from('tasks')
    .update({
      completed,
      completed_at: completed ? new Date().toISOString() : null,
    })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data as Task;
}

export async function updateTask(
  id: string,
  patch: Partial<{
    title: string;
    notes: string | null;
    tag_id: string | null;
    parent_id: string | null;
    period_start: string;
  }>,
): Promise<Task> {
  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from('tasks')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data as Task;
}

export async function deleteTask(id: string): Promise<void> {
  const { supabase } = await requireUser();
  const { error } = await supabase.from('tasks').delete().eq('id', id);
  if (error) throw error;
}
