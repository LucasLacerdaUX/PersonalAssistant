'use client';

import Link from 'next/link';
import { format, addDays, parseISO, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toYMD } from '@/lib/dates';

export function DayNavigator({ selectedYMD }: { selectedYMD: string }) {
  const selected = parseISO(selectedYMD);
  const today = new Date();

  // Show a strip of 7 days centered on the selection.
  const days = Array.from({ length: 7 }, (_, i) => addDays(selected, i - 3));
  const prev = toYMD(addDays(selected, -1));
  const next = toYMD(addDays(selected, 1));

  return (
    <div className="flex items-center gap-2 px-4 md:px-8 pb-3">
      <Link
        href={{ pathname: '/', query: { d: prev } }}
        aria-label="Previous day"
        className="size-9 grid place-items-center rounded-full border border-border/60 hover:bg-muted/60 transition-colors shrink-0"
      >
        <ChevronLeft className="size-4" />
      </Link>

      <div className="flex-1 min-w-0 grid grid-cols-7 gap-1.5">
        {days.map((day) => {
          const ymd = toYMD(day);
          const isSelected = isSameDay(day, selected);
          const isToday = isSameDay(day, today);
          return (
            <Link
              key={ymd}
              href={{ pathname: '/', query: { d: ymd } }}
              className={cn(
                'relative flex flex-col items-center py-2 rounded-xl transition-colors',
                isSelected
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted/60',
              )}
            >
              <span
                className={cn(
                  'text-[10px] uppercase tracking-wider',
                  isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground',
                )}
              >
                {format(day, 'EEE')}
              </span>
              <span className="text-base font-serif leading-tight mt-0.5">
                {format(day, 'd')}
              </span>
              {isToday && !isSelected && (
                <span className="absolute bottom-1 size-1 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>

      <Link
        href={{ pathname: '/', query: { d: next } }}
        aria-label="Next day"
        className="size-9 grid place-items-center rounded-full border border-border/60 hover:bg-muted/60 transition-colors shrink-0"
      >
        <ChevronRight className="size-4" />
      </Link>
    </div>
  );
}
