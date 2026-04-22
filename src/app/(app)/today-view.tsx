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
import { EmptyDoodle } from '@/components/shell/empty-doodle';

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

  const completed = tasks.filter((t) => t.completed).length;

  return (
    <div className="flex flex-col">
      <PageHeader
        eyebrow={isToday ? 'Today' : format(date, 'EEEE')}
        title={isToday ? greet() : format(date, 'MMMM d')}
        subtitle={isToday ? friendlyDate : format(date, 'yyyy')}
      />
      <DayNavigator selectedYMD={selected} />

      <section className="px-4 md:px-8 pb-20 md:pb-10 space-y-3 max-w-2xl w-full mx-auto md:mx-0">
        <TaskComposer
          timeframe="daily"
          periodStart={selected}
          tags={tags}
          parents={parentOptions}
          queryKey={queryKey}
          placeholder="What do you want to do today?"
        />

        {tasks.length > 0 && (
          <div className="flex items-center justify-between px-1 pt-1">
            <p className="text-[11.5px] text-muted-foreground tracking-tight">
              {completed} of {tasks.length} done
            </p>
            <Progress value={completed} total={tasks.length} />
          </div>
        )}

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

function greet() {
  const hour = new Date().getHours();
  if (hour < 5) return 'Still up?';
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Winding down';
}

function Progress({ value, total }: { value: number; total: number }) {
  const pct = total === 0 ? 0 : (value / total) * 100;
  return (
    <div className="h-1 w-24 rounded-full bg-muted overflow-hidden">
      <div
        className="h-full rounded-full bg-primary transition-[width] duration-500"
        style={{ width: `${pct}%` }}
      />
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
      <div className="rounded-2xl py-12 text-center paper-dots bg-muted/30">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }
  return (
    <div className="rounded-2xl py-12 px-6 text-center paper-dots bg-muted/30">
      <EmptyDoodle className="mx-auto mb-3 w-28 text-primary/70" />
      <p className="font-display text-[22px] tracking-[-0.02em] leading-tight">
        {isToday ? 'Nothing queued up.' : 'A quiet day.'}
      </p>
      <p className="text-[13px] text-muted-foreground mt-1.5 max-w-[30ch] mx-auto">
        {isToday
          ? 'Type above to capture the first thing on your mind.'
          : 'Either nothing was planned, or nothing made the cut.'}
      </p>
    </div>
  );
}
