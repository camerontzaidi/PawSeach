import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import ReportMap from "../../components/ReportMap";

type SearchParams = {
  city?: string;
  state?: string;
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
  const state = params.state?.trim() ?? "";
  const zipInput = params.zip?.trim() ?? "";

  const zipCodes = zipInput
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  const supabase = await createClient();

  // --------------------------------------------------
  // GET MISSING DOGS FROM DATABASE
  // --------------------------------------------------

  let query = supabase
    .from("dogs")
    .select("*")
    .eq("status", "missing");

  // City filter
  if (city) {
    query = query.ilike("city", `%${city}%`);
  }

  // State filter
  if (state) {
    query = query.ilike("state", `%${state}%`);
  }

  // ZIP filter
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
      <main className="min-h-screen bg-[#003d35] px-4 py-10 text-white sm:px-6 sm:py-16">
        <section className="mx-auto max-w-6xl">

          <div className="rounded-2xl border border-red-400 bg-red-900/30 p-8">

            <h1 className="text-3xl font-bold text-red-100">
              Unable to load missing-pet reports right now.
            </h1>

            <p className="mt-4 text-red-200">
              Supabase returned an error while loading the dogs table.
            </p>

            <p className="mt-4 rounded-lg bg-black/30 p-4 font-mono text-sm text-red-100">
              {error.message}
            </p>

          </div>

        </section>
      </main>
    );
  }

  const reports = (dogs ?? []) as Dog[];

  // --------------------------------------------------
  // SEARCH LABEL
  // --------------------------------------------------

  const searchedLocationLabel = [
    city,
    state,
  ]
    .filter(Boolean)
    .join(", ");

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
        [
          dog.city,
          dog.state,
        ]
          .filter(Boolean)
          .join(", ") ||
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
    <main className="min-h-screen bg-[#003d35] px-4 py-10 text-white sm:px-6 sm:py-16">

      <section className="mx-auto max-w-6xl">

        {/* HEADER */}

        <div className="max-w-3xl">

          <span className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">
            Missing Pets
          </span>

          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">
            Search Missing Pets
          </h1>

          <p className="mt-4 text-lg leading-relaxed text-[#b7d5ce]">
            Search missing pet reports by city, state, or ZIP code
            and help bring a lost animal home.
          </p>

        </div>

        {/* SEARCH CARD */}

        <section className="mt-8 rounded-2xl border border-[#1b5b51] bg-[#06483f] p-5 shadow-lg sm:p-8">

          <div>

            <h2 className="text-2xl font-bold">
              Find Missing Pets
            </h2>

            <p className="mt-1 text-[#b7d5ce]">
              Enter a location to narrow your search.
            </p>

          </div>

          <form
            method="get"
            className="mt-6"
          >

            <div className="grid gap-6 md:grid-cols-3">

              {/* CITY */}

              <div>

                <label
                  htmlFor="city"
                  className="block font-semibold"
                >
                  City
                </label>

                <input
                  id="city"
                  name="city"
                  type="text"
                  defaultValue={city}
                  placeholder="Example: Fremont"
                  className="mt-2 w-full rounded-md border border-[#1b5b51] bg-[#003d35] px-4 py-3 text-white placeholder:text-[#9bbab3] outline-none focus:border-[#fbb12c]"
                />

                <p className="mt-2 text-sm text-[#b7d5ce]">
                  Search by city.
                </p>

              </div>

              {/* STATE */}

              <div>

                <label
                  htmlFor="state"
                  className="block font-semibold"
                >
                  State
                </label>

                <input
                  id="state"
                  name="state"
                  type="text"
                  defaultValue={state}
                  placeholder="Example: California"
                  className="mt-2 w-full rounded-md border border-[#1b5b51] bg-[#003d35] px-4 py-3 text-white placeholder:text-[#9bbab3] outline-none focus:border-[#fbb12c]"
                />

                <p className="mt-2 text-sm text-[#b7d5ce]">
                  Search by state.
                </p>

              </div>

              {/* ZIP */}

              <div>

                <label
                  htmlFor="zip"
                  className="block font-semibold"
                >
                  ZIP Codes
                </label>

                <input
                  id="zip"
                  name="zip"
                  type="text"
                  defaultValue={zipInput}
                  placeholder="Example: 94538, 94536"
                  className="mt-2 w-full rounded-md border border-[#1b5b51] bg-[#003d35] px-4 py-3 text-white placeholder:text-[#9bbab3] outline-none focus:border-[#fbb12c]"
                />

                <p className="mt-2 text-sm text-[#b7d5ce]">
                  Separate multiple ZIP codes with commas.
                </p>

              </div>

            </div>

            {/* SEARCH BUTTON */}

            <button
              type="submit"
              className="mt-6 rounded-md bg-[#fbb12c] px-8 py-3 font-bold text-[#003d35] transition hover:bg-[#ffc34d]"
            >
              Search Missing Pets
            </button>

            {/* CLEAR */}

            {(city || state || zipInput) && (
              <Link
                href="/dogs"
                className="ml-3 inline-block rounded-md border border-[#1b5b51] px-8 py-3 font-semibold transition hover:border-[#fbb12c] hover:text-[#fbb12c]"
              >
                Clear
              </Link>
            )}

          </form>

        </section>

        {/* MAP */}

        <section className="mt-8">

          <div className="mb-4">

            <h2 className="text-2xl font-bold">

              {searchedLocationLabel
                ? `Missing Pets Near ${searchedLocationLabel}`
                : "Missing Pets Map"}

            </h2>

            <p className="mt-1 text-[#b7d5ce]">

              {searchedLocationLabel
                ? `Showing missing-pet reports near ${searchedLocationLabel}.`
                : "Explore active missing-pet reports across the United States."}

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

              {searchedLocationLabel
                ? "Search Results"
                : "Missing Pets"}

            </h2>

            <p className="mt-1 text-[#b7d5ce]">

              {reports.length}{" "}

              {reports.length === 1
                ? "missing pet"
                : "missing pets"}{" "}

              found

            </p>

          </div>

          {/* EMPTY STATE */}

          {reports.length === 0 ? (

            <div className="mt-6 rounded-2xl border border-[#1b5b51] bg-[#06483f] px-6 py-12 text-center">

              <div className="text-5xl">
                🔎
              </div>

              <h3 className="mt-4 text-2xl font-bold">
                No missing pets found
              </h3>

              <p className="mx-auto mt-2 max-w-lg text-[#b7d5ce]">

                {searchedLocationLabel
                  ? "No missing-pet reports match this location. Try another city, state, or ZIP code."
                  : 'There are currently no rows in the dogs table with a status of "missing".'}

              </p>

            </div>

          ) : (

            /* RESULTS GRID */

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {reports.map((dog) => {

                const dogName =
                  dog.name ||
                  dog.dog_name ||
                  "Unknown dog";

                const location =
                  [
                    dog.city,
                    dog.state,
                  ]
                    .filter(Boolean)
                    .join(", ") ||
                  "Unknown location";

                const dogZip =
                  dog.zip_code ||
                  dog.zip ||
                  "";

                const description =
                  dog.description ||
                  dog.details ||
                  "";

                return (

                  <Link
                    key={dog.id}
                    href={`/dogs/${dog.id}`}
                    className="group overflow-hidden rounded-2xl border border-[#1b5b51] bg-[#06483f] transition hover:-translate-y-1 hover:border-[#fbb12c] hover:shadow-lg"
                  >

                    {/* PHOTO */}

                    <div className="flex h-48 items-center justify-center bg-[#003d35] text-7xl">
                      🐕
                    </div>

                    {/* CONTENT */}

                    <div className="p-6">

                      <div className="flex items-start justify-between gap-3">

                        <div>

                          <h3 className="text-2xl font-bold">
                            {dogName}
                          </h3>

                          <p className="mt-1 text-[#b7d5ce]">
                            {dog.breed ||
                              "Unknown breed"}
                          </p>

                        </div>

                        <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-bold text-red-300">
                          Missing
                        </span>

                      </div>

                      <div className="mt-5 space-y-2 text-sm text-[#c3ded8]">

                        <p>
                          📍 {location}
                        </p>

                        {dogZip && (
                          <p>
                            📮 ZIP: {dogZip}
                          </p>
                        )}

                      </div>

                      {description && (
                        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-[#c3ded8]">
                          {description}
                        </p>
                      )}

                      <div className="mt-5 font-bold text-[#fbb12c]">
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