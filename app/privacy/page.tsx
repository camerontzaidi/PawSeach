import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | PawSearch",
  description: "How PawSearch handles user and report information.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-r from-white via-[#e4e4e4] to-[#b5b5b5] px-6 py-12 sm:py-16">
      <article className="mx-auto max-w-4xl rounded-3xl bg-white p-6 shadow-sm sm:p-10">
        <div className="border-b border-gray-200 pb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            PawSearch
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-black">
            Privacy Policy
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
                  Information PawSearch may collect
                </h2>

                <p className="mt-2">
                  Depending on how you use PawSearch, information may include
                  your name, email address, profile image, authentication
                  identifiers, pet and sighting report details, uploaded
                  photographs, timestamps, and location information included in
                  reports.
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
                  How information is used
                </h2>

                <p className="mt-2">
                  Information is used to authenticate users, create and
                  display missing or found pet reports, manage your reports,
                  support matching and map features, communicate relevant
                  service information, improve PawSearch, and protect against
                  misuse.
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
                  Public report information
                </h2>

                <p className="mt-2">
                  Information intentionally included in a public missing-pet
                  or found-animal report may be visible to other users and
                  visitors. Avoid including private contact details, home
                  addresses, or other sensitive information unless necessary
                  and appropriate.
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
                  Service providers
                </h2>

                <p className="mt-2">
                  PawSearch uses third-party services to operate parts of the
                  platform. These may include Supabase for authentication,
                  database, and storage services, Google for Google sign-in,
                  and mapping providers such as Mapbox. Those providers
                  process information under their own terms and privacy
                  practices.
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
                  Profile images
                </h2>

                <p className="mt-2">
                  When Google sign-in supplies a profile image, PawSearch may
                  display that image within your account interface. If no image
                  is available or the image cannot be loaded, PawSearch
                  displays initials derived from your account name instead.
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
                  Data retention and security
                </h2>

                <p className="mt-2">
                  PawSearch aims to retain information only as reasonably
                  needed to operate the service and maintain report history. No
                  online service can guarantee absolute security, so users
                  should avoid submitting unnecessary sensitive information.
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
                <h2 className="text-lg font-bold text-black">Your choices</h2>

                <p className="mt-2">
                  You can manage or close reports through available account
                  tools. Additional controls for editing account information,
                  notification preferences, and account deletion may be added
                  as PawSearch develops.
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
                  Policy updates
                </h2>

                <p className="mt-2">
                  This policy may be updated as features and data practices
                  change. The date at the top of this page identifies the
                  current version.
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-10 border-t border-gray-200 pt-6">
          <Link
            href="/terms"
            className="font-semibold text-black underline underline-offset-4 hover:text-gray-600"
          >
            Read the Terms of Service
          </Link>

          <p className="mt-5 text-xs leading-5 text-gray-400">
            This privacy policy is an initial product draft and should be
            reviewed by qualified legal counsel before a public or commercial
            launch.
          </p>
        </div>
      </article>
    </main>
  );
}