import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | PawSearch",
  description: "Terms governing the use of PawSearch.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-r from-white via-[#e4e4e4] to-[#b5b5b5] px-6 py-12 sm:py-16">
      <article className="mx-auto max-w-4xl rounded-3xl bg-white p-6 shadow-sm sm:p-10">
        <div className="border-b border-gray-200 pb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            PawSearch
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-black">
            Terms of Service
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            Last updated: September 3, 2026
          </p>
        </div>

        <div className="mt-8 space-y-8 text-[15px] leading-7 text-gray-700">
          <section>
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                01
              </div>

              <div>
                <h2 className="text-lg font-bold text-black">
                  About PawSearch
                </h2>

                <p className="mt-2">
                  PawSearch is a community platform for sharing information
                  about missing and found pets. We cannot guarantee that a pet
                  will be located, identified, returned, or reunited with an
                  owner.
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                02
              </div>

              <div>
                <h2 className="text-lg font-bold text-black">
                  Eligibility and accounts
                </h2>

                <p className="mt-2">
                  You are responsible for the information associated with your
                  account and for activity performed through it. If you sign in
                  using a third-party provider such as Google, that provider&apos;s
                  terms may also apply.
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                03
              </div>

              <div>
                <h2 className="text-lg font-bold text-black">
                  User-submitted content
                </h2>

                <p className="mt-2">
                  You may submit pet descriptions, photographs, location
                  information, sightings, and related details. You are
                  responsible for having the right to submit that content and
                  for ensuring that it is not knowingly false, misleading,
                  unlawful, or abusive. PawSearch may display and process
                  submitted content as needed to operate the service.
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                04
              </div>

              <div>
                <h2 className="text-lg font-bold text-black">
                  Safety and prohibited conduct
                </h2>

                <p className="mt-2">
                  Do not use PawSearch to impersonate another person, make
                  fraudulent ownership claims, harass users, post intentionally
                  false reports, solicit sensitive information, or facilitate
                  scams. PawSearch may remove content or restrict access when
                  reasonably necessary to protect users or the service.
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                05
              </div>

              <div>
                <h2 className="text-lg font-bold text-black">
                  Rewards and transactions
                </h2>

                <p className="mt-2">
                  Any reward mentioned in a report is an arrangement between
                  the people involved. PawSearch is not a party to reward
                  payments and does not verify claims of ownership or
                  discovery. Users should independently verify information
                  before sending money or sharing sensitive information.
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                06
              </div>

              <div>
                <h2 className="text-lg font-bold text-black">
                  Location information
                </h2>

                <p className="mt-2">
                  Reports may include approximate or precise location
                  information. Consider your personal safety before publishing
                  addresses or other sensitive locations. Public report
                  information may be visible to other PawSearch users and
                  visitors.
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                07
              </div>

              <div>
                <h2 className="text-lg font-bold text-black">
                  Service availability
                </h2>

                <p className="mt-2">
                  PawSearch may change, suspend, or discontinue features. The
                  service is provided on an &quot;as available&quot; basis, and
                  errors, interruptions, or inaccurate user-submitted
                  information may occur.
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                08
              </div>

              <div>
                <h2 className="text-lg font-bold text-black">
                  Changes to these terms
                </h2>

                <p className="mt-2">
                  These terms may be updated as PawSearch develops. The date at
                  the top of this page identifies the current version.
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-10 border-t border-gray-200 pt-6">
          <Link
            href="/privacy"
            className="font-semibold text-black underline underline-offset-4 hover:text-gray-600"
          >
            Read the Privacy Policy
          </Link>

          <p className="mt-5 text-xs leading-5 text-gray-400">
            These terms are an initial product draft and are not a substitute
            for review by qualified legal counsel before a public or commercial
            launch.
          </p>
        </div>
      </article>
    </main>
  );
}