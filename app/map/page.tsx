import ReportMap from "../../components/ReportMap";
import { getMapReports } from "@/lib/reports/map-data";

export default async function MapPage() {
  const reports = await getMapReports();

  return (
    <main className="min-h-screen bg-[#003d35] px-4 py-10 text-white sm:px-6 sm:py-16">
      <section className="mx-auto max-w-6xl">
        <span className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">
          Community Map
        </span>

        <h1 className="mt-2 text-4xl font-bold sm:text-5xl">
          Missing and Found Pets Near You
        </h1>

        <p className="mt-4 max-w-2xl text-lg text-[#b7d5ce]">
          Explore active missing and found pet reports on the map and help
          reunite pets with their families.
        </p>

        <div className="mt-8">
          <ReportMap reports={reports} />
        </div>
      </section>
    </main>
  );
}
