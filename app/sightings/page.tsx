export default function SightingsPage() {
  const dogs = [
    {
      id: "test",
      breed: "Golden Retriever",
      location: "Fremont Community Park",
      zip: "94538",
      date: "July 28, 2026",
    },
    {
      id: "test2",
      breed: "Brown Mixed Breed",
      location: "Central Fremont",
      zip: "94536",
      date: "July 27, 2026",
    },
  ];

  return (
    <main className="min-h-screen bg-[#003d35] px-6 py-16 text-white">

      <section className="mx-auto max-w-5xl">


        {/* Header */}
        <h1 className="text-4xl font-bold">
          Search Found Dogs
        </h1>


        <p className="mt-4 text-[#b7d5ce]">
          Search found animal reports from community members.
          Use a city or ZIP code to find possible matches.
        </p>




        {/* Search */}
        <section className="mt-8 rounded-xl border border-[#1b5b51] bg-[#06483f] p-8">


          <h2 className="text-2xl font-bold">
            Find Found Dogs
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
                placeholder="Example: 94538, 94536"
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
            Search Found Dogs
          </button>


        </section>





        {/* Results */}
        <section className="mt-12">


          <h2 className="text-3xl font-bold">
            Found Dogs Near You
          </h2>



          <div className="mt-6 grid gap-6 md:grid-cols-2">


            {dogs.map((dog) => (

              <a
                key={dog.id}
                href={`/sightings/${dog.id}`}
                className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-6 transition hover:border-[#fbb12c]"
              >


                <div className="flex h-48 items-center justify-center rounded-lg bg-[#003d35] text-6xl">
                  🐶
                </div>



                <h3 className="mt-5 text-2xl font-bold">
                  {dog.breed}
                </h3>



                <p className="mt-3 text-[#c3ded8]">
                  📍 Found near {dog.location}
                </p>



                <p className="mt-2 text-[#b7d5ce]">
                  ZIP: {dog.zip}
                </p>



                <p className="mt-2 text-[#b7d5ce]">
                  Found on {dog.date}
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