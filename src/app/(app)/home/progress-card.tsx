'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, Flame, Target } from 'lucide-react';

export function ProgressCard({
  daily,
  weekly,
  monthly,
}: {
  daily: { done: number; total: number };
  weekly: { done: number; total: number };
  monthly: { done: number; total: number };
}) {
  const pct =
    daily.total === 0 ? 0 : Math.round((daily.done / daily.total) * 100);

  return (
    <section className="rounded-3xl bg-card ring-1 ring-foreground/[0.05] shadow-[var(--shadow-paper)] p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-[17px] tracking-[-0.012em] font-medium">
          Today&rsquo;s progress
        </h2>
      </div>

      <div className="mt-4 grid grid-cols-[auto_1fr] gap-4 items-center">
        <Donut pct={pct} />
        <div className="space-y-2">
          <Stat
            icon={Target}
            accent="sage"
            label="Daily goals"
            value={`${daily.done} / ${daily.total || 0}`}
          />
          <Stat
            icon={CheckCircle2}
            accent="periwinkle"
            label="This week"
            value={`${weekly.done} / ${weekly.total || 0}`}
          />
          <Stat
            icon={Flame}
            accent="butter"
            label="This month"
            value={`${monthly.done} / ${monthly.total || 0}`}
          />
        </div>
      </div>

      <p className="mt-4 rounded-full bg-[var(--chip-rose)] text-[var(--chip-rose-ink)] text-center text-[12px] font-medium tracking-[-0.005em] py-1.5">
        Keep it blooming.
      </p>
    </section>
  );
}

function Donut({ pct }: { pct: number }) {
  const shouldReduce = useReducedMotion();
  const r = 34;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;

  return (
    <div className="relative size-24 grid place-items-center">
      <svg viewBox="0 0 80 80" className="size-24 -rotate-90">
        <circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke="var(--muted)"
          strokeWidth="8"
        />
        <motion.circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - dash }}
          transition={
            shouldReduce
              ? { duration: 0 }
              : { type: 'spring', duration: 0.9, bounce: 0.12 }
          }
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <p className="font-display text-[22px] leading-none font-medium tabular-nums tracking-[-0.02em]">
            {pct}%
          </p>
          <p className="text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground mt-0.5">
            done
          </p>
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  accent,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  accent: 'sage' | 'periwinkle' | 'butter';
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 bg-muted/40">
      <span
        className="size-7 rounded-lg grid place-items-center shrink-0"
        style={{
          background: `var(--chip-${accent})`,
          color: `var(--chip-${accent}-ink)`,
        }}
      >
        <Icon className="size-3.5" strokeWidth={2} />
      </span>
      <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
        <p className="text-[12px] text-muted-foreground truncate">{label}</p>
        <p className="text-[13px] font-medium tabular-nums tracking-tight">
          {value}
        </p>
      </div>
    </div>
  );
}
