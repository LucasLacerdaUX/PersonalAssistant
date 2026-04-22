'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { addDays, addMonths } from 'date-fns';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTasks, useTasksInRange } from '@/lib/hooks/use-tasks';
import { toYMD, weekStartYMD, monthStartYMD } from '@/lib/dates';
import type { Task } from '@/lib/supabase/types';

type Tab = 'weekly' | 'monthly';

export function GoalsCard() {
  const [tab, setTab] = useState<Tab>('weekly');

  const weekStart = weekStartYMD();
  const monthStart = monthStartYMD();
  const weekEnd = toYMD(addDays(new Date(weekStart), 6));
  const monthEnd = toYMD(addDays(addMonths(new Date(monthStart), 1), -1));

  const weeklyParents = useTasks('weekly', weekStart).data ?? [];
  const monthlyParents = useTasks('monthly', monthStart).data ?? [];
  const weeklyChildren =
    useTasksInRange('daily', weekStart, weekEnd).data ?? [];
  const monthlyChildren =
    useTasksInRange('daily', monthStart, monthEnd).data ?? [];

  const parents = tab === 'weekly' ? weeklyParents : monthlyParents;
  const children = tab === 'weekly' ? weeklyChildren : monthlyChildren;

  return (
    <section className="rounded-3xl bg-card ring-1 ring-foreground/[0.05] shadow-[var(--shadow-paper)] p-5">
      <header className="flex items-center justify-between">
        <div
          role="tablist"
          className="inline-flex items-center rounded-full bg-muted/70 p-1 text-[12.5px] relative"
        >
          <TabButton active={tab === 'weekly'} onClick={() => setTab('weekly')}>
            Weekly
          </TabButton>
          <TabButton
            active={tab === 'monthly'}
            onClick={() => setTab('monthly')}
          >
            Monthly
          </TabButton>
        </div>
      </header>

      {parents.length === 0 ? (
        <p className="mt-4 text-[13px] text-muted-foreground bg-muted/40 rounded-xl py-6 text-center">
          No {tab} goals yet.{' '}
          <Link href="/plan" className="underline">
            Plan a few.
          </Link>
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {parents.slice(0, 4).map((p, idx) => (
            <GoalRow
              key={p.id}
              parent={p}
              allChildren={children}
              index={idx}
            />
          ))}
        </ul>
      )}

      <Link
        href="/plan"
        className="mt-4 flex items-center justify-center gap-1 text-[13px] font-medium text-foreground/80 [@media(hover:hover)]:hover:text-foreground transition-colors duration-150 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        View all goals
        <ChevronRight className="size-3.5" />
      </Link>
    </section>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        'relative rounded-full px-3.5 py-1.5 transition-colors duration-150',
        active ? 'text-foreground' : 'text-muted-foreground',
      )}
    >
      {active && (
        <motion.span
          layoutId="goals-tab-active"
          className="absolute inset-0 rounded-full bg-card shadow-[var(--shadow-paper)] ring-1 ring-foreground/[0.06]"
          transition={{ type: 'spring', duration: 0.28, bounce: 0.08 }}
        />
      )}
      <span className="relative font-medium tracking-tight">{children}</span>
    </button>
  );
}

const GOAL_ACCENTS = ['sage', 'periwinkle', 'rose', 'butter'] as const;
const GOAL_EMOJI = ['🌱', '📖', '🫧', '☕'];

function GoalRow({
  parent,
  allChildren,
  index,
}: {
  parent: Task;
  allChildren: Task[];
  index: number;
}) {
  const shouldReduce = useReducedMotion();
  const kids = useMemo(
    () => allChildren.filter((c) => c.parent_id === parent.id),
    [allChildren, parent.id],
  );
  const done = kids.filter((c) => c.completed).length;
  const total = kids.length;
  const hasKids = total > 0;
  const pct = hasKids ? (done / total) * 100 : parent.completed ? 100 : 0;

  const accent = GOAL_ACCENTS[index % GOAL_ACCENTS.length];
  const emoji = GOAL_EMOJI[index % GOAL_EMOJI.length];

  return (
    <li className="flex items-center gap-3">
      <span
        aria-hidden
        className="shrink-0 size-10 rounded-2xl grid place-items-center text-[18px]"
        style={{
          background: `var(--chip-${accent})`,
          color: `var(--chip-${accent}-ink)`,
        }}
      >
        {emoji}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[13.5px] font-medium truncate tracking-[-0.005em]">
            {parent.title}
          </p>
          <p className="text-[11.5px] text-muted-foreground tabular-nums shrink-0">
            {hasKids ? `${done} / ${total}` : parent.completed ? 'Done' : '—'}
          </p>
        </div>
        <div className="mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden">
          <motion.span
            className="block h-full rounded-full"
            style={{ background: `var(--chip-${accent}-ink)` }}
            initial={{ width: shouldReduce ? `${pct}%` : 0 }}
            animate={{ width: `${pct}%` }}
            transition={
              shouldReduce
                ? { duration: 0 }
                : { type: 'spring', duration: 0.7, bounce: 0.1 }
            }
          />
        </div>
      </div>
    </li>
  );
}
