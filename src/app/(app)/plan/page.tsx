import { PlanWeekView } from './plan-week-view';

export default async function PlanWeekPage({
  searchParams,
}: {
  searchParams: Promise<{ w?: string }>;
}) {
  const { w } = await searchParams;
  return <PlanWeekView selectedFromUrl={w} />;
}
