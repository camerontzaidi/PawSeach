-- Run this in the Supabase SQL Editor before deploying the updated missing-pet form.
-- This migration aligns public.dogs with app/report/page.tsx and app/report/actions.ts.
-- It is written to preserve existing data where possible.

-- 1) Add columns used by the form/backend if they do not already exist.
alter table public.dogs
  add column if not exists primary_color text,
  add column if not exists secondary_color text,
  add column if not exists sex text,
  add column if not exists size text,
  add column if not exists estimated_birth_year smallint,
  add column if not exists microchipped boolean not null default false,
  add column if not exists last_seen_at timestamp with time zone,
  add column if not exists time_is_approximate boolean not null default false,
  add column if not exists location_description text,
  add column if not exists circumstances text,
  add column if not exists reward_offered boolean not null default false,
  add column if not exists reward_amount numeric(10,2);

-- 2) If the legacy last_seen_date column exists, copy those dates into last_seen_at
--    only where last_seen_at has not already been populated.
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'dogs'
      and column_name = 'last_seen_date'
  ) then
    execute $sql$
      update public.dogs
      set last_seen_at = last_seen_date::timestamp at time zone 'UTC'
      where last_seen_at is null
        and last_seen_date is not null
    $sql$;
  end if;
end $$;

-- 3) Add/retain data-quality constraints.
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'dogs_sex_check') then
    alter table public.dogs
      add constraint dogs_sex_check check (sex in ('male', 'female', 'unknown'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'dogs_size_check') then
    alter table public.dogs
      add constraint dogs_size_check check (size in ('small', 'medium', 'large', 'unknown'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'dogs_estimated_birth_year_check') then
    alter table public.dogs
      add constraint dogs_estimated_birth_year_check
      check (estimated_birth_year is null or estimated_birth_year between 1900 and 2100);
  end if;

  if not exists (select 1 from pg_constraint where conname = 'dogs_reward_check') then
    alter table public.dogs
      add constraint dogs_reward_check check (
        (reward_offered = false and reward_amount is null)
        or (reward_offered = true and reward_amount is not null and reward_amount >= 0)
      );
  end if;
end $$;

-- 4) The UI/backend require these fields for all new submissions.
--    Applying NOT NULL to an existing table can fail when old rows contain NULLs,
--    so only tighten each column when existing data is already complete.
do $$
begin
  if not exists (select 1 from public.dogs where primary_color is null) then
    alter table public.dogs alter column primary_color set not null;
  else
    raise notice 'primary_color still has NULL rows; NOT NULL was not applied.';
  end if;

  if not exists (select 1 from public.dogs where last_seen_at is null) then
    alter table public.dogs alter column last_seen_at set not null;
  else
    raise notice 'last_seen_at still has NULL rows; NOT NULL was not applied.';
  end if;

  if not exists (select 1 from public.dogs where location_description is null) then
    alter table public.dogs alter column location_description set not null;
  else
    raise notice 'location_description still has NULL rows; NOT NULL was not applied.';
  end if;
end $$;

-- 5) last_seen_at replaces the legacy date-only field.
alter table public.dogs
  drop column if exists last_seen_date;

-- 6) Dog photos table used by the missing-pet submission backend.
create table if not exists public.dog_photos (
  id uuid default gen_random_uuid() primary key,
  dog_id uuid references public.dogs(id) on delete cascade not null,
  storage_path text not null unique,
  is_primary boolean not null default false,
  created_at timestamp with time zone not null default timezone('utc'::text, now())
);

create unique index if not exists one_primary_photo_per_dog
  on public.dog_photos(dog_id)
  where is_primary = true;

create index if not exists dogs_owner_id_idx on public.dogs(owner_id);
create index if not exists dogs_status_idx on public.dogs(status);
create index if not exists dogs_location_idx on public.dogs(latitude, longitude);
create index if not exists dog_photos_dog_id_idx on public.dog_photos(dog_id);

-- 7) RLS for application tables.
alter table public.dogs enable row level security;
alter table public.dog_photos enable row level security;

drop policy if exists "Public can view active dog reports" on public.dogs;
create policy "Public can view active dog reports"
on public.dogs for select
using (status in ('missing', 'spotted', 'reunited'));

drop policy if exists "Owners can create dog reports" on public.dogs;
create policy "Owners can create dog reports"
on public.dogs for insert to authenticated
with check (auth.uid() = owner_id);

drop policy if exists "Owners can update dog reports" on public.dogs;
create policy "Owners can update dog reports"
on public.dogs for update to authenticated
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

drop policy if exists "Owners can delete dog reports" on public.dogs;
create policy "Owners can delete dog reports"
on public.dogs for delete to authenticated
using (auth.uid() = owner_id);

drop policy if exists "Public can view dog photos" on public.dog_photos;
create policy "Public can view dog photos"
on public.dog_photos for select
using (true);

