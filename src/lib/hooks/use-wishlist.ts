'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createItem,
  createList,
  deleteItem,
  deleteList,
  toggleAcquired,
  updateItem,
} from '@/app/(app)/actions/wishlist';
import { getSupabaseBrowser } from '@/lib/supabase/browser';
import { qk } from '@/lib/query-keys';
import type { WishlistItem, WishlistList } from '@/lib/supabase/types';

export function useWishlistLists() {
  return useQuery({
    queryKey: qk.wishlistLists,
    queryFn: async () => {
      const { data, error } = await getSupabaseBrowser()
        .from('wishlist_lists')
        .select('*')
        .order('created_at', { ascending: true });
      if (error) throw error;
      return (data as WishlistList[]) ?? [];
    },
  });
}

export function useWishlistItems(listId: string | null) {
  return useQuery({
    queryKey: qk.wishlistItems(listId ?? ''),
    enabled: !!listId,
    queryFn: async () => {
      const { data, error } = await getSupabaseBrowser()
        .from('wishlist_items')
        .select('*')
        .eq('list_id', listId!)
        .order('acquired', { ascending: true })
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data as WishlistItem[]) ?? [];
    },
  });
}

export function useCreateList() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => createList(name),
    onSuccess: (newList) => {
      qc.setQueryData<WishlistList[]>(qk.wishlistLists, (old) => [
        ...(old ?? []),
        newList,
      ]);
    },
  });
}

export function useDeleteList() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteList(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: qk.wishlistLists });
      const previous = qc.getQueryData<WishlistList[]>(qk.wishlistLists);
      qc.setQueryData<WishlistList[]>(qk.wishlistLists, (old) =>
        (old ?? []).filter((l) => l.id !== id),
      );
      qc.removeQueries({ queryKey: qk.wishlistItems(id) });
      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) qc.setQueryData(qk.wishlistLists, ctx.previous);
    },
  });
}

export function useCreateItem(listId: string) {
  const qc = useQueryClient();
  const key = qk.wishlistItems(listId);
  return useMutation({
    mutationFn: createItem,
    onMutate: async (input) => {
      await qc.cancelQueries({ queryKey: key });
      const previous = qc.getQueryData<WishlistItem[]>(key);
      const now = new Date().toISOString();
      const temp: WishlistItem = {
        id: `temp-${crypto.randomUUID()}`,
        user_id: 'pending',
        list_id: input.list_id,
        tag_id: input.tag_id ?? null,
        name: input.name || 'Untitled item',
        kind: input.kind,
        price_amount: input.price_amount ?? null,
        price_currency: input.price_currency ?? null,
        target_price: input.target_price ?? null,
        product_url: input.product_url ?? null,
        image_url: input.image_url ?? null,
        notes: input.notes ?? null,
        acquired: false,
        created_at: now,
        updated_at: now,
      };
      qc.setQueryData<WishlistItem[]>(key, (old) => [temp, ...(old ?? [])]);
      return { previous, tempId: temp.id };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(key, ctx.previous);
    },
    onSuccess: (row, _vars, ctx) => {
      qc.setQueryData<WishlistItem[]>(key, (old) =>
        (old ?? []).map((i) => (i.id === ctx?.tempId ? row : i)),
      );
    },
  });
}

export function useUpdateItem(listId: string) {
  const qc = useQueryClient();
  const key = qk.wishlistItems(listId);
  return useMutation({
    mutationFn: ({
      id,
      patch,
    }: {
      id: string;
      patch: Parameters<typeof updateItem>[1];
    }) => updateItem(id, patch),
    onMutate: async ({ id, patch }) => {
      await qc.cancelQueries({ queryKey: key });
      const previous = qc.getQueryData<WishlistItem[]>(key);
      qc.setQueryData<WishlistItem[]>(key, (old) =>
        (old ?? []).map((i) => (i.id === id ? { ...i, ...patch } : i)),
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(key, ctx.previous);
    },
    onSuccess: (row) => {
      qc.setQueryData<WishlistItem[]>(key, (old) =>
        (old ?? []).map((i) => (i.id === row.id ? row : i)),
      );
    },
  });
}

export function useToggleAcquired(listId: string) {
  const qc = useQueryClient();
  const key = qk.wishlistItems(listId);
  return useMutation({
    mutationFn: ({ id, acquired }: { id: string; acquired: boolean }) =>
      toggleAcquired(id, acquired),
    onMutate: async ({ id, acquired }) => {
      await qc.cancelQueries({ queryKey: key });
      const previous = qc.getQueryData<WishlistItem[]>(key);
      qc.setQueryData<WishlistItem[]>(key, (old) =>
        (old ?? []).map((i) => (i.id === id ? { ...i, acquired } : i)),
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(key, ctx.previous);
    },
  });
}

export function useDeleteItem(listId: string) {
  const qc = useQueryClient();
  const key = qk.wishlistItems(listId);
  return useMutation({
    mutationFn: deleteItem,
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: key });
      const previous = qc.getQueryData<WishlistItem[]>(key);
      qc.setQueryData<WishlistItem[]>(key, (old) =>
        (old ?? []).filter((i) => i.id !== id),
      );
      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) qc.setQueryData(key, ctx.previous);
    },
  });
}
