import ReportMap from "../../components/ReportMap";
import { getMapReports } from "@/lib/reports/map-data";

export default async function MapPage() {
  const reports = await getMapReports();

  return (
    <main className="min-h-screen bg-gradient-to-r from-white via-[#e4e4e4] to-[#b5b5b5] px-6 py-12 sm:py-16">
      <section className="mx-auto max-w-6xl">
        {/* HEADER */}

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Community Map
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-black sm:text-5xl">
            Missing Pets Near You
          </h1>

          <p className="mt-3 max-w-2xl text-lg leading-7 text-gray-600">
            Explore active missing-pet reports on the map and help reunite pets
            with their families.
          </p>
        </div>

        {/* MAP */}

        <section className="mt-8 rounded-3xl bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5 flex items-start gap-4 px-1">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
              01
            </div>

            <div>
              <h2 className="text-xl font-bold text-black">
                Pet Reports
              </h2>

              <p className="mt-1 text-sm leading-6 text-gray-600">
                Select a marker to view information about a reported pet.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl">
            <ReportMap reports={reports} />
          </div>
        </section>
      </section>
    </main>
  );
}