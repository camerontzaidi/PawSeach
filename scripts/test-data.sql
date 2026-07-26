-- Replace these UUID values with real auth/user IDs from your development project.
-- Run this only in a development database.

BEGIN;

INSERT INTO dogs (
  dog_id,
  owner_id,
  name,
  breed,
  primary_color,
  sex,
  estimated_birth_year,
  size,
  distinctive_features,
  microchipped
)
VALUES (
  '11111111-1111-4111-8111-111111111111',
  'REPLACE-WITH-A-REAL-USER-UUID',
  'Milo',
  'Golden Retriever',
  'golden',
  'male',
  2021,
  'large',
  'Blue collar and a small white patch on chest',
  TRUE
);

INSERT INTO missing_reports (
  report_id,
  dog_id,
  last_seen_at,
  time_is_approximate,
  location_description,
  private_latitude,
  private_longitude,
  public_latitude,
  public_longitude,
  circumstances,
  reward_offered,
  reward_amount,
  report_status
)
VALUES (
  '22222222-2222-4222-8222-222222222222',
  '11111111-1111-4111-8111-111111111111',
  CURRENT_TIMESTAMP - INTERVAL '1 day',
  FALSE,
  'Central Park near the south entrance',
  38.581600,
  -121.494400,
  38.580000,
  -121.490000,
  'Slipped out of the leash during a walk.',
  TRUE,
  100.00,
  'missing'
);

INSERT INTO missing_report_photos (
  report_photo_id,
  report_id,
  photo_url
)
VALUES (
  '33333333-3333-4333-8333-333333333333',
  '22222222-2222-4222-8222-222222222222',
  'development/sample-owner/sample-report/milo.jpg'
);

COMMIT;

-- Verify the three-table relationship.
SELECT
  d.dog_id,
  d.name,
  d.owner_id,
  mr.report_id,
  mr.report_status,
  mrp.report_photo_id,
  mrp.photo_url
FROM dogs AS d
JOIN missing_reports AS mr
  ON mr.dog_id = d.dog_id
LEFT JOIN missing_report_photos AS mrp
  ON mrp.report_id = mr.report_id
WHERE d.dog_id = '11111111-1111-4111-8111-111111111111';

-- Check for orphaned reports or photo records. Both counts should be zero.
SELECT COUNT(*) AS orphaned_reports
FROM missing_reports AS mr
LEFT JOIN dogs AS d ON d.dog_id = mr.dog_id
WHERE d.dog_id IS NULL;

SELECT COUNT(*) AS orphaned_report_photos
FROM missing_report_photos AS mrp
LEFT JOIN missing_reports AS mr ON mr.report_id = mrp.report_id
WHERE mr.report_id IS NULL;
