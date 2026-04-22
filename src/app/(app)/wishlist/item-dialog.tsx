'use client';

import { useEffect, useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { previewFromUrl } from '@/app/(app)/actions/wishlist';
import { useCreateItem, useUpdateItem } from '@/lib/hooks/use-wishlist';
import type { Tag, WishlistItem, WishlistKind } from '@/lib/supabase/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const currencies = ['USD', 'EUR', 'BRL', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF'];

export function ItemDialog({
  open,
  onOpenChange,
  listId,
  tags,
  editing,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  listId: string;
  tags: Tag[];
  editing: WishlistItem | null;
}) {
  const create = useCreateItem(listId);
  const update = useUpdateItem(listId);
  const pending = create.isPending || update.isPending;
  const [fetchingOg, setFetchingOg] = useState(false);

  const [name, setName] = useState('');
  const [kind, setKind] = useState<WishlistKind>('physical');
  const [priceAmount, setPriceAmount] = useState('');
  const [priceCurrency, setPriceCurrency] = useState('USD');
  const [targetPrice, setTargetPrice] = useState('');
  const [productUrl, setProductUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [tagId, setTagId] = useState<string>('none');

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setName(editing.name);
      setKind(editing.kind);
      setPriceAmount(editing.price_amount?.toString() ?? '');
      setPriceCurrency(editing.price_currency ?? 'USD');
      setTargetPrice(editing.target_price?.toString() ?? '');
      setProductUrl(editing.product_url ?? '');
      setImageUrl(editing.image_url ?? '');
      setNotes(editing.notes ?? '');
      setTagId(editing.tag_id ?? 'none');
    } else {
      setName('');
      setKind('physical');
      setPriceAmount('');
      setPriceCurrency('USD');
      setTargetPrice('');
      setProductUrl('');
      setImageUrl('');
      setNotes('');
      setTagId('none');
    }
  }, [open, editing]);

  async function grabFromUrl() {
    if (!productUrl) return;
    setFetchingOg(true);
    try {
      const og = await previewFromUrl(productUrl);
      if (og.title && !name) setName(og.title);
      if (og.image && !imageUrl) setImageUrl(og.image);
    } finally {
      setFetchingOg(false);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      name: name.trim() || 'Untitled item',
      kind,
      price_amount: priceAmount ? parseFloat(priceAmount) : null,
      price_currency: priceAmount ? priceCurrency : null,
      target_price: targetPrice ? parseFloat(targetPrice) : null,
      product_url: productUrl.trim() || null,
      image_url: imageUrl.trim() || null,
      notes: notes.trim() || null,
      tag_id: tagId === 'none' ? null : tagId,
    };
    if (editing) {
      update.mutate({ id: editing.id, patch: payload });
    } else {
      create.mutate({
        list_id: listId,
        ...payload,
        auto_og: !payload.image_url || !payload.name,
      });
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl font-normal">
            {editing ? 'Edit item' : 'Add to wishlist'}
          </DialogTitle>
          <DialogDescription>
            Paste a product URL and we&apos;ll fill in the name and image.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="product_url">Product URL</Label>
            <div className="flex gap-2">
              <Input
                id="product_url"
                value={productUrl}
                onChange={(e) => setProductUrl(e.target.value)}
                placeholder="https://…"
              />
              <Button
                type="button"
                variant="outline"
                onClick={grabFromUrl}
                disabled={!productUrl || fetchingOg}
              >
                {fetchingOg ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Sparkles className="size-4" />
                )}
                Grab
              </Button>
            </div>
          </div>

          {imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt=""
              className="w-full aspect-[16/9] rounded-xl object-cover border border-border/60"
            />
          )}

          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="What is it?"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Kind</Label>
              <Select
                value={kind}
                onValueChange={(v) => v && setKind(v as WishlistKind)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="physical">Physical</SelectItem>
                  <SelectItem value="digital">Digital</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Tag</Label>
              <Select value={tagId} onValueChange={(v) => v && setTagId(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="No tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No tag</SelectItem>
                  {tags.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-end">
            <div className="space-y-1.5">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={priceAmount}
                onChange={(e) => setPriceAmount(e.target.value)}
                placeholder="99.00"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Currency</Label>
              <Select
                value={priceCurrency}
                onValueChange={(v) => v && setPriceCurrency(v)}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="target">Target price</Label>
              <Input
                id="target"
                type="number"
                step="0.01"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                placeholder="optional"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://…"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Size, color, reasons you want it…"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? 'Saving…' : editing ? 'Save changes' : 'Add item'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
