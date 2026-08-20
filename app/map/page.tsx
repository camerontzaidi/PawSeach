import ReportMap from "../../components/ReportMap";

const reports = [
  {
    id: "test",
    name: "Max",
    breed: "Golden Retriever",
    location: "Fremont, California",
    latitude: 37.5485,
    longitude: -121.9886,
    status: "Missing" as const,
  },
  {
    id: "test2",
    name: "Buddy",
    breed: "Brown Mixed Breed",
    location: "Central Fremont",
    latitude: 37.558,
    longitude: -121.97,
    status: "Missing" as const,
  },
];

export default function MapPage() {
  return (
    <main className="min-h-screen bg-[#003d35] px-4 py-10 text-white sm:px-6 sm:py-16">
      <section className="mx-auto max-w-6xl">
        <span className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">
          Community Map
        </span>

        <h1 className="mt-2 text-4xl font-bold sm:text-5xl">
          Missing Pets Near You
        </h1>

        <p className="mt-4 max-w-2xl text-lg text-[#b7d5ce]">
          Explore missing pet reports on the map and help reunite pets
          with their families.
        </p>

        <div className="mt-8">
          <ReportMap reports={reports} />
        </div>
      </section>
    </main>
  );
}