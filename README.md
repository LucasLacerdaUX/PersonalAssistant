# Comprinhas

A personal organizer: wishlist, daily/weekly/monthly tasks, and a markdown notepad.
Coming in phase 2: habit tracker, kanban projects.

Stack: Next.js 16 (App Router) · TypeScript · Tailwind v4 · shadcn/ui (base-nova)
· framer-motion · Supabase (Postgres + Auth + RLS).

---

## One-time setup

### 1. Create a Supabase project

1. Go to https://supabase.com/dashboard and create a new project.
2. Open **SQL Editor**, paste the contents of
   [`supabase/migrations/0001_init.sql`](./supabase/migrations/0001_init.sql),
   and run it. This creates tables, indexes, triggers, RLS policies, and a
   `handle_new_user` trigger that seeds a profile, four starter tags, and a
   default wishlist on first sign-in.
3. Under **Project Settings → API**, copy the **Project URL** and the
   **`anon` public key**.

### 2. Configure auth providers

In the Supabase dashboard → **Authentication → Providers**:

- **Google** — enable it, then follow Supabase's
  [Google setup guide](https://supabase.com/docs/guides/auth/social-login/auth-google)
  to create a Google OAuth client and paste the client ID + secret back into Supabase.
  Set the authorized redirect URI to
  `https://<your-project-ref>.supabase.co/auth/v1/callback`.
- **Email** — keep it enabled; the magic-link flow uses this by default.

Under **Authentication → URL Configuration**, set the **Site URL** to
`http://localhost:3000` in development (or your production domain). Add
`http://localhost:3000/auth/callback` and `http://localhost:3000/auth/confirm`
to the list of additional redirect URLs.

### 3. Local env vars

```bash
cp .env.local.example .env.local
```

Fill in `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and set
`NEXT_PUBLIC_SITE_URL=http://localhost:3000`.

### 4. Run

```bash
npm run dev
```

Open http://localhost:3000, sign in with Google or request a magic link, and
you'll land on **Today**.

---

## What's in the box

- **Today** (`/`) — daily tasks with a horizontal day strip. Add a task, tag it,
  optionally link it to a weekly or monthly parent. Unfinished tasks stay on
  their day (no auto-rollover).
- **Plan** (`/plan`) — `Week` lists this week's focus items; `Year`
  (`/plan/year`) renders the 12 months as cards of monthly themes.
- **Wishlist** (`/wishlist`) — multiple lists (tabs), items with name, kind
  (physical/digital), price + currency, target price, product URL, image,
  notes, tag. Paste a product URL and hit **Grab** to auto-fetch the Open Graph
  title and image.
- **Notes** (`/notes`) — markdown editor with Write/Preview toggle and
  Postgres full-text search.
- **Settings** (`/settings`) — manage tags (name + color), set your display
  currency.

Tags are user-editable and shared across all entity types (tasks, wishlist
items, notes). Four tags — Work, Life, Relationship, Houseowning — are seeded
on your first sign-in.

---

## Project layout

```
src/
  app/
    (app)/              protected shell — everything behind auth
      actions/          server actions (tasks, wishlist, notes, settings)
      page.tsx          Today
      plan/             Week (default) + year/
      wishlist/         list picker, items, add/edit dialog
      notes/            master-detail notes editor
      settings/
    auth/               OAuth callback + magic-link confirm + error
    login/              sign-in page (Google + magic link)
    layout.tsx          root layout (theme provider, fonts, toaster)
    globals.css         Tailwind v4 + playful theme tokens
  components/
    shell/              sidebar, tab bar, mobile header, user menu
    tasks/              task row, composer, day navigator
    ui/                 shadcn/ui primitives
  lib/
    supabase/           server + browser clients, proxy (auth refresh)
    dates.ts            date helpers (week/month anchors)
    format.ts           money formatter
    og.ts               Open Graph extractor
supabase/
  migrations/
    0001_init.sql       full schema, RLS, triggers, seed
```

---

## Deploying to Vercel

1. `vercel link` (or create a new project in the Vercel dashboard).
2. Add the three env vars from `.env.local.example` in **Project → Settings → Environment Variables**.
3. Update Supabase's **Site URL** and redirect URLs to your production domain
   (and `.../auth/callback`, `.../auth/confirm`).
4. `vercel --prod`.

Middleware is implemented as `src/proxy.ts` (Next.js 16 renamed middleware to
proxy). It refreshes Supabase sessions on every request and redirects
unauthenticated users to `/login`.
