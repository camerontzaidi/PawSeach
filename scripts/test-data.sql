-- Development-only relationship checks for the current combined public.dogs schema.
-- Replace the UUID below with an existing public.profiles.id.

insert into public.dogs (
  owner_id,
  dog_name,
  breed,
  description,
  primary_color,
  sex,
  size,
  last_seen_date,
  last_seen_at,
  location_description,
  latitude,
  longitude,
  status
)
values (
  'REPLACE-WITH-A-REAL-PROFILE-UUID',
  'Milo',
  'Golden Retriever',
  'Friendly dog wearing a blue collar.',
  'gold',
  'male',
  'large',
  current_date,
  now(),
  'Example neighborhood park',
  38.581600,
  -121.494400,
  'missing'
)
returning id;

-- After replacing DOG_UUID with the returned id:
insert into public.dog_photos (dog_id, storage_path, is_primary)
values ('DOG_UUID', 'test-user/DOG_UUID/example.jpg', true);

-- Verify owner and photo relationships.
select
  d.id,
  d.dog_name,
  d.owner_id,
  d.status,
  p.id as photo_id,
  p.storage_path,
  p.is_primary
from public.dogs d
left join public.dog_photos p on p.dog_id = d.id
order by d.created_at desc;

-- Should return zero.
select count(*) as orphaned_photos
from public.dog_photos p
left join public.dogs d on d.id = p.dog_id
where d.id is null;
