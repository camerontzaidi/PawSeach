"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export default function SightingsPage() {
  const dogs = [
    {
      id: "test",
      breed: "Golden Retriever",
      location: "Fremont Community Park",
      city: "Fremont",
      zip: "94538",
      date: "July 28, 2026",
    },
    {
      id: "test2",
      breed: "Brown Mixed Breed",
      location: "Central Fremont",
      city: "Fremont",
      zip: "94536",
      date: "July 27, 2026",
    },
  ];

  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [searched, setSearched] = useState(false);

  const filteredDogs = useMemo(() => {
    if (!searched) return dogs;

    const citySearch = city.trim().toLowerCase();

    const zipSearch = zip
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    return dogs.filter((dog) => {
      const cityMatches =
        !citySearch || dog.city.toLowerCase().includes(citySearch);

      const zipMatches =
        zipSearch.length === 0 || zipSearch.includes(dog.zip);

      return cityMatches && zipMatches;
    });
  }, [city, zip, searched]);

  function handleSearch() {
    setSearched(true);
  }

  function handleClear() {
    setCity("");
    setZip("");
    setSearched(false);
  }

  return (
    <main className="min-h-screen bg-[#003d35] px-6 py-16 text-white">
      <section className="mx-auto max-w-5xl">

        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold">
            Search Found Dogs
          </h1>

          <p className="mt-4 max-w-2xl text-[#b7d5ce]">
            Search found animal reports from community members.
            Use a city or ZIP code to find possible matches.
          </p>
        </div>

        {/* Search */}
        <section className="mt-8 rounded-xl border border-[#1b5b51] bg-[#06483f] p-8">
          <h2 className="text-2xl font-bold">
            Find Found Dogs
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2">

            {/* City */}
            <div>
              <label
                htmlFor="city"
                className="font-semibold"
              >
                City
              </label>

              <input
                id="city"
                type="text"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                placeholder="Example: Fremont"
                className="mt-2 w-full rounded-md border border-[#1b5b51] bg-[#003d35] px-4 py-3 text-white outline-none placeholder:text-[#9bbab3] focus:border-[#fbb12c]"
              />

              <p className="mt-2 text-sm text-[#b7d5ce]">
                Search a broader area by city.
              </p>
            </div>

            {/* ZIP */}
            <div>
              <label
                htmlFor="zip"
                className="font-semibold"
              >
                ZIP Codes
              </label>

              <input
                id="zip"
                type="text"
                value={zip}
                onChange={(event) => setZip(event.target.value)}
                placeholder="Example: 94538, 94536"
                className="mt-2 w-full rounded-md border border-[#1b5b51] bg-[#003d35] px-4 py-3 text-white outline-none placeholder:text-[#9bbab3] focus:border-[#fbb12c]"
              />

              <p className="mt-2 text-sm text-[#b7d5ce]">
                Add multiple ZIP codes separated by commas.
              </p>
            </div>
          </div>

          {/* Search Buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSearch}
              className="rounded-md bg-[#078c78] px-8 py-3 font-bold text-white transition hover:bg-[#067966]"
            >
              Search Found Dogs
            </button>

            {searched && (
              <button
                type="button"
                onClick={handleClear}
                className="rounded-md border border-[#1b5b51] px-8 py-3 font-semibold text-[#b7d5ce] transition hover:border-[#fbb12c] hover:text-white"
              >
                Clear Search
              </button>
            )}
          </div>
        </section>

        {/* Results */}
        <section className="mt-12">

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-3xl font-bold">
                {searched ? "Search Results" : "Found Dogs Near You"}
              </h2>

              <p className="mt-2 text-[#b7d5ce]">
                {filteredDogs.length}{" "}
                {filteredDogs.length === 1 ? "report" : "reports"} found
              </p>
            </div>
          </div>

          {/* Empty State */}
          {filteredDogs.length === 0 ? (
            <div className="mt-6 rounded-xl border border-[#1b5b51] bg-[#06483f] p-10 text-center">
              <div className="text-5xl">
                🐾
              </div>

              <h3 className="mt-4 text-2xl font-bold">
                No found dogs match your search
              </h3>

              <p className="mx-auto mt-3 max-w-md text-[#b7d5ce]">
                Try a different city or ZIP code, or clear your
                search to view all available reports.
              </p>

              <button
                type="button"
                onClick={handleClear}
                className="mt-6 rounded-md bg-[#fbb12c] px-6 py-3 font-bold text-[#003d35]"
              >
                View All Reports
              </button>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 md:grid-cols-2">

              {filteredDogs.map((dog) => (
                <Link
                  key={dog.id}
                  href={`/sightings/${dog.id}`}
                  className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-6 transition hover:border-[#fbb12c] hover:shadow-lg"
                >
                  {/* Photo Placeholder */}
                  <div className="flex h-48 items-center justify-center rounded-lg bg-[#003d35] text-6xl">
                    🐶
                  </div>

                  {/* Breed */}
                  <h3 className="mt-5 text-2xl font-bold">
                    {dog.breed}
                  </h3>

                  {/* Location */}
                  <p className="mt-3 text-[#c3ded8]">
                    📍 Found near {dog.location}
                  </p>

                  {/* ZIP */}
                  <p className="mt-2 text-[#b7d5ce]">
                    ZIP: {dog.zip}
                  </p>

                  {/* Date */}
                  <p className="mt-2 text-[#b7d5ce]">
                    Found on {dog.date}
                  </p>

                  {/* View Report */}
                  <span className="mt-5 inline-block rounded-md bg-[#fbb12c] px-5 py-2 font-bold text-[#003d35]">
                    View Report →
                  </span>
                </Link>
              ))}

            </div>
          )}
        </section>
      </section>
    </main>
  );
}