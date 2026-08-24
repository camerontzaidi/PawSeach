import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import ReportMap from "@/components/ReportMap";

type SearchParams = {
  city?: string;
  zip?: string;
};

type FoundReport = {
  id: string;
  breed: string | null;
  color: string;
  city: string;
  zip_code: string;
  found_at: string;
  details: string | null;
  status: string;
  latitude: number | null;
  longitude: number | null;
};

type FoundPhoto = {
  found_report_id: string;
  storage_path: string;
};

export default async function SightingsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const city = params.city?.trim() ?? "";
  const zipInput = params.zip?.trim() ?? "";

  const zipCodes = zipInput
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  const supabase = await createClient();

  let query = supabase
    .from("found_reports")
    .select(
      "id, breed, color, city, zip_code, found_at, details, status, latitude, longitude",
    )
    .neq("status", "closed")
    .order("created_at", { ascending: false })
    .limit(50);

  if (city) {
    query = query.ilike("city", `%${city}%`);
  }

  if (zipCodes.length > 0) {
    query = query.in("zip_code", zipCodes);
  }

  const { data, error } = await query;

  const reports = (data ?? []) as FoundReport[];

  /* -----------------------------
     Load primary photos
  ----------------------------- */

  const photoByReport = new Map<string, string>();

  if (reports.length > 0) {
    const { data: photoRows } = await supabase
      .from("found_report_photos")
      .select("found_report_id, storage_path")
      .in(
        "found_report_id",
        reports.map((report) => report.id),
      )
      .eq("is_primary", true);

    for (const row of (photoRows ?? []) as FoundPhoto[]) {
      const { data: publicUrl } = supabase.storage
        .from("found-report-photos")
        .getPublicUrl(row.storage_path);

      photoByReport.set(
        row.found_report_id,
        publicUrl.publicUrl,
      );
    }
  }

  /* -----------------------------
     Only send reports with valid
     coordinates to the map
  ----------------------------- */

  const mapReports = reports
    .filter(
      (report) =>
        report.latitude !== null &&
        report.longitude !== null,
    )
    .map((report) => ({
      id: report.id,
      name: report.breed || "Unknown breed",
      breed: report.breed || "Unknown breed",
      location: `${report.city}, ${report.zip_code}`,
      latitude: report.latitude as number,
      longitude: report.longitude as number,
      status: "Found" as const,
    }));

  /* -----------------------------
     Map center
  ----------------------------- */

  const cityCoordinates: Record<
    string,
    { latitude: number; longitude: number }
  > = {
    fremont: {
      latitude: 37.5485,
      longitude: -121.9886,
    },
    "san jose": {
      latitude: 37.3382,
      longitude: -121.8863,
    },
    oakland: {
      latitude: 37.8044,
      longitude: -122.2712,
    },
    "san francisco": {
      latitude: 37.7749,
      longitude: -122.4194,
    },
    sacramento: {
      latitude: 38.5816,
      longitude: -121.4944,
    },
    "los angeles": {
      latitude: 34.0522,
      longitude: -118.2437,
    },
    "new york": {
      latitude: 40.7128,
      longitude: -74.006,
    },
  };

  const normalizedCity = city.toLowerCase();

  const searchedCityCoordinates =
    cityCoordinates[normalizedCity];

  const mapCenter =
    mapReports.length > 0
      ? {
          latitude: mapReports[0].latitude,
          longitude: mapReports[0].longitude,
        }
      : searchedCityCoordinates
        ? searchedCityCoordinates
        : {
            latitude: 39.8283,
            longitude: -98.5795,
          };

  const mapZoom =
    mapReports.length > 0 || searchedCityCoordinates
      ? 12
      : 4;

  return (
    <main className="min-h-screen bg-[#003d35] px-6 py-16 text-white">
      <section className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="max-w-3xl">
          <span className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">
            Found Pets
          </span>

          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">
            Search Found Dogs
          </h1>

          <p className="mt-4 text-lg leading-relaxed text-[#b7d5ce]">
            Search found animal reports from community members.
            Use a city or ZIP code to find possible matches.
          </p>
        </div>

        {/* Search Card */}
        <section className="mt-8 rounded-2xl border border-[#1b5b51] bg-[#06483f] p-5 shadow-lg sm:p-8">
          <h2 className="text-2xl font-bold">
            Find Found Dogs
          </h2>

          <p className="mt-1 text-[#b7d5ce]">
            Enter a location to narrow your search.
          </p>

          <form className="mt-6" method="get">
            <div className="grid gap-6 md:grid-cols-2">

              {/* City */}
              <div>
                <label
                  htmlFor="city"
                  className="font-semibold"
                >
                  City
                </label>

                <input
                  id="city"
                  name="city"
                  defaultValue={city}
                  placeholder="Example: Fremont"
                  className="mt-2 w-full rounded-md border border-[#1b5b51] bg-[#003d35] px-4 py-3 text-white placeholder:text-[#9bbab3] outline-none focus:border-[#fbb12c]"
                />

                <p className="mt-2 text-sm text-[#b7d5ce]">
                  Search a broader area by city.
                </p>
              </div>

              {/* ZIP */}
              <div>
                <label
                  htmlFor="zip"
                  className="font-semibold"
                >
                  ZIP Codes
                </label>

                <input
                  id="zip"
                  name="zip"
                  defaultValue={zipInput}
                  placeholder="Example: 94538, 94536"
                  className="mt-2 w-full rounded-md border border-[#1b5b51] bg-[#003d35] px-4 py-3 text-white placeholder:text-[#9bbab3] outline-none focus:border-[#fbb12c]"
                />

                <p className="mt-2 text-sm text-[#b7d5ce]">
                  Add multiple ZIP codes for a more specific search.
                </p>
              </div>

            </div>

            <button
              type="submit"
              className="mt-6 rounded-md bg-[#078c78] px-8 py-3 font-bold text-white transition hover:bg-[#09a38c]"
            >
              Search Found Dogs
            </button>
          </form>
        </section>

        {/* Map */}
        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-2xl font-bold">
              {city
                ? `Found Dogs in ${city}`
                : "Found Dogs Map"}
            </h2>

            <p className="mt-1 text-[#b7d5ce]">
              {city
                ? `Showing found-dog reports near ${city}.`
                : "Explore found-dog reports across the United States."}
            </p>
          </div>

          <ReportMap
            reports={mapReports}
            center={mapCenter}
            zoom={mapZoom}
          />
        </section>

        {/* Results */}
        <section className="mt-12">
          <div>
            <h2 className="text-3xl font-bold">
              {city || zipInput
                ? "Search Results"
                : "Found Dogs Near You"}
            </h2>

            <p className="mt-1 text-[#b7d5ce]">
              {reports.length}{" "}
              {reports.length === 1
                ? "report"
                : "reports"}{" "}
              found
            </p>
          </div>

          {/* Database Error */}
          {error ? (
            <p className="mt-6 rounded-lg border border-red-400 bg-red-900/30 p-4 text-red-100">
              Unable to load found-animal reports right now.
            </p>
          ) : reports.length === 0 ? (

            /* Empty State */
            <div className="mt-6 rounded-2xl border border-[#1b5b51] bg-[#06483f] px-6 py-12 text-center">
              <div className="text-5xl">
                🔎
              </div>

              <h3 className="mt-4 text-2xl font-bold">
                No found dogs found
              </h3>

              <p className="mx-auto mt-2 max-w-lg text-[#b7d5ce]">
                No found-animal reports match this search yet.
                Try another city or ZIP code.
              </p>
            </div>

          ) : (

            /* Results Grid */
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {reports.map((report) => {
                const photoUrl =
                  photoByReport.get(report.id);

                return (
                  <Link
                    key={report.id}
                    href={`/sightings/${report.id}`}
                    className="group overflow-hidden rounded-xl border border-[#1b5b51] bg-[#06483f] p-6 transition hover:-translate-y-1 hover:border-[#fbb12c] hover:shadow-lg"
                  >
                    {/* Photo */}
                    <div
                      className="flex h-48 items-center justify-center rounded-lg bg-[#003d35] bg-cover bg-center text-6xl"
                      style={
                        photoUrl
                          ? {
                              backgroundImage: `url(${photoUrl})`,
                            }
                          : undefined
                      }
                    >
                      {!photoUrl && "🐶"}
                    </div>

                    {/* Breed */}
                    <h3 className="mt-5 text-2xl font-bold">
                      {report.breed || "Unknown breed"}
                    </h3>

                    {/* Color */}
                    <p className="mt-2 text-[#b7d5ce]">
                      Color: {report.color}
                    </p>

                    {/* Location */}
                    <p className="mt-3 text-[#c3ded8]">
                      📍 Found near {report.city}
                    </p>

                    {/* ZIP */}
                    <p className="mt-2 text-[#b7d5ce]">
                      ZIP: {report.zip_code}
                    </p>

                    {/* Date */}
                    <p className="mt-2 text-[#b7d5ce]">
                      Found on{" "}
                      {new Date(
                        `${report.found_at}T00:00:00`,
                      ).toLocaleDateString()}
                    </p>

                    {/* Details */}
                    {report.details && (
                      <p className="mt-4 line-clamp-3 text-[#c3ded8]">
                        {report.details}
                      </p>
                    )}

                    {/* Button */}
                    <span className="mt-5 inline-block rounded-md bg-[#fbb12c] px-5 py-2 font-bold text-[#003d35]">
                      View Report →
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

      </section>
    </main>
  );
}