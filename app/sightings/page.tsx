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
  color: string | null;
  city: string;
  zip_code: string | null;
  found_at: string;
  details: string | null;
  status: string;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
};

type ReunitedDog = {
  id: string;
  dog_name: string;
  breed: string | null;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  status: string;
  created_at: string;
  last_seen_at: string | null;
  location_description: string | null;
};

type FoundPhoto = {
  found_report_id: string;
  storage_path: string;
};

type DogPhoto = {
  dog_id: string;
  storage_path: string;
};

type DisplayReport = {
  id: string;
  type: "found" | "reunited";
  name: string;
  breed: string;
  color: string;
  city: string;
  zip: string;
  date: string;
  details: string | null;
  status: string;
  latitude: number | null;
  longitude: number | null;
  photoUrl: string | null;
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

  // ==================================================
  // GET ACTUAL FOUND REPORTS
  // ==================================================

  let foundQuery = supabase
    .from("found_reports")
    .select(
      `
        id,
        breed,
        color,
        city,
        zip_code,
        found_at,
        details,
        status,
        latitude,
        longitude,
        created_at
      `,
    )
    .neq("status", "closed")
    .order("created_at", { ascending: false })
    .limit(50);

  if (city) {
    foundQuery = foundQuery.ilike(
      "city",
      `%${city}%`,
    );
  }

  if (zipCodes.length > 0) {
    foundQuery = foundQuery.in(
      "zip_code",
      zipCodes,
    );
  }

  const {
    data: foundData,
    error: foundError,
  } = await foundQuery;

  const foundReports =
    (foundData ?? []) as FoundReport[];

  // ==================================================
  // GET REUNITED DOGS
  //
  // These are dogs that originally lived in the
  // "dogs" table but were marked as reunited.
  // ==================================================

  let reunitedQuery = supabase
    .from("dogs")
    .select(
      `
        id,
        dog_name,
        breed,
        description,
        latitude,
        longitude,
        status,
        created_at,
        last_seen_at,
        location_description
      `,
    )
    .eq("status", "reunited")
    .order("created_at", {
      ascending: false,
    })
    .limit(50);

  const {
    data: reunitedData,
    error: reunitedError,
  } = await reunitedQuery;

  const reunitedDogs =
    (reunitedData ?? []) as ReunitedDog[];

  // ==================================================
  // LOAD FOUND REPORT PHOTOS
  // ==================================================

  const foundPhotoByReport =
    new Map<string, string>();

  if (foundReports.length > 0) {
    const {
      data: photoRows,
      error: photoError,
    } = await supabase
      .from("found_report_photos")
      .select(
        "found_report_id, storage_path",
      )
      .in(
        "found_report_id",
        foundReports.map(
          (report) => report.id,
        ),
      )
      .eq("is_primary", true);

    if (photoError) {
      console.error(
        "Error loading found report photos:",
        photoError,
      );
    }

    for (const row of (photoRows ??
      []) as FoundPhoto[]) {
      const { data: publicUrl } =
        supabase.storage
          .from("found-report-photos")
          .getPublicUrl(
            row.storage_path,
          );

      foundPhotoByReport.set(
        row.found_report_id,
        publicUrl.publicUrl,
      );
    }
  }

  // ==================================================
  // LOAD REUNITED DOG PHOTOS
  // ==================================================

  const dogPhotoByDog =
    new Map<string, string>();

  if (reunitedDogs.length > 0) {
    const {
      data: dogPhotoRows,
      error: dogPhotoError,
    } = await supabase
      .from("dog_photos")
      .select(
        "dog_id, storage_path",
      )
      .in(
        "dog_id",
        reunitedDogs.map(
          (dog) => dog.id,
        ),
      )
      .eq("is_primary", true);

    if (dogPhotoError) {
      console.error(
        "Error loading reunited dog photos:",
        dogPhotoError,
      );
    }

    for (const row of (dogPhotoRows ??
      []) as DogPhoto[]) {
      const { data: publicUrl } =
        supabase.storage
          .from("dog-photos")
          .getPublicUrl(
            row.storage_path,
          );

      dogPhotoByDog.set(
        row.dog_id,
        publicUrl.publicUrl,
      );
    }
  }

  // ==================================================
  // COMBINE FOUND + REUNITED REPORTS
  // ==================================================

  const actualFoundReports: DisplayReport[] =
    foundReports.map((report) => ({
      id: report.id,
      type: "found",
      name:
        report.breed ||
        "Found Animal",
      breed:
        report.breed ||
        "Unknown breed",
      color:
        report.color ||
        "Unknown",
      city: report.city,
      zip:
        report.zip_code ||
        "",
      date: report.found_at,
      details: report.details,
      status: report.status,
      latitude: report.latitude,
      longitude: report.longitude,
      photoUrl:
        foundPhotoByReport.get(
          report.id,
        ) ?? null,
    }));

  const reunitedReports: DisplayReport[] =
    reunitedDogs.map((dog) => ({
      id: dog.id,
      type: "reunited",
      name: dog.dog_name,
      breed:
        dog.breed ||
        "Unknown breed",
      color: "Unknown",
      city:
        dog.location_description ||
        "Location unavailable",
      zip: "",
      date:
        dog.last_seen_at ||
        dog.created_at,
      details:
        dog.description,
      status: "reunited",
      latitude: dog.latitude,
      longitude: dog.longitude,
      photoUrl:
        dogPhotoByDog.get(
          dog.id,
        ) ?? null,
    }));

  // ==================================================
  // COMBINE EVERYTHING
  // ==================================================

  let reports = [
    ...actualFoundReports,
    ...reunitedReports,
  ];

  // ==================================================
  // FILTER REUNITED DOGS BY CITY / ZIP
  //
  // Found reports are already filtered by Supabase.
  // Reunited dogs don't necessarily have separate
  // city/zip columns, so we filter their location
  // description here when a city is provided.
  // ==================================================

  if (city) {
    const normalizedSearchCity =
      city.toLowerCase();

    reports = reports.filter(
      (report) => {
        if (report.type === "found") {
          return true;
        }

        return report.city
          .toLowerCase()
          .includes(
            normalizedSearchCity,
          );
      },
    );
  }

  // ==================================================
  // MAP REPORTS
  // ==================================================

  const mapReports = reports
    .filter(
      (report) =>
        report.latitude !== null &&
        report.longitude !== null,
    )
    .map((report) => ({
      id: report.id,
      name: report.name,
      breed: report.breed,
      location:
        report.zip
          ? `${report.city}, ${report.zip}`
          : report.city,
      latitude:
        report.latitude as number,
      longitude:
        report.longitude as number,
      status:
        "Found" as const,
    }));

  // ==================================================
  // MAP CENTER
  //
  // Use REAL DATABASE COORDINATES.
  // No hardcoded city coordinates.
  // ==================================================

  const mapCenter =
    mapReports.length > 0
      ? {
          latitude:
            mapReports[0].latitude,
          longitude:
            mapReports[0].longitude,
        }
      : {
          latitude: 39.8283,
          longitude: -98.5795,
        };

  const mapZoom =
    mapReports.length > 0
      ? 12
      : 4;

  // ==================================================
  // ERROR HANDLING
  // ==================================================

  const hasDatabaseError =
    !!foundError ||
    !!reunitedError;

  if (foundError) {
    console.error(
      "Error loading found reports:",
      foundError,
    );
  }

  if (reunitedError) {
    console.error(
      "Error loading reunited dogs:",
      reunitedError,
    );
  }

  // ==================================================
  // PAGE
  // ==================================================

  return (
    <main className="min-h-screen bg-[#003d35] px-6 py-16 text-white">
      <section className="mx-auto max-w-6xl">

        {/* HEADER */}

        <div className="max-w-3xl">
          <span className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">
            Found Pets
          </span>

          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">
            Search Found Dogs
          </h1>

          <p className="mt-4 text-lg leading-relaxed text-[#b7d5ce]">
            Search found animal reports and
            reunited pets from the PawSearch
            community.
          </p>
        </div>

        {/* SEARCH CARD */}

        <section className="mt-8 rounded-2xl border border-[#1b5b51] bg-[#06483f] p-5 shadow-lg sm:p-8">

          <h2 className="text-2xl font-bold">
            Find Found Dogs
          </h2>

          <p className="mt-1 text-[#b7d5ce]">
            Enter a location to narrow your search.
          </p>

          <form
            className="mt-6"
            method="get"
          >
            <div className="grid gap-6 md:grid-cols-2">

              {/* CITY */}

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
                  Add multiple ZIP codes for
                  a more specific search.
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

        {/* MAP */}

        <section className="mt-8">

          <div className="mb-4">

            <h2 className="text-2xl font-bold">
              {city
                ? `Found Dogs in ${city}`
                : "Found Dogs Map"}
            </h2>

            <p className="mt-1 text-[#b7d5ce]">
              {city
                ? `Showing found and reunited pet reports near ${city}.`
                : "Explore found and reunited pet reports across the United States."}
            </p>

          </div>

          <ReportMap
            reports={mapReports}
            center={mapCenter}
            zoom={mapZoom}
          />

        </section>

        {/* RESULTS */}

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

          {/* ERROR */}

          {hasDatabaseError ? (

            <p className="mt-6 rounded-lg border border-red-400 bg-red-900/30 p-4 text-red-100">
              Unable to load found-animal
              reports right now.
            </p>

          ) : reports.length === 0 ? (

            /* EMPTY STATE */

            <div className="mt-6 rounded-2xl border border-[#1b5b51] bg-[#06483f] px-6 py-12 text-center">

              <div className="text-5xl">
                🔎
              </div>

              <h3 className="mt-4 text-2xl font-bold">
                No found dogs found
              </h3>

              <p className="mx-auto mt-2 max-w-lg text-[#b7d5ce]">
                No found or reunited pet
                reports match this search yet.
                Try another city or ZIP code.
              </p>

            </div>

          ) : (

            /* RESULTS GRID */

            <div className="mt-6 grid gap-6 md:grid-cols-2">

              {reports.map((report) => {

                const isReunited =
                  report.type ===
                  "reunited";

                const href =
                  isReunited
                    ? `/dogs/${report.id}`
                    : `/sightings/${report.id}`;

                return (
                  <Link
                    key={`${report.type}-${report.id}`}
                    href={href}
                    className="group overflow-hidden rounded-xl border border-[#1b5b51] bg-[#06483f] p-6 transition hover:-translate-y-1 hover:border-[#fbb12c] hover:shadow-lg"
                  >

                    {/* PHOTO */}

                    <div
                      className="flex h-48 items-center justify-center rounded-lg bg-[#003d35] bg-cover bg-center text-6xl"
                      style={
                        report.photoUrl
                          ? {
                              backgroundImage:
                                `url(${report.photoUrl})`,
                            }
                          : undefined
                      }
                    >
                      {!report.photoUrl &&
                        "🐶"}
                    </div>

                    {/* STATUS */}

                    <div className="mt-5">

                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
                          isReunited
                            ? "bg-[#078c78] text-white"
                            : "bg-[#fbb12c] text-[#003d35]"
                        }`}
                      >
                        {isReunited
                          ? "Reunited"
                          : "Found"}
                      </span>

                    </div>

                    {/* NAME / BREED */}

                    <h3 className="mt-4 text-2xl font-bold">
                      {report.name}
                    </h3>

                    <p className="mt-2 text-[#b7d5ce]">
                      {report.breed}
                    </p>

                    {/* LOCATION */}

                    <p className="mt-3 text-[#c3ded8]">
                      📍{" "}
                      {isReunited
                        ? report.city
                        : `Found near ${report.city}`}
                    </p>

                    {/* ZIP */}

                    {report.zip && (
                      <p className="mt-2 text-[#b7d5ce]">
                        ZIP: {report.zip}
                      </p>
                    )}

                    {/* DATE */}

                    <p className="mt-2 text-[#b7d5ce]">
                      {isReunited
                        ? "Last seen on "
                        : "Found on "}
                      {new Date(
                        `${report.date}T00:00:00`,
                      ).toLocaleDateString()}
                    </p>

                    {/* DETAILS */}

                    {report.details && (
                      <p className="mt-4 line-clamp-3 text-[#c3ded8]">
                        {report.details}
                      </p>
                    )}

                    {/* BUTTON */}

                    <span
                      className={`mt-5 inline-block rounded-md px-5 py-2 font-bold ${
                        isReunited
                          ? "bg-[#078c78] text-white"
                          : "bg-[#fbb12c] text-[#003d35]"
                      }`}
                    >
                      {isReunited
                        ? "View Reunited Pet →"
                        : "View Report →"}
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