import { PageHeader } from '@/components/page-header';
import { WishlistView } from './wishlist-view';

export default async function WishlistPage({
  searchParams,
}: {
  searchParams: Promise<{ list?: string }>;
}) {
  const { list } = await searchParams;
  return (
    <div className="flex flex-col">
      <PageHeader
        title="Wishlist"
        subtitle="Things you want, someday or soon."
      />
      <WishlistView listParam={list} />
    </div>
  );
}
