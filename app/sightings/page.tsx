export default function SightingsPage() {
  return (
    <main className="min-h-screen bg-[#003d35] px-6 py-10 text-white">

      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <h1 className="text-4xl font-bold">
          I Found an Animal
        </h1>

        <p className="mt-3 max-w-2xl text-[#c3ded8]">
          Whether you found a dog or are looking for a pet that was found,
          PawSearch helps connect animals with their families.
        </p>



        {/* Post Found Dog */}
        <section className="mt-10">

          <div className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-8">

            <h2 className="text-2xl font-bold">
              Found a Dog?
            </h2>

            <p className="mt-4 text-[#c3ded8]">
              Create a report with the dog's photo,
              description, and where you found them.
            </p>

            <a
              href="/sightings/report"
              className="mt-6 inline-block rounded-md bg-[#fbb12c] px-6 py-3 font-bold text-[#003d35]"
            >
              Post Found Dog
            </a>

          </div>

        </section>




        {/* Search Section */}
        <section className="mt-10 rounded-xl border border-[#1b5b51] bg-[#06483f] p-8">

          <h2 className="text-2xl font-bold">
            Search Found Dogs
          </h2>


          <p className="mt-3 text-[#c3ded8]">
            Search reports from community members who found animals.
            Enter your city or ZIP code to find possible matches.
          </p>


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
            className="mt-6 rounded-md bg-[#078c78] px-8 py-3 font-bold text-white"
          >
            Search
          </button>


        </section>





        {/* Recent Found Dogs */}
        <section className="mt-10">

          <h2 className="text-3xl font-bold">
            Recent Found Dogs
          </h2>


          <div className="mt-6 grid gap-6 md:grid-cols-2">


            {/* Example Found Dog */}
            <a
              href="/sightings/test"
              className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-6 transition hover:border-[#fbb12c]"
            >

              <div className="flex h-48 items-center justify-center rounded-lg bg-[#003d35] text-6xl">
                🐕
              </div>


              <h3 className="mt-5 text-2xl font-bold">
                Golden Retriever
              </h3>


              <p className="mt-2 text-[#c3ded8]">
                Found near Fremont Community Park
              </p>


              <p className="mt-2 text-[#b7d5ce]">
                Found on July 28, 2026
              </p>


              <span className="mt-4 inline-block font-bold text-[#fbb12c]">
                View Report →
              </span>

            </a>





            {/* Example Found Dog */}
            <a
              href="/sightings/test2"
              className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-6 transition hover:border-[#fbb12c]"
            >

              <div className="flex h-48 items-center justify-center rounded-lg bg-[#003d35] text-6xl">
                🐶
              </div>


              <h3 className="mt-5 text-2xl font-bold">
                Brown Mixed Breed
              </h3>


              <p className="mt-2 text-[#c3ded8]">
                Found near Central Fremont
              </p>


              <p className="mt-2 text-[#b7d5ce]">
                Found on July 27, 2026
              </p>


              <span className="mt-4 inline-block font-bold text-[#fbb12c]">
                View Report →
              </span>

            </a>


          </div>


        </section>


      </div>

    </main>
  );
}