export default function Home() {
  return (
    <main className="min-h-screen bg-[#003d35] text-white">
      {/* Header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <h1 className="text-2xl font-bold tracking-tight">
          🐾 PawSearch
        </h1>
      </header>

      {/* Hero Section */}
      <section className="mx-auto flex max-w-4xl flex-col items-center px-6 pb-16 pt-16 text-center">
        <p className="mb-5 text-sm font-semibold tracking-wide text-[#9bd8c9]">
          COMMUNITY-POWERED ANIMAL RESCUE
        </p>

        <h2 className="max-w-3xl text-5xl font-bold leading-tight md:text-6xl">
          Every pet deserves to find their way home.
        </h2>

        <p className="mt-6 max-w-2xl text-lg text-[#c3ded8]">
          Search reports from your neighbors. Report a missing animal or
          submit a sighting to help reunite pets with their families.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex w-full max-w-md flex-col gap-4">
          <a
            href="/report"
            className="rounded-md bg-[#fbb12c] px-6 py-4 font-bold text-[#003d35] transition hover:scale-[1.02] hover:bg-[#ffc34d]"
          >
            Report a Missing Pet
          </a>

          <a
            href="/sightings"
            className="rounded-md bg-[#078c78] px-6 py-4 font-bold text-white transition hover:scale-[1.02] hover:bg-[#0aa58e]"
          >
            I Found an Animal
          </a>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-[#1b5b51] px-6 py-16">
        <a href="/how-it-works" className="mx-auto block max-w-5xl">
          <div className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-10 transition hover:border-[#fbb12c]">
            <h3 className="text-3xl font-bold">How It Works Here</h3>

            <p className="mt-4 max-w-2xl text-[#b7d5ce]">
              Learn how PawSearch helps communities report missing pets,
              share sightings, and reunite animals with their families.
            </p>

            <p className="mt-6 font-semibold text-[#fbb12c]">
              Learn more →
            </p>
          </div>
        </a>
      </section>

      {/* Latest Reports */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <a href="/dogs" className="block">
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-bold">Latest Reports</h3>

            <span className="text-sm font-semibold text-[#fbb12c]">
              Search your area →
            </span>
          </div>

          <div className="mt-8 rounded-xl border border-[#1b5b51] bg-[#06483f] p-10 text-center transition hover:border-[#fbb12c]">
            <p className="text-[#b7d5ce]">
              Enter your ZIP code to find the latest missing pet reports near
              you.
            </p>
          </div>
        </a>
      </section>

      {/* Stories */}
      <section className="border-t border-[#1b5b51] px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h3 className="text-center text-3xl font-bold">Stories</h3>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="flex aspect-square items-center justify-center rounded-xl border border-[#1b5b51] bg-[#06483f] text-4xl font-bold">
              A
            </div>

            <div className="flex aspect-square items-center justify-center rounded-xl border border-[#1b5b51] bg-[#06483f] text-4xl font-bold">
              B
            </div>

            <div className="flex aspect-square items-center justify-center rounded-xl border border-[#1b5b51] bg-[#06483f] text-4xl font-bold">
              C
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t border-[#1b5b51]">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-6 py-12 text-center md:grid-cols-4">
          <div>
            <p className="text-4xl font-bold text-[#fbb12c]">—</p>
            <p className="mt-2 text-sm text-[#b7d5ce]">Animals Reunited</p>
          </div>

          <div>
            <p className="text-4xl font-bold text-[#fbb12c]">—</p>
            <p className="mt-2 text-sm text-[#b7d5ce]">Active Reports</p>
          </div>

          <div>
            <p className="text-4xl font-bold text-[#fbb12c]">—</p>
            <p className="mt-2 text-sm text-[#b7d5ce]">Reunion Rate</p>
          </div>

          <div>
            <p className="text-4xl font-bold text-[#fbb12c]">—</p>
            <p className="mt-2 text-sm text-[#b7d5ce]">
              Avg. Time to Reunion
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}