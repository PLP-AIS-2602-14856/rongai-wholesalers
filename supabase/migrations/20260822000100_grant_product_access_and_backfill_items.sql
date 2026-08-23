grant select on public.products to anon;
grant select, insert, update, delete on public.products to authenticated;

revoke all on public.product_sync_runs from anon;
grant select, insert on public.product_sync_runs to authenticated;

revoke all on public.profiles from anon;
grant select, update on public.profiles to authenticated;

insert into public.products (
  id,
  external_id,
  title,
  slug,
  description,
  price,
  category,
  image_url,
  rating,
  rating_count,
  is_published,
  created_at,
  updated_at
)
select
  items.id,
  null,
  items.name,
  regexp_replace(lower(items.sku), '[^a-z0-9]+', '-', 'g'),
  concat(items.name, ' - ', items.unit_description),
  items.wholesale_price_kes,
  items.category,
  concat('https://placehold.co/800x800/eef3ef/18201b.png?text=', replace(items.sku, '-', '%20')),
  0,
  0,
  not items.is_discontinued,
  items.created_at,
  now()
from public.items
where not exists (
  select 1
  from public.products
  where products.id = items.id
);
