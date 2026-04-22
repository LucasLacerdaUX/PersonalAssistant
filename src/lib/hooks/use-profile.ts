'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getSupabaseBrowser } from '@/lib/supabase/browser';
import { qk } from '@/lib/query-keys';
import { updateDisplayCurrency } from '@/app/(app)/actions/settings';
import type { Profile } from '@/lib/supabase/types';

export function useProfile() {
  return useQuery({
    queryKey: qk.profile,
    queryFn: async () => {
      const { data, error } = await getSupabaseBrowser()
        .from('profiles')
        .select('*')
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return (data as Profile | null) ?? null;
    },
    staleTime: 60_000,
  });
}

export function useUpdateDisplayCurrency() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (currency: string) => updateDisplayCurrency(currency),
    onMutate: async (currency) => {
      await qc.cancelQueries({ queryKey: qk.profile });
      const previous = qc.getQueryData<Profile | null>(qk.profile);
      qc.setQueryData<Profile | null>(qk.profile, (old) =>
        old ? { ...old, display_currency: currency } : old,
      );
      return { previous };
    },
    onError: (_err, _currency, ctx) => {
      if (ctx) qc.setQueryData(qk.profile, ctx.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: qk.profile }),
  });
}
