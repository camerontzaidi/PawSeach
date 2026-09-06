import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import LocationSettings from "@/components/LocationSettings";

type Dog = {
  id: string;
  dog_name: string;
  breed: string | null;
  status: string;
  location_description: string | null;
  created_at: string;
};

type FoundReport = {
  id: string;
  breed: string | null;
  color: string | null;
  city: string | null;
  zip_code: string | null;
  status: string;
  found_at: string | null;
};

function formatDate(value: string | null) {
  if (!value) {
    return "Date unavailable";
  }

  return new Date(value).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function MePage() {
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
  // GET USER PROFILE / SAVED LOCATION
  // --------------------------------------------------

  const { data: profileData, error: profileError } =
    await supabase
      .from("profiles")
      .select("city, zip_code")
      .eq("id", user.id)
      .single();

  if (profileError) {
    console.error(
      "ME - Error loading profile:",
      profileError,
    );
  }

  const city = profileData?.city || "";
  const zip = profileData?.zip_code || "";

  // --------------------------------------------------
  // GET USER'S MISSING REPORTS
  // --------------------------------------------------

  const { data: dogsData, error: dogsError } =
    await supabase
      .from("dogs")
      .select(
        `
          id,
          dog_name,
          breed,
          status,
          location_description,
          created_at
        `,
      )
      .eq("owner_id", user.id)
      .order("created_at", {
        ascending: false,
      });

  if (dogsError) {
    console.error(
      "ME - Error loading dogs:",
      dogsError,
    );
  }

  const dogs = (dogsData ?? []) as Dog[];

  // --------------------------------------------------
  // GET USER'S FOUND REPORT IDS
  // --------------------------------------------------

  const { data: reportsData, error: reportsError } =
    await supabase
      .from("reports")
      .select("id")
      .eq("user_id", user.id);

  if (reportsError) {
    console.error(
      "ME - Error loading reports:",
      reportsError,
    );
  }

  const reportIds = (reportsData ?? []).map(
    (report) => report.id,
  );

  // --------------------------------------------------
  // GET USER'S FOUND REPORTS
  // --------------------------------------------------

  let foundReports: FoundReport[] = [];

  if (reportIds.length > 0) {
    const { data: foundData, error: foundError } =
      await supabase
        .from("found_reports")
        .select(
          `
            id,
            breed,
            color,
            city,
            zip_code,
            status,
            found_at
          `,
        )
        .in("report_id", reportIds)
        .order("found_at", {
          ascending: false,
        });

    if (foundError) {
      console.error(
        "ME - Error loading found reports:",
        foundError,
      );
    }

    foundReports =
      (foundData ?? []) as FoundReport[];
  }

  // --------------------------------------------------
  // GET MISSING PETS NEAR SAVED LOCATION
  //
  // NOTE:
  // This assumes your dogs table has city + zip_code.
  // If it doesn't, we will adjust this query.
  // --------------------------------------------------

  let nearbyMissingCount = 0;

  if (city || zip) {
    let nearbyQuery = supabase
      .from("dogs")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("status", "missing");

    if (city) {
      nearbyQuery = nearbyQuery.eq(
        "city",
        city,
      );
    }

    if (zip) {
      nearbyQuery = nearbyQuery.eq(
        "zip_code",
        zip,
      );
    }

    const {
      count,
      error: nearbyError,
    } = await nearbyQuery;

    if (nearbyError) {
      console.error(
        "ME - Error loading nearby dogs:",
        nearbyError,
      );
    } else {
      nearbyMissingCount = count ?? 0;
    }
  }

  // --------------------------------------------------
  // BUILD REAL RECENT ACTIVITY
  // --------------------------------------------------

  const recentActivity = [
    ...dogs.map((dog) => ({
      id: `dog-${dog.id}`,
      icon:
        dog.status.toLowerCase() === "reunited"
          ? "🎉"
          : "🐕",
      title:
        dog.status.toLowerCase() === "reunited"
          ? `${dog.dog_name} was reunited`
          : `Reported ${dog.dog_name} missing`,
      description: [
        dog.breed,
        dog.location_description,
      ]
        .filter(Boolean)
        .join(" · "),
      date: dog.created_at,
    })),

    ...foundReports.map((report) => ({
      id: `found-${report.id}`,
      icon: "📍",
      title: "Reported a pet sighting",
      description: [
        report.breed || "Found animal",
        report.city,
        report.zip_code,
      ]
        .filter(Boolean)
        .join(" · "),
      date: report.found_at,
    })),
  ]
    .sort(
      (a, b) =>
        new Date(b.date || 0).getTime() -
        new Date(a.date || 0).getTime(),
    )
    .slice(0, 5);

  const dogsUrl =
    city || zip
      ? `/dogs?city=${encodeURIComponent(
          city,
        )}&zip=${encodeURIComponent(zip)}`
      : "/dogs";

  return (
    <main className="min-h-screen bg-[#003d35] px-4 py-10 text-white sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <div>
          <span className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">
            My PawSearch
          </span>

          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">
            My Reports & My Information
          </h1>

          <p className="mt-3 text-lg text-[#b7d5ce]">
            Manage your location, reports, and activity
            on PawSearch.
          </p>
        </div>

        {/* LOCATION */}

        <LocationSettings
          initialCity={city}
          initialZip={zip}
        />

        {/* MY REPORTS */}

        <section className="mt-8 rounded-2xl border border-[#1b5b51] bg-[#06483f] p-6 sm:p-8">
          <span className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">
            Reports
          </span>

          <h2 className="mt-2 text-2xl font-bold">
            My Reports
          </h2>

          <p className="mt-2 text-[#b7d5ce]">
            View, edit, and manage your missing pet and
            found animal reports.
          </p>

          <div className="mt-6 rounded-xl bg-[#003d35] p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h3 className="text-lg font-bold">
                  Manage Your Reports
                </h3>

                <p className="mt-1 text-sm text-[#b7d5ce]">
                  Update report information, view details,
                  and manage report statuses.
                </p>
              </div>

              <Link
                href="/dashboard"
                className="shrink-0 rounded-md bg-[#078c78] px-6 py-3 text-center font-bold text-white transition hover:bg-[#067966]"
              >
                View My Reports →
              </Link>

            </div>
          </div>
        </section>

        {/* MISSING PETS NEAR YOU */}

        <section className="mt-8 rounded-2xl border border-[#1b5b51] bg-[#06483f] p-6 sm:p-8">
          <span className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">
            Community
          </span>

          <h2 className="mt-2 text-2xl font-bold">
            Missing Pets Near You
          </h2>

          <p className="mt-2 text-[#b7d5ce]">
            Explore missing pet reports around your saved
            location.
          </p>

          <div className="mt-6 flex flex-col items-center rounded-xl bg-[#003d35] p-8 text-center">

            <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#fbb12c]">
              <span className="text-3xl font-bold">
                {city || zip
                  ? nearbyMissingCount
                  : "—"}
              </span>
            </div>

            <p className="mt-4 text-lg font-semibold">
              Missing pet reports
            </p>

            <p className="mt-1 text-sm text-[#b7d5ce]">
              {city || zip
                ? `Based on ${city || "your selected area"}${zip ? `, ${zip}` : ""}.`
                : "Save your location above to search pets near you."}
            </p>

            <Link
              href={dogsUrl}
              className="mt-6 rounded-md bg-[#078c78] px-6 py-3 font-bold text-white transition hover:bg-[#067966]"
            >
              View Missing Pets Near Me →
            </Link>

          </div>
        </section>

        {/* RECENT ACTIVITY */}

        <section className="mt-8 rounded-2xl border border-[#1b5b51] bg-[#06483f] p-6 sm:p-8">

          <span className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">
            Activity
          </span>

          <h2 className="mt-2 text-2xl font-bold">
            Recent Activity
          </h2>

          <p className="mt-1 text-[#b7d5ce]">
            Keep track of your recent activity on PawSearch.
          </p>

          {recentActivity.length === 0 ? (
            <div className="mt-6 rounded-xl bg-[#003d35] p-8 text-center">

              <div className="text-4xl">
                🐾
              </div>

              <h3 className="mt-3 font-bold">
                No activity yet
              </h3>

              <p className="mt-2 text-sm text-[#b7d5ce]">
                Your recent reports and activity will appear
                here.
              </p>

            </div>
          ) : (
            <div className="mt-6 space-y-3">

              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex gap-4 rounded-xl border border-[#1b5b51] bg-[#003d35] p-4"
                >

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#06483f] text-xl">
                    {activity.icon}
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="font-bold">
                      {activity.title}
                    </p>

                    {activity.description && (
                      <p className="mt-1 text-sm text-[#b7d5ce]">
                        {activity.description}
                      </p>
                    )}

                    <p className="mt-1 text-xs text-[#9bbab3]">
                      {formatDate(activity.date)}
                    </p>

                  </div>

                </div>
              ))}

            </div>
          )}

        </section>

      </div>
    </main>
  );
}