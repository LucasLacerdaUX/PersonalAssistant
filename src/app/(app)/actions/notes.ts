'use server';

import { getSupabaseServer } from '@/lib/supabase/server';
import type { Note } from '@/lib/supabase/types';

async function requireUser() {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  return { supabase, user };
}

export async function createNote(): Promise<Note> {
  const { supabase, user } = await requireUser();
  const { data, error } = await supabase
    .from('notes')
    .insert({ user_id: user.id, title: '', body: '' })
    .select('*')
    .single();
  if (error) throw error;
  return data as Note;
}

export async function updateNote(
  id: string,
  patch: { title?: string; body?: string; tag_id?: string | null },
): Promise<Note> {
  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from('notes')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data as Note;
}

export async function deleteNote(id: string): Promise<void> {
  const { supabase } = await requireUser();
  const { error } = await supabase.from('notes').delete().eq('id', id);
  if (error) throw error;
}
