import Link from "next/link";
import { notFound } from "next/navigation";
import ReportManagement from "@/components/ReportManagement";
import { getCurrentUserId, getMissingReport } from "@/lib/reports/data";

function prettyStatus(status: string) {
  return status.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default async function DogReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [result, userId] = await Promise.all([
    getMissingReport(id),
    getCurrentUserId(),
  ]);

  if (!result) notFound();
  const { report: dog, photos } = result;
  const primaryPhoto = photos[0];
  const isOwner = userId === dog.owner_id;

  return (
    <main className="min-h-screen bg-[#003d35] px-4 py-10 text-white sm:px-6 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <Link href="/dogs" className="inline-flex items-center text-sm font-semibold text-[#b7d5ce] transition hover:text-[#fbb12c]">
          ← Back to Missing Pets
        </Link>

        <div className="mt-6 max-w-3xl">
          <span className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">Missing Pet Report</span>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">{dog.dog_name}</h1>
          <p className="mt-3 text-lg text-[#b7d5ce]">Help bring this pet home.</p>
        </div>

        <section className="mt-8 overflow-hidden rounded-2xl border border-[#1b5b51] bg-[#06483f] shadow-lg">
          <div
            className="flex h-64 items-center justify-center bg-[#003d35] bg-contain bg-center bg-no-repeat text-8xl sm:h-96"
            style={primaryPhoto ? { backgroundImage: `url(${primaryPhoto})` } : undefined}
          >
            {!primaryPhoto && "🐕"}
          </div>

          <div className="p-5 sm:p-8">
            <div className="flex flex-col gap-4 border-b border-[#1b5b51] pb-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-3xl font-bold">{dog.dog_name}</h2>
                <p className="mt-1 text-lg text-[#b7d5ce]">{dog.breed || "Unknown breed"}</p>
              </div>
              <span className="w-fit rounded-full bg-[#fbb12c] px-4 py-2 text-sm font-bold text-[#003d35]">
                {prettyStatus(dog.status)}
              </span>
            </div>

            <section className="mt-8">
              <h3 className="text-2xl font-bold">Dog Information</h3>
              <div className="mt-4 grid gap-3 text-[#c3ded8] sm:grid-cols-2">
                <p>Primary color: {dog.primary_color || "Not provided"}</p>
                <p>Secondary color: {dog.secondary_color || "Not provided"}</p>
                <p>Sex: {dog.sex || "Unknown"}</p>
                <p>Size: {dog.size || "Unknown"}</p>
                <p>Microchipped: {dog.microchipped ? "Yes" : "No / unknown"}</p>
                <p>Birth year: {dog.estimated_birth_year || "Unknown"}</p>
              </div>
              {dog.description && <p className="mt-4 leading-relaxed text-[#c3ded8]">{dog.description}</p>}
            </section>

            <section className="mt-8 rounded-xl border border-[#1b5b51] bg-[#003d35] p-5 sm:p-6">
              <h3 className="text-xl font-bold">Last Seen Information</h3>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold text-[#9bbab3]">Date</p>
                  <p className="mt-1 text-[#c3ded8]">
                    📅 {dog.last_seen_at ? new Date(dog.last_seen_at).toLocaleString() : "Not provided"}
                    {dog.time_is_approximate ? " (approx.)" : ""}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#9bbab3]">Location</p>
                  <p className="mt-1 text-[#c3ded8]">📍 {dog.location_description || "Not provided"}</p>
                </div>
                {dog.latitude !== null && dog.longitude !== null && (
                  <div className="sm:col-span-2">
                    <p className="text-sm font-semibold text-[#9bbab3]">Coordinates</p>
                    <p className="mt-1 text-[#c3ded8]">{dog.latitude}, {dog.longitude}</p>
                  </div>
                )}
              </div>
            </section>

            {dog.circumstances && (
              <section className="mt-6 rounded-xl border border-[#1b5b51] p-5 sm:p-6">
                <h3 className="text-xl font-bold">What Happened?</h3>
                <p className="mt-3 leading-relaxed text-[#c3ded8]">{dog.circumstances}</p>
              </section>
            )}

            {dog.reward_offered && (
              <section className="mt-6 rounded-xl border border-[#fbb12c]/50 bg-[#003d35] p-5 sm:p-6">
                <h3 className="text-xl font-bold">Reward Offered</h3>
                <p className="mt-2 text-[#c3ded8]">${Number(dog.reward_amount ?? 0).toFixed(2)}</p>
              </section>
            )}

            {photos.length > 1 && (
              <section className="mt-6 rounded-xl border border-[#1b5b51] p-5 sm:p-6">
                <h3 className="text-xl font-bold">Additional Photos</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {photos.slice(1).map((url) => (
                    <div key={url} className="h-48 rounded-lg bg-[#003d35] bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${url})` }} />
                  ))}
                </div>
              </section>
            )}

            {isOwner && <ReportManagement reportId={dog.id} status={dog.status} reportType="missing" />}
          </div>
        </section>
      </div>
    </main>
  );
}