drop policy if exists "Owners can create dog photo rows" on public.dog_photos;
create policy "Owners can create dog photo rows"
on public.dog_photos for insert to authenticated
with check (
  exists (
    select 1 from public.dogs
    where dogs.id = dog_photos.dog_id
      and dogs.owner_id = auth.uid()
  )
);

-- 8) Storage bucket + policies.
insert into storage.buckets (id, name, public)
values ('dog-photos', 'dog-photos', true)
on conflict (id) do nothing;

drop policy if exists "Public can view dog photo files" on storage.objects;
create policy "Public can view dog photo files"
on storage.objects for select
using (bucket_id = 'dog-photos');

drop policy if exists "Users can upload their dog photos" on storage.objects;
create policy "Users can upload their dog photos"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'dog-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can delete their dog photos" on storage.objects;
create policy "Users can delete their dog photos"
on storage.objects for delete to authenticated
using (
  bucket_id = 'dog-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- 9) Found-animal reports. These are separate from public.dogs because the
--    finder usually does not know the owner and the animal may not match an
--    existing missing-dog report yet.
create table if not exists public.found_reports (
  id uuid default gen_random_uuid() primary key,
  reporter_id uuid references public.profiles(id) on delete cascade not null,
  matched_missing_dog_id uuid references public.dogs(id) on delete set null,
  breed text,
  color text not null,
  size text not null default 'unknown',
  collar_status text not null default 'unsure',
  found_at date not null,
  city text not null,
  zip_code text not null,
  details text,
  status text not null default 'unmatched',
  created_at timestamp with time zone not null default timezone('utc'::text, now()),
  updated_at timestamp with time zone not null default timezone('utc'::text, now()),
  constraint found_reports_size_check
    check (size in ('small', 'medium', 'large', 'unknown')),
  constraint found_reports_collar_status_check
    check (collar_status in ('yes', 'no', 'unsure')),
  constraint found_reports_status_check
    check (status in ('unmatched', 'possible_match', 'confirmed_match', 'reunited', 'closed')),
  constraint found_reports_zip_check
    check (zip_code ~ '^[0-9]{5}$')
);

create index if not exists found_reports_reporter_id_idx
  on public.found_reports(reporter_id);
create index if not exists found_reports_status_idx
  on public.found_reports(status);
create index if not exists found_reports_city_idx
  on public.found_reports(city);
create index if not exists found_reports_zip_code_idx
  on public.found_reports(zip_code);
create index if not exists found_reports_matched_missing_dog_idx
  on public.found_reports(matched_missing_dog_id);

-- 10) Found-report photos.
create table if not exists public.found_report_photos (
  id uuid default gen_random_uuid() primary key,
  found_report_id uuid references public.found_reports(id) on delete cascade not null,
  storage_path text not null unique,
  is_primary boolean not null default false,
  created_at timestamp with time zone not null default timezone('utc'::text, now())
);

create unique index if not exists one_primary_photo_per_found_report
  on public.found_report_photos(found_report_id)
  where is_primary = true;

create index if not exists found_report_photos_report_id_idx
  on public.found_report_photos(found_report_id);

-- 11) RLS for found reports and their photo rows.
alter table public.found_reports enable row level security;
alter table public.found_report_photos enable row level security;

drop policy if exists "Public can view found reports" on public.found_reports;
create policy "Public can view found reports"
on public.found_reports for select
using (status <> 'closed');

drop policy if exists "Reporters can create found reports" on public.found_reports;
create policy "Reporters can create found reports"
on public.found_reports for insert to authenticated
with check (auth.uid() = reporter_id);

drop policy if exists "Reporters can update found reports" on public.found_reports;
create policy "Reporters can update found reports"
on public.found_reports for update to authenticated
using (auth.uid() = reporter_id)
with check (auth.uid() = reporter_id);

drop policy if exists "Reporters can delete found reports" on public.found_reports;
create policy "Reporters can delete found reports"
on public.found_reports for delete to authenticated
using (auth.uid() = reporter_id);

drop policy if exists "Public can view found report photos" on public.found_report_photos;
create policy "Public can view found report photos"
on public.found_report_photos for select
using (true);

drop policy if exists "Reporters can create found report photo rows" on public.found_report_photos;
create policy "Reporters can create found report photo rows"
on public.found_report_photos for insert to authenticated
with check (
  exists (
    select 1
    from public.found_reports
    where found_reports.id = found_report_photos.found_report_id
      and found_reports.reporter_id = auth.uid()
  )
);

-- 12) Found-report photo storage bucket and policies.
insert into storage.buckets (id, name, public)
values ('found-report-photos', 'found-report-photos', true)
on conflict (id) do nothing;

drop policy if exists "Public can view found report photo files" on storage.objects;
create policy "Public can view found report photo files"
on storage.objects for select
using (bucket_id = 'found-report-photos');

drop policy if exists "Users can upload found report photos" on storage.objects;
create policy "Users can upload found report photos"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'found-report-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can delete found report photos" on storage.objects;
create policy "Users can delete found report photos"
on storage.objects for delete to authenticated
using (
  bucket_id = 'found-report-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);
