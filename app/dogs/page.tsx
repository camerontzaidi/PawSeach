export default function DogsPage() {
  const dogs = [
    {
      id: "test",
      name: "Max",
      breed: "Golden Retriever",
      location: "Fremont, California",
      zip: "94538",
      description:
        "Friendly dog with a red collar. Last seen running near the neighborhood park.",
      status: "Missing",
    },
  ];

  return (
    <main className="min-h-screen bg-[#003d35] px-6 py-16 text-white">

      <section className="mx-auto max-w-5xl">

        {/* Header */}
        <h1 className="text-4xl font-bold">
          Search Missing Pets
        </h1>

        <p className="mt-4 text-[#b7d5ce]">
          Search missing pet reports by city or ZIP code to find animals
          reported in your area.
        </p>



        {/* Search */}
        <div className="mt-8 rounded-xl border border-[#1b5b51] bg-[#06483f] p-8">


          <h2 className="text-2xl font-bold">
            Find Missing Pets
          </h2>


          <div className="mt-6 grid gap-6 md:grid-cols-2">


            {/* City */}
            <div>

              <label className="font-semibold">
                City
              </label>

              <input
                placeholder="Example: Fremont"
                className="mt-2 w-full rounded-md border border-[#1b5b51] bg-[#003d35] px-4 py-3 text-white placeholder:text-[#9bbab3]"
              />

              <p className="mt-2 text-sm text-[#b7d5ce]">
                Search a broader area by city.
              </p>

            </div>



            {/* ZIP */}
            <div>

              <label className="font-semibold">
                ZIP Codes
              </label>

              <input
                placeholder="Example: 94538, 94539"
                className="mt-2 w-full rounded-md border border-[#1b5b51] bg-[#003d35] px-4 py-3 text-white placeholder:text-[#9bbab3]"
              />

              <p className="mt-2 text-sm text-[#b7d5ce]">
                Add multiple ZIP codes for a more specific search.
              </p>

            </div>


          </div>



          <button
            className="mt-6 rounded-md bg-[#078c78] px-8 py-3 font-bold text-white"
          >
            Search Missing Pets
          </button>


        </div>




        {/* Results */}
        <section className="mt-12">

          <h2 className="text-3xl font-bold">
            Missing Pets Near You
          </h2>


          <div className="mt-6 grid gap-6 md:grid-cols-2">


            {dogs.map((dog) => (

              <a
                key={dog.id}
                href={`/dogs/${dog.id}`}
                className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-6 transition hover:border-[#fbb12c]"
              >

                <div className="flex h-40 items-center justify-center rounded-lg bg-[#003d35] text-6xl">
                  🐕
                </div>


                <h3 className="mt-5 text-2xl font-bold">
                  {dog.name}
                </h3>


                <p className="mt-2 text-[#b7d5ce]">
                  {dog.breed}
                </p>


                <p className="mt-4 text-[#c3ded8]">
                  📍 {dog.location}
                </p>


                <p className="mt-2 text-[#c3ded8]">
                  ZIP: {dog.zip}
                </p>


                <p className="mt-4 text-[#c3ded8]">
                  {dog.description}
                </p>


                <span className="mt-5 inline-block rounded-md bg-[#fbb12c] px-5 py-2 font-bold text-[#003d35]">
                  View Report →
                </span>


              </a>

            ))}


          </div>

        </section>


      </section>

    </main>
  );
}