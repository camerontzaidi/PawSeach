import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import ReportMap from "@/components/ReportMap";

type SearchParams = { city?: string; zip?: string };

type DogRow = {
  id: string;
  dog_name: string;
  breed: string | null;
  location_description: string | null;
  description: string | null;
  status: string;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
};

type DogPhoto = { dog_id: string; storage_path: string };

export default async function DogsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const city = params.city?.trim() ?? "";
  const zip = params.zip?.trim() ?? "";
  const supabase = await createClient();

  let query = supabase
    .from("dogs")
    .select("id, dog_name, breed, location_description, description, status, latitude, longitude, created_at")
    .in("status", ["missing", "spotted"])
    .order("created_at", { ascending: false })
    .limit(50);

  if (city) query = query.ilike("location_description", `%${city}%`);
  if (zip) query = query.ilike("location_description", `%${zip}%`);

  const { data, error } = await query;
  const dogs = (data ?? []) as DogRow[];
  const photoByDog = new Map<string, string>();

  if (dogs.length > 0) {
    const { data: photoRows } = await supabase
      .from("dog_photos")
      .select("dog_id, storage_path")
      .in("dog_id", dogs.map((dog) => dog.id))
      .eq("is_primary", true);

    for (const row of (photoRows ?? []) as DogPhoto[]) {
      const { data: publicUrl } = supabase.storage.from("dog-photos").getPublicUrl(row.storage_path);
      photoByDog.set(row.dog_id, publicUrl.publicUrl);
    }
  }

  const mapReports = dogs
    .filter((dog) => dog.latitude !== null && dog.longitude !== null)
    .map((dog) => ({
      id: dog.id,
      name: dog.dog_name,
      breed: dog.breed || "Unknown breed",
      location: dog.location_description || "Location unavailable",
      latitude: Number(dog.latitude),
      longitude: Number(dog.longitude),
      status: "Missing" as const,
    }));

  const center = mapReports.length > 0
    ? { latitude: mapReports[0].latitude, longitude: mapReports[0].longitude }
    : { latitude: 39.8283, longitude: -98.5795 };

  return (
    <main className="min-h-screen bg-[#003d35] px-4 py-10 text-white sm:px-6 sm:py-16">
      <section className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <span className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">Missing Pets</span>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Search Missing Pets</h1>
          <p className="mt-4 text-lg leading-relaxed text-[#b7d5ce]">Search live Supabase reports by city or ZIP text and help bring a lost animal home.</p>
        </div>

        <section className="mt-8 rounded-2xl border border-[#1b5b51] bg-[#06483f] p-5 shadow-lg sm:p-8">
          <form method="get" className="grid gap-5 md:grid-cols-2">
            <label className="font-semibold">City<input name="city" defaultValue={city} placeholder="Example: Fremont" className="mt-2 w-full rounded-md border border-[#1b5b51] bg-[#003d35] px-4 py-3" /></label>
            <label className="font-semibold">ZIP Code<input name="zip" defaultValue={zip} placeholder="Example: 94538" className="mt-2 w-full rounded-md border border-[#1b5b51] bg-[#003d35] px-4 py-3" /></label>
            <div className="md:col-span-2 flex gap-3">
              <button className="rounded-md bg-[#fbb12c] px-8 py-3 font-bold text-[#003d35]">Search Missing Pets</button>
              {(city || zip) && <Link href="/dogs" className="rounded-md border border-[#1b5b51] px-8 py-3 font-semibold">Clear</Link>}
            </div>
          </form>
        </section>

        <section className="mt-8">
          <h2 className="mb-4 text-2xl font-bold">Missing Pets Map</h2>
          <ReportMap reports={mapReports} center={center} zoom={mapReports.length > 0 ? 11 : 4} />
        </section>

        <section className="mt-12">
          <h2 className="text-3xl font-bold">Search Results</h2>
          <p className="mt-1 text-[#b7d5ce]">{dogs.length} {dogs.length === 1 ? "report" : "reports"} found</p>

          {error ? (
            <p className="mt-6 rounded-lg border border-red-400 bg-red-900/30 p-4">Unable to load missing-pet reports right now.</p>
          ) : dogs.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-[#1b5b51] bg-[#06483f] px-6 py-12 text-center">
              <div className="text-5xl">🔎</div><h3 className="mt-4 text-2xl font-bold">No missing pets found</h3>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {dogs.map((dog) => {
                const photo = photoByDog.get(dog.id);
                return (
                  <Link key={dog.id} href={`/dogs/${dog.id}`} className="group overflow-hidden rounded-2xl border border-[#1b5b51] bg-[#06483f] transition hover:border-[#fbb12c]">
                    <div className="flex h-48 items-center justify-center bg-[#003d35] bg-cover bg-center text-7xl" style={photo ? { backgroundImage: `url(${photo})` } : undefined}>{!photo && "🐕"}</div>
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-3"><div><h3 className="text-2xl font-bold">{dog.dog_name}</h3><p className="mt-1 text-[#b7d5ce]">{dog.breed || "Unknown breed"}</p></div><span className="rounded-full bg-[#fbb12c] px-3 py-1 text-xs font-bold text-[#003d35]">Missing</span></div>
                      <p className="mt-5 text-sm text-[#c3ded8]">📍 {dog.location_description || "Location unavailable"}</p>
                      {dog.description && <p className="mt-4 line-clamp-3 text-sm text-[#c3ded8]">{dog.description}</p>}
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
