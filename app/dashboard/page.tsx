import Link from "next/link";
import { redirect } from "next/navigation";
import ReportManagement from "@/components/ReportManagement";
import { getCurrentUserDashboard } from "@/lib/reports/data";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function prettyStatus(status: string) {
  return status.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default async function DashboardPage() {
  const dashboard = await getCurrentUserDashboard();
  if (!dashboard) redirect("/login");

  const { missing, found, missingPhotos, foundPhotos } = dashboard;

  return (
    <main className="min-h-screen bg-[#003d35] px-4 py-10 text-white sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <span className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">
          My Reports
        </span>
        <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Manage Your Reports</h1>
        <p className="mt-3 text-lg text-[#b7d5ce]">
          These reports are loaded from Supabase for your signed-in account.
        </p>

        <section className="mt-12">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold">My Missing Pet Reports</h2>
              <p className="mt-1 text-[#b7d5ce]">{missing.length} {missing.length === 1 ? "report" : "reports"}</p>
            </div>
            <Link href="/report" className="font-bold text-[#fbb12c] hover:text-[#ffc34d]">
              + New Missing Report
            </Link>
          </div>

          {missing.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-[#1b5b51] bg-[#06483f] p-10 text-center">
              <div className="text-5xl">🐕</div>
              <h3 className="mt-4 text-xl font-bold">No missing pet reports</h3>
              <p className="mt-2 text-[#b7d5ce]">You haven&apos;t created any missing pet reports yet.</p>
              <Link href="/report" className="mt-6 inline-block rounded-md bg-[#fbb12c] px-6 py-3 font-bold text-[#003d35] hover:bg-[#ffc34d]">
                Report a Missing Pet
              </Link>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {missing.map((report) => {
                const photo = missingPhotos.get(report.id);
                return (
                  <article key={report.id} className="overflow-hidden rounded-2xl border border-[#1b5b51] bg-[#06483f]">
                    <div
                      className="flex h-48 items-center justify-center bg-[#003d35] bg-cover bg-center text-7xl"
                      style={photo ? { backgroundImage: `url(${photo})` } : undefined}
                    >
                      {!photo && "🐕"}
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-2xl font-bold">{report.dog_name}</h3>
                          <p className="mt-1 text-[#b7d5ce]">{report.breed || "Unknown breed"}</p>
                        </div>
                        <span className="rounded-full bg-[#fbb12c] px-3 py-1 text-xs font-bold text-[#003d35]">{prettyStatus(report.status)}</span>
                      </div>
                      <div className="mt-5 space-y-2 text-sm text-[#c3ded8]">
                        <p>📍 {report.location_description || "Location unavailable"}</p>
                        <p>📅 {formatDate(report.created_at)}</p>
                      </div>
                      <div className="mt-6">
                        <Link href={`/dogs/${report.id}`} className="rounded-md border border-[#1b5b51] px-4 py-2 font-semibold transition hover:border-[#fbb12c] hover:text-[#fbb12c]">
                          View Report
                        </Link>
                      </div>
                      <ReportManagement reportId={report.id} status={report.status} reportType="missing" />
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="mt-12">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold">My Found Animal Reports</h2>
              <p className="mt-1 text-[#b7d5ce]">{found.length} {found.length === 1 ? "report" : "reports"}</p>
            </div>
            <Link href="/sightings/report" className="font-bold text-[#fbb12c] hover:text-[#ffc34d]">
              + New Found Report
            </Link>
          </div>

          {found.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-[#1b5b51] bg-[#06483f] p-10 text-center">
              <div className="text-5xl">🐾</div>
              <h3 className="mt-4 text-xl font-bold">No found animal reports</h3>
              <p className="mt-2 text-[#b7d5ce]">You haven&apos;t submitted any found animal reports yet.</p>
              <Link href="/sightings/report" className="mt-6 inline-block rounded-md bg-[#fbb12c] px-6 py-3 font-bold text-[#003d35] hover:bg-[#ffc34d]">
                Report a Found Animal
              </Link>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {found.map((report) => {
                const photo = foundPhotos.get(report.id);
                return (
                  <article key={report.id} className="overflow-hidden rounded-2xl border border-[#1b5b51] bg-[#06483f]">
                    <div
                      className="flex h-48 items-center justify-center bg-[#003d35] bg-cover bg-center text-7xl"
                      style={photo ? { backgroundImage: `url(${photo})` } : undefined}
                    >
                      {!photo && "🐾"}
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-2xl font-bold">{report.breed || "Found Animal"}</h3>
                          <p className="mt-1 text-[#b7d5ce]">{report.color}</p>
                        </div>
                        <span className="rounded-full bg-[#078c78] px-3 py-1 text-xs font-bold text-white">{prettyStatus(report.status)}</span>
                      </div>
                      <div className="mt-5 space-y-2 text-sm text-[#c3ded8]">
                        <p>📍 {report.city}, {report.zip_code}</p>
                        <p>📅 {formatDate(report.found_at)}</p>
                      </div>
                      <div className="mt-6">
                        <Link href={`/sightings/${report.id}`} className="rounded-md border border-[#1b5b51] px-4 py-2 font-semibold transition hover:border-[#fbb12c] hover:text-[#fbb12c]">
                          View Report
                        </Link>
                      </div>
                      <ReportManagement reportId={report.id} status={report.status} reportType="found" />
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
