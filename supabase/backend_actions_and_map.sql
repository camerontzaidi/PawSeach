-- Run this migration in the Supabase SQL Editor before testing the updated
-- found-report map flow or the new close/reunited backend actions.

-- 1) Found reports now save the exact point selected in the LocationPicker.
alter table public.found_reports
  add column if not exists latitude numeric(9,6),
  add column if not exists longitude numeric(9,6),
  add column if not exists closed_at timestamp with time zone;

create index if not exists found_reports_location_idx
  on public.found_reports(latitude, longitude);

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'found_reports_latitude_check'
  ) then
    alter table public.found_reports
      add constraint found_reports_latitude_check
      check (latitude is null or latitude between -90 and 90);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'found_reports_longitude_check'
  ) then
    alter table public.found_reports
      add constraint found_reports_longitude_check
      check (longitude is null or longitude between -180 and 180);
  end if;
end $$;

-- 2) Missing reports can be explicitly closed in addition to being reunited.
alter table public.dogs
  add column if not exists closed_at timestamp with time zone;

alter table public.dogs
  drop constraint if exists dogs_status_check;

alter table public.dogs
  add constraint dogs_status_check
  check (status in ('missing', 'spotted', 'reunited', 'closed'));

-- 3) Closed reports stay hidden from public browsing, but their creator can
--    still select them later for the owner dashboard/history view.
drop policy if exists "Public can view active dog reports" on public.dogs;
create policy "Public can view active dog reports"
on public.dogs for select
using (status in ('missing', 'spotted', 'reunited'));

drop policy if exists "Owners can view their own dog reports" on public.dogs;
create policy "Owners can view their own dog reports"
on public.dogs for select to authenticated
using (auth.uid() = owner_id);

drop policy if exists "Public can view found reports" on public.found_reports;
create policy "Public can view found reports"
on public.found_reports for select
using (status <> 'closed');

drop policy if exists "Reporters can view their own found reports" on public.found_reports;
create policy "Reporters can view their own found reports"
on public.found_reports for select to authenticated
using (auth.uid() = reporter_id);

-- Existing UPDATE policies remain the database-level ownership guard.
-- The server actions also explicitly filter by owner_id/reporter_id.
