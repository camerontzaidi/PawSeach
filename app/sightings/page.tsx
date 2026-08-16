import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

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
    .select("id, breed, color, city, zip_code, found_at, details, status")
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
      photoByReport.set(row.found_report_id, publicUrl.publicUrl);
    }
  }

  return (
    <main className="min-h-screen bg-[#003d35] px-6 py-16 text-white">
      <section className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold">Search Found Dogs</h1>

        <p className="mt-4 text-[#b7d5ce]">
          Search found animal reports from community members. Use a city
          or ZIP code to find possible matches.
        </p>

        <section className="mt-8 rounded-xl border border-[#1b5b51] bg-[#06483f] p-8">
          <h2 className="text-2xl font-bold">Find Found Dogs</h2>

          <form className="mt-6" method="get">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="city" className="font-semibold">
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  defaultValue={city}
                  placeholder="Example: Fremont"
                  className="mt-2 w-full rounded-md border border-[#1b5b51] bg-[#003d35] px-4 py-3 text-white placeholder:text-[#9bbab3]"
                />
                <p className="mt-2 text-sm text-[#b7d5ce]">
                  Search a broader area by city.
                </p>
              </div>

              <div>
                <label htmlFor="zip" className="font-semibold">
                  ZIP Codes
                </label>
                <input
                  id="zip"
                  name="zip"
                  defaultValue={zipInput}
                  placeholder="Example: 94538, 94536"
                  className="mt-2 w-full rounded-md border border-[#1b5b51] bg-[#003d35] px-4 py-3 text-white placeholder:text-[#9bbab3]"
                />
                <p className="mt-2 text-sm text-[#b7d5ce]">
                  Add multiple ZIP codes for a more specific search.
                </p>
              </div>
            </div>

            <button className="mt-6 rounded-md bg-[#078c78] px-8 py-3 font-bold text-white">
              Search Found Dogs
            </button>
          </form>
        </section>

        <section className="mt-12">
          <h2 className="text-3xl font-bold">Found Dogs Near You</h2>

          {error ? (
            <p className="mt-6 rounded-lg border border-red-400 bg-red-900/30 p-4 text-red-100">
              Unable to load found-animal reports right now.
            </p>
          ) : reports.length === 0 ? (
            <p className="mt-6 rounded-lg border border-[#1b5b51] bg-[#06483f] p-6 text-[#c3ded8]">
              No found-animal reports match this search yet.
            </p>
          ) : (
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {reports.map((report) => {
                const photoUrl = photoByReport.get(report.id);

                return (
                  <Link
                    key={report.id}
                    href={`/sightings/${report.id}`}
                    className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-6 transition hover:border-[#fbb12c]"
                  >
                    <div
                      className="flex h-48 items-center justify-center rounded-lg bg-[#003d35] bg-cover bg-center text-6xl"
                      style={
                        photoUrl
                          ? { backgroundImage: `url(${photoUrl})` }
                          : undefined
                      }
                    >
                      {!photoUrl && "🐶"}
                    </div>

                    <h3 className="mt-5 text-2xl font-bold">
                      {report.breed || "Unknown breed"}
                    </h3>

                    <p className="mt-2 text-[#b7d5ce]">
                      Color: {report.color}
                    </p>

                    <p className="mt-3 text-[#c3ded8]">
                      📍 Found near {report.city}
                    </p>

                    <p className="mt-2 text-[#b7d5ce]">
                      ZIP: {report.zip_code}
                    </p>

                    <p className="mt-2 text-[#b7d5ce]">
                      Found on {new Date(`${report.found_at}T00:00:00`).toLocaleDateString()}
                    </p>

                    {report.details && (
                      <p className="mt-4 line-clamp-3 text-[#c3ded8]">
                        {report.details}
                      </p>
                    )}

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
