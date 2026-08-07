import Link from "next/link";
export default function Home() {
  return (
    <main className="min-h-screen bg-[#003d35] text-white">


      {/* Hero Section */}
      <section className="mx-auto flex max-w-5xl flex-col items-center px-6 pb-16 pt-16 text-center">

        <p className="mb-5 text-sm font-semibold tracking-wide text-[#9bd8c9]">
          COMMUNITY-POWERED ANIMAL RESCUE
        </p>


        <h2 className="max-w-3xl text-5xl font-bold leading-tight md:text-6xl">
          Every pet deserves to find their way home.
        </h2>


        <p className="mt-6 max-w-2xl text-lg text-[#c3ded8]">
          Whether you lost a pet or found one, PawSearch connects
          communities to help reunite animals with their families.
        </p>



        {/* Main Actions */}
        <div className="mt-10 grid w-full gap-6 md:grid-cols-2">


          {/* Report Missing Pet */}
          <Link
            href="/report"
            className="rounded-xl border border-[#1b5b51] bg-[#fbb12c] p-8 text-left text-[#003d35] transition hover:scale-[1.02]"
          >
            <h3 className="text-2xl font-bold">
              🐕 Report a Missing Pet
            </h3>

            <p className="mt-3">
              Lost your pet? Create a report with their information,
              last known location, and photo.
            </p>
          </Link>




          {/* Report Found Pet */}
          <Link
            href="/sightings/report"
            className="rounded-xl border border-[#1b5b51] bg-[#078c78] p-8 text-left text-white transition hover:scale-[1.02]"
          >
            <h3 className="text-2xl font-bold">
              🐶 Report a Found Pet
            </h3>

            <p className="mt-3 text-[#d5eee8]">
              Found an animal? Submit details to help reconnect
              them with their owner.
            </p>
          </Link>




          {/* Search Missing Pets */}
          <Link
            href="/dogs"
            className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-8 text-left transition hover:border-[#fbb12c]"
          >
            <h3 className="text-2xl font-bold">
              🔎 Search Missing Pets
            </h3>

            <p className="mt-3 text-[#c3ded8]">
              Search missing pet reports by city or ZIP code
              to help find a lost animal.
            </p>
          </Link>




          {/* Search Found Dogs */}
          <Link
            href="/sightings"
            className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-8 text-left transition hover:border-[#fbb12c]"
          >
            <h3 className="text-2xl font-bold">
              📍 Search Found Dogs
            </h3>

            <p className="mt-3 text-[#c3ded8]">
              Browse found animal reports near your area
              using location filters.
            </p>
          </Link>


        </div>

      </section>




      {/* How It Works */}
      <section className="border-t border-[#1b5b51] px-6 py-16">

        <Link href="/how-it-works" className="mx-auto block max-w-5xl">

          <div className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-10 transition hover:border-[#fbb12c]">

            <h3 className="text-3xl font-bold">
              How It Works Here
            </h3>


            <p className="mt-4 max-w-2xl text-[#b7d5ce]">
              Learn how PawSearch helps communities report missing pets,
              share sightings, and reunite animals with their families.
            </p>


            <p className="mt-6 font-semibold text-[#fbb12c]">
              Learn more →
            </p>

          </div>

        </Link>

      </section>




      {/* Stories */}
      <section className="border-t border-[#1b5b51] px-6 py-16">

        <div className="mx-auto max-w-5xl">

          <h3 className="text-center text-3xl font-bold">
            Stories
          </h3>


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




      {/* Stats */}
      <section className="border-t border-[#1b5b51]">

        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-6 py-12 text-center md:grid-cols-4">

          <div>
            <p className="text-4xl font-bold text-[#fbb12c]">—</p>
            <p className="mt-2 text-sm text-[#b7d5ce]">
              Animals Reunited
            </p>
          </div>


          <div>
            <p className="text-4xl font-bold text-[#fbb12c]">—</p>
            <p className="mt-2 text-sm text-[#b7d5ce]">
              Active Reports
            </p>
          </div>


          <div>
            <p className="text-4xl font-bold text-[#fbb12c]">—</p>
            <p className="mt-2 text-sm text-[#b7d5ce]">
              Reunion Rate
            </p>
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