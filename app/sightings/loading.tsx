export default function Loading() {
  return (
    <main className="min-h-screen bg-[#003d35] px-4 py-10 text-white sm:px-6 sm:py-16">
      <section className="mx-auto max-w-6xl">

        <div className="animate-pulse">

          {/* Header */}
          <div className="h-12 w-80 rounded bg-[#1b5b51]" />

          <div className="mt-4 h-6 w-full max-w-2xl rounded bg-[#1b5b51]" />

          {/* Search skeleton */}
          <div className="mt-8 rounded-2xl border border-[#1b5b51] bg-[#06483f] p-8">

            <div className="h-7 w-56 rounded bg-[#1b5b51]" />

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="h-12 rounded-md bg-[#1b5b51]" />
              <div className="h-12 rounded-md bg-[#1b5b51]" />
            </div>

            <div className="mt-6 h-12 w-48 rounded-md bg-[#1b5b51]" />

          </div>

          {/* Results skeleton */}
          <div className="mt-12 grid gap-6 md:grid-cols-2">

            {[1, 2].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-[#1b5b51] bg-[#06483f] p-6"
              >

                <div className="h-48 rounded-lg bg-[#1b5b51]" />

                <div className="mt-5 h-7 w-48 rounded bg-[#1b5b51]" />

                <div className="mt-4 h-4 w-64 rounded bg-[#1b5b51]" />

                <div className="mt-3 h-4 w-32 rounded bg-[#1b5b51]" />

                <div className="mt-5 h-10 w-40 rounded bg-[#1b5b51]" />

              </div>
            ))}

          </div>

        </div>

      </section>
    </main>
  );
}