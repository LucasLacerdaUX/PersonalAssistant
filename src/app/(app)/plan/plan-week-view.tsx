'use client';

import { useMemo } from 'react';
import { addDays, format, parseISO, startOfMonth } from 'date-fns';
import Link from 'next/link';
import { AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TaskRow } from '@/components/tasks/task-row';
import { TaskComposer } from '@/components/tasks/task-composer';
import { toYMD, weekStartYMD } from '@/lib/dates';
import { qk } from '@/lib/query-keys';
import { useTasks } from '@/lib/hooks/use-tasks';
import { useTags } from '@/lib/hooks/use-tags';
import { useQuery } from '@tanstack/react-query';
import { getSupabaseBrowser } from '@/lib/supabase/browser';
import type { TaskTimeframe } from '@/lib/supabase/types';

export function PlanWeekView({ selectedFromUrl }: { selectedFromUrl?: string }) {
  const selected = selectedFromUrl || weekStartYMD();
  const weekStart = parseISO(selected);
  const weekEnd = addDays(weekStart, 6);
  const monthStart = toYMD(startOfMonth(weekStart));

  const tasksQuery = useTasks('weekly', selected);
  const tagsQuery = useTags();
  const monthParentsQuery = useQuery({
    queryKey: ['monthly-parents', monthStart],
    queryFn: async () => {
      const { data, error } = await getSupabaseBrowser()
        .from('tasks')
        .select('id, title, timeframe')
        .eq('timeframe', 'monthly')
        .eq('period_start', monthStart)
        .eq('completed', false);
      if (error) throw error;
      return (data ?? []) as {
        id: string;
        title: string;
        timeframe: TaskTimeframe;
      }[];
    },
  });

  const tasks = tasksQuery.data ?? [];
  const tags = tagsQuery.data ?? [];
  const parentOptions = monthParentsQuery.data ?? [];

  const tagById = useMemo(
    () => new Map(tags.map((t) => [t.id, t])),
    [tags],
  );

  const prev = toYMD(addDays(weekStart, -7));
  const next = toYMD(addDays(weekStart, 7));
  const queryKey = qk.tasks('weekly', selected);

  return (
    <div className="px-4 md:px-8 pb-8 max-w-2xl w-full mx-auto md:mx-0 space-y-4">
      <div className="flex items-center justify-between">
        <Link
          href={{ pathname: '/plan', query: { w: prev } }}
          className="size-9 grid place-items-center rounded-full border border-border/60 hover:bg-muted/60 transition-colors"
          aria-label="Previous week"
        >
          <ChevronLeft className="size-4" />
        </Link>
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
            Week of
          </p>
          <p className="font-serif text-xl">
            {format(weekStart, 'MMM d')} – {format(weekEnd, 'MMM d')}
          </p>
        </div>
        <Link
          href={{ pathname: '/plan', query: { w: next } }}
          className="size-9 grid place-items-center rounded-full border border-border/60 hover:bg-muted/60 transition-colors"
          aria-label="Next week"
        >
          <ChevronRight className="size-4" />
        </Link>
      </div>

      <TaskComposer
        timeframe="weekly"
        periodStart={selected}
        tags={tags}
        parents={parentOptions}
        queryKey={queryKey}
        placeholder="A focus for this week…"
      />

      {tasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 py-10 text-center dot-grid">
          <p className="font-serif text-lg">
            {tasksQuery.isLoading ? 'Loading…' : 'Nothing yet for this week.'}
          </p>
          {!tasksQuery.isLoading && (
            <p className="text-sm text-muted-foreground mt-1">
              Add one or two big things you want to land before Sunday.
            </p>
          )}
        </div>
      ) : (
        <ul className="space-y-2">
          <AnimatePresence initial={false}>
            {tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                tag={task.tag_id ? tagById.get(task.tag_id) : null}
                queryKey={queryKey}
              />
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
