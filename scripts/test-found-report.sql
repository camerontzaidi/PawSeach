-- After submitting a found-animal report through the app, use these queries
-- in the Supabase SQL Editor to verify the report/photo relationship.

select
  fr.id,
  fr.reporter_id,
  fr.breed,
  fr.color,
  fr.size,
  fr.collar_status,
  fr.found_at,
  fr.city,
  fr.zip_code,
  fr.status,
  fr.created_at
from public.found_reports fr
order by fr.created_at desc
limit 20;

select
  fr.id as found_report_id,
  fr.city,
  fr.zip_code,
  frp.id as photo_id,
  frp.storage_path,
  frp.is_primary
from public.found_reports fr
left join public.found_report_photos frp
  on frp.found_report_id = fr.id
order by fr.created_at desc, frp.is_primary desc;

select count(*) as orphaned_found_report_photos
from public.found_report_photos frp
left join public.found_reports fr
  on fr.id = frp.found_report_id
where fr.id is null;
