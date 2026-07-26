# Missing-report submission implementation

## Added files

- `lib/validation/missing-report.ts`: shared Zod schema and `FormData` conversion.
- `app/report/actions.ts`: authenticated server action that inserts a dog and report, uploads photos, inserts photo rows, and performs best-effort rollback on failure.
- `scripts/test-data.sql`: development-only sample inserts and relationship checks.

## Updated files

- `app/report/page.tsx`: real form fields, server submission, loading state, and clear success/error output.
- `next.config.ts`: raises the Server Action request limit to 30 MB for up to five 5 MB photos plus form overhead.
- `package.json` and `package-lock.json`: add Zod.

## Required Supabase setup

1. Create a Storage bucket named `missing-report-photos`.
2. Ensure the database includes `dogs`, `missing_reports`, and `missing_report_photos` with the column names used by the action.
3. Ensure the authenticated user's UUID can be stored in `dogs.owner_id`. If `owner_id` references a custom `users` or `profiles` table, create the corresponding row when a user signs up.
4. Add RLS policies allowing authenticated owners to insert and delete their own dog/report records and upload/delete objects beneath a path beginning with their user UUID.
5. Replace the temporary `0,0` report coordinates once map/geocoding support is implemented.

## Run locally

```bash
npm install
npm run dev
```

Use a signed-in test account, submit the form, and confirm that one row appears in each of:

- `dogs`
- `missing_reports`
- `missing_report_photos` (one row per uploaded image)

The `dogs.owner_id` value should match the signed-in user's Supabase Auth UUID.
