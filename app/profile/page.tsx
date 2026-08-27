import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getCurrentUserDashboard } from "@/lib/reports/data";
import Link from "next/link";

export default async function ProfilePage() {
  const dashboard = await getCurrentUserDashboard();
  if (!dashboard) redirect("/login");

  const supabase = await createClient();
  const { data: profile } = await supabase.from("profiles").select("city, zip_code").eq("id", dashboard.user.id).maybeSingle();
  const name = dashboard.user.user_metadata?.full_name || dashboard.user.user_metadata?.name || "PawSearch User";
  const reunited = dashboard.missing.filter((row) => row.status === "reunited").length + dashboard.found.filter((row) => row.status === "reunited").length;

  return (
    <main className="min-h-screen bg-[#003d35] px-4 py-10 text-white sm:px-6 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <section className="rounded-2xl border border-[#1b5b51] bg-[#06483f] p-8">
          <span className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">Profile</span>
          <h1 className="mt-2 text-4xl font-bold">{name}</h1>
          <p className="mt-2 text-[#b7d5ce]">{dashboard.user.email}</p>
          <p className="mt-1 text-[#b7d5ce]">Saved location: {profile?.city || "Not set"}{profile?.zip_code ? `, ${profile.zip_code}` : ""}</p>
        </section>

        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          <div className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-5"><p className="text-3xl font-bold">{dashboard.missing.length + dashboard.found.length}</p><p className="text-[#b7d5ce]">Reports submitted</p></div>
          <div className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-5"><p className="text-3xl font-bold">{dashboard.found.length}</p><p className="text-[#b7d5ce]">Found reports</p></div>
          <div className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-5"><p className="text-3xl font-bold">{reunited}</p><p className="text-[#b7d5ce]">Reunited</p></div>
        </div>

        <div className="mt-8 flex gap-4">
          <Link href="/me" className="rounded-md bg-[#fbb12c] px-6 py-3 font-bold text-[#003d35]">Edit Information</Link>
          <Link href="/dashboard" className="rounded-md bg-[#078c78] px-6 py-3 font-bold">My Reports</Link>
        </div>
      </div>
    </main>
  );
}
