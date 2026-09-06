import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | PawSearch",
  description: "How PawSearch handles user and report information.",
};

export default function PrivacyPage() {
  return (
    <main className="bg-[#003d35] px-6 py-14 text-white">
      <article className="mx-auto max-w-4xl rounded-2xl border border-[#1b5b51] bg-[#06483f] p-7 sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">PawSearch</p>
        <h1 className="mt-2 text-4xl font-bold">Privacy Policy</h1>
        <p className="mt-3 text-sm text-[#9bbab3]">Last updated: September 3, 2026</p>

        <div className="mt-8 space-y-8 leading-relaxed text-[#d7e7e3]">
          <section><h2 className="text-xl font-bold text-white">1. Information PawSearch may collect</h2><p className="mt-2">
            Depending on how you use PawSearch, information may include your name, email address, profile image, authentication identifiers, pet and sighting report details, uploaded photographs, timestamps, and location information included in reports.
          </p></section>

          <section><h2 className="text-xl font-bold text-white">2. How information is used</h2><p className="mt-2">
            Information is used to authenticate users, create and display missing or found pet reports, manage your reports, support matching and map features, communicate relevant service information, improve PawSearch, and protect against misuse.
          </p></section>

          <section><h2 className="text-xl font-bold text-white">3. Public report information</h2><p className="mt-2">
            Information intentionally included in a public missing-pet or found-animal report may be visible to other users and visitors. Avoid including private contact details, home addresses, or other sensitive information unless necessary and appropriate.
          </p></section>

          <section><h2 className="text-xl font-bold text-white">4. Service providers</h2><p className="mt-2">
            PawSearch uses third-party services to operate parts of the platform. These may include Supabase for authentication, database, and storage services; Google for Google sign-in; and mapping providers such as Mapbox. Those providers process information under their own terms and privacy practices.
          </p></section>

          <section><h2 className="text-xl font-bold text-white">5. Profile images</h2><p className="mt-2">
            When Google sign-in supplies a profile image, PawSearch may display that image within your account interface. If no image is available or the image cannot be loaded, PawSearch displays initials derived from your account name instead.
          </p></section>

          <section><h2 className="text-xl font-bold text-white">6. Data retention and security</h2><p className="mt-2">
            PawSearch aims to retain information only as reasonably needed to operate the service and maintain report history. No online service can guarantee absolute security, so users should avoid submitting unnecessary sensitive information.
          </p></section>

          <section><h2 className="text-xl font-bold text-white">7. Your choices</h2><p className="mt-2">
            You can manage or close reports through available account tools. Additional controls for editing account information, notification preferences, and account deletion may be added as PawSearch develops.
          </p></section>

          <section><h2 className="text-xl font-bold text-white">8. Policy updates</h2><p className="mt-2">
            This policy may be updated as features and data practices change. The date at the top of this page identifies the current version.
          </p></section>
        </div>

        <div className="mt-10 border-t border-[#1b5b51] pt-6 text-sm">
          <Link href="/terms" className="font-semibold text-[#fbb12c] hover:text-[#ffc34d]">Read the Terms of Service</Link>
        </div>

        <p className="mt-5 text-xs leading-relaxed text-[#789b94]">
          This privacy policy is an initial product draft and should be reviewed by qualified legal counsel before a public or commercial launch.
        </p>
      </article>
    </main>
  );
}
