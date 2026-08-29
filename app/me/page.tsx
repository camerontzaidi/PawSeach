import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserDashboard } from "@/lib/reports/data";
import { createClient } from "@/utils/supabase/server";
import { updateProfilePreferences } from "@/app/actions/profile";

export default async function MePage() {
  const dashboard = await getCurrentUserDashboard();
  if (!dashboard) redirect("/login");

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("city, zip_code, notify_nearby_sightings, notify_contact_requests, notify_product_updates")
    .eq("id", dashboard.user.id)
    .maybeSingle();

  const activeCount =
    dashboard.missing.filter((row) => ["missing", "spotted"].includes(row.status)).length +
    dashboard.found.filter((row) => !["closed", "reunited"].includes(row.status)).length;

  return (
    <main className="min-h-screen bg-[#003d35] px-4 py-10 text-white sm:px-6 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <span className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">My Information</span>
        <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Account & Preferences</h1>
        <p className="mt-3 text-[#b7d5ce]">Signed in as {dashboard.user.email}</p>

        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          <div className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-5"><p className="text-3xl font-bold">{dashboard.missing.length}</p><p className="text-[#b7d5ce]">Missing reports</p></div>
          <div className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-5"><p className="text-3xl font-bold">{dashboard.found.length}</p><p className="text-[#b7d5ce]">Found reports</p></div>
          <div className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-5"><p className="text-3xl font-bold">{activeCount}</p><p className="text-[#b7d5ce]">Active reports</p></div>
        </div>

        <section className="mt-8 rounded-2xl border border-[#1b5b51] bg-[#06483f] p-6 sm:p-8">
          <h2 className="text-2xl font-bold">Saved Preferences</h2>
          <form action={updateProfilePreferences} className="mt-6 space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="font-semibold">City<input name="city" defaultValue={profile?.city ?? ""} className="mt-2 w-full rounded-md border border-[#1b5b51] bg-[#003d35] px-4 py-3" /></label>
              <label className="font-semibold">ZIP Code<input name="zipCode" defaultValue={profile?.zip_code ?? ""} pattern="[0-9]{5}" className="mt-2 w-full rounded-md border border-[#1b5b51] bg-[#003d35] px-4 py-3" /></label>
            </div>
            <label className="flex items-center gap-3"><input name="notifyNearbySightings" type="checkbox" defaultChecked={profile?.notify_nearby_sightings ?? true} /> Nearby-sighting notifications</label>
            <label className="flex items-center gap-3"><input name="notifyContactRequests" type="checkbox" defaultChecked={profile?.notify_contact_requests ?? true} /> Contact-request notifications</label>
            <label className="flex items-center gap-3"><input name="notifyProductUpdates" type="checkbox" defaultChecked={profile?.notify_product_updates ?? true} /> PawSearch product updates</label>
            <button className="rounded-md bg-[#fbb12c] px-6 py-3 font-bold text-[#003d35]">Save Preferences</button>
          </form>
        </section>

        <section className="mt-8 rounded-2xl border border-[#1b5b51] bg-[#06483f] p-6 sm:p-8">
          <h2 className="text-2xl font-bold">My Reports</h2>
          <p className="mt-2 text-[#b7d5ce]">Manage your real missing and found reports from the dashboard.</p>
          <Link href="/dashboard" className="mt-5 inline-block rounded-md bg-[#078c78] px-6 py-3 font-bold">Open My Reports →</Link>
        </section>
      </div>
    </main>
  );
}
