export default function Loading() {
  return (
    <main className="min-h-screen bg-[#003d35] px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-4xl animate-pulse">

        <div className="h-10 w-64 rounded bg-[#1b5b51]" />

        <div className="mt-3 h-5 w-72 rounded bg-[#1b5b51]" />

        <section className="mt-8 rounded-2xl border border-[#1b5b51] bg-[#06483f] p-6">

          {/* Photo */}
          <div className="h-80 rounded-lg bg-[#1b5b51]" />

          {/* Name + status */}
          <div className="mt-6 flex justify-between">
            <div>
              <div className="h-8 w-40 rounded bg-[#1b5b51]" />
              <div className="mt-2 h-5 w-48 rounded bg-[#1b5b51]" />
            </div>

            <div className="h-9 w-20 rounded-full bg-[#1b5b51]" />
          </div>

          {/* Information */}
          <div className="mt-8 h-32 rounded-lg bg-[#1b5b51]" />

          {/* Found information */}
          <div className="mt-6 h-40 rounded-lg bg-[#1b5b51]" />

          {/* Contact */}
          <div className="mt-6 h-36 rounded-lg bg-[#1b5b51]" />

        </section>
      </div>
    </main>
  );
}