# Rongai Wholesalers

Wholesale in Rongai with live inventory tracking system.

Next.js App Router storefront backed by Supabase PostgreSQL/Auth and seeded from Fake Store API.

## Setup

```bash
npm install --cache .npm-cache
cp .env.example .env.local
npm run dev
```

Required environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
PRODUCT_SYNC_SECRET=
```

`PRODUCT_SYNC_SECRET` is optional and protects the route handler trigger in addition to admin auth.

## Database

Apply the migrations in `supabase/migrations` to the connected Supabase project.

The migrations create and maintain:

- `profiles`
- `products`
- `product_sync_runs`

They enable RLS, allow public reads of published products, restrict product writes plus sync logs to admin users, and backfill the wholesale `items` catalog into `products`.

## Admin Bootstrap

After creating a user through Supabase Auth, promote that user to admin in SQL:

```sql
update public.profiles
set role = 'admin'
where email = 'you@example.com';
```

Only admins can create, update, archive, or synchronize products.

## Synchronization

Admins can run Fake Store synchronization from `/admin/products`.

The route handler is:

```bash
POST /api/sync/products
```

If `PRODUCT_SYNC_SECRET` is configured, include:

```bash
x-sync-secret: your-secret
```

Imported products use `external_id` for idempotent upserts. Re-sync skips imported products whose local `updated_at` is newer than their last `synced_at`, avoiding accidental overwrite of admin edits.

## Verification

```bash
npm run typecheck
npm run lint
npm run build
```
