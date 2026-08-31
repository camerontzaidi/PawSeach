import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getCurrentUserDashboard } from "@/lib/reports/data";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
<<<<<<< HEAD
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
=======
  const supabase = await createClient();

  // --------------------------------------------------
  // GET LOGGED-IN USER
  // --------------------------------------------------

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // --------------------------------------------------
  // REAL USER INFORMATION
  // --------------------------------------------------

  const name =
    user.user_metadata?.name ||
    user.user_metadata?.full_name ||
    user.user_metadata?.display_name ||
    user.email?.split("@")[0] ||
    "User";

  const email = user.email || "Email unavailable";

  const memberSince = new Date(user.created_at).toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    },
  );

  // --------------------------------------------------
  // GET USER'S DOG REPORTS
  // --------------------------------------------------

  const { data: dogsData, error: dogsError } = await supabase
    .from("dogs")
    .select("id, status")
    .eq("owner_id", user.id);

  if (dogsError) {
    console.error("PROFILE - Error loading dogs:", dogsError);
  }

  const dogs = dogsData ?? [];

  // --------------------------------------------------
  // REAL REPORT COUNTS
  // --------------------------------------------------

  const missingReports = dogs.filter(
    (dog) => dog.status?.toLowerCase() === "missing",
  ).length;

  const reunitedReports = dogs.filter(
    (dog) => dog.status?.toLowerCase() === "reunited",
  ).length;

  const closedReports = dogs.filter(
    (dog) => dog.status?.toLowerCase() === "closed",
  ).length;

  // --------------------------------------------------
  // GET USER'S FOUND REPORTS
  //
  // reports.user_id -> user.id
  // found_reports.report_id -> reports.id
  // --------------------------------------------------

  const { data: reportsData, error: reportsError } = await supabase
    .from("reports")
    .select("id")
    .eq("user_id", user.id);

  if (reportsError) {
    console.error(
      "PROFILE - Error loading reports:",
      reportsError,
    );
  }

  const reportIds = (reportsData ?? []).map(
    (report) => report.id,
  );

  let foundReports = 0;

  if (reportIds.length > 0) {
    const { count, error: foundError } = await supabase
      .from("found_reports")
      .select("id", {
        count: "exact",
        head: true,
      })
      .in("report_id", reportIds);

    if (foundError) {
      console.error(
        "PROFILE - Error loading found reports:",
        foundError,
      );
    } else {
      foundReports = count ?? 0;
    }
  }

  // --------------------------------------------------
  // TEMPORARY LOCATION
  // --------------------------------------------------

  const city = "Fremont";
  const zip = "94538";

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <main className="min-h-screen bg-[#003d35] px-4 py-10 text-white sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">

        {/* PROFILE HEADER */}

        <section className="overflow-hidden rounded-2xl border border-[#1b5b51] bg-[#06483f]">

          <div className="h-32 bg-[#078c78]" />

          <div className="px-6 pb-7 sm:px-8">

            <div className="-mt-14 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">

                {/* AVATAR */}

                <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-[#06483f] bg-[#fbb12c] text-5xl font-bold text-[#003d35]">
                  {name.charAt(0).toUpperCase()}
                </div>

                {/* USER INFO */}

                <div>

                  <p className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">
                    My Account
                  </p>

                  <h1 className="mt-1 text-4xl font-bold">
                    My Information
                  </h1>

                  <p className="mt-1 text-[#b7d5ce]">
                    {name}
                  </p>

                  <p className="mt-1 text-sm text-[#9bbab3]">
                    Member since {memberSince}
                  </p>

                </div>

              </div>

              <Link
                href="/me"
                className="rounded-md border border-[#1b5b51] px-5 py-2.5 text-center font-bold transition hover:border-[#fbb12c] hover:text-[#fbb12c]"
              >
                Edit Information
              </Link>

            </div>

          </div>

        </section>

        {/* REPORT ACTIVITY */}

        <section className="mt-8">

          <div>

            <span className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">
              Your PawSearch Activity
            </span>

            <h2 className="mt-2 text-3xl font-bold">
              Your Reports
            </h2>

            <p className="mt-2 text-[#b7d5ce]">
              A summary of your missing-pet and found-animal reports.
            </p>

          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {/* MISSING REPORTS */}

            <div className="rounded-2xl border border-[#1b5b51] bg-[#06483f] p-6">

              <div className="text-3xl">
                🐕
              </div>

              <p className="mt-4 text-3xl font-bold">
                {missingReports}
              </p>

              <p className="mt-1 text-[#b7d5ce]">
                Missing reports
              </p>

            </div>

            {/* FOUND REPORTS */}

            <div className="rounded-2xl border border-[#1b5b51] bg-[#06483f] p-6">

              <div className="text-3xl">
                🐾
              </div>

              <p className="mt-4 text-3xl font-bold">
                {foundReports}
              </p>

              <p className="mt-1 text-[#b7d5ce]">
                Found reports
              </p>

            </div>

            {/* REUNITED */}

            <div className="rounded-2xl border border-[#1b5b51] bg-[#06483f] p-6">

              <div className="text-3xl">
                🎉
              </div>

              <p className="mt-4 text-3xl font-bold">
                {reunitedReports}
              </p>

              <p className="mt-1 text-[#b7d5ce]">
                Pets reunited
              </p>

            </div>

            {/* CLOSED */}

            <div className="rounded-2xl border border-[#1b5b51] bg-[#06483f] p-6">

              <div className="text-3xl">
                📁
              </div>

              <p className="mt-4 text-3xl font-bold">
                {closedReports}
              </p>

              <p className="mt-1 text-[#b7d5ce]">
                Closed reports
              </p>

            </div>

          </div>

        </section>

        {/* PERSONAL INFORMATION + NOTIFICATIONS */}

        <div className="mt-8 grid gap-8 lg:grid-cols-2">

          {/* PERSONAL INFORMATION */}

          <section className="rounded-2xl border border-[#1b5b51] bg-[#06483f] p-6 sm:p-8">

            <div className="flex items-start justify-between gap-4">

              <div>

                <span className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">
                  Information
                </span>

                <h2 className="mt-2 text-2xl font-bold">
                  Personal Information
                </h2>

                <p className="mt-1 text-[#b7d5ce]">
                  Your basic account information.
                </p>

              </div>

              <Link
                href="/me"
                className="text-sm font-bold text-[#fbb12c] hover:text-[#ffc34d]"
              >
                Edit
              </Link>

            </div>

            <div className="mt-6 space-y-4">

              {/* NAME */}

              <div className="rounded-xl border border-[#1b5b51] bg-[#003d35] p-4">

                <p className="text-sm text-[#9bbab3]">
                  Name
                </p>

                <p className="mt-1 font-semibold">
                  {name}
                </p>

              </div>

              {/* EMAIL */}

              <div className="rounded-xl border border-[#1b5b51] bg-[#003d35] p-4">

                <p className="text-sm text-[#9bbab3]">
                  Email
                </p>

                <p className="mt-1 font-semibold">
                  {email}
                </p>

              </div>

              {/* LOCATION */}

              <div className="rounded-xl border border-[#1b5b51] bg-[#003d35] p-4">

                <p className="text-sm text-[#9bbab3]">
                  Saved Location
                </p>

                <p className="mt-1 font-semibold">
                  {city}, {zip}
                </p>

              </div>

            </div>

          </section>

          {/* NOTIFICATIONS */}

          <section className="rounded-2xl border border-[#1b5b51] bg-[#06483f] p-6 sm:p-8">

            <span className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">
              Preferences
            </span>

            <h2 className="mt-2 text-2xl font-bold">
              Notifications
            </h2>

            <p className="mt-1 text-[#b7d5ce]">
              Choose what PawSearch keeps you updated about.
            </p>

            <div className="mt-6 space-y-4">

              {/* NEARBY SIGHTINGS */}

              <label className="flex items-center justify-between gap-4 rounded-xl border border-[#1b5b51] bg-[#003d35] p-4">

                <div>

                  <p className="font-semibold">
                    Nearby sightings
                  </p>

                  <p className="mt-1 text-sm text-[#9bbab3]">
                    Get notified about sightings near your reports.
                  </p>

                </div>

                <input
                  type="checkbox"
                  defaultChecked
                  className="h-5 w-5 accent-[#fbb12c]"
                />

              </label>

              {/* CONTACT REQUESTS */}

              <label className="flex items-center justify-between gap-4 rounded-xl border border-[#1b5b51] bg-[#003d35] p-4">

                <div>

                  <p className="font-semibold">
                    Contact requests
                  </p>

                  <p className="mt-1 text-sm text-[#9bbab3]">
                    Know when someone wants to contact you.
                  </p>

                </div>

                <input
                  type="checkbox"
                  defaultChecked
                  className="h-5 w-5 accent-[#fbb12c]"
                />

              </label>

              {/* PAWSEARCH UPDATES */}

              <label className="flex items-center justify-between gap-4 rounded-xl border border-[#1b5b51] bg-[#003d35] p-4">

                <div>

                  <p className="font-semibold">
                    PawSearch updates
                  </p>

                  <p className="mt-1 text-sm text-[#9bbab3]">
                    Important product and community updates.
                  </p>

                </div>

                <input
                  type="checkbox"
                  defaultChecked
                  className="h-5 w-5 accent-[#fbb12c]"
                />

              </label>

            </div>

          </section>

        </div>

        {/* PRIVACY & SAFETY */}

        <section className="mt-8 rounded-2xl border border-[#1b5b51] bg-[#06483f] p-6 sm:p-8">

          <span className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">
            Safety
          </span>

          <h2 className="mt-2 text-2xl font-bold">
            Privacy & Safety
          </h2>

          <p className="mt-2 text-[#b7d5ce]">
            Keep your information protected while using PawSearch.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">

            <div className="rounded-xl border border-[#1b5b51] bg-[#003d35] p-5">

              <div className="text-2xl">
                🔒
              </div>

              <h3 className="mt-3 font-bold">
                Private Contact Information
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-[#b7d5ce]">
                Your personal contact information should remain private when
                communicating with other PawSearch users.
              </p>

            </div>

            <div className="rounded-xl border border-[#1b5b51] bg-[#003d35] p-5">

              <div className="text-2xl">
                ⚠️
              </div>

              <h3 className="mt-3 font-bold">
                Stay Alert for Scams
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-[#b7d5ce]">
                Never send money or sensitive information based only on an
                unverified claim that someone found your pet.
              </p>

            </div>

          </div>

        </section>

        {/* ACCOUNT SETTINGS */}

        <section className="mt-8 rounded-2xl border border-[#1b5b51] bg-[#06483f] p-6 sm:p-8">

          <span className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">
            Account
          </span>

          <h2 className="mt-2 text-2xl font-bold">
            Account Settings
          </h2>

          <p className="mt-2 text-[#b7d5ce]">
            Manage your account preferences and information.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">

            <Link
              href="/me"
              className="rounded-xl border border-[#1b5b51] bg-[#003d35] p-5 transition hover:border-[#fbb12c]"
            >

              <div className="text-2xl">
                ⚙️
              </div>

              <h3 className="mt-3 font-bold">
                Account Preferences
              </h3>

              <p className="mt-1 text-sm text-[#b7d5ce]">
                Manage your saved location and account preferences.
              </p>

            </Link>

            <Link
              href="/dashboard"
              className="rounded-xl border border-[#1b5b51] bg-[#003d35] p-5 transition hover:border-[#fbb12c]"
            >

              <div className="text-2xl">
                📋
              </div>

              <h3 className="mt-3 font-bold">
                My Reports & Activity
              </h3>

              <p className="mt-1 text-sm text-[#b7d5ce]">
                View your reports, saved reports, and recent activity.
              </p>

            </Link>

          </div>

          <div className="mt-6 border-t border-[#1b5b51] pt-6">

            <form action="/auth/signout" method="post">

              <button
                type="submit"
                className="rounded-md border border-red-400/40 px-5 py-2.5 font-semibold text-red-300 transition hover:bg-red-500/10"
              >
                Sign Out
              </button>

            </form>

            <p className="mt-3 text-xs text-[#9bbab3]">
              Account deletion and authentication settings can be connected to
              Supabase later.
            </p>

          </div>

        </section>

        {/* FOOTER */}

        <div className="mt-10 text-center">

          <Link
            href="/"
            className="font-semibold text-[#fbb12c] hover:text-[#ffc34d]"
          >
            ← Back to PawSearch
          </Link>

>>>>>>> mapping-week
        </div>

      </div>
    </main>
  );
}
