# Frontend ↔ Supabase integration handoff

This pass removes the remaining report/profile mock data and connects the requested Ravi workflow to Supabase/server actions.

## Implemented
- `/dashboard`: authenticated user's real missing/found reports, primary photos, locations, statuses, dates, counts, and management controls.
- `/me` + `/profile`: real authenticated user identity, report stats, saved city/ZIP and notification preferences.
- `/dogs`: real active missing reports + primary photos + real map coordinates.
- `/dogs/[id]`: real report, photos, status, location, coordinates, owner-only management controls.
- `/dogs/[id]/edit`: owner-only prepopulated edit form wired to `updateMissingDogReport`.
- `/sightings/[id]`: real found report, photos, location/coordinates, owner-only controls.
- `/sightings/[id]/edit`: owner-only prepopulated edit form wired to `updateFoundAnimalReport`.
- `ReportManagement`: real Edit / Close / Mark Reunited actions for both report types with confirmation.
- `/map` + `ReportMap`: continue consuming real missing/found report data; missing/found markers are visually distinct and link to the correct detail pages.
- Found-report submission continues to write to `found_reports`, link to the authenticated reporter, store photos in `found_report_photos`, and save coordinates.

## Required SQL
Run existing migrations as needed, then run:
1. `supabase/backend_actions_and_map.sql`
2. `supabase/frontend_integration.sql`

The second migration adds city/ZIP and notification preference columns to `profiles` plus self-select/self-update RLS policies.

## Important QA
Use two authenticated test accounts to verify ownership protection. Test create → dashboard → detail → edit → close/reunite for both missing and found reports. Verify closed reports disappear from public browsing but remain visible to their creator on the dashboard.
