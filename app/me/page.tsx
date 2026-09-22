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
      "ME - Error loading profile:",
      profileError,
    );
  }

  const city = profileData?.city?.trim() || "";
  const state = profileData?.state?.trim() || "";
  const zip = profileData?.zip_code?.trim() || "";

  // --------------------------------------------------
  // GET USER'S MISSING REPORTS
  // --------------------------------------------------

  const {
    data: dogsData,
    error: dogsError,
  } = await supabase
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

  const {
    data: reportsData,
    error: reportsError,
  } = await supabase
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
    const {
      data: foundData,
      error: foundError,
    } = await supabase
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
  // --------------------------------------------------

  let nearbyMissingCount = 0;

  if (city || state || zip) {
    let nearbyQuery = supabase
      .from("dogs")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("status", "missing");

    if (city) {
      nearbyQuery = nearbyQuery.ilike(
        "city",
        `%${city}%`,
      );
    }

    if (state) {
      nearbyQuery = nearbyQuery.ilike(
        "state",
        `%${state}%`,
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
  // BUILD RECENT ACTIVITY
  // --------------------------------------------------

  const recentActivity = [
    ...dogs.map((dog) => ({
      id: `dog-${dog.id}`,
      href: `/dogs/${dog.id}`,
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
      href: `/sightings/${report.id}`,
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

  // --------------------------------------------------
  // BUILD MISSING PET SEARCH URL
  // --------------------------------------------------

  const searchParams = new URLSearchParams();

  if (city) {
    searchParams.set("city", city);
  }

  if (state) {
    searchParams.set("state", state);
  }

  if (zip) {
    searchParams.set("zip", zip);
  }

  const dogsUrl =
    searchParams.toString().length > 0
      ? `/dogs?${searchParams.toString()}`
      : "/dogs";

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <main className="min-h-screen bg-gradient-to-r from-white via-[#e4e4e4] to-[#b5b5b5] px-4 py-10 text-black sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            My PawSearch
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            My Reports & My Information
          </h1>

          <p className="mt-3 max-w-2xl text-lg leading-7 text-gray-600">
            Manage your location, reports, and activity
            on PawSearch.
          </p>
        </div>

        {/* LOCATION */}

        <LocationSettings
          initialCity={city}
          initialState={state}
          initialZip={zip}
        />

        {/* MY REPORTS */}

        <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-7 flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
              01
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                My Reports
              </h2>

              <p className="mt-1 text-gray-600">
                View, edit, and manage your missing pet
                and found animal reports.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-bold">
                  Manage Your Reports
                </h3>

                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Update report information, view details,
                  and manage report statuses.
                </p>
              </div>

              <Link
                href="/dashboard"
                className="shrink-0 rounded-xl bg-black px-6 py-3 text-center font-bold text-white transition hover:bg-gray-800"
              >
                View My Reports →
              </Link>
            </div>
          </div>
        </section>

        {/* MISSING PETS NEAR YOU */}

        <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-7 flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
              02
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                Missing Pets Near You
              </h2>

              <p className="mt-1 text-gray-600">
                Explore missing pet reports around your
                saved location.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#fbb12c] bg-white">
              <span className="text-3xl font-bold text-black">
                {city || state || zip
                  ? nearbyMissingCount
                  : "—"}
              </span>
            </div>

            <p className="mt-4 text-lg font-semibold text-black">
              Missing pet reports
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {city || state || zip
                ? `Based on ${
                    [city, state]
                      .filter(Boolean)
                      .join(", ") ||
                    "your selected area"
                  }${
                    zip ? ` ${zip}` : ""
                  }.`
                : "Save your location above to search pets near you."}
            </p>

            <Link
              href={dogsUrl}
              className="mt-6 inline-block rounded-xl bg-black px-6 py-3 font-bold text-white transition hover:bg-gray-800"
            >
              View Missing Pets Near Me →
            </Link>
          </div>
        </section>

        {/* RECENT ACTIVITY */}

        <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-7 flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
              03
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                Recent Activity
              </h2>

              <p className="mt-1 text-gray-600">
                Keep track of your recent activity on
                PawSearch.
              </p>
            </div>
          </div>

          {recentActivity.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center">
              <div className="text-4xl">
                🐾
              </div>

              <h3 className="mt-3 font-bold">
                No activity yet
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Your recent reports and activity will
                appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <Link
                  key={activity.id}
                  href={activity.href}
                  className="group flex gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 transition hover:border-gray-400 hover:bg-white hover:shadow-sm"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-xl">
                    {activity.icon}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-black group-hover:underline">
                      {activity.title}
                    </p>

                    {activity.description && (
                      <p className="mt-1 text-sm text-gray-600">
                        {activity.description}
                      </p>
                    )}

                    <p className="mt-1 text-xs text-gray-500">
                      {formatDate(activity.date)}
                    </p>
                  </div>

                  <div className="flex items-center text-gray-400 transition group-hover:translate-x-1 group-hover:text-black">
                    →
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}