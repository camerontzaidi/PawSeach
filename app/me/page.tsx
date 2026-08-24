"use client";

import { useState } from "react";
import Link from "next/link";

export default function MePage() {
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [saved, setSaved] = useState(false);

  function handleSaveLocation() {
    setSaved(true);
  }

  const dogsUrl = `/dogs?city=${encodeURIComponent(
    city,
  )}&zip=${encodeURIComponent(zip)}`;

  return (
    <main className="min-h-screen bg-[#003d35] px-4 py-10 text-white sm:px-6 sm:py-16">
      <div className="mx-auto max-w-5xl">
        {/* HEADER */}
        <div>
          <span className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">
            My PawSearch
          </span>

          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">
            Welcome back!
          </h1>

          <p className="mt-3 text-lg text-[#b7d5ce]">
            Manage your location and stay connected to missing pets in your
            area.
          </p>
        </div>

        {/* YOUR LOCATION */}
        <section className="mt-8 rounded-2xl border border-[#1b5b51] bg-[#06483f] p-6 sm:p-8">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">
              Location
            </span>

            <h2 className="mt-2 text-2xl font-bold">
              Your Location
            </h2>

            <p className="mt-2 text-[#b7d5ce]">
              Save your city and ZIP code to make it easier to find missing
              pets near you.
            </p>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
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
                onChange={(event) => {
                  setCity(event.target.value);
                  setSaved(false);
                }}
                placeholder="Fremont"
                className="mt-2 w-full rounded-md border border-[#1b5b51] bg-[#003d35] px-4 py-3 text-white outline-none placeholder:text-[#9bbab3] focus:border-[#fbb12c]"
              />
            </div>

            <div>
              <label
                htmlFor="zip"
                className="block font-semibold"
              >
                ZIP Code
              </label>

              <input
                id="zip"
                type="text"
                value={zip}
                onChange={(event) => {
                  setZip(event.target.value);
                  setSaved(false);
                }}
                placeholder="94538"
                className="mt-2 w-full rounded-md border border-[#1b5b51] bg-[#003d35] px-4 py-3 text-white outline-none placeholder:text-[#9bbab3] focus:border-[#fbb12c]"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSaveLocation}
            className="mt-6 rounded-md bg-[#fbb12c] px-8 py-3 font-bold text-[#003d35] transition hover:bg-[#ffc34d]"
          >
            Save Location
          </button>

          {saved && (
            <p
              role="status"
              className="mt-4 font-semibold text-[#fbb12c]"
            >
              ✓ Location saved
            </p>
          )}
        </section>

        {/* YOUR REPORTS */}
        <section className="mt-8 rounded-2xl border border-[#1b5b51] bg-[#06483f] p-6 sm:p-8">
          <span className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">
            Reports
          </span>

          <h2 className="mt-2 text-2xl font-bold">
            Your Reports
          </h2>

          <p className="mt-2 text-[#b7d5ce]">
            View and manage the missing pet and found animal reports you
            have submitted.
          </p>

          <div className="mt-6 rounded-xl bg-[#003d35] p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-bold">
                  Manage Your Reports
                </h3>

                <p className="mt-1 text-sm text-[#b7d5ce]">
                  View reports, edit information, and update report statuses.
                </p>
              </div>

              <Link
                href="/dashboard"
                className="shrink-0 rounded-md bg-[#078c78] px-6 py-3 text-center font-bold text-white transition hover:bg-[#067966]"
              >
                View My Reports →
              </Link>
            </div>
          </div>
        </section>

        {/* MISSING PETS NEAR YOU */}
        <section className="mt-8 rounded-2xl border border-[#1b5b51] bg-[#06483f] p-6 sm:p-8">
          <span className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">
            Community
          </span>

          <h2 className="mt-2 text-2xl font-bold">
            Missing Pets Near You
          </h2>

          <p className="mt-2 text-[#b7d5ce]">
            Explore missing pet reports around your saved location.
          </p>

          <div className="mt-6 flex flex-col items-center rounded-xl bg-[#003d35] p-8 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#fbb12c]">
              <span className="text-3xl font-bold">
                12
              </span>
            </div>

            <p className="mt-4 text-lg font-semibold">
              Missing pet reports
            </p>

            <p className="mt-1 text-sm text-[#b7d5ce]">
              {city || zip
                ? `Based on ${city || "your selected area"}${
                    zip ? `, ${zip}` : ""
                  }.`
                : "Save your location above to search pets near you."}
            </p>

            <Link
              href={dogsUrl}
              className="mt-6 rounded-md bg-[#078c78] px-6 py-3 font-bold text-white transition hover:bg-[#067966]"
            >
              View Missing Pets Near Me →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}