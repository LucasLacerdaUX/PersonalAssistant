'use client';

import { addDays, addMonths } from 'date-fns';
import { HeroCard } from './hero-card';
import { ProgressCard } from './progress-card';
import { DailyGoalsCard } from './daily-goals-card';
import { GoalsCard } from './goals-card';
import { WishlistCard } from './wishlist-card';
import { NotesCard } from './notes-card';
import { useTasksInRange, useTasks } from '@/lib/hooks/use-tasks';
import { todayYMD, weekStartYMD, monthStartYMD, toYMD } from '@/lib/dates';

export function HomeView({ name }: { name: string }) {
  const today = todayYMD();
  const weekStart = weekStartYMD();
  const monthStart = monthStartYMD();
  const weekEnd = toYMD(addDays(new Date(weekStart), 6));
  const monthEnd = toYMD(addDays(addMonths(new Date(monthStart), 1), -1));

  const todayTasks = useTasks('daily', today).data ?? [];
  const weekTasks = useTasksInRange('daily', weekStart, weekEnd).data ?? [];
  const monthTasks = useTasksInRange('daily', monthStart, monthEnd).data ?? [];

  const count = (list: { completed: boolean }[]) => ({
    done: list.filter((t) => t.completed).length,
    total: list.length,
  });

  return (
    <div className="px-4 md:px-8 pt-5 md:pt-8 pb-24 md:pb-12">
      <div className="grid gap-5 lg:gap-6 lg:grid-cols-[minmax(0,1fr)_340px] max-w-[1280px]">
        <div className="space-y-5 lg:space-y-6 min-w-0">
          <HeroCard name={name} />

          <div className="grid gap-5 md:grid-cols-2">
            <DailyGoalsCard />
            <GoalsCard />
          </div>
        </div>

        <aside className="space-y-5 lg:space-y-6 min-w-0">
          <ProgressCard
            daily={count(todayTasks)}
            weekly={count(weekTasks)}
            monthly={count(monthTasks)}
          />
          <WishlistCard />
          <NotesCard />
        </aside>
      </div>
    </div>
  );
}
