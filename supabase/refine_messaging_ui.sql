-- PawSearch messaging polish migration.
alter table public.conversations
  add column if not exists owner_name text;

update public.conversations as c
set owner_name = coalesce(
  nullif(btrim(u.raw_user_meta_data ->> 'full_name'), ''),
  nullif(btrim(u.raw_user_meta_data ->> 'name'), ''),
  nullif(btrim(u.raw_user_meta_data ->> 'display_name'), ''),
  nullif(
    btrim(
      concat_ws(
        ' ',
        nullif(btrim(u.raw_user_meta_data ->> 'first_name'), ''),
        nullif(btrim(u.raw_user_meta_data ->> 'last_name'), '')
      )
    ),
    ''
  ),
  split_part(u.email, '@', 1),
  'PawSearch User'
)
from auth.users as u
where u.id = c.owner_id
  and (c.owner_name is null or btrim(c.owner_name) = '');
