import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import ReportMap from "@/components/ReportMap";

type SearchParams = {
  city?: string;
  zip?: string;
};

type Dog = {
  id: string;
  name?: string | null;
  dog_name?: string | null;
  breed?: string | null;
  city?: string | null;
  state?: string | null;
  zip_code?: string | null;
  zip?: string | null;
  description?: string | null;
  details?: string | null;
  status: string;
  latitude?: number | null;
  longitude?: number | null;
};

type DogPhoto = {
  id: string;
  dog_id: string;
  storage_path: string;
  is_primary: boolean;
};

type MapCenter = {
  latitude: number;
  longitude: number;
};

const defaultMapCenter: MapCenter = {
  latitude: 39.8283,
  longitude: -98.5795,
};

export default async function DogsPage({
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

  // --------------------------------------------------
  // GET MISSING DOGS
  // --------------------------------------------------

  let query = supabase
    .from("dogs")
    .select("*")
    .eq("status", "missing")
    .order("created_at", { ascending: false });

  if (city) {
    query = query.ilike("city", `%${city}%`);
  }

  if (zipCodes.length > 0) {
    query = query.in("zip_code", zipCodes);
  }

  const {
    data: dogs,
    error,
  } = await query;

  // --------------------------------------------------
  // DATABASE ERROR
  // --------------------------------------------------

  if (error) {
    console.error("DOGS TABLE ERROR:", error);

    return (
      <main className="min-h-screen bg-gradient-to-r from-white via-[#e4e4e4] to-[#b5b5b5] px-4 py-10 text-black sm:px-6 sm:py-16">
        <section className="mx-auto max-w-6xl">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h1 className="text-3xl font-bold">
              Unable to load missing-pet reports right now.
            </h1>

            <p className="mt-4 text-gray-600">
              Supabase returned an error while loading the dogs table.
            </p>

            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 font-mono text-sm text-red-700">
              {error.message}
            </p>
          </div>
        </section>
      </main>
    );
  }

  const reports = (dogs ?? []) as Dog[];

  // --------------------------------------------------
  // LOAD PRIMARY PHOTOS
  // --------------------------------------------------

  const photoByDog = new Map<string, string>();

  if (reports.length > 0) {
    const { data: photoRows, error: photoError } =
      await supabase
        .from("dog_photos")
        .select(
          `
            id,
            dog_id,
            storage_path,
            is_primary
          `,
        )
        .in(
          "dog_id",
          reports.map((dog) => dog.id),
        )
        .order("is_primary", {
          ascending: false,
        });

    if (photoError) {
      console.error(
        "DOG PHOTOS ERROR:",
        photoError,
      );
    }

    for (const row of (photoRows ?? []) as DogPhoto[]) {
      /*
       * Only use the first photo we encounter
       * for each dog because the query orders
       * primary photos first.
       */
      if (photoByDog.has(row.dog_id)) {
        continue;
      }

      const { data: publicUrlData } =
        supabase.storage
          .from("dog-photos")
          .getPublicUrl(row.storage_path);

      if (publicUrlData.publicUrl) {
        photoByDog.set(
          row.dog_id,
          publicUrlData.publicUrl,
        );
      }
    }
  }

  // --------------------------------------------------
  // SEARCH LABEL
  // --------------------------------------------------

  const searchedLocationLabel = [
    city,
    zipInput,
  ]
    .filter(Boolean)
    .join(" ");

  // --------------------------------------------------
  // MAP REPORTS
  // --------------------------------------------------

  const mapReports = reports
    .filter(
      (dog) =>
        dog.latitude !== null &&
        dog.latitude !== undefined &&
        dog.longitude !== null &&
        dog.longitude !== undefined,
    )
    .map((dog) => ({
      id: dog.id,

      name:
        dog.name ||
        dog.dog_name ||
        "Unknown dog",

      breed:
        dog.breed ||
        "Unknown breed",

      location:
        dog.city ||
        "Unknown location",

      latitude: dog.latitude as number,

      longitude: dog.longitude as number,

      status: "Missing" as const,
    }));

  // --------------------------------------------------
  // MAP CENTER
  // --------------------------------------------------

  const mapCenter =
    mapReports.length > 0
      ? {
          latitude: mapReports[0].latitude,
          longitude: mapReports[0].longitude,
        }
      : defaultMapCenter;

  const mapZoom =
    mapReports.length > 0
      ? 11
      : 4;

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <main className="min-h-screen bg-gradient-to-r from-white via-[#e4e4e4] to-[#b5b5b5] px-4 py-10 text-black sm:px-6 sm:py-16">
      <section className="mx-auto max-w-6xl">

        {/* HEADER */}

        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Missing Pets
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Search Missing Pets
          </h1>

          <p className="mt-4 text-lg leading-7 text-gray-600">
            Search missing pet reports by city or ZIP code
            and help bring a lost animal home.
          </p>
        </div>

        {/* SEARCH CARD */}

        <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm sm:p-8">

          <div className="mb-7 flex items-start gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
              01
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                Search Location
              </h2>

              <p className="mt-1 text-gray-600">
                Enter a location to narrow your search.
              </p>
            </div>

          </div>

          <form
            method="get"
            className="grid gap-5 md:grid-cols-2"
          >

            {/* CITY */}

            <div>
              <label
                htmlFor="city"
                className="mb-2 block font-semibold"
              >
                City
              </label>

              <input
                id="city"
                name="city"
                type="text"
                defaultValue={city}
                placeholder="Example: Fremont"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black outline-none transition placeholder:text-gray-400 focus:border-[#fbb12c] focus:ring-2 focus:ring-[#fbb12c]/20"
              />

              <p className="mt-2 text-sm text-gray-500">
                Search by city.
              </p>
            </div>

            {/* ZIP */}

            <div>
              <label
                htmlFor="zip"
                className="mb-2 block font-semibold"
              >
                ZIP Code
              </label>

              <input
                id="zip"
                name="zip"
                type="text"
                defaultValue={zipInput}
                placeholder="Example: 94536"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black outline-none transition placeholder:text-gray-400 focus:border-[#fbb12c] focus:ring-2 focus:ring-[#fbb12c]/20"
              />

              <p className="mt-2 text-sm text-gray-500">
                Search by ZIP code.
              </p>
            </div>

            {/* BUTTONS */}

            <div className="flex flex-wrap gap-3 md:col-span-2">

              <button
                type="submit"
                className="rounded-xl bg-black px-6 py-3 font-bold text-white transition hover:bg-gray-800"
              >
                Search Missing Pets
              </button>

              {(city || zipInput) && (
                <Link
                  href="/dogs"
                  className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-black transition hover:border-gray-500 hover:bg-gray-50"
                >
                  Clear
                </Link>
              )}

            </div>

          </form>
        </section>

        {/* MAP */}

        <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm sm:p-8">

          <div className="mb-6 flex items-start gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
              02
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                {searchedLocationLabel
                  ? `Missing Pets Near ${searchedLocationLabel}`
                  : "Missing Pets Map"}
              </h2>

              <p className="mt-1 text-gray-600">
                {searchedLocationLabel
                  ? `Showing missing-pet reports near ${searchedLocationLabel}.`
                  : "Explore active missing-pet reports across the United States."}
              </p>
            </div>

          </div>

          <div className="overflow-hidden rounded-2xl">
            <ReportMap
              reports={mapReports}
              center={mapCenter}
              zoom={mapZoom}
            />
          </div>

        </section>

        {/* RESULTS */}

        <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm sm:p-8">

          <div className="mb-7 flex items-start gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
              03
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                {searchedLocationLabel
                  ? "Search Results"
                  : "Missing Pets"}
              </h2>

              <p className="mt-1 text-gray-600">
                {reports.length}{" "}
                {reports.length === 1
                  ? "missing pet"
                  : "missing pets"}{" "}
                found
              </p>
            </div>

          </div>

          {/* EMPTY STATE */}

          {reports.length === 0 ? (

            <div className="rounded-2xl border border-gray-200 bg-gray-50 px-6 py-12 text-center">

              <div className="text-5xl">
                🔎
              </div>

              <h3 className="mt-4 text-2xl font-bold">
                No missing pets found
              </h3>

              <p className="mx-auto mt-2 max-w-lg text-gray-600">
                {searchedLocationLabel
                  ? "No missing-pet reports match this location. Try another city or ZIP code."
                  : 'There are currently no rows in the dogs table with a status of "missing".'}
              </p>

            </div>

          ) : (

            /* RESULTS GRID */

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {reports.map((dog) => {

                const dogName =
                  dog.name ||
                  dog.dog_name ||
                  "Unknown dog";

                const location =
                  dog.city ||
                  "Unknown location";

                const dogZip =
                  dog.zip_code ||
                  dog.zip ||
                  "";

                const description =
                  dog.description ||
                  dog.details ||
                  "";

                const photoUrl =
                  photoByDog.get(dog.id);

                return (

                  <Link
                    key={dog.id}
                    href={`/dogs/${dog.id}`}
                    className="group overflow-hidden rounded-3xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:border-gray-400 hover:shadow-lg"
                  >

                    {/* PHOTO */}

                    <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">

                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={`${dogName} - missing pet`}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-7xl">
                          🐕
                        </div>
                      )}

                      <div className="absolute right-4 top-4">
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-black shadow-sm">
                          Missing
                        </span>
                      </div>

                    </div>

                    {/* CONTENT */}

                    <div className="p-6">

                      <h3 className="text-2xl font-bold text-black">
                        {dogName}
                      </h3>

                      <p className="mt-1 text-gray-600">
                        {dog.breed ||
                          "Unknown breed"}
                      </p>

                      <div className="mt-5 space-y-2 text-sm text-gray-600">

                        <p>
                          📍 {location}
                        </p>

                        {dogZip && (
                          <p>
                            📮 {dogZip}
                          </p>
                        )}

                      </div>

                      {description && (
                        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-gray-500">
                          {description}
                        </p>
                      )}

                      <div className="mt-5 font-bold text-black transition group-hover:text-gray-600">
                        View Full Report →
                      </div>

                    </div>

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