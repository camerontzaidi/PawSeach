-- Run this in the Supabase SQL Editor to add the found-animal reporting backend.
-- Safe to rerun because tables, indexes, bucket, and policies are created idempotently.

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
