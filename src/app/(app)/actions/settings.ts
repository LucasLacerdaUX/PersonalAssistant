'use server';

import { getSupabaseServer } from '@/lib/supabase/server';
import type { Tag } from '@/lib/supabase/types';

async function requireUser() {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  return { supabase, user };
}

export async function createTag(name: string, color: string): Promise<Tag> {
  const { supabase, user } = await requireUser();
  const { data, error } = await supabase
    .from('tags')
    .insert({ user_id: user.id, name: name.trim(), color })
    .select('*')
    .single();
  if (error) throw error;
  return data as Tag;
}

export async function updateTag(
  id: string,
  patch: { name?: string; color?: string },
): Promise<Tag> {
  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from('tags')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data as Tag;
}

export async function deleteTag(id: string) {
  const { supabase } = await requireUser();
  const { error } = await supabase.from('tags').delete().eq('id', id);
  if (error) throw error;
}

export async function updateDisplayCurrency(currency: string) {
  const { supabase, user } = await requireUser();
  const { error } = await supabase
    .from('profiles')
    .upsert({ id: user.id, display_currency: currency });
  if (error) throw error;
}
