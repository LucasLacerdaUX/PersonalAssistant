import { PlanYearView } from './plan-year-view';

export default async function PlanYearPage({
  searchParams,
}: {
  searchParams: Promise<{ y?: string }>;
}) {
  const { y } = await searchParams;
  const year = y ? parseInt(y, 10) : new Date().getFullYear();
  return <PlanYearView year={year} />;
}
