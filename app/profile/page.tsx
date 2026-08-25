import Link from "next/link";

const profile = {
  name: "Ravi",
  email: "ravi@example.com",
  memberSince: "July 2026",
  city: "Fremont",
  zip: "94538",
};

const stats = {
  reports: 5,
  sightings: 8,
  reunited: 3,
  active: 2,
};

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-[#003d35] px-4 py-10 text-white sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        {/* PROFILE HEADER */}
        <section className="overflow-hidden rounded-2xl border border-[#1b5b51] bg-[#06483f]">
          <div className="h-32 bg-[#078c78]" />

          <div className="px-6 pb-7 sm:px-8">
            <div className="-mt-14 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-[#06483f] bg-[#fbb12c] text-5xl font-bold text-[#003d35]">
                  {profile.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">
                    My Account
                  </p>

                  <h1 className="mt-1 text-4xl font-bold">
                    My Information
                  </h1>

                  <p className="mt-1 text-[#b7d5ce]">
                    {profile.name}
                  </p>

                  <p className="mt-1 text-sm text-[#9bbab3]">
                    Member since {profile.memberSince}
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

        {/* PAWSEARCH IMPACT */}
        <section className="mt-8">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">
              Your PawSearch Impact
            </span>

            <h2 className="mt-2 text-3xl font-bold">
              Making a difference
            </h2>

            <p className="mt-2 text-[#b7d5ce]">
              Your activity helps connect missing pets with their families.
            </p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-[#1b5b51] bg-[#06483f] p-6">
              <div className="text-3xl">📋</div>

              <p className="mt-4 text-3xl font-bold">
                {stats.reports}
              </p>

              <p className="mt-1 text-[#b7d5ce]">
                Reports submitted
              </p>
            </div>

            <div className="rounded-2xl border border-[#1b5b51] bg-[#06483f] p-6">
              <div className="text-3xl">📍</div>

              <p className="mt-4 text-3xl font-bold">
                {stats.sightings}
              </p>

              <p className="mt-1 text-[#b7d5ce]">
                Sightings reported
              </p>
            </div>

            <div className="rounded-2xl border border-[#1b5b51] bg-[#06483f] p-6">
              <div className="text-3xl">🎉</div>

              <p className="mt-4 text-3xl font-bold">
                {stats.reunited}
              </p>

              <p className="mt-1 text-[#b7d5ce]">
                Pets reunited
              </p>
            </div>

            <div className="rounded-2xl border border-[#1b5b51] bg-[#06483f] p-6">
              <div className="text-3xl">🔎</div>

              <p className="mt-4 text-3xl font-bold">
                {stats.active}
              </p>

              <p className="mt-1 text-[#b7d5ce]">
                Active reports
              </p>
            </div>
          </div>
        </section>

        {/* PERSONAL INFORMATION AND NOTIFICATIONS */}
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
              <div className="rounded-xl border border-[#1b5b51] bg-[#003d35] p-4">
                <p className="text-sm text-[#9bbab3]">
                  Name
                </p>

                <p className="mt-1 font-semibold">
                  {profile.name}
                </p>
              </div>

              <div className="rounded-xl border border-[#1b5b51] bg-[#003d35] p-4">
                <p className="text-sm text-[#9bbab3]">
                  Email
                </p>

                <p className="mt-1 font-semibold">
                  {profile.email}
                </p>
              </div>

              <div className="rounded-xl border border-[#1b5b51] bg-[#003d35] p-4">
                <p className="text-sm text-[#9bbab3]">
                  Saved Location
                </p>

                <p className="mt-1 font-semibold">
                  {profile.city}, {profile.zip}
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
              <div className="text-2xl">🔒</div>

              <h3 className="mt-3 font-bold">
                Private Contact Information
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-[#b7d5ce]">
                Your personal contact information should remain private when
                communicating with other PawSearch users.
              </p>
            </div>

            <div className="rounded-xl border border-[#1b5b51] bg-[#003d35] p-5">
              <div className="text-2xl">⚠️</div>

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
              <div className="text-2xl">⚙️</div>

              <h3 className="mt-3 font-bold">
                Account Preferences
              </h3>

              <p className="mt-1 text-sm text-[#b7d5ce]">
                Manage your saved location and account preferences.
              </p>
            </Link>

            <Link
              href="/me"
              className="rounded-xl border border-[#1b5b51] bg-[#003d35] p-5 transition hover:border-[#fbb12c]"
            >
              <div className="text-2xl">📋</div>

              <h3 className="mt-3 font-bold">
                My Reports & Activity
              </h3>

              <p className="mt-1 text-sm text-[#b7d5ce]">
                View your reports, saved reports, and recent activity.
              </p>
            </Link>
          </div>

          <div className="mt-6 border-t border-[#1b5b51] pt-6">
            <button
              type="button"
              className="rounded-md border border-red-400/40 px-5 py-2.5 font-semibold text-red-300 transition hover:bg-red-500/10"
            >
              Sign Out
            </button>

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
        </div>
      </div>
    </main>
  );
}