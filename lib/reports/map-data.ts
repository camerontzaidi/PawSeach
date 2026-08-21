import { createClient } from "@/utils/supabase/server";

export type MapReport = {
  id: string;
  name: string;
  breed: string;
  location: string;
  latitude: number;
  longitude: number;
  status: "Missing" | "Found";
};

function hasValidCoordinate(value: unknown) {
  return value !== null && value !== undefined && Number.isFinite(Number(value));
}

export async function getMissingMapReports(): Promise<MapReport[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("dogs")
    .select("id, dog_name, breed, location_description, latitude, longitude, status")
    .in("status", ["missing", "spotted"])
    .not("latitude", "is", null)
    .not("longitude", "is", null);

  if (error) {
    console.error("Could not load missing reports for map:", error.message);
    return [];
  }

  return (data ?? [])
    .filter((row) => hasValidCoordinate(row.latitude) && hasValidCoordinate(row.longitude))
    .map((row) => ({
      id: row.id,
      name: row.dog_name || "Missing Dog",
      breed: row.breed || "Unknown breed",
      location: row.location_description || "Location unavailable",
      latitude: Number(row.latitude),
      longitude: Number(row.longitude),
      status: "Missing" as const,
    }));
}

export async function getFoundMapReports(): Promise<MapReport[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("found_reports")
    .select("id, breed, color, city, zip_code, latitude, longitude, status")
    .in("status", ["unmatched", "possible_match", "confirmed_match"])
    .not("latitude", "is", null)
    .not("longitude", "is", null);

  if (error) {
    console.error("Could not load found reports for map:", error.message);
    return [];
  }

  return (data ?? [])
    .filter((row) => hasValidCoordinate(row.latitude) && hasValidCoordinate(row.longitude))
    .map((row) => ({
      id: row.id,
      name: "Found Animal",
      breed: row.breed || row.color || "Unknown breed",
      location: [row.city, row.zip_code].filter(Boolean).join(", ") || "Location unavailable",
      latitude: Number(row.latitude),
      longitude: Number(row.longitude),
      status: "Found" as const,
    }));
}

export async function getMapReports(): Promise<MapReport[]> {
  const [missing, found] = await Promise.all([
    getMissingMapReports(),
    getFoundMapReports(),
  ]);

  return [...missing, ...found];
}
