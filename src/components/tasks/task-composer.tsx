'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCreateTask } from '@/lib/hooks/use-tasks';
import type { TaskTimeframe, Tag } from '@/lib/supabase/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type ParentOption = { id: string; title: string; timeframe: TaskTimeframe };
type QueryKey = readonly (string | number)[];

export function TaskComposer({
  timeframe,
  periodStart,
  tags,
  parents,
  queryKey,
  placeholder,
}: {
  timeframe: TaskTimeframe;
  periodStart: string;
  tags: Tag[];
  parents?: ParentOption[];
  queryKey: QueryKey;
  placeholder?: string;
}) {
  const [title, setTitle] = useState('');
  const [tagId, setTagId] = useState<string | null>(null);
  const [parentId, setParentId] = useState<string | null>(null);
  const create = useCreateTask(queryKey);

  const activeTag = tags.find((t) => t.id === tagId) ?? null;
  const activeParent = parents?.find((p) => p.id === parentId) ?? null;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    create.mutate({
      title: trimmed,
      timeframe,
      period_start: periodStart,
      tag_id: tagId,
      parent_id: parentId,
    });
    setTitle('');
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-2 rounded-2xl bg-card p-2 ring-1 ring-foreground/[0.07] shadow-[var(--shadow-paper)] focus-within:ring-primary/40 focus-within:shadow-[var(--shadow-float)] transition-all"
    >
      <div className="flex items-center gap-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={placeholder ?? 'What needs to get done?'}
          className="border-0 shadow-none focus-visible:ring-0 text-[15px] bg-transparent"
        />
        <Button
          type="submit"
          size="icon"
          className="size-9 rounded-full shrink-0"
          disabled={!title.trim()}
          aria-label="Add task"
        >
          <Plus className="size-4" />
        </Button>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap px-1">
        <TagPicker tags={tags} activeTag={activeTag} onChange={setTagId} />
        {parents && parents.length > 0 && (
          <ParentPicker
            parents={parents}
            activeParent={activeParent}
            onChange={setParentId}
          />
        )}
      </div>
    </form>
  );
}

function TagPicker({
  tags,
  activeTag,
  onChange,
}: {
  tags: Tag[];
  activeTag: Tag | null;
  onChange: (id: string | null) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          'inline-flex items-center gap-1.5 text-[11.5px] rounded-full px-2.5 py-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors bg-transparent',
          activeTag && 'bg-muted text-foreground',
        )}
      >
        {activeTag ? (
          <>
            <span
              className="size-2 rounded-full"
              style={{ background: activeTag.color }}
            />
            {activeTag.name}
          </>
        ) : (
          <span>+ tag</span>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-56 p-1" align="start">
        <button
          type="button"
          onClick={() => onChange(null)}
          className="w-full text-left text-sm rounded-md px-2 py-1.5 hover:bg-muted text-muted-foreground"
        >
          No tag
        </button>
        {tags.map((tag) => (
          <button
            key={tag.id}
            type="button"
            onClick={() => onChange(tag.id)}
            className="w-full text-left text-sm rounded-md px-2 py-1.5 hover:bg-muted inline-flex items-center gap-2"
          >
            <span
              className="size-2.5 rounded-full"
              style={{ background: tag.color }}
            />
            {tag.name}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}

function ParentPicker({
  parents,
  activeParent,
  onChange,
}: {
  parents: ParentOption[];
  activeParent: ParentOption | null;
  onChange: (id: string | null) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          'inline-flex items-center gap-1.5 text-[11.5px] rounded-full px-2.5 py-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors bg-transparent',
          activeParent && 'bg-muted text-foreground',
        )}
      >
        {activeParent ? (
          <>
            <span className="text-muted-foreground">↳</span>
            <span className="truncate max-w-[14ch]">
              {activeParent.title}
            </span>
          </>
        ) : (
          <span>+ parent goal</span>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-64 p-1" align="start">
        <button
          type="button"
          onClick={() => onChange(null)}
          className="w-full text-left text-sm rounded-md px-2 py-1.5 hover:bg-muted text-muted-foreground"
        >
          No parent
        </button>
        {parents.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onChange(p.id)}
            className="w-full text-left text-sm rounded-md px-2 py-1.5 hover:bg-muted"
          >
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground mr-1.5">
              {p.timeframe}
            </span>
            {p.title}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}

export type { ParentOption };
