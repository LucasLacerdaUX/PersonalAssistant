export const qk = {
  tags: ['tags'] as const,
  profile: ['profile'] as const,
  tasks: (timeframe: string, periodStart: string) =>
    ['tasks', timeframe, periodStart] as const,
  tasksRange: (timeframe: string, from: string, to: string) =>
    ['tasks', 'range', timeframe, from, to] as const,
  wishlistLists: ['wishlist-lists'] as const,
  wishlistItems: (listId: string) => ['wishlist-items', listId] as const,
  notes: (q: string) => ['notes', q] as const,
  note: (id: string) => ['note', id] as const,
};
