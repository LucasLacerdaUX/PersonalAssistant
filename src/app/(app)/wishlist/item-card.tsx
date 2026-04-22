'use client';

import { motion } from 'framer-motion';
import { Check, ExternalLink, Package, Zap, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDeleteItem, useToggleAcquired } from '@/lib/hooks/use-wishlist';
import { formatMoney } from '@/lib/format';
import type { Tag, WishlistItem } from '@/lib/supabase/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Rotating placeholder palette — deterministic per item so it doesn't flicker.
const placeholders = ['sage', 'butter', 'clay', 'periwinkle', 'lilac', 'sky', 'rose'] as const;

function placeholderForId(id: string) {
  let sum = 0;
  for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i);
  return placeholders[sum % placeholders.length];
}

export function ItemCard({
  item,
  tag,
  listId,
  onEdit,
}: {
  item: WishlistItem;
  tag?: Tag | null;
  listId: string;
  onEdit: () => void;
}) {
  const toggle = useToggleAcquired(listId);
  const del = useDeleteItem(listId);
  const isTemp = item.id.startsWith('temp-');

  const price = formatMoney(item.price_amount, item.price_currency);
  const target = formatMoney(item.target_price, item.price_currency);
  const belowTarget =
    item.target_price != null &&
    item.price_amount != null &&
    item.price_amount <= item.target_price;

  const placeholderAccent = placeholderForId(item.id);

  function onToggle() {
    if (isTemp) return;
    toggle.mutate({ id: item.id, acquired: !item.acquired });
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'group relative rounded-2xl overflow-hidden bg-card ring-1 ring-foreground/[0.06] shadow-[var(--shadow-paper)] hover:shadow-[var(--shadow-float)] transition-all flex flex-col',
        item.acquired && 'opacity-65',
        isTemp && 'opacity-70',
      )}
    >
      <button
        onClick={onEdit}
        className="aspect-[4/3] w-full relative overflow-hidden"
        aria-label="Edit item"
      >
        {item.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image_url}
            alt=""
            className="size-full object-cover group-hover:scale-[1.035] transition-transform duration-700 ease-out"
          />
        ) : (
          <div
            className={cn('size-full grid place-items-center chip', `chip-${placeholderAccent}`)}
            style={{ borderRadius: 0, padding: 0 }}
          >
            <span className="font-display text-5xl font-medium tracking-[-0.04em] opacity-80">
              {item.name.slice(0, 1).toUpperCase()}
            </span>
          </div>
        )}

        <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 rounded-full bg-background/90 backdrop-blur-sm text-foreground text-[10px] font-medium px-2 py-0.5 ring-1 ring-foreground/5">
          {item.kind === 'digital' ? (
            <Zap className="size-3" />
          ) : (
            <Package className="size-3" />
          )}
          {item.kind}
        </span>

        {belowTarget && !item.acquired && (
          <span className="absolute top-2.5 left-2.5 chip chip-sage text-[10px] font-medium">
            under target
          </span>
        )}

        {item.acquired && (
          <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-full bg-foreground/85 text-background text-[10px] font-medium px-2 py-0.5">
            <Check className="size-3" strokeWidth={3} /> acquired
          </span>
        )}
      </button>

      <div className="p-3.5 flex-1 flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <button onClick={onEdit} className="text-left flex-1 min-w-0">
            <h3 className="text-[14px] font-medium leading-snug line-clamp-2 tracking-[-0.005em]">
              {item.name}
            </h3>
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger
              className="size-7 -mr-1 -mt-1 rounded-md inline-flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors bg-transparent"
              aria-label="Item menu"
            >
              <MoreVertical className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={onToggle} disabled={isTemp}>
                {item.acquired ? 'Mark available' : 'Mark acquired'}
              </DropdownMenuItem>
              {item.product_url && (
                <DropdownMenuItem
                  onClick={() =>
                    window.open(item.product_url!, '_blank', 'noopener,noreferrer')
                  }
                >
                  Open link <ExternalLink className="size-3 ml-auto" />
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                disabled={isTemp}
                onClick={() => {
                  if (confirm('Delete this item?')) {
                    del.mutate(item.id);
                  }
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-end justify-between gap-2 mt-auto pt-1">
          <div className="flex flex-col">
            {price && (
              <span
                className={cn(
                  'text-[14.5px] font-display font-medium tabular-nums tracking-[-0.01em]',
                  belowTarget && !item.acquired && 'text-primary',
                )}
              >
                {price}
              </span>
            )}
            {target && !item.acquired && (
              <span className="text-[10.5px] text-muted-foreground tabular-nums">
                target {target}
              </span>
            )}
          </div>
          {tag && (
            <span className="inline-flex items-center gap-1.5 text-[10.5px] rounded-full px-2 py-0.5 bg-muted text-foreground/80">
              <span
                className="size-1.5 rounded-full"
                style={{ background: tag.color }}
              />
              {tag.name}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
