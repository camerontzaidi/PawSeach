import { createClient } from "@/utils/supabase/server";

export type MissingReportRecord = {
  id: string;
  owner_id: string;
  dog_name: string;
  breed: string | null;
  description: string | null;
  circumstances: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  sex: string | null;
  size: string | null;
  estimated_birth_year: number | null;
  microchipped: boolean | null;
  last_seen_at: string | null;
  time_is_approximate: boolean | null;
  location_description: string | null;
  latitude: number | null;
  longitude: number | null;
  reward_offered: boolean | null;
  reward_amount: number | null;
  status: string;
  created_at: string;
  closed_at: string | null;
};

export type FoundReportRecord = {
  id: string;
  reporter_id: string;
  matched_missing_dog_id: string | null;
  breed: string | null;
  color: string;
  size: string;
  collar_status: string;
  found_at: string;
  city: string;
  zip_code: string;
  latitude: number | null;
  longitude: number | null;
  details: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
};

type PhotoRow = {
  storage_path: string;
  is_primary: boolean;
};

function publicPhotoUrl(
  supabase: Awaited<ReturnType<typeof createClient>>,
  bucket: string,
  storagePath: string,
) {
  return supabase.storage.from(bucket).getPublicUrl(storagePath).data.publicUrl;
}

export async function getMissingReport(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("dogs")
    .select(
      "id, owner_id, dog_name, breed, description, circumstances, primary_color, secondary_color, sex, size, estimated_birth_year, microchipped, last_seen_at, time_is_approximate, location_description, latitude, longitude, reward_offered, reward_amount, status, created_at, closed_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;

  const { data: photoRows } = await supabase
    .from("dog_photos")
    .select("storage_path, is_primary")
    .eq("dog_id", id)
    .order("is_primary", { ascending: false })
    .order("created_at", { ascending: true });

  const photos = ((photoRows ?? []) as PhotoRow[]).map((photo) =>
    publicPhotoUrl(supabase, "dog-photos", photo.storage_path),
  );

  return { report: data as MissingReportRecord, photos };
}

export async function getFoundReport(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("found_reports")
    .select(
      "id, reporter_id, matched_missing_dog_id, breed, color, size, collar_status, found_at, city, zip_code, latitude, longitude, details, status, created_at, updated_at, closed_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;

  const { data: photoRows } = await supabase
    .from("found_report_photos")
    .select("storage_path, is_primary")
    .eq("found_report_id", id)
    .order("is_primary", { ascending: false })
    .order("created_at", { ascending: true });

  const photos = ((photoRows ?? []) as PhotoRow[]).map((photo) =>
    publicPhotoUrl(supabase, "found-report-photos", photo.storage_path),
  );

  return { report: data as FoundReportRecord, photos };
}

export async function getCurrentUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export async function getCurrentUserDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const [{ data: missingData }, { data: foundData }] = await Promise.all([
    supabase
      .from("dogs")
      .select("id, dog_name, breed, location_description, status, created_at")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("found_reports")
      .select("id, breed, color, city, zip_code, status, found_at, created_at")
      .eq("reporter_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const missing = missingData ?? [];
  const found = foundData ?? [];

  const missingIds = missing.map((row) => row.id);
  const foundIds = found.map((row) => row.id);
  const missingPhotos = new Map<string, string>();
  const foundPhotos = new Map<string, string>();

  if (missingIds.length > 0) {
    const { data } = await supabase
      .from("dog_photos")
      .select("dog_id, storage_path")
      .in("dog_id", missingIds)
      .eq("is_primary", true);

    for (const row of data ?? []) {
      missingPhotos.set(
        row.dog_id,
        publicPhotoUrl(supabase, "dog-photos", row.storage_path),
      );
    }
  }

  if (foundIds.length > 0) {
    const { data } = await supabase
      .from("found_report_photos")
      .select("found_report_id, storage_path")
      .in("found_report_id", foundIds)
      .eq("is_primary", true);

    for (const row of data ?? []) {
      foundPhotos.set(
        row.found_report_id,
        publicPhotoUrl(supabase, "found-report-photos", row.storage_path),
      );
    }
  }

  return { user, missing, found, missingPhotos, foundPhotos };
}
