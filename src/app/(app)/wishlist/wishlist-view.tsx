'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useCreateList,
  useDeleteList,
  useWishlistItems,
  useWishlistLists,
} from '@/lib/hooks/use-wishlist';
import { useTags } from '@/lib/hooks/use-tags';
import type { WishlistItem } from '@/lib/supabase/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ItemCard } from './item-card';
import { ItemDialog } from './item-dialog';

export function WishlistView({ listParam }: { listParam?: string }) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<WishlistItem | null>(null);

  const listsQuery = useWishlistLists();
  const tagsQuery = useTags();
  const lists = listsQuery.data ?? [];
  const tags = tagsQuery.data ?? [];

  const activeList = lists.find((l) => l.id === listParam) ?? lists[0];
  const activeListId = activeList?.id ?? null;
  const itemsQuery = useWishlistItems(activeListId);
  const items = itemsQuery.data ?? [];

  const createList = useCreateList();
  const deleteList = useDeleteList();

  const tagById = new Map(tags.map((t) => [t.id, t]));
  const unacquired = items.filter((i) => !i.acquired);
  const acquired = items.filter((i) => i.acquired);

  if (listsQuery.isLoading) {
    return <div className="px-4 md:px-8 pb-8 text-sm text-muted-foreground">Loading…</div>;
  }

  if (!activeList) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">
          No lists yet. Refresh once to bootstrap your default list.
        </p>
      </div>
    );
  }

  function addList(e?: React.FormEvent) {
    e?.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) {
      setCreating(false);
      return;
    }
    createList.mutate(trimmed, {
      onSuccess: (row) => {
        setNewName('');
        setCreating(false);
        router.push(`/wishlist?list=${row.id}`);
      },
    });
  }

  function removeList(id: string) {
    if (!confirm('Delete this list and all its items?')) return;
    deleteList.mutate(id, {
      onSuccess: () => router.push('/wishlist'),
    });
  }

  function openNewItem() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEditItem(item: WishlistItem) {
    setEditing(item);
    setDialogOpen(true);
  }

  return (
    <div className="px-4 md:px-8 pb-8 space-y-5">
      <div className="flex items-center gap-2 overflow-x-auto -mx-1 px-1 pb-1">
        {lists.map((list) => {
          const active = list.id === activeList.id;
          return (
            <button
              key={list.id}
              onClick={() => router.push(`/wishlist?list=${list.id}`)}
              className={cn(
                'relative shrink-0 rounded-full border border-border/60 px-3.5 py-1.5 text-sm transition-colors',
                active
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'hover:bg-muted/60',
              )}
            >
              {list.name}
            </button>
          );
        })}
        <AnimatePresence initial={false}>
          {creating ? (
            <motion.form
              key="new-list-form"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              onSubmit={addList}
              className="flex items-center gap-1"
            >
              <Input
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onBlur={() => addList()}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setNewName('');
                    setCreating(false);
                  }
                }}
                placeholder="List name…"
                className="h-9 w-40 rounded-full"
              />
            </motion.form>
          ) : (
            <button
              onClick={() => setCreating(true)}
              className="shrink-0 inline-flex items-center gap-1 rounded-full border border-dashed border-border/60 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            >
              <Plus className="size-3.5" /> New list
            </button>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {unacquired.length} item{unacquired.length === 1 ? '' : 's'}
          {acquired.length > 0 ? ` · ${acquired.length} acquired` : ''}
        </p>
        <div className="flex items-center gap-2">
          {lists.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-destructive"
              onClick={() => removeList(activeList.id)}
            >
              <X className="size-4" /> Delete list
            </Button>
          )}
          <Button onClick={openNewItem} className="rounded-full">
            <Plus className="size-4" /> Add item
          </Button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 py-16 text-center dot-grid">
          <p className="font-serif text-xl">
            {itemsQuery.isLoading ? 'Loading…' : 'Nothing in this list yet.'}
          </p>
          {!itemsQuery.isLoading && (
            <>
              <p className="text-sm text-muted-foreground mt-1">
                Add an item — paste a product URL and we&apos;ll grab the image for you.
              </p>
              <Button onClick={openNewItem} className="mt-4">
                <Plus className="size-4" /> Add your first item
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {unacquired.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              tag={item.tag_id ? tagById.get(item.tag_id) : null}
              listId={activeList.id}
              onEdit={() => openEditItem(item)}
            />
          ))}
        </div>
      )}

      {acquired.length > 0 && (
        <section className="space-y-3 pt-4 border-t border-border/60">
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Check className="size-3.5" /> Acquired
          </p>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {acquired.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                tag={item.tag_id ? tagById.get(item.tag_id) : null}
                listId={activeList.id}
                onEdit={() => openEditItem(item)}
              />
            ))}
          </div>
        </section>
      )}

      <ItemDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        listId={activeList.id}
        tags={tags}
        editing={editing}
      />
    </div>
  );
}
