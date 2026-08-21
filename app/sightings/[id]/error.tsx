"use client";

import Link from "next/link";

export default function FoundDogReportError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-[#003d35] px-4 py-16 text-white sm:px-6">
      <div className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center">

        <section className="w-full rounded-2xl border border-[#1b5b51] bg-[#06483f] p-8 text-center shadow-lg sm:p-12">

          {/* Icon */}
          <div className="text-6xl">
            ⚠️
          </div>

          {/* Heading */}
          <h1 className="mt-5 text-3xl font-bold sm:text-4xl">
            We couldn&apos;t load this report
          </h1>

          {/* Description */}
          <p className="mx-auto mt-4 max-w-lg leading-relaxed text-[#b7d5ce]">
            Something went wrong while loading this found-pet report.
            Please try again or return to the list of found pets.
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            <button
              type="button"
              onClick={() => reset()}
              className="rounded-md bg-[#fbb12c] px-6 py-3 font-bold text-[#003d35] transition hover:bg-[#ffc34d]"
            >
              Try Again
            </button>

            <Link
              href="/sightings"
              className="rounded-md border border-[#1b5b51] px-6 py-3 font-semibold text-[#b7d5ce] transition hover:border-[#fbb12c] hover:text-white"
            >
              Back to Found Pets
            </Link>

          </div>

        </section>

      </div>
    </main>
  );
}