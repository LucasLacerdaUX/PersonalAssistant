'use client';

import { motion } from 'framer-motion';
import { Check, ExternalLink, Package, Zap } from 'lucide-react';
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
import { MoreVertical } from 'lucide-react';

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
        'group relative rounded-2xl overflow-hidden border border-border/60 bg-card flex flex-col',
        item.acquired && 'opacity-60',
        isTemp && 'opacity-70',
      )}
    >
      <button
        onClick={onEdit}
        className="aspect-[4/3] w-full bg-muted relative overflow-hidden"
        aria-label="Edit item"
      >
        {item.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image_url}
            alt=""
            className="size-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        ) : (
          <div className="size-full grid place-items-center">
            <span className="font-serif text-3xl text-muted-foreground">
              {item.name.slice(0, 1).toUpperCase()}
            </span>
          </div>
        )}

        <span
          className={cn(
            'absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-background/90 text-foreground text-[10px] px-2 py-0.5 shadow-sm',
          )}
        >
          {item.kind === 'digital' ? (
            <Zap className="size-3" />
          ) : (
            <Package className="size-3" />
          )}
          {item.kind}
        </span>

        {belowTarget && (
          <span className="absolute top-2 left-2 rounded-full bg-emerald-500 text-white text-[10px] px-2 py-0.5 shadow-sm">
            under target
          </span>
        )}
      </button>

      <div className="p-3 flex-1 flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <button onClick={onEdit} className="text-left flex-1 min-w-0">
            <h3 className="text-sm font-medium leading-snug line-clamp-2">
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

        <div className="flex items-center justify-between gap-2 mt-auto pt-1">
          <div className="flex flex-col">
            {price && (
              <span className={cn('text-sm font-medium', belowTarget && 'text-emerald-600 dark:text-emerald-400')}>
                {price}
              </span>
            )}
            {target && !item.acquired && (
              <span className="text-[10px] text-muted-foreground">
                target {target}
              </span>
            )}
          </div>
          {tag && (
            <span className="inline-flex items-center gap-1 text-[10px] rounded-full px-2 py-0.5 bg-muted">
              <span
                className="size-1.5 rounded-full"
                style={{ background: tag.color }}
              />
              {tag.name}
            </span>
          )}
        </div>
      </div>

      {item.acquired && (
        <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-foreground/80 text-background text-[10px] px-2 py-0.5">
          <Check className="size-3" /> acquired
        </span>
      )}
    </motion.article>
  );
}
