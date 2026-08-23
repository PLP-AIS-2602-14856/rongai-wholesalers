create schema if not exists app_private;

create or replace function app_private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function app_private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace function app_private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function app_private.set_updated_at();

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function app_private.set_updated_at();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function app_private.handle_new_user();

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
to authenticated
using (id = (select auth.uid()) or app_private.is_admin());

drop policy if exists "profiles_update_own_name" on public.profiles;
create policy "profiles_update_own_name"
on public.profiles for update
to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()) and role = 'customer');

drop policy if exists "products_admin_all" on public.products;
create policy "products_admin_all"
on public.products for all
to authenticated
using (app_private.is_admin())
with check (app_private.is_admin());

drop policy if exists "sync_runs_admin_read" on public.product_sync_runs;
create policy "sync_runs_admin_read"
on public.product_sync_runs for select
to authenticated
using (app_private.is_admin());

drop policy if exists "sync_runs_admin_insert" on public.product_sync_runs;
create policy "sync_runs_admin_insert"
on public.product_sync_runs for insert
to authenticated
with check (app_private.is_admin());

grant usage on schema app_private to authenticated;
grant execute on function app_private.is_admin() to authenticated;
revoke all on function app_private.handle_new_user() from public, anon, authenticated;
revoke all on function app_private.set_updated_at() from public, anon, authenticated;

drop function if exists public.handle_new_user();
drop function if exists public.is_admin();
drop function if exists public.set_updated_at();
