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
        eyebrow="Wishlist"
        title="Little wants, kept close."
        subtitle="Things you'd love, someday or soon."
      />
      <WishlistView listParam={list} />
    </div>
  );
}
