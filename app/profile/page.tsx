import Link from "next/link";

const reports = [
  {
    id: "1",
    name: "Max",
    breed: "Golden Retriever",
    status: "Missing",
    location: "Fremont, California",
    date: "July 26, 2026",
  },
  {
    id: "2",
    name: "Buddy",
    breed: "Labrador Retriever",
    status: "Found",
    location: "Fremont, California",
    date: "July 28, 2026",
  },
];

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-[#003d35] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold">
            My PawSearch
          </h1>

          <p className="mt-2 text-[#b7d5ce]">
            Manage your pet reports and account.
          </p>
        </div>

        {/* Account Card */}
        <section className="mt-8 rounded-xl border border-[#1b5b51] bg-[#06483f] p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-2xl font-bold">
                Welcome back!
              </h2>

              <p className="mt-1 text-[#b7d5ce]">
                Manage your PawSearch activity below.
              </p>
            </div>

            <Link
              href="/"
              className="rounded-md border border-[#1b5b51] px-5 py-2 font-semibold transition hover:border-[#fbb12c] hover:text-[#fbb12c]"
            >
              Back to Home
            </Link>

          </div>
        </section>

        {/* Reports */}
        <section className="mt-8">

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                My Reports
              </h2>

              <p className="mt-1 text-[#b7d5ce]">
                Reports you have submitted.
              </p>
            </div>

            <Link
              href="/report"
              className="rounded-md bg-[#fbb12c] px-5 py-2 font-bold text-[#003d35] transition hover:bg-[#ffc34d]"
            >
              + New Report
            </Link>
          </div>

          {/* Report Cards */}
          <div className="mt-5 grid gap-5 md:grid-cols-2">

            {reports.map((report) => (
              <article
                key={report.id}
                className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-6"
              >

                <div className="flex items-start justify-between gap-4">

                  <div>
                    <h3 className="text-2xl font-bold">
                      {report.name}
                    </h3>

                    <p className="mt-1 text-[#b7d5ce]">
                      {report.breed}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-4 py-1 text-sm font-bold ${
                      report.status === "Missing"
                        ? "bg-[#fbb12c] text-[#003d35]"
                        : "bg-[#078c78] text-white"
                    }`}
                  >
                    {report.status}
                  </span>

                </div>

                <div className="mt-5 space-y-2 text-[#c3ded8]">

                  <p>
                    📍 {report.location}
                  </p>

                  <p>
                    📅 {report.date}
                  </p>

                </div>

                <Link
                  href={
                    report.status === "Missing"
                      ? `/dogs/${report.id}`
                      : `/sightings/${report.id}`
                  }
                  className="mt-5 inline-block rounded-md border border-[#1b5b51] px-5 py-2 font-semibold transition hover:border-[#fbb12c] hover:text-[#fbb12c]"
                >
                  View Report
                </Link>

              </article>
            ))}

          </div>
        </section>

        {/* Account Settings */}
        <section className="mt-8 rounded-xl border border-[#1b5b51] bg-[#06483f] p-6">

          <h2 className="text-2xl font-bold">
            Account
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">

            <div className="rounded-lg border border-[#1b5b51] bg-[#003d35] p-4">
              <p className="text-sm text-[#b7d5ce]">
                Email
              </p>

              <p className="mt-1 font-semibold">
                Your account email
              </p>
            </div>

            <div className="rounded-lg border border-[#1b5b51] bg-[#003d35] p-4">
              <p className="text-sm text-[#b7d5ce]">
                Reports
              </p>

              <p className="mt-1 font-semibold">
                {reports.length} submitted reports
              </p>
            </div>

          </div>

        </section>

      </div>
    </main>
  );
}