import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import UserAvatar from "@/components/UserAvatar";
import ProfileInformation from "@/components/ProfileInformation";

export default async function ProfilePage() {
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
  // USER INFORMATION
  // --------------------------------------------------

  const name =
    user.user_metadata?.name ||
    user.user_metadata?.full_name ||
    user.user_metadata?.display_name ||
    user.email?.split("@")[0] ||
    "User";

  const email = user.email || "Email unavailable";

  const avatarUrl =
    user.user_metadata?.avatar_url ||
    user.user_metadata?.picture ||
    null;

  const memberSince = new Date(
    user.created_at,
  ).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // --------------------------------------------------
  // GET SAVED LOCATION
  // --------------------------------------------------

  const {
    data: profileData,
    error: profileError,
  } = await supabase
    .from("profiles")
    .select("city, zip_code")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error(
      "PROFILE - Error loading profile:",
      profileError,
    );
  }

  const city = profileData?.city || "";
  const zip = profileData?.zip_code || "";

  // --------------------------------------------------
  // GET USER'S DOG REPORTS
  // --------------------------------------------------

  const {
    data: dogsData,
    error: dogsError,
  } = await supabase
    .from("dogs")
    .select("id, status")
    .eq("owner_id", user.id);

  if (dogsError) {
    console.error(
      "PROFILE - Error loading dogs:",
      dogsError,
    );
  }

  const dogs = dogsData ?? [];

  // --------------------------------------------------
  // REPORT COUNTS
  // --------------------------------------------------

  const missingReports = dogs.filter(
    (dog) =>
      dog.status?.toLowerCase() === "missing",
  ).length;

  const reunitedReports = dogs.filter(
    (dog) =>
      dog.status?.toLowerCase() === "reunited",
  ).length;

  const closedReports = dogs.filter(
    (dog) =>
      dog.status?.toLowerCase() === "closed",
  ).length;

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
            <div className="-mt-14 flex flex-col gap-5 sm:flex-row sm:items-end">

              <UserAvatar
                name={name}
                avatarUrl={avatarUrl}
                className="h-28 w-28 border-4 border-[#06483f]"
                textClassName="text-3xl"
              />

              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">
                  PawSearch
                </p>

                <h1 className="mt-1 text-4xl font-bold">
                  {name}
                </h1>

                <p className="mt-1 text-sm text-[#9bbab3]">
                  Member since {memberSince}
                </p>
              </div>

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
              A summary of your missing-pet reports and their outcomes.
            </p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">

            {/* MISSING */}

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

        {/* MY INFORMATION */}

        <section className="mt-8 rounded-2xl border border-[#1b5b51] bg-[#06483f] p-6 sm:p-8">
          <ProfileInformation
            initialName={name}
            email={email}
            initialCity={city}
            initialZip={zip}
          />
        </section>

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
                Your personal contact information should remain
                private when communicating with other PawSearch users.
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
                Never send money or sensitive information based only
                on an unverified claim that someone found your pet.
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
            Manage your account and PawSearch activity.
          </p>

          <div className="mt-6 border-t border-[#1b5b51] pt-6">

            <form
              action="/auth/signout"
              method="post"
            >
              <button
                type="submit"
                className="rounded-md border border-red-400/40 px-5 py-2.5 font-semibold text-red-300 transition hover:bg-red-500/10"
              >
                Sign Out
              </button>
            </form>

          </div>
        </section>

      </div>
    </main>
  );
}