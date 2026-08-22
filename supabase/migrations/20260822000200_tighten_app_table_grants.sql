revoke all privileges on table public.profiles from anon, authenticated;
revoke all privileges on table public.products from anon, authenticated;
revoke all privileges on table public.product_sync_runs from anon, authenticated;

grant select on table public.products to anon;
grant select, insert, update, delete on table public.products to authenticated;

grant select, update on table public.profiles to authenticated;
grant select, insert on table public.product_sync_runs to authenticated;
