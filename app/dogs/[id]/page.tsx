import Link from "next/link";

export default function DogReportPage() {
  // Temporary fake data
  // Later we will replace this with Supabase data
  const dog = {
    name: "Max",
    breed: "Golden Retriever",
    description:
      "Friendly dog with a red collar. Last seen running near the neighborhood park.",
    lastSeenDate: "July 26, 2026",
    location: "Fremont, California",
    latitude: "37.5485",
    longitude: "-121.9886",
    status: "Missing",
    circumstances:
      "Max went missing and was last seen near the neighborhood park. Please contact the owner if you believe you have found him.",
  };

  return (
    <main className="min-h-screen bg-[#003d35] px-4 py-10 text-white sm:px-6 sm:py-16">
      <div className="mx-auto max-w-5xl">

        {/* Back Link */}
        <Link
          href="/dogs"
          className="inline-flex items-center text-sm font-semibold text-[#b7d5ce] transition hover:text-[#fbb12c]"
        >
          ← Back to Missing Pets
        </Link>

        {/* Header */}
        <div className="mt-6 max-w-3xl">
          <span className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">
            Missing Pet Report
          </span>

          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">
            {dog.name}
          </h1>

          <p className="mt-3 text-lg text-[#b7d5ce]">
            Help bring this pet home.
          </p>
        </div>

        {/* Main Report Card */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-[#1b5b51] bg-[#06483f] shadow-lg">

          {/* Photo */}
          <div className="flex h-64 items-center justify-center bg-[#003d35] text-8xl sm:h-96">
            🐕
          </div>

          <div className="p-5 sm:p-8">

            {/* Name + Status */}
            <div className="flex flex-col gap-4 border-b border-[#1b5b51] pb-6 sm:flex-row sm:items-start sm:justify-between">

              <div>
                <h2 className="text-3xl font-bold">
                  {dog.name}
                </h2>

                <p className="mt-1 text-lg text-[#b7d5ce]">
                  {dog.breed}
                </p>
              </div>

              <span className="w-fit rounded-full bg-[#fbb12c] px-4 py-2 text-sm font-bold text-[#003d35]">
                {dog.status}
              </span>

            </div>

            {/* Dog Information */}
            <section className="mt-8">
              <h3 className="text-2xl font-bold">
                Dog Information
              </h3>

              <p className="mt-3 leading-relaxed text-[#c3ded8]">
                {dog.description}
              </p>
            </section>

            {/* Last Seen Information */}
            <section className="mt-8 rounded-xl border border-[#1b5b51] bg-[#003d35] p-5 sm:p-6">

              <h3 className="text-xl font-bold">
                Last Seen Information
              </h3>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">

                <div>
                  <p className="text-sm font-semibold text-[#9bbab3]">
                    Date
                  </p>

                  <p className="mt-1 text-[#c3ded8]">
                    📅 {dog.lastSeenDate}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#9bbab3]">
                    Location
                  </p>

                  <p className="mt-1 text-[#c3ded8]">
                    📍 {dog.location}
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <p className="text-sm font-semibold text-[#9bbab3]">
                    Coordinates
                  </p>

                  <p className="mt-1 text-[#c3ded8]">
                    {dog.latitude}, {dog.longitude}
                  </p>
                </div>

              </div>

            </section>

            {/* Circumstances */}
            <section className="mt-6 rounded-xl border border-[#1b5b51] p-5 sm:p-6">

              <h3 className="text-xl font-bold">
                What Happened?
              </h3>

              <p className="mt-3 leading-relaxed text-[#c3ded8]">
                {dog.circumstances}
              </p>

            </section>

            {/* Share Report */}
            <section className="mt-6 rounded-xl border border-[#1b5b51] p-5 sm:p-6">

              <h3 className="text-xl font-bold">
                Share This Report
              </h3>

              <p className="mt-2 leading-relaxed text-[#c3ded8]">
                Help spread the word by sharing this report with
                people in your community.
              </p>

              <button
                type="button"
                className="mt-5 w-full rounded-md bg-[#fbb12c] px-6 py-3 font-bold text-[#003d35] transition hover:bg-[#ffc34d] sm:w-auto"
              >
                Copy Report Link
              </button>

            </section>

            {/* Contact Owner */}
            <section className="mt-6 rounded-xl border border-[#1b5b51] bg-[#003d35] p-5 sm:p-6">

              <span className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">
                Have You Found Max?
              </span>

              <h3 className="mt-2 text-2xl font-bold">
                Contact the Owner
              </h3>

              <p className="mt-3 leading-relaxed text-[#c3ded8]">
                If you believe you found this dog, you can send
                a message request to the owner.
              </p>

              <ul className="mt-5 space-y-3 text-sm text-[#b7d5ce]">

                <li>
                  ✓ You can only send one message request
                </li>

                <li>
                  ✓ Your contact information stays private
                </li>

                <li>
                  ✓ The owner must accept before chatting
                </li>

              </ul>

              <Link
                href="/dogs/test/contact"
                className="mt-6 inline-block w-full rounded-md bg-[#078c78] px-6 py-3 text-center font-bold text-white transition hover:bg-[#067966] sm:w-auto"
              >
                Contact Owner
              </Link>

            </section>

          </div>
        </section>

        {/* Future States */}
        {/*
          Future states after Supabase integration:

          - Loading report...
          - No dog report found.
          - Unable to load report.
        */}

      </div>
    </main>
  );
}