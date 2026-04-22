'use client';

import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronRight, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTasks, useToggleTask } from '@/lib/hooks/use-tasks';
import { useTags } from '@/lib/hooks/use-tags';
import { todayYMD } from '@/lib/dates';
import { qk } from '@/lib/query-keys';

export function DailyGoalsCard() {
  const date = todayYMD();
  const { data: tasks = [] } = useTasks('daily', date);
  const { data: tags = [] } = useTags();
  const tagById = new Map(tags.map((t) => [t.id, t]));

  const queryKey = qk.tasks('daily', date);
  const toggle = useToggleTask(queryKey);
  const shouldReduce = useReducedMotion();

  const done = tasks.filter((t) => t.completed).length;
  const total = tasks.length;

  const preview = tasks.slice(0, 5);

  return (
    <section className="rounded-3xl bg-card ring-1 ring-foreground/[0.05] shadow-[var(--shadow-paper)] p-5">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-[17px] tracking-[-0.012em] font-medium">
            Daily goals
          </h2>
          <p className="text-[12px] text-muted-foreground mt-0.5 tabular-nums">
            {format(parseISO(date), 'EEEE, MMMM d')}
          </p>
        </div>
        <span
          className="text-[11px] font-medium rounded-full px-2.5 py-1 tabular-nums"
          style={{
            background: 'var(--chip-sage)',
            color: 'var(--chip-sage-ink)',
          }}
        >
          {done} / {total || 0}
        </span>
      </header>

      {preview.length === 0 ? (
        <p className="mt-4 text-[13px] text-muted-foreground bg-muted/40 rounded-xl py-6 text-center">
          Nothing queued up — open Today to capture something.
        </p>
      ) : (
        <ul className="mt-3 space-y-1">
          <AnimatePresence initial={false}>
            {preview.map((task) => {
              const tag = task.tag_id ? tagById.get(task.tag_id) : null;
              return (
                <motion.li
                  key={task.id}
                  layout={!shouldReduce}
                  className="group flex items-center gap-2.5 py-1.5 pl-1 pr-2 rounded-lg [@media(hover:hover)]:hover:bg-muted/50 transition-colors duration-150"
                >
                  <button
                    type="button"
                    aria-label={task.completed ? 'Mark undone' : 'Mark done'}
                    onClick={() =>
                      toggle.mutate({
                        id: task.id,
                        completed: !task.completed,
                      })
                    }
                    className={cn(
                      'relative shrink-0 size-[18px] rounded-full ring-1 transition-colors duration-150 grid place-items-center',
                      '[touch-action:manipulation]',
                      task.completed
                        ? 'bg-primary ring-primary text-primary-foreground'
                        : 'bg-transparent ring-foreground/20 [@media(hover:hover)]:hover:ring-foreground/40',
                    )}
                  >
                    {task.completed && (
                      <motion.svg
                        initial={shouldReduce ? false : { scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', duration: 0.28, bounce: 0.35 }}
                        viewBox="0 0 12 12"
                        className="size-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M2.5 6.2 L 5 8.5 L 9.5 3.5" />
                      </motion.svg>
                    )}
                  </button>

                  <span
                    className={cn(
                      'flex-1 text-[14px] truncate tracking-[-0.005em] transition-colors duration-150',
                      task.completed && 'text-muted-foreground line-through',
                    )}
                  >
                    {task.title}
                  </span>

                  {tag && (
                    <span
                      className="inline-flex items-center gap-1 text-[11px] text-muted-foreground shrink-0"
                      title={tag.name}
                    >
                      <span
                        className="size-2 rounded-full"
                        style={{ background: tag.color }}
                      />
                      <span className="hidden sm:inline">{tag.name}</span>
                    </span>
                  )}
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}

      <Link
        href="/today"
        className="mt-4 flex items-center justify-between gap-2 rounded-2xl bg-muted/50 px-3.5 py-2.5 text-[12.5px] text-foreground/80 [@media(hover:hover)]:hover:bg-muted transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <span className="inline-flex items-center gap-1.5">
          <Leaf className="size-3.5 text-primary" strokeWidth={2} />
          {total > 0
            ? done === total
              ? 'All done. Rest well.'
              : `${total - done} left. You've got this.`
            : 'A clean slate. Plant something.'}
        </span>
        <ChevronRight className="size-4 text-muted-foreground" />
      </Link>
    </section>
  );
}
