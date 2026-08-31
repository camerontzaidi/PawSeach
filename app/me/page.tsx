"use client";

import { useState } from "react";
import Link from "next/link";

const recentActivity = [
  {
    icon: "🐕",
    title: "Reported Max missing",
    description: "Golden Retriever · Fremont, California",
    date: "July 26, 2026",
  },
  {
    icon: "📍",
    title: "Reported a pet sighting",
    description: "Near Central Fremont",
    date: "July 28, 2026",
  },
  {
    icon: "🎉",
    title: "Buddy was reunited",
    description: "Labrador Retriever",
    date: "July 30, 2026",
  },
];

const savedReports = [
  {
    id: "1",
    name: "Max",
    breed: "Golden Retriever",
    location: "Fremont, California",
    status: "Missing",
    type: "missing",
  },
  {
    id: "2",
    name: "Buddy",
    breed: "Labrador Retriever",
    location: "San Jose, California",
    status: "Found",
    type: "found",
  },
];

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
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}
        <div>
          <span className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">
            My PawSearch
          </span>

          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">
            My Reports & My Information
          </h1>

          <p className="mt-3 text-lg text-[#b7d5ce]">
            Manage your location, reports, and activity on PawSearch.
          </p>
        </div>

        {/* LOCATION */}
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

        {/* MY REPORTS */}
        <section className="mt-8 rounded-2xl border border-[#1b5b51] bg-[#06483f] p-6 sm:p-8">
          <span className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">
            Reports
          </span>

          <h2 className="mt-2 text-2xl font-bold">
            My Reports
          </h2>

          <p className="mt-2 text-[#b7d5ce]">
            View, edit, and manage your missing pet and found animal reports.
          </p>

          <div className="mt-6 rounded-xl bg-[#003d35] p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-bold">
                  Manage Your Reports
                </h3>

                <p className="mt-1 text-sm text-[#b7d5ce]">
                  Update report information, view details, and manage report
                  statuses.
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

        {/* RECENT ACTIVITY */}
        <section className="mt-8 rounded-2xl border border-[#1b5b51] bg-[#06483f] p-6 sm:p-8">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">
              Activity
            </span>

            <h2 className="mt-2 text-2xl font-bold">
              Recent Activity
            </h2>

            <p className="mt-1 text-[#b7d5ce]">
              Keep track of your recent activity on PawSearch.
            </p>
          </div>

          <div className="mt-6 space-y-3">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex gap-4 rounded-xl border border-[#1b5b51] bg-[#003d35] p-4"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#06483f] text-xl">
                  {activity.icon}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-bold">
                    {activity.title}
                  </p>

                  <p className="mt-1 text-sm text-[#b7d5ce]">
                    {activity.description}
                  </p>

                  <p className="mt-1 text-xs text-[#9bbab3]">
                    {activity.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SAVED REPORTS */}
        <section className="mt-8">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">
              Saved
            </span>

            <h2 className="mt-2 text-2xl font-bold">
              Saved Reports
            </h2>

            <p className="mt-1 text-[#b7d5ce]">
              Quickly return to reports you want to keep an eye on.
            </p>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {savedReports.map((report) => (
              <article
                key={report.id}
                className="rounded-2xl border border-[#1b5b51] bg-[#06483f] p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold">
                      {report.name}
                    </h3>

                    <p className="mt-1 text-[#b7d5ce]">
                      {report.breed}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      report.status === "Missing"
                        ? "bg-[#ef4444] text-white"
                        : "bg-[#078c78] text-white"
                    }`}
                  >
                    {report.status}
                  </span>
                </div>

                <p className="mt-5 text-sm text-[#c3ded8]">
                  📍 {report.location}
                </p>

                <Link
                  href={
                    report.type === "missing"
                      ? `/dogs/${report.id}`
                      : `/sightings/${report.id}`
                  }
                  className="mt-5 inline-block rounded-md border border-[#1b5b51] px-5 py-2 font-semibold transition hover:border-[#fbb12c] hover:text-[#fbb12c]"
                >
                  View Report
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* ACCOUNT INFORMATION */}
        <section className="mt-8 rounded-2xl border border-[#1b5b51] bg-[#06483f] p-6 sm:p-8">
          <span className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">
            Account
          </span>

          <h2 className="mt-2 text-2xl font-bold">
            My Information
          </h2>

          <p className="mt-2 text-[#b7d5ce]">
            Manage your PawSearch account information and preferences.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Link
              href="/profile"
              className="rounded-xl border border-[#1b5b51] bg-[#003d35] p-5 transition hover:border-[#fbb12c]"
            >
              <div className="text-2xl">👤</div>

              <h3 className="mt-3 font-bold">
                Profile
              </h3>

              <p className="mt-1 text-sm text-[#b7d5ce]">
                View your account and personal information.
              </p>
            </Link>

            <Link
              href="/profile"
              className="rounded-xl border border-[#1b5b51] bg-[#003d35] p-5 transition hover:border-[#fbb12c]"
            >
              <div className="text-2xl">🔔</div>

              <h3 className="mt-3 font-bold">
                Notifications
              </h3>

              <p className="mt-1 text-sm text-[#b7d5ce]">
                Manage your PawSearch notification preferences.
              </p>
            </Link>
          </div>
        </section>

        <div className="mt-10 text-center">
          <Link
            href="/"
            className="font-semibold text-[#fbb12c] hover:text-[#ffc34d]"
          >
            ← Back to PawSearch
          </Link>
        </div>
      </div>
    </main>
  );
}