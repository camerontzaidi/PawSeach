# Supabase changes required for the report form

The application now writes one combined row to `public.dogs`, matching the table already created in Supabase. It no longer expects separate `missing_reports` or `missing_report_photos` tables.

Before testing the form, run `supabase/align_report_form.sql` in the Supabase SQL Editor. It:

- adds the additional form columns to `public.dogs`;
- creates `public.dog_photos`;
- creates the public `dog-photos` Storage bucket;
- adds table and Storage Row Level Security policies;
- adds indexes and validation constraints.

## Authentication prerequisite

`public.dogs.owner_id` references `public.profiles(id)`. The report action sets `owner_id` to `auth.getUser().user.id`, so every authenticated user must have a profile row with the same UUID.

Check this with:

```sql
select au.id as auth_user_id, p.id as profile_id
from auth.users au
left join public.profiles p on p.id = au.id;
```

Any row with a null `profile_id` cannot submit a report until its profile row is created. Ideally, signup should automatically create the matching profile.

## Mapbox transition

Latitude and longitude are currently visible number inputs. They are required because the existing Supabase table marks them `not null`. When the Mapbox picker is ready, it should populate inputs named `latitude` and `longitude`; the server action will not need to change.

## Existing `last_seen_date`

The migration retains `last_seen_date` for compatibility but adds `last_seen_at`, which preserves both date and time. New submissions write to `last_seen_at`. Once all pages use `last_seen_at`, `last_seen_date` can be removed in a later migration.
