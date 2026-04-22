'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Sparkles } from 'lucide-react';
import {
  useWishlistItems,
  useWishlistLists,
} from '@/lib/hooks/use-wishlist';

export function WishlistCard() {
  const { data: lists = [] } = useWishlistLists();
  const defaultList = lists[0] ?? null;
  const { data: items = [] } = useWishlistItems(defaultList?.id ?? null);

  const preview = items.filter((i) => !i.acquired).slice(0, 3);

  return (
    <section className="rounded-3xl bg-card ring-1 ring-foreground/[0.05] shadow-[var(--shadow-paper)] p-5">
      <header className="flex items-center justify-between">
        <h2 className="font-display text-[17px] tracking-[-0.012em] font-medium">
          Wishlist
        </h2>
      </header>

      {preview.length === 0 ? (
        <p className="mt-4 text-[13px] text-muted-foreground bg-muted/40 rounded-xl py-6 text-center">
          Nothing on the wishlist yet.
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-foreground/[0.06]">
          {preview.map((item) => (
            <li key={item.id} className="flex items-center gap-3 py-2.5 first:pt-1 last:pb-1">
              <div className="relative shrink-0 size-11 rounded-xl overflow-hidden bg-muted ring-1 ring-foreground/[0.04]">
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt=""
                    fill
                    sizes="44px"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="grid place-items-center size-full text-muted-foreground">
                    <Sparkles className="size-4" strokeWidth={1.8} />
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13.5px] font-medium tracking-[-0.005em] line-clamp-1">
                  {item.name}
                </p>
                {item.price_amount != null && (
                  <p className="text-[11.5px] text-muted-foreground tabular-nums mt-0.5">
                    {formatPrice(item.price_amount, item.price_currency)}
                  </p>
                )}
              </div>
              <Link
                href={item.product_url ?? `/wishlist?list=${defaultList?.id ?? ''}`}
                target={item.product_url ? '_blank' : undefined}
                rel={item.product_url ? 'noopener noreferrer' : undefined}
                className="shrink-0 rounded-full text-[12px] font-medium px-3 py-1 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 [touch-action:manipulation]"
                style={{
                  background: 'var(--chip-sage)',
                  color: 'var(--chip-sage-ink)',
                }}
              >
                {item.product_url ? 'Open' : 'View'}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Link
        href="/wishlist"
        className="mt-4 flex items-center justify-between gap-2 rounded-2xl bg-muted/50 px-3.5 py-2.5 text-[12.5px] text-foreground/80 [@media(hover:hover)]:hover:bg-muted transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <span>View full wishlist</span>
        <ChevronRight className="size-4 text-muted-foreground" />
      </Link>
    </section>
  );
}

function formatPrice(amount: number, currency: string | null) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency ?? 'USD',
    }).format(amount);
  } catch {
    return `${amount}`;
  }
}
