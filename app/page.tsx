import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#003d35] text-white">
      <section className="mx-auto flex max-w-5xl flex-col items-center px-6 pb-16 pt-16 text-center">
        <p className="mb-5 text-sm font-semibold tracking-wide text-[#9bd8c9]">
          COMMUNITY-POWERED PET SEARCH
        </p>

        <h1 className="max-w-3xl text-5xl font-bold leading-tight md:text-6xl">
          Every missing pet deserves to find their way home.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-[#c3ded8]">
          PawSearch helps owners publish missing-pet reports and gives the
          community a safe way to share information directly with them.
        </p>

        <div className="mt-10 grid w-full gap-6 md:grid-cols-3">
          <Link
            href="/report"
            className="rounded-xl border border-[#1b5b51] bg-[#fbb12c] p-8 text-left text-[#003d35] transition hover:scale-[1.02]"
          >
            <h2 className="text-2xl font-bold">🐕 Report a Missing Pet</h2>
            <p className="mt-3">
              Create an account or sign in to publish a report with photos,
              details, and the last known location.
            </p>
          </Link>

          <Link
            href="/sightings/report"
            className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-8 text-left transition hover:border-[#fbb12c]"
          >
            <h2 className="text-2xl font-bold">🐾 Report a Found Pet</h2>
            <p className="mt-3 text-[#c3ded8]">
              Found a pet? Share photos, details, and where you found them to
              help reconnect them with their family.
            </p>
          </Link>

          <Link
            href="/dogs"
            className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-8 text-left transition hover:border-[#fbb12c]"
          >
            <h2 className="text-2xl font-bold">🔎 Search Missing Pets</h2>
            <p className="mt-3 text-[#c3ded8]">
              Anyone can browse missing-pet reports. Sign in when you want to
              contact an owner or manage your own reports.
            </p>
          </Link>
        </div>
      </section>

      <section className="border-t border-[#1b5b51] px-6 py-16">
        <Link href="/how-it-works" className="mx-auto block max-w-5xl">
          <div className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-10 transition hover:border-[#fbb12c]">
            <h2 className="text-3xl font-bold">How PawSearch Works</h2>
            <p className="mt-4 max-w-2xl text-[#b7d5ce]">
              Learn how owners publish missing-pet reports, how community
              members can safely share information, and how protected
              messaging keeps contact inside PawSearch.
            </p>
            <p className="mt-6 font-semibold text-[#fbb12c]">Learn more →</p>
          </div>
        </Link>
      </section>

      <section className="border-t border-[#1b5b51] px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              How the Community Can Help
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-[#b7d5ce]">
              PawSearch keeps public browsing simple while giving owners
              control over who can contact them and when a conversation can
              continue.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-6">
              <div className="text-3xl">👀</div>
              <h3 className="mt-3 text-xl font-bold">Browse freely</h3>
              <p className="mt-2 text-sm leading-6 text-[#b7d5ce]">
                Visitors can search reports and view public missing-pet
                information without an account.
              </p>
            </div>

            <div className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-6">
              <div className="text-3xl">💬</div>
              <h3 className="mt-3 text-xl font-bold">Message safely</h3>
              <p className="mt-2 text-sm leading-6 text-[#b7d5ce]">
                Signed-in users can send one initial message request without
                exposing personal phone numbers or email addresses.
              </p>
            </div>

            <div className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-6">
              <div className="text-3xl">🛡️</div>
              <h3 className="mt-3 text-xl font-bold">Owner controls access</h3>
              <p className="mt-2 text-sm leading-6 text-[#b7d5ce]">
                Additional messages remain disabled until the pet owner
                accepts the request.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#1b5b51] px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">
              Community Stories
            </p>
            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
              Reunions Made Possible by Community Help
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-[#b7d5ce]">
              Real PawSearch reunion stories will appear here as the community
              grows.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {["A", "B", "C"].map((letter) => (
              <div
                key={letter}
                className="flex aspect-square flex-col items-center justify-center rounded-xl border border-[#1b5b51] bg-[#06483f] p-6 text-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#003d35] text-2xl">
                  🐾
                </div>
                <p className="mt-5 text-lg font-bold">Story {letter}</p>
                <p className="mt-2 text-sm text-[#b7d5ce]">
                  Community reunion story coming soon.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#1b5b51]">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">
              Community Impact
            </p>
            <h2 className="mt-2 text-3xl font-bold">
              PawSearch by the Numbers
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            <div>
              <p className="text-4xl font-bold text-[#fbb12c]">—</p>
              <p className="mt-2 text-sm text-[#b7d5ce]">Pets Reunited</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-[#fbb12c]">—</p>
              <p className="mt-2 text-sm text-[#b7d5ce]">
                Active Missing Reports
              </p>
            </div>
            <div>
              <p className="text-4xl font-bold text-[#fbb12c]">—</p>
              <p className="mt-2 text-sm text-[#b7d5ce]">
                Helpful Messages
              </p>
            </div>
            <div>
              <p className="text-4xl font-bold text-[#fbb12c]">—</p>
              <p className="mt-2 text-sm text-[#b7d5ce]">
                Communities Reached
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
