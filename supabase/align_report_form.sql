-- Run this in the Supabase SQL Editor before deploying the updated report form.
-- It aligns public.dogs with the fields submitted by app/report/actions.ts.

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
  add column if not exists reward_offered boolean not null default false,
  add column if not exists reward_amount numeric(10,2);

-- Add constraints only if they do not already exist.
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

-- Keep the existing last_seen_date for compatibility, but backfill last_seen_at.
update public.dogs
set last_seen_at = coalesce(last_seen_at, last_seen_date::timestamp at time zone 'UTC')
where last_seen_at is null;

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

-- RLS for the application tables.
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

-- Create the Storage bucket if it does not yet exist.
insert into storage.buckets (id, name, public)
values ('dog-photos', 'dog-photos', true)
on conflict (id) do nothing;

-- Storage object policies: each path starts with the authenticated user's UUID.
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
