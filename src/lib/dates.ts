import {
  addDays,
  format,
  isSameDay,
  isSameMonth,
  startOfWeek as dfStartOfWeek,
  startOfMonth as dfStartOfMonth,
  parseISO,
} from 'date-fns';

export function toYMD(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function fromYMD(ymd: string): Date {
  return parseISO(ymd);
}

export function todayYMD(): string {
  return toYMD(new Date());
}

export function weekStartYMD(ref: Date | string = new Date()): string {
  const d = typeof ref === 'string' ? fromYMD(ref) : ref;
  return toYMD(dfStartOfWeek(d, { weekStartsOn: 1 })); // Monday
}

export function monthStartYMD(ref: Date | string = new Date()): string {
  const d = typeof ref === 'string' ? fromYMD(ref) : ref;
  return toYMD(dfStartOfMonth(d));
}

export function monthStartsOfYear(year: number): string[] {
  return Array.from({ length: 12 }, (_, i) => toYMD(new Date(year, i, 1)));
}

export { addDays, isSameDay, isSameMonth, format };
