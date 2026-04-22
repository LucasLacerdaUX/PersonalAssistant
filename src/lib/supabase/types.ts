// Hand-written row types that mirror /supabase/migrations/0001_init.sql.

export type TaskTimeframe = 'daily' | 'weekly' | 'monthly';
export type WishlistKind = 'physical' | 'digital';

export type Tag = {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
};

export type Profile = {
  id: string;
  display_currency: string;
  created_at: string;
  updated_at: string;
};

export type WishlistList = {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
};

export type WishlistItem = {
  id: string;
  user_id: string;
  list_id: string;
  tag_id: string | null;
  name: string;
  kind: WishlistKind;
  price_amount: number | null;
  price_currency: string | null;
  target_price: number | null;
  product_url: string | null;
  image_url: string | null;
  notes: string | null;
  acquired: boolean;
  created_at: string;
  updated_at: string;
};

export type Task = {
  id: string;
  user_id: string;
  tag_id: string | null;
  parent_id: string | null;
  title: string;
  notes: string | null;
  timeframe: TaskTimeframe;
  period_start: string;
  completed: boolean;
  completed_at: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Note = {
  id: string;
  user_id: string;
  tag_id: string | null;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
};
