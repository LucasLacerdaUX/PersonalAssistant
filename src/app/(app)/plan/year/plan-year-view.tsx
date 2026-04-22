'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { monthStartsOfYear } from '@/lib/dates';
import { MonthColumn } from './month-column';
import { qk } from '@/lib/query-keys';
import { useTasksInRange } from '@/lib/hooks/use-tasks';
import { useTags } from '@/lib/hooks/use-tags';
import type { Task } from '@/lib/supabase/types';

export function PlanYearView({ year }: { year: number }) {
  const from = `${year}-01-01`;
  const to = `${year}-12-01`;
  const tasksQuery = useTasksInRange('monthly', from, to);
  const tagsQuery = useTags();

  const tasks = tasksQuery.data ?? [];
  const tags = tagsQuery.data ?? [];

  const tagById = useMemo(
    () => new Map(tags.map((t) => [t.id, t])),
    [tags],
  );

  const tasksByMonth = useMemo(() => {
    const map = new Map<string, Task[]>();
    for (const t of tasks) {
      const arr = map.get(t.period_start) ?? [];
      arr.push(t);
      map.set(t.period_start, arr);
    }
    return map;
  }, [tasks]);

  const months = monthStartsOfYear(year);
  const yearQueryKey = qk.tasksRange('monthly', from, to);

  return (
    <div className="px-4 md:px-8 pb-8">
      <div className="flex items-center justify-between mb-4 md:mb-6 max-w-6xl mx-auto md:mx-0">
        <Link
          href={{ pathname: '/plan/year', query: { y: year - 1 } }}
          className="size-9 grid place-items-center rounded-full border border-border/60 hover:bg-muted/60 transition-colors"
          aria-label="Previous year"
        >
          <ChevronLeft className="size-4" />
        </Link>
        <p className="font-serif text-2xl">{year}</p>
        <Link
          href={{ pathname: '/plan/year', query: { y: year + 1 } }}
          className="size-9 grid place-items-center rounded-full border border-border/60 hover:bg-muted/60 transition-colors"
          aria-label="Next year"
        >
          <ChevronRight className="size-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-w-6xl mx-auto md:mx-0">
        {months.map((monthStart) => {
          const label = format(parseISO(monthStart), 'MMMM');
          const monthTasks = tasksByMonth.get(monthStart) ?? [];
          return (
            <MonthColumn
              key={monthStart}
              label={label}
              monthStart={monthStart}
              tasks={monthTasks}
              tagById={tagById}
              tags={tags}
              queryKey={yearQueryKey}
            />
          );
        })}
      </div>
    </div>
  );
}
