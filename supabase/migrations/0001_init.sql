-- Comprinhas initial schema
-- Run in Supabase SQL editor (or via CLI) against a fresh project.

create extension if not exists "unaccent";
create extension if not exists "pgcrypto";

-- unaccent() is STABLE, which Postgres rejects inside generated columns.
-- This wrapper is logically immutable for our inputs and lets us use it in notes.search_vector.
create or replace function public.immutable_unaccent(text)
returns text language sql immutable parallel safe as $$
  select public.unaccent('public.unaccent', $1)
$$;

-- ──────────────────────────────────────────────────────────────
-- profiles
-- ──────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id                uuid primary key references auth.users(id) on delete cascade,
  display_currency  text not null default 'USD',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ──────────────────────────────────────────────────────────────
-- tags (user-editable, universal — one tag per item)
-- ──────────────────────────────────────────────────────────────
create table if not exists public.tags (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  color       text not null default '#6366f1',
  created_at  timestamptz not null default now(),
  unique (user_id, name)
);
create index if not exists tags_user_idx on public.tags(user_id);

-- ──────────────────────────────────────────────────────────────
-- wishlist_lists
-- ──────────────────────────────────────────────────────────────
create table if not exists public.wishlist_lists (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  created_at  timestamptz not null default now()
);
create index if not exists wishlist_lists_user_idx on public.wishlist_lists(user_id);

-- ──────────────────────────────────────────────────────────────
-- wishlist_items
-- ──────────────────────────────────────────────────────────────
do $$ begin
  create type public.wishlist_kind as enum ('physical', 'digital');
exception when duplicate_object then null; end $$;

create table if not exists public.wishlist_items (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  list_id         uuid not null references public.wishlist_lists(id) on delete cascade,
  tag_id          uuid references public.tags(id) on delete set null,
  name            text not null,
  kind            public.wishlist_kind not null default 'physical',
  price_amount    numeric(12, 2),
  price_currency  text,
  target_price    numeric(12, 2),
  product_url     text,
  image_url       text,
  notes           text,
  acquired        boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists wishlist_items_user_idx on public.wishlist_items(user_id);
create index if not exists wishlist_items_list_idx on public.wishlist_items(list_id);

-- ──────────────────────────────────────────────────────────────
-- tasks
--   period_start anchors the task to a bucket:
--     daily   → the specific date
--     weekly  → Monday of that week
--     monthly → 1st of that month
-- ──────────────────────────────────────────────────────────────
do $$ begin
  create type public.task_timeframe as enum ('daily', 'weekly', 'monthly');
exception when duplicate_object then null; end $$;

create table if not exists public.tasks (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  tag_id        uuid references public.tags(id) on delete set null,
  parent_id     uuid references public.tasks(id) on delete set null,
  title         text not null,
  notes         text,
  timeframe     public.task_timeframe not null,
  period_start  date not null,
  completed     boolean not null default false,
  completed_at  timestamptz,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists tasks_user_period_idx on public.tasks(user_id, timeframe, period_start);
create index if not exists tasks_parent_idx on public.tasks(parent_id);

-- ──────────────────────────────────────────────────────────────
-- notes (with generated tsvector for FTS)
-- ──────────────────────────────────────────────────────────────
create table if not exists public.notes (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  tag_id          uuid references public.tags(id) on delete set null,
  title           text not null default '',
  body            text not null default '',
  search_vector   tsvector generated always as (
    to_tsvector(
      'simple',
      public.immutable_unaccent(coalesce(title, '')) || ' ' ||
      public.immutable_unaccent(coalesce(body, ''))
    )
  ) stored,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists notes_user_idx on public.notes(user_id);
create index if not exists notes_search_idx on public.notes using gin(search_vector);

-- ──────────────────────────────────────────────────────────────
-- updated_at trigger
-- ──────────────────────────────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch before update on public.profiles
  for each row execute procedure public.touch_updated_at();

drop trigger if exists wishlist_items_touch on public.wishlist_items;
create trigger wishlist_items_touch before update on public.wishlist_items
  for each row execute procedure public.touch_updated_at();

drop trigger if exists tasks_touch on public.tasks;
create trigger tasks_touch before update on public.tasks
  for each row execute procedure public.touch_updated_at();

drop trigger if exists notes_touch on public.notes;
create trigger notes_touch before update on public.notes
  for each row execute procedure public.touch_updated_at();

-- ──────────────────────────────────────────────────────────────
-- new-user bootstrap: profile + seed tags + default wishlist
-- ──────────────────────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id) values (new.id)
    on conflict (id) do nothing;

  insert into public.tags (user_id, name, color) values
    (new.id, 'Work',         '#6366f1'),
    (new.id, 'Life',         '#22c55e'),
    (new.id, 'Relationship', '#ec4899'),
    (new.id, 'Houseowning',  '#f59e0b')
  on conflict (user_id, name) do nothing;

  insert into public.wishlist_lists (user_id, name) values (new.id, 'My wishlist');

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ──────────────────────────────────────────────────────────────
-- RLS
-- ──────────────────────────────────────────────────────────────
alter table public.profiles       enable row level security;
alter table public.tags           enable row level security;
alter table public.wishlist_lists enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.tasks          enable row level security;
alter table public.notes          enable row level security;

drop policy if exists "profiles_self"       on public.profiles;
drop policy if exists "tags_self"           on public.tags;
drop policy if exists "wishlist_lists_self" on public.wishlist_lists;
drop policy if exists "wishlist_items_self" on public.wishlist_items;
drop policy if exists "tasks_self"          on public.tasks;
drop policy if exists "notes_self"          on public.notes;

create policy "profiles_self" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "tags_self" on public.tags
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "wishlist_lists_self" on public.wishlist_lists
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "wishlist_items_self" on public.wishlist_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "tasks_self" on public.tasks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "notes_self" on public.notes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
