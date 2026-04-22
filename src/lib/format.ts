export function formatMoney(
  amount: number | null | undefined,
  currency: string | null | undefined,
): string | null {
  if (amount == null) return null;
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount} ${currency ?? ''}`.trim();
  }
}
