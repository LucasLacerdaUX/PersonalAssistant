'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useCreateTask,
  useDeleteTask,
  useToggleTask,
} from '@/lib/hooks/use-tasks';
import type { Tag, Task } from '@/lib/supabase/types';
import { Input } from '@/components/ui/input';

type QueryKey = readonly (string | number)[];

export function MonthColumn({
  label,
  monthStart,
  tasks,
  tagById,
  tags,
  queryKey,
}: {
  label: string;
  monthStart: string;
  tasks: Task[];
  tagById: Map<string, Tag>;
  tags: Tag[];
  queryKey: QueryKey;
}) {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const create = useCreateTask(queryKey);

  function addTheme(e?: React.FormEvent) {
    e?.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setAdding(false);
      return;
    }
    create.mutate({
      title: trimmed,
      timeframe: 'monthly',
      period_start: monthStart,
    });
    setTitle('');
    setAdding(false);
  }

  return (
    <div className="rounded-3xl border border-border/60 bg-card p-4 min-h-32 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-serif text-lg leading-none">{label}</h3>
        <button
          onClick={() => setAdding(true)}
          aria-label={`Add theme for ${label}`}
          className="size-7 grid place-items-center rounded-full hover:bg-muted/60 transition-colors text-muted-foreground"
        >
          <Plus className="size-4" />
        </button>
      </div>

      <ul className="space-y-1.5 flex-1">
        <AnimatePresence initial={false}>
          {tasks.map((task) => (
            <MonthTaskRow
              key={task.id}
              task={task}
              tag={task.tag_id ? tagById.get(task.tag_id) : null}
              queryKey={queryKey}
            />
          ))}
        </AnimatePresence>

        {tasks.length === 0 && !adding && (
          <li className="text-xs text-muted-foreground italic pt-1">
            No themes yet.
          </li>
        )}
      </ul>

      <AnimatePresence>
        {adding && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={addTheme}
            className="mt-2 overflow-hidden"
          >
            <Input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => addTheme()}
              placeholder={`A theme for ${label}…`}
              className="h-9 text-sm rounded-xl"
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setTitle('');
                  setAdding(false);
                }
              }}
            />
          </motion.form>
        )}
      </AnimatePresence>

      {tags.length > 0 && tasks.length === 0 && !adding && (
        <button
          onClick={() => setAdding(true)}
          className="mt-3 w-full text-left text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-colors"
        >
          <Plus className="size-3" /> Add a theme
        </button>
      )}
    </div>
  );
}

function MonthTaskRow({
  task,
  tag,
  queryKey,
}: {
  task: Task;
  tag?: Tag | null;
  queryKey: QueryKey;
}) {
  const toggle = useToggleTask(queryKey);
  const del = useDeleteTask(queryKey);
  const isTemp = task.id.startsWith('temp-');
  const completed = task.completed;

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -6 }}
      className={cn('group flex items-start gap-2 text-sm', isTemp && 'opacity-70')}
    >
      <button
        onClick={() => !isTemp && toggle.mutate({ id: task.id, completed: !completed })}
        disabled={isTemp}
        aria-label={completed ? 'Mark incomplete' : 'Mark complete'}
        className={cn(
          'mt-0.5 size-4 shrink-0 rounded-full border-2 transition-colors grid place-items-center',
          completed
            ? 'bg-primary border-primary text-primary-foreground'
            : 'border-muted-foreground/40 hover:border-primary',
        )}
      >
        {completed && <Check className="size-2.5" strokeWidth={3} />}
      </button>
      <div className="flex-1 min-w-0">
        <p className={cn('leading-snug', completed && 'line-through text-muted-foreground')}>
          {task.title}
        </p>
        {tag && (
          <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
            <span className="size-1.5 rounded-full" style={{ background: tag.color }} />
            {tag.name}
          </span>
        )}
      </div>
      <button
        onClick={() => !isTemp && del.mutate(task.id)}
        disabled={isTemp}
        className="opacity-0 group-hover:opacity-100 text-[10px] text-muted-foreground hover:text-destructive"
      >
        ✕
      </button>
    </motion.li>
  );
}
