export default function SightingsPage() {
  return (
    <main className="min-h-screen bg-[#003d35] px-6 py-10 text-white">

      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <h1 className="text-4xl font-bold">
          I Found an Animal
        </h1>

        <p className="mt-3 max-w-2xl text-[#c3ded8]">
          Help reunite a lost dog with their family.
          Post information about an animal you found or search
          for found dogs near you.
        </p>


        {/* Options */}
        <section className="mt-10 grid gap-6 md:grid-cols-2">


          {/* Post Found Dog */}
          <div className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-8">

            <h2 className="text-2xl font-bold">
              Found a Dog?
            </h2>

            <p className="mt-4 text-[#c3ded8]">
              Create a report with the dog's photo,
              description, and where you found them.
            </p>


            <a
              href="/sightings/create"
              className="mt-6 inline-block rounded-md bg-[#fbb12c] px-6 py-3 font-bold text-[#003d35]"
            >
              Post Found Dog
            </a>

          </div>



          {/* Search Found Dogs */}
          <div className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-8">

            <h2 className="text-2xl font-bold">
              Looking for Found Dogs?
            </h2>

            <p className="mt-4 text-[#c3ded8]">
              Search reports from people who found animals
              near your area.
            </p>


            <button
              className="mt-6 rounded-md bg-[#078c78] px-6 py-3 font-bold text-white"
            >
              Search Found Dogs
            </button>

          </div>


        </section>



        {/* Search Section */}
        <section className="mt-10 rounded-xl border border-[#1b5b51] bg-[#06483f] p-8">

          <h2 className="text-2xl font-bold">
            Search by Location
          </h2>


          <div className="mt-6 grid gap-4 md:grid-cols-2">


            <div>
              <label className="mb-2 block font-semibold">
                City
              </label>

              <input
                placeholder="Example: Fremont"
                className="w-full rounded-md border border-[#1b5b51] bg-[#003d35] px-4 py-3 text-white placeholder:text-[#9bbab3]"
              />

            </div>


            <div>
              <label className="mb-2 block font-semibold">
                ZIP Code
              </label>

              <input
                placeholder="Example: 94538"
                className="w-full rounded-md border border-[#1b5b51] bg-[#003d35] px-4 py-3 text-white placeholder:text-[#9bbab3]"
              />

            </div>


          </div>


          <button
            className="mt-6 rounded-md bg-[#078c78] px-8 py-3 font-bold"
          >
            Search
          </button>


        </section>



        {/* Recent Found Dogs Placeholder */}
        <section className="mt-10">

          <h2 className="text-3xl font-bold">
            Recent Found Dogs
          </h2>


          <div className="mt-6 rounded-xl border border-[#1b5b51] bg-[#06483f] p-10 text-center">

            <p className="text-[#c3ded8]">
              Search results will appear here based on city
              and ZIP code.
            </p>

          </div>

        </section>


      </div>

    </main>
  );
}