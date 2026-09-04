import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | PawSearch",
  description: "Terms governing the use of PawSearch.",
};

export default function TermsPage() {
  return (
    <main className="bg-[#003d35] px-6 py-14 text-white">
      <article className="mx-auto max-w-4xl rounded-2xl border border-[#1b5b51] bg-[#06483f] p-7 sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">PawSearch</p>
        <h1 className="mt-2 text-4xl font-bold">Terms of Service</h1>
        <p className="mt-3 text-sm text-[#9bbab3]">Last updated: September 3, 2026</p>

        <div className="mt-8 space-y-8 leading-relaxed text-[#d7e7e3]">
          <section><h2 className="text-xl font-bold text-white">1. About PawSearch</h2><p className="mt-2">
            PawSearch is a community platform intended to help people share information about missing and found pets. PawSearch does not guarantee that a pet will be located, identified, returned, or reunited with an owner.
          </p></section>

          <section><h2 className="text-xl font-bold text-white">2. Eligibility and accounts</h2><p className="mt-2">
            You are responsible for the accuracy of information associated with your account and for activity performed through it. If you sign in using a third-party provider such as Google, that provider&apos;s terms may also apply.
          </p></section>

          <section><h2 className="text-xl font-bold text-white">3. User-submitted content</h2><p className="mt-2">
            You may submit pet descriptions, photographs, location information, sightings, and related details. You represent that you have the right to submit that content and that it is not knowingly false, misleading, unlawful, or abusive. You give PawSearch permission to display and process submitted content as needed to operate the service.
          </p></section>

          <section><h2 className="text-xl font-bold text-white">4. Safety and prohibited conduct</h2><p className="mt-2">
            Do not use PawSearch to impersonate another person, make fraudulent ownership claims, harass users, post intentionally false reports, solicit sensitive information, or facilitate scams. PawSearch may remove content or restrict access when reasonably necessary to protect users or the service.
          </p></section>

          <section><h2 className="text-xl font-bold text-white">5. Rewards and transactions</h2><p className="mt-2">
            Any reward mentioned in a report is an arrangement between the people involved. PawSearch is not a party to reward payments and does not verify claims of ownership or discovery. Users should independently verify information before sending money or sharing sensitive information.
          </p></section>

          <section><h2 className="text-xl font-bold text-white">6. Location information</h2><p className="mt-2">
            Reports may include approximate or precise location information. Consider personal safety before publishing addresses or other sensitive locations. Public report information may be visible to other PawSearch users and visitors.
          </p></section>

          <section><h2 className="text-xl font-bold text-white">7. Service availability</h2><p className="mt-2">
            PawSearch may change, suspend, or discontinue features. The service is provided on an &quot;as available&quot; basis, and errors, interruptions, or inaccurate user-submitted information may occur.
          </p></section>

          <section><h2 className="text-xl font-bold text-white">8. Changes to these terms</h2><p className="mt-2">
            These terms may be updated as PawSearch develops. The date at the top of this page identifies the current version.
          </p></section>
        </div>

        <div className="mt-10 border-t border-[#1b5b51] pt-6 text-sm">
          <Link href="/privacy" className="font-semibold text-[#fbb12c] hover:text-[#ffc34d]">Read the Privacy Policy</Link>
        </div>

        <p className="mt-5 text-xs leading-relaxed text-[#789b94]">
          These terms are an initial product draft and are not a substitute for review by qualified legal counsel before a public or commercial launch.
        </p>
      </article>
    </main>
  );
}
