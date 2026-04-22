'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import {
  useCreateTag,
  useDeleteTag,
  useTags,
  useUpdateTag,
} from '@/lib/hooks/use-tags';
import type { Tag } from '@/lib/supabase/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Garden palette — soft, cohesive accents that pair with the sage base.
const palette = [
  '#7aa487', // sage
  '#e8c06a', // butter
  '#d88a6a', // clay
  '#e69aa2', // rose
  '#8698c9', // periwinkle
  '#b08cc0', // lilac
  '#7fa9c2', // sky
  '#4f7c68', // moss
  '#c46d6d', // terracotta
  '#d9a27a', // apricot
  '#8fb285', // fern
  '#b39ad4', // wisteria
];

export function TagEditor() {
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(palette[0]);
  const tagsQuery = useTags();
  const tags = tagsQuery.data ?? [];
  const create = useCreateTag();
  const del = useDeleteTag();

  function addTag(e?: React.FormEvent) {
    e?.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) {
      setAdding(false);
      return;
    }
    create.mutate({ name: trimmed, color: newColor });
    setNewName('');
    setNewColor(palette[0]);
    setAdding(false);
  }

  function remove(id: string) {
    if (!confirm('Delete this tag? Items tagged with it will lose the tag.'))
      return;
    del.mutate(id);
  }

  return (
    <div className="space-y-3">
      <ul className="space-y-2">
        <AnimatePresence initial={false}>
          {tags.map((tag) => (
            <TagRow key={tag.id} tag={tag} onDelete={() => remove(tag.id)} />
          ))}
        </AnimatePresence>
      </ul>

      <AnimatePresence>
        {adding ? (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={addTag}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2 rounded-xl border border-border/60 p-2">
              <ColorSwatches value={newColor} onChange={setNewColor} />
              <Input
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="New tag name…"
                className="border-0 shadow-none focus-visible:ring-0"
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setAdding(false);
                    setNewName('');
                  }
                }}
              />
              <Button type="submit" size="sm">
                Add
              </Button>
            </div>
          </motion.form>
        ) : (
          <Button
            variant="outline"
            onClick={() => setAdding(true)}
            className="w-full"
          >
            <Plus className="size-4" /> New tag
          </Button>
        )}
      </AnimatePresence>
    </div>
  );
}

function TagRow({ tag, onDelete }: { tag: Tag; onDelete: () => void }) {
  const [name, setName] = useState(tag.name);
  const [color, setColor] = useState(tag.color);
  const update = useUpdateTag();

  function commitName() {
    const next = name.trim();
    if (!next || next === tag.name) {
      setName(tag.name);
      return;
    }
    update.mutate({ id: tag.id, patch: { name: next } });
  }

  function changeColor(c: string) {
    setColor(c);
    update.mutate({ id: tag.id, patch: { color: c } });
  }

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -8 }}
      className="flex items-center gap-2 rounded-xl border border-border/60 p-2"
    >
      <ColorSwatches value={color} onChange={changeColor} />
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={commitName}
        onKeyDown={(e) => {
          if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
        }}
        className="border-0 shadow-none focus-visible:ring-0"
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        className="size-8 text-muted-foreground hover:text-destructive"
        aria-label={`Delete ${tag.name}`}
      >
        <Trash2 className="size-4" />
      </Button>
    </motion.li>
  );
}

function ColorSwatches({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center">
      <button
        type="button"
        className="size-7 rounded-full grid place-items-center shrink-0"
        aria-label="Tag color"
      >
        <span
          className="size-5 rounded-full ring-1 ring-border"
          style={{ background: value }}
        />
      </button>
      <div className="flex items-center gap-0.5 pl-1">
        {palette.slice(0, 6).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onChange(c)}
            className="size-5 rounded-full ring-1 ring-border transition-transform hover:scale-110"
            style={{ background: c, outline: c === value ? '2px solid currentColor' : 'none', outlineOffset: 1 }}
            aria-label={`Set color ${c}`}
          />
        ))}
      </div>
    </div>
  );
}
