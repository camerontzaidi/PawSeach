export default function DogsPage() {
  const dogs = [
    {
      id: "test",
      name: "Max",
      breed: "Golden Retriever",
      location: "Fremont, California",
      description:
        "Friendly dog with a red collar. Last seen running near the neighborhood park.",
      status: "Missing",
    },
  ];

  return (
    <main className="min-h-screen bg-[#003d35] px-6 py-16 text-white">

      <section className="mx-auto max-w-5xl">

        <h1 className="text-4xl font-bold">
          Latest Missing Pet Reports
        </h1>

        <p className="mt-4 text-[#b7d5ce]">
          Enter your ZIP code to find missing pets near you.
        </p>


        {/* Search */}
        <div className="mt-8 rounded-xl border border-[#1b5b51] bg-[#06483f] p-6">

          <label className="font-bold">
            ZIP Code
          </label>

          <input
            placeholder="Example: 94538"
            className="mt-3 w-full rounded-md border border-[#1b5b51] bg-[#003d35] px-4 py-3 text-white placeholder:text-[#9bbab3]"
          />

          <button className="mt-4 rounded-md bg-[#078c78] px-6 py-3 font-bold text-white">
            Search
          </button>

        </div>



        {/* Reports */}
        <section className="mt-10">

          <h2 className="text-3xl font-bold">
            Missing Dogs Near You
          </h2>


          <div className="mt-6 grid gap-6 md:grid-cols-2">

            {dogs.map((dog) => (

              <a
                key={dog.id}
                href={`/dogs/${dog.id}`}
                className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-6 transition hover:scale-[1.02]"
              >

                <div className="flex h-40 items-center justify-center rounded-lg bg-[#003d35] text-6xl">
                  🐕
                </div>


                <h3 className="mt-5 text-2xl font-bold">
                  {dog.name}
                </h3>


                <p className="mt-1 text-[#b7d5ce]">
                  {dog.breed}
                </p>


                <p className="mt-4 text-[#c3ded8]">
                  📍 {dog.location}
                </p>


                <p className="mt-3 text-[#c3ded8]">
                  {dog.description}
                </p>


                <span className="mt-5 inline-block rounded-md bg-[#fbb12c] px-5 py-2 font-bold text-[#003d35]">
                  View Report
                </span>


              </a>

            ))}

          </div>

        </section>


      </section>

    </main>
  );
}