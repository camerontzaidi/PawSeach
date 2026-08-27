import Link from "next/link";
import { notFound } from "next/navigation";
import ReportManagement from "@/components/ReportManagement";
import { getCurrentUserId, getFoundReport } from "@/lib/reports/data";

function prettyStatus(status: string) {
  return status.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default async function FoundDogReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [result, userId] = await Promise.all([getFoundReport(id), getCurrentUserId()]);
  if (!result) notFound();

  const { report, photos } = result;
  const primaryPhoto = photos[0];
  const isOwner = userId === report.reporter_id;

  return (
    <main className="min-h-screen bg-[#003d35] px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <Link href="/sightings" className="text-sm font-semibold text-[#b7d5ce] hover:text-[#fbb12c]">← Back to Found Animals</Link>
        <h1 className="mt-6 text-4xl font-bold">Found Animal Report</h1>
        <p className="mt-2 text-[#b7d5ce]">Help reunite this pet with their family.</p>

        <section className="mt-8 rounded-xl border border-[#1b5b51] bg-[#06483f] p-6">
          <div
            className="flex h-80 items-center justify-center rounded-lg bg-[#003d35] bg-contain bg-center bg-no-repeat text-6xl"
            style={primaryPhoto ? { backgroundImage: `url(${primaryPhoto})` } : undefined}
          >
            {!primaryPhoto && "🐕"}
          </div>

          <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row">
            <div>
              <h2 className="text-3xl font-bold">{report.breed || "Unknown breed"}</h2>
              <p className="mt-1 text-[#b7d5ce]">{report.color} · {report.size}</p>
            </div>
            <span className="h-fit rounded-full bg-[#078c78] px-4 py-2 font-bold text-white">{prettyStatus(report.status)}</span>
          </div>

          <div className="mt-8 rounded-lg border border-[#1b5b51] p-5">
            <h3 className="text-xl font-bold">Animal Information</h3>
            <div className="mt-4 space-y-2 text-[#c3ded8]">
              <p>Color: {report.color}</p>
              <p>Approximate size: {report.size}</p>
              <p>Collar: {report.collar_status}</p>
              {report.details && <p>{report.details}</p>}
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-[#1b5b51] p-5">
            <h3 className="text-xl font-bold">Found Information</h3>
            <div className="mt-4 space-y-3 text-[#c3ded8]">
              <p>📅 Date Found: {new Date(`${report.found_at}T00:00:00`).toLocaleDateString()}</p>
              <p>📍 Location: {report.city}, {report.zip_code}</p>
              {report.latitude !== null && report.longitude !== null && <p>Coordinates: {report.latitude}, {report.longitude}</p>}
            </div>
          </div>

          {photos.length > 1 && (
            <div className="mt-6 rounded-lg border border-[#1b5b51] p-5">
              <h3 className="text-xl font-bold">Additional Photos</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {photos.slice(1).map((photoUrl) => (
                  <div key={photoUrl} className="h-48 rounded-lg bg-[#003d35] bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${photoUrl})` }} />
                ))}
              </div>
            </div>
          )}

          {isOwner && <ReportManagement reportId={report.id} status={report.status} reportType="found" />}
        </section>
      </div>
    </main>
  );
}
