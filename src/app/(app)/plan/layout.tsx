import { PageHeader } from '@/components/page-header';
import { PlanTabs } from './plan-tabs';

export default function PlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <PageHeader
        title="Plan"
        subtitle="Weekly focus and yearly themes."
        actions={<PlanTabs />}
      />
      {children}
    </div>
  );
}
