import { TodayView } from '../today-view';

export default async function TodayPage({
  searchParams,
}: {
  searchParams: Promise<{ d?: string }>;
}) {
  const { d } = await searchParams;
  return <TodayView selectedFromUrl={d} />;
}
