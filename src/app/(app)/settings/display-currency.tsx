'use client';

import { useProfile, useUpdateDisplayCurrency } from '@/lib/hooks/use-profile';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const currencies = ['USD', 'EUR', 'BRL', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF'];

export function DisplayCurrency() {
  const profile = useProfile();
  const update = useUpdateDisplayCurrency();
  const value = profile.data?.display_currency ?? 'USD';

  function onChange(v: string | null) {
    if (!v || v === value) return;
    update.mutate(v);
  }

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-40">
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
  );
}
