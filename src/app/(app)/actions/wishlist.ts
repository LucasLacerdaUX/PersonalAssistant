'use server';

import { getSupabaseServer } from '@/lib/supabase/server';
import type { WishlistItem, WishlistKind, WishlistList } from '@/lib/supabase/types';
import { fetchOpenGraph } from '@/lib/og';

async function requireUser() {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  return { supabase, user };
}

export async function createList(name: string): Promise<WishlistList> {
  const { supabase, user } = await requireUser();
  const { data, error } = await supabase
    .from('wishlist_lists')
    .insert({ user_id: user.id, name: name.trim() || 'Untitled list' })
    .select('*')
    .single();
  if (error) throw error;
  return data as WishlistList;
}

export async function renameList(id: string, name: string): Promise<void> {
  const { supabase } = await requireUser();
  const { error } = await supabase
    .from('wishlist_lists')
    .update({ name: name.trim() || 'Untitled list' })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteList(id: string): Promise<void> {
  const { supabase } = await requireUser();
  const { error } = await supabase.from('wishlist_lists').delete().eq('id', id);
  if (error) throw error;
}

export async function previewFromUrl(
  productUrl: string,
): Promise<{ title: string | null; image: string | null }> {
  if (!productUrl) return { title: null, image: null };
  return fetchOpenGraph(productUrl);
}

export async function createItem(input: {
  list_id: string;
  name: string;
  kind: WishlistKind;
  price_amount?: number | null;
  price_currency?: string | null;
  target_price?: number | null;
  product_url?: string | null;
  image_url?: string | null;
  notes?: string | null;
  tag_id?: string | null;
  auto_og?: boolean;
}): Promise<WishlistItem> {
  const { supabase, user } = await requireUser();

  let image_url = input.image_url ?? null;
  let name = input.name.trim();

  if (input.auto_og && input.product_url && (!image_url || !name)) {
    const og = await fetchOpenGraph(input.product_url);
    if (!image_url && og.image) image_url = og.image;
    if (!name && og.title) name = og.title;
  }

  if (!name) name = 'Untitled item';

  const { data, error } = await supabase
    .from('wishlist_items')
    .insert({
      user_id: user.id,
      list_id: input.list_id,
      name,
      kind: input.kind,
      price_amount: input.price_amount ?? null,
      price_currency: input.price_currency ?? null,
      target_price: input.target_price ?? null,
      product_url: input.product_url ?? null,
      image_url,
      notes: input.notes ?? null,
      tag_id: input.tag_id ?? null,
    })
    .select('*')
    .single();
  if (error) throw error;
  return data as WishlistItem;
}

export async function updateItem(
  id: string,
  patch: Partial<{
    name: string;
    kind: WishlistKind;
    price_amount: number | null;
    price_currency: string | null;
    target_price: number | null;
    product_url: string | null;
    image_url: string | null;
    notes: string | null;
    tag_id: string | null;
    list_id: string;
  }>,
): Promise<WishlistItem> {
  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from('wishlist_items')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data as WishlistItem;
}

export async function toggleAcquired(
  id: string,
  acquired: boolean,
): Promise<WishlistItem> {
  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from('wishlist_items')
    .update({ acquired })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data as WishlistItem;
}

export async function deleteItem(id: string): Promise<void> {
  const { supabase } = await requireUser();
  const { error } = await supabase.from('wishlist_items').delete().eq('id', id);
  if (error) throw error;
}
