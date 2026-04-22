import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function PageHeader({
  title,
  subtitle,
  actions,
  className,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'px-4 md:px-8 pt-4 md:pt-8 pb-3 md:pb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between',
        className,
      )}
    >
      <div>
        <h1 className="font-serif text-3xl md:text-4xl leading-tight tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
