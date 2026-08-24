"use client";

import Link from "next/link";
import { useState } from "react";
import ReportMap from "../../components/ReportMap";

const dogs = [
  {
    id: "test",
    name: "Max",
    breed: "Golden Retriever",
    location: "Fremont, California",
    zip: "94538",
    latitude: 37.5485,
    longitude: -121.9886,
    description:
      "Friendly dog with a red collar. Last seen running near the neighborhood park.",
    status: "Missing",
  },
];

type MapCenter = {
  latitude: number;
  longitude: number;
};

const defaultMapCenter: MapCenter = {
  latitude: 39.8283,
  longitude: -98.5795,
};

export default function DogsPage() {
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [searched, setSearched] = useState(false);
  const [mapCenter, setMapCenter] =
    useState<MapCenter>(defaultMapCenter);
  const [mapZoom, setMapZoom] = useState(4);
  const [isSearchingLocation, setIsSearchingLocation] =
    useState(false);

  const filteredDogs = dogs.filter((dog) => {
    const cityMatch =
      !city ||
      dog.location.toLowerCase().includes(city.toLowerCase());

    const zipCodes = zip
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    const zipMatch =
      zipCodes.length === 0 || zipCodes.includes(dog.zip);

    return cityMatch && zipMatch;
  });

  async function handleSearch() {
    setSearched(true);

    const searchLocation = city.trim() || zip.trim();

    if (!searchLocation) {
      setMapCenter(defaultMapCenter);
      setMapZoom(4);
      return;
    }

    setIsSearchingLocation(true);

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          searchLocation,
        )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&limit=1&country=US`,
      );

      const data = await response.json();

      if (data.features?.length > 0) {
        const [longitude, latitude] =
          data.features[0].center;

        setMapCenter({
          latitude,
          longitude,
        });

        setMapZoom(zip.trim() ? 12 : 11);
      }
    } catch (error) {
      console.error(
        "Unable to find search location:",
        error,
      );
    } finally {
      setIsSearchingLocation(false);
    }
  }

  function clearSearch() {
    setCity("");
    setZip("");
    setSearched(false);
    setMapCenter(defaultMapCenter);
    setMapZoom(4);
  }

  const mapReports = filteredDogs.map((dog) => ({
    id: dog.id,
    name: dog.name,
    breed: dog.breed,
    location: dog.location,
    latitude: dog.latitude,
    longitude: dog.longitude,
    status: "Missing" as const,
  }));

  const searchedLocationLabel =
    city.trim() || zip.trim();

  return (
    <main className="min-h-screen bg-[#003d35] px-4 py-10 text-white sm:px-6 sm:py-16">
      <section className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="max-w-3xl">
          <span className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">
            Missing Pets
          </span>

          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">
            Search Missing Pets
          </h1>

          <p className="mt-4 text-lg leading-relaxed text-[#b7d5ce]">
            Search missing pet reports by city or ZIP code and help bring
            a lost animal home.
          </p>
        </div>

        {/* Search Card */}
        <section className="mt-8 rounded-2xl border border-[#1b5b51] bg-[#06483f] p-5 shadow-lg sm:p-8">
          <div>
            <h2 className="text-2xl font-bold">
              Find Missing Pets
            </h2>

            <p className="mt-1 text-[#b7d5ce]">
              Enter a location to narrow your search.
            </p>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">

            {/* City */}
            <div>
              <label
                htmlFor="city"
                className="block font-semibold"
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
                className="block font-semibold"
              >
                ZIP Codes
              </label>

              <input
                id="zip"
                type="text"
                value={zip}
                onChange={(event) => setZip(event.target.value)}
                placeholder="Example: 94538"
                className="mt-2 w-full rounded-md border border-[#1b5b51] bg-[#003d35] px-4 py-3 text-white outline-none placeholder:text-[#9bbab3] focus:border-[#fbb12c]"
              />

              <p className="mt-2 text-sm text-[#b7d5ce]">
                Search a more specific area by ZIP code.
              </p>
            </div>

          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleSearch}
              disabled={isSearchingLocation}
              className="rounded-md bg-[#fbb12c] px-8 py-3 font-bold text-[#003d35] transition hover:bg-[#ffc34d] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSearchingLocation
                ? "Finding Location..."
                : "Search Missing Pets"}
            </button>

            {(city || zip) && (
              <button
                type="button"
                onClick={clearSearch}
                className="rounded-md border border-[#1b5b51] px-8 py-3 font-semibold transition hover:border-[#fbb12c] hover:text-[#fbb12c]"
              >
                Clear
              </button>
            )}
          </div>
        </section>

        {/* Map */}
        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-2xl font-bold">
              {searchedLocationLabel
                ? `Missing Pets Near ${searchedLocationLabel}`
                : "Missing Pets Map"}
            </h2>

            <p className="mt-1 text-[#b7d5ce]">
              {searchedLocationLabel
                ? `Showing the map around ${searchedLocationLabel}.`
                : "Explore missing pet reports across the United States."}
            </p>
          </div>

          <ReportMap
            reports={mapReports}
            center={mapCenter}
            zoom={mapZoom}
          />
        </section>

        {/* Results */}
        <section className="mt-12">
          <div>
            <h2 className="text-3xl font-bold">
              {searched
                ? "Search Results"
                : "Missing Pets Near You"}
            </h2>

            <p className="mt-1 text-[#b7d5ce]">
              {filteredDogs.length}{" "}
              {filteredDogs.length === 1
                ? "report"
                : "reports"}{" "}
              found
            </p>
          </div>

          {/* Empty State */}
          {searched && filteredDogs.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-[#1b5b51] bg-[#06483f] px-6 py-12 text-center">
              <div className="text-5xl">🔎</div>

              <h3 className="mt-4 text-2xl font-bold">
                No missing pets found
              </h3>

              <p className="mx-auto mt-2 max-w-lg text-[#b7d5ce]">
                We couldn't find any missing pet reports matching
                your search. Try another city or ZIP code.
              </p>

              <button
                type="button"
                onClick={clearSearch}
                className="mt-6 rounded-md bg-[#fbb12c] px-6 py-3 font-bold text-[#003d35]"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredDogs.map((dog) => (
                <Link
                  key={dog.id}
                  href={`/dogs/${dog.id}`}
                  className="group overflow-hidden rounded-2xl border border-[#1b5b51] bg-[#06483f] transition hover:-translate-y-1 hover:border-[#fbb12c] hover:shadow-lg"
                >
                  <div className="flex h-48 items-center justify-center bg-[#003d35] text-7xl transition group-hover:scale-[1.02]">
                    🐕
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-2xl font-bold">
                          {dog.name}
                        </h3>

                        <p className="mt-1 text-[#b7d5ce]">
                          {dog.breed}
                        </p>
                      </div>

                      <span className="rounded-full bg-[#fbb12c] px-3 py-1 text-xs font-bold text-[#003d35]">
                        Missing
                      </span>
                    </div>

                    <div className="mt-5 space-y-2 text-sm text-[#c3ded8]">
                      <p>📍 {dog.location}</p>
                      <p>📮 ZIP: {dog.zip}</p>
                    </div>

                    <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-[#c3ded8]">
                      {dog.description}
                    </p>

                    <div className="mt-5 font-bold text-[#fbb12c]">
                      View Full Report →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

      </section>
    </main>
  );
}