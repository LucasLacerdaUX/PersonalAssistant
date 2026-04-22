'use client';

import { useMemo } from 'react';
import { format, parseISO, startOfWeek, startOfMonth } from 'date-fns';
import { AnimatePresence } from 'framer-motion';
import { PageHeader } from '@/components/page-header';
import { DayNavigator } from '@/components/tasks/day-navigator';
import { TaskRow } from '@/components/tasks/task-row';
import { TaskComposer } from '@/components/tasks/task-composer';
import { todayYMD, toYMD } from '@/lib/dates';
import { qk } from '@/lib/query-keys';
import {
  useParentOptions,
  useParentTitles,
  useTasks,
} from '@/lib/hooks/use-tasks';
import { useTags } from '@/lib/hooks/use-tags';

export function TodayView({ selectedFromUrl }: { selectedFromUrl?: string }) {
  const selected = selectedFromUrl || todayYMD();
  const date = parseISO(selected);
  const weekStart = toYMD(startOfWeek(date, { weekStartsOn: 1 }));
  const monthStart = toYMD(startOfMonth(date));

  const tasksQuery = useTasks('daily', selected);
  const tagsQuery = useTags();
  const parentOptionsQuery = useParentOptions(weekStart, monthStart);

  const tasks = tasksQuery.data ?? [];
  const tags = tagsQuery.data ?? [];
  const parentOptions = parentOptionsQuery.data ?? [];

  const parentIds = useMemo(
    () => tasks.map((t) => t.parent_id).filter((x): x is string => !!x),
    [tasks],
  );
  const parentTitlesQuery = useParentTitles(parentIds);
  const parentTitleById = parentTitlesQuery.data ?? new Map<string, string>();

  const tagById = useMemo(
    () => new Map(tags.map((t) => [t.id, t])),
    [tags],
  );

  const friendlyDate = format(date, 'EEEE, MMMM d');
  const isToday = selected === todayYMD();
  const queryKey = qk.tasks('daily', selected);

  return (
    <div className="flex flex-col">
      <PageHeader
        title={isToday ? 'Today' : friendlyDate}
        subtitle={isToday ? friendlyDate : undefined}
      />
      <DayNavigator selectedYMD={selected} />

      <section className="px-4 md:px-8 pb-8 space-y-3 max-w-2xl w-full mx-auto md:mx-0">
        <TaskComposer
          timeframe="daily"
          periodStart={selected}
          tags={tags}
          parents={parentOptions}
          queryKey={queryKey}
          placeholder="What do you want to do today?"
        />

        {tasks.length === 0 ? (
          <EmptyState isToday={isToday} loading={tasksQuery.isLoading} />
        ) : (
          <ul className="space-y-2">
            <AnimatePresence initial={false}>
              {tasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  tag={task.tag_id ? tagById.get(task.tag_id) : null}
                  parentTitle={
                    task.parent_id ? parentTitleById.get(task.parent_id) : null
                  }
                  queryKey={queryKey}
                />
              ))}
            </AnimatePresence>
          </ul>
        )}
      </section>
    </div>
  );
}

function EmptyState({
  isToday,
  loading,
}: {
  isToday: boolean;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-dashed border-border/60 py-10 text-center dot-grid">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-dashed border-border/60 py-10 text-center dot-grid">
      <p className="font-serif text-lg">
        {isToday ? 'Nothing queued up.' : 'Nothing here.'}
      </p>
      <p className="text-sm text-muted-foreground mt-1">
        {isToday
          ? 'Type above to capture your first task of the day.'
          : 'Either it was a quiet day, or nothing was planned.'}
      </p>
    </div>
  );
}
