'use client';

import Link from 'next/link';
import { format, addDays, parseISO, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toYMD } from '@/lib/dates';

export function DayNavigator({ selectedYMD }: { selectedYMD: string }) {
  const selected = parseISO(selectedYMD);
  const today = new Date();

  const days = Array.from({ length: 7 }, (_, i) => addDays(selected, i - 3));
  const prev = toYMD(addDays(selected, -1));
  const next = toYMD(addDays(selected, 1));

  return (
    <div className="flex items-center gap-2 px-4 md:px-8 pb-5">
      <NavButton href={`/?d=${prev}`} label="Previous day">
        <ChevronLeft className="size-4" />
      </NavButton>

      <div className="flex-1 min-w-0 grid grid-cols-7 gap-1">
        {days.map((day) => {
          const ymd = toYMD(day);
          const isSelected = isSameDay(day, selected);
          const isToday = isSameDay(day, today);
          return (
            <Link
              key={ymd}
              href={{ pathname: '/', query: { d: ymd } }}
              className={cn(
                'relative flex flex-col items-center pt-2 pb-1.5 rounded-xl transition-all duration-200',
                isSelected
                  ? 'bg-foreground text-background shadow-[var(--shadow-float)]'
                  : 'hover:bg-muted',
              )}
            >
              <span
                className={cn(
                  'text-[10px] uppercase tracking-[0.14em] font-medium',
                  isSelected ? 'opacity-70' : 'text-muted-foreground',
                )}
              >
                {format(day, 'EEE')}
              </span>
              <span
                className={cn(
                  'font-display text-[17px] leading-[1.1] tabular-nums',
                  isSelected ? 'font-medium' : '',
                )}
              >
                {format(day, 'd')}
              </span>
              {isToday && !isSelected && (
                <span className="absolute bottom-1.5 size-1 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>

      <NavButton href={`/?d=${next}`} label="Next day">
        <ChevronRight className="size-4" />
      </NavButton>
    </div>
  );
}

function NavButton({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="size-9 grid place-items-center rounded-full bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0"
    >
      {children}
    </Link>
  );
}
