-- Run after add_found_reports.sql and backend_actions_and_map.sql.
-- Adds user preferences used by /me and /profile.
alter table public.profiles
  add column if not exists city text,
  add column if not exists zip_code text,
  add column if not exists notify_nearby_sightings boolean not null default true,
  add column if not exists notify_contact_requests boolean not null default true,
  add column if not exists notify_product_updates boolean not null default true;

-- Authenticated users may update only their own profile row.
alter table public.profiles enable row level security;
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
on public.profiles for select to authenticated
using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles for update to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);
