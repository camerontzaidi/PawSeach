"use client";

import Link from "next/link";

const missingReports = [
  {
    id: "test",
    name: "Max",
    breed: "Golden Retriever",
    location: "Fremont, California",
    status: "Missing",
    date: "July 26, 2026",
    photo: "🐕",
  },
];

const foundReports = [
  {
    id: "found-test",
    name: "Found Golden Retriever",
    type: "Dog",
    location: "San Jose, California",
    status: "Active",
    date: "July 28, 2026",
    photo: "🐶",
  },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#003d35] px-4 py-10 text-white sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div>
          <span className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">
            My Reports
          </span>

          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">
            Manage Your Reports
          </h1>

          <p className="mt-3 text-lg text-[#b7d5ce]">
            View and manage your missing pet and found animal reports.
          </p>
        </div>

        {/* Missing Reports */}
        <section className="mt-12">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold">
                My Missing Pet Reports
              </h2>

              <p className="mt-1 text-[#b7d5ce]">
                {missingReports.length}{" "}
                {missingReports.length === 1 ? "report" : "reports"}
              </p>
            </div>

            <Link
              href="/report"
              className="font-bold text-[#fbb12c] hover:text-[#ffc34d]"
            >
              + New Missing Report
            </Link>
          </div>

          {missingReports.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-[#1b5b51] bg-[#06483f] p-10 text-center">
              <div className="text-5xl">🐕</div>

              <h3 className="mt-4 text-xl font-bold">
                No missing pet reports
              </h3>

              <p className="mt-2 text-[#b7d5ce]">
                You haven't created any missing pet reports yet.
              </p>

              <Link
                href="/report"
                className="mt-6 inline-block rounded-md bg-[#fbb12c] px-6 py-3 font-bold text-[#003d35] hover:bg-[#ffc34d]"
              >
                Report a Missing Pet
              </Link>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {missingReports.map((report) => (
                <article
                  key={report.id}
                  className="overflow-hidden rounded-2xl border border-[#1b5b51] bg-[#06483f]"
                >
                  <div className="flex h-48 items-center justify-center bg-[#003d35] text-7xl">
                    {report.photo}
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-bold">
                          {report.name}
                        </h3>

                        <p className="mt-1 text-[#b7d5ce]">
                          {report.breed}
                        </p>
                      </div>

                      <span className="rounded-full bg-[#fbb12c] px-3 py-1 text-xs font-bold text-[#003d35]">
                        {report.status}
                      </span>
                    </div>

                    <div className="mt-5 space-y-2 text-sm text-[#c3ded8]">
                      <p>📍 {report.location}</p>
                      <p>📅 {report.date}</p>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link
                        href={`/dogs/${report.id}`}
                        className="rounded-md border border-[#1b5b51] px-4 py-2 font-semibold transition hover:border-[#fbb12c] hover:text-[#fbb12c]"
                      >
                        View
                      </Link>

                      <Link
                        href={`/dogs/${report.id}/edit`}
                        className="rounded-md bg-[#078c78] px-4 py-2 font-bold text-white transition hover:bg-[#067966]"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Found Reports */}
        <section className="mt-12">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold">
                My Found Animal Reports
              </h2>

              <p className="mt-1 text-[#b7d5ce]">
                {foundReports.length}{" "}
                {foundReports.length === 1 ? "report" : "reports"}
              </p>
            </div>

            <Link
              href="/sightings"
              className="font-bold text-[#fbb12c] hover:text-[#ffc34d]"
            >
              + New Found Report
            </Link>
          </div>

          {foundReports.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-[#1b5b51] bg-[#06483f] p-10 text-center">
              <div className="text-5xl">🐾</div>

              <h3 className="mt-4 text-xl font-bold">
                No found animal reports
              </h3>

              <p className="mt-2 text-[#b7d5ce]">
                You haven't submitted any found animal reports yet.
              </p>

              <Link
                href="/sightings"
                className="mt-6 inline-block rounded-md bg-[#fbb12c] px-6 py-3 font-bold text-[#003d35] hover:bg-[#ffc34d]"
              >
                Report a Found Animal
              </Link>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {foundReports.map((report) => (
                <article
                  key={report.id}
                  className="overflow-hidden rounded-2xl border border-[#1b5b51] bg-[#06483f]"
                >
                  <div className="flex h-48 items-center justify-center bg-[#003d35] text-7xl">
                    {report.photo}
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-bold">
                          {report.name}
                        </h3>

                        <p className="mt-1 text-[#b7d5ce]">
                          {report.type}
                        </p>
                      </div>

                      <span className="rounded-full bg-[#078c78] px-3 py-1 text-xs font-bold text-white">
                        {report.status}
                      </span>
                    </div>

                    <div className="mt-5 space-y-2 text-sm text-[#c3ded8]">
                      <p>📍 {report.location}</p>
                      <p>📅 {report.date}</p>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link
                        href={`/sightings/${report.id}`}
                        className="rounded-md border border-[#1b5b51] px-4 py-2 font-semibold transition hover:border-[#fbb12c] hover:text-[#fbb12c]"
                      >
                        View
                      </Link>

                      <Link
                        href={`/sightings/${report.id}/edit`}
                        className="rounded-md bg-[#078c78] px-4 py-2 font-bold text-white transition hover:bg-[#067966]"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}