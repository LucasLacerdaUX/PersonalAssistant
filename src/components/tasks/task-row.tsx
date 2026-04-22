'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDeleteTask, useToggleTask } from '@/lib/hooks/use-tasks';
import type { Task, Tag } from '@/lib/supabase/types';
import { Button } from '@/components/ui/button';

type QueryKey = readonly (string | number)[];

export function TaskRow({
  task,
  tag,
  parentTitle,
  queryKey,
}: {
  task: Task;
  tag?: Tag | null;
  parentTitle?: string | null;
  queryKey: QueryKey;
}) {
  const toggle = useToggleTask(queryKey);
  const del = useDeleteTask(queryKey);

  const isTemp = task.id.startsWith('temp-');
  const completed = task.completed;

  function onToggle() {
    if (isTemp) return;
    toggle.mutate({ id: task.id, completed: !completed });
  }

  function onDelete() {
    if (isTemp) return;
    del.mutate(task.id);
  }

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'group relative flex items-start gap-3 rounded-2xl bg-card px-3.5 py-3 ring-1 ring-foreground/[0.06] shadow-[var(--shadow-paper)] transition-colors',
        completed && 'bg-muted/50 ring-transparent shadow-none',
        isTemp && 'opacity-70',
      )}
    >
      <button
        onClick={onToggle}
        disabled={isTemp}
        aria-label={completed ? 'Mark incomplete' : 'Mark complete'}
        className={cn(
          'relative mt-[1px] size-5 shrink-0 rounded-full transition-all grid place-items-center',
          completed
            ? 'bg-primary text-primary-foreground shadow-[0_2px_6px_color-mix(in_oklch,var(--primary)_40%,transparent)]'
            : 'ring-[1.5px] ring-muted-foreground/30 hover:ring-primary hover:ring-[2px]',
        )}
      >
        <AnimatePresence>
          {completed && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 600, damping: 25 }}
            >
              <Check className="size-3" strokeWidth={3} />
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'text-[14.5px] leading-snug',
            completed && 'line-through text-muted-foreground',
          )}
        >
          {task.title}
        </p>
        {(tag || parentTitle) && (
          <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px] text-muted-foreground">
            {tag && (
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="size-2 rounded-full"
                  style={{ background: tag.color }}
                />
                {tag.name}
              </span>
            )}
            {parentTitle && (
              <span className="inline-flex items-center gap-1">
                <span className="text-muted-foreground/50">↳</span>
                {parentTitle}
              </span>
            )}
          </div>
        )}
      </div>

      <Button
        onClick={onDelete}
        disabled={isTemp}
        size="icon"
        variant="ghost"
        className="opacity-0 group-hover:opacity-100 focus:opacity-100 size-8 text-muted-foreground hover:text-destructive"
        aria-label="Delete task"
      >
        <Trash2 className="size-4" />
      </Button>
    </motion.li>
  );
}
