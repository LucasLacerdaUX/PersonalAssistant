import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function PageHeader({
  title,
  subtitle,
  eyebrow,
  actions,
  className,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  eyebrow?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'px-4 md:px-8 pt-5 md:pt-10 pb-4 md:pb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between',
        className,
      )}
    >
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-2">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-[2rem] md:text-[2.625rem] leading-[1.02] tracking-[-0.028em] font-medium">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[13.5px] md:text-sm text-muted-foreground mt-2">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
