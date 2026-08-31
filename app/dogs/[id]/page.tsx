import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import ReportManagement from "@/components/ReportManagement";
import CopyReportLink from "@/components/CopyReportLink";

type Dog = {
  id: string;
  owner_id: string;
  dog_name: string;
  breed: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  sex: string | null;
  size: string | null;
  estimated_birth_year: number | null;
  microchipped: boolean | null;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  status: string;
  created_at: string;
  last_seen_at: string | null;
  location_description: string | null;
  time_is_approximate: boolean | null;
  circumstances: string | null;
  reward_offered: boolean | null;
  reward_amount: number | null;
};

type DogPhoto = {
  id: string;
  dog_id: string;
  storage_path: string;
  is_primary: boolean;
};

function formatDate(date: string | null) {
  if (!date) {
    return "Date unavailable";
  }

  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(date: string | null) {
  if (!date) {
    return "Date unavailable";
  }

  return new Date(date).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatStatus(status: string) {
  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatValue(value: string | null) {
  if (!value) {
    return "Not provided";
  }

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default async function DogReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  // --------------------------------------------------
  // GET LOGGED-IN USER
  // --------------------------------------------------

  // --------------------------------------------------
  // GET REAL DOG REPORT
  // --------------------------------------------------

  const { data: dogData, error: dogError } = await supabase
    .from("dogs")
    .select(`
      id,
      owner_id,
      dog_name,
      breed,
      primary_color,
      secondary_color,
      sex,
      size,
      estimated_birth_year,
      microchipped,
      description,
      latitude,
      longitude,
      status,
      created_at,
      last_seen_at,
      location_description,
      time_is_approximate,
      circumstances,
      reward_offered,
      reward_amount
    `)
    .eq("id", id)
    .maybeSingle();

  if (dogError) {
    console.error(
      "VIEW REPORT - Supabase error:",
      dogError,
    );
  }

  if (!dogData) {
    console.error(
      "VIEW REPORT - No dog found for ID:",
      id,
    );

    notFound();
  }

  const dog = dogData as Dog;

  // --------------------------------------------------
  // GET DOG PHOTOS
  // --------------------------------------------------

  const { data: photosData, error: photosError } =
    await supabase
      .from("dog_photos")
      .select(`
        id,
        dog_id,
        storage_path,
        is_primary
      `)
      .eq("dog_id", dog.id)
      .order("is_primary", { ascending: false });

  if (photosError) {
    console.error(
      "VIEW REPORT - Error loading dog photos:",
      photosError,
    );
  }

  const photos = (photosData ?? []) as DogPhoto[];

  const primaryPhoto =
    photos.find((photo) => photo.is_primary) ??
    photos[0] ??
    null;

  // --------------------------------------------------
  // CONVERT STORAGE PATH TO PUBLIC IMAGE URL
  // --------------------------------------------------

  let photoUrl: string | null = null;

  if (primaryPhoto?.storage_path) {
    const { data: publicUrlData } =
      supabase.storage
        .from("dog-photos")
        .getPublicUrl(primaryPhoto.storage_path);

    photoUrl = publicUrlData.publicUrl;

    console.log(
      "VIEW REPORT - Photo storage path:",
      primaryPhoto.storage_path,
    );

    console.log(
      "VIEW REPORT - Generated photo URL:",
      photoUrl,
    );
  }

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <main className="min-h-screen bg-[#003d35] px-4 py-10 text-white sm:px-6 sm:py-16">
      <div className="mx-auto max-w-5xl">

        {/* BACK LINK */}

        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm font-semibold text-[#b7d5ce] transition hover:text-[#fbb12c]"
        >
          ← Back to My Reports
        </Link>

        {/* HEADER */}

        <div className="mt-6 max-w-3xl">
          <span className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">
            Missing Pet Report
          </span>

          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">
            {dog.dog_name}
          </h1>

          <p className="mt-3 text-lg text-[#b7d5ce]">
            Help bring this pet home.
          </p>
        </div>

        {/* MAIN REPORT */}

        <section className="mt-8 overflow-hidden rounded-2xl border border-[#1b5b51] bg-[#06483f] shadow-lg">

          {/* PHOTO */}

          <div className="flex h-64 items-center justify-center bg-[#003d35] sm:h-96">

            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoUrl}
                alt={dog.dog_name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-8xl">
                🐕
              </span>
            )}

          </div>

          <div className="p-5 sm:p-8">

            {/* NAME + STATUS */}

            <div className="flex flex-col gap-4 border-b border-[#1b5b51] pb-6 sm:flex-row sm:items-start sm:justify-between">

              <div>
                <h2 className="text-3xl font-bold">
                  {dog.dog_name}
                </h2>

                <p className="mt-1 text-lg text-[#b7d5ce]">
                  {dog.breed || "Unknown breed"}
                </p>
              </div>

              <span
                className={`w-fit rounded-full px-4 py-2 text-sm font-bold ${
                  dog.status.toLowerCase() === "missing"
                    ? "bg-[#fbb12c] text-[#003d35]"
                    : "bg-[#078c78] text-white"
                }`}
              >
                {formatStatus(dog.status)}
              </span>

            </div>

            {/* PET INFORMATION */}

            <section className="mt-8">

              <h3 className="text-2xl font-bold">
                Pet Information
              </h3>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">

                <div>
                  <p className="text-sm font-semibold text-[#9bbab3]">
                    Primary Color
                  </p>

                  <p className="mt-1 text-[#c3ded8]">
                    {formatValue(dog.primary_color)}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#9bbab3]">
                    Secondary Color
                  </p>

                  <p className="mt-1 text-[#c3ded8]">
                    {formatValue(dog.secondary_color)}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#9bbab3]">
                    Sex
                  </p>

                  <p className="mt-1 text-[#c3ded8]">
                    {formatValue(dog.sex)}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#9bbab3]">
                    Size
                  </p>

                  <p className="mt-1 text-[#c3ded8]">
                    {formatValue(dog.size)}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#9bbab3]">
                    Estimated Birth Year
                  </p>

                  <p className="mt-1 text-[#c3ded8]">
                    {dog.estimated_birth_year ?? "Unknown"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#9bbab3]">
                    Microchipped
                  </p>

                  <p className="mt-1 text-[#c3ded8]">
                    {dog.microchipped === null
                      ? "Unknown"
                      : dog.microchipped
                        ? "Yes"
                        : "No"}
                  </p>
                </div>

              </div>

              {dog.description && (
                <div className="mt-6">

                  <p className="text-sm font-semibold text-[#9bbab3]">
                    Description
                  </p>

                  <p className="mt-2 leading-relaxed text-[#c3ded8]">
                    {dog.description}
                  </p>

                </div>
              )}

            </section>

            {/* LAST SEEN */}

            <section className="mt-8 rounded-xl border border-[#1b5b51] bg-[#003d35] p-5 sm:p-6">

              <h3 className="text-xl font-bold">
                Last Seen Information
              </h3>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">

                <div>

                  <p className="text-sm font-semibold text-[#9bbab3]">
                    Date & Time
                  </p>

                  <p className="mt-1 text-[#c3ded8]">
                    📅 {formatDateTime(dog.last_seen_at)}
                  </p>

                  {dog.time_is_approximate && (
                    <p className="mt-1 text-sm text-[#b7d5ce]">
                      Time is approximate
                    </p>
                  )}

                </div>

                <div>

                  <p className="text-sm font-semibold text-[#9bbab3]">
                    Location
                  </p>

                  <p className="mt-1 text-[#c3ded8]">
                    📍{" "}
                    {dog.location_description ||
                      "Location unavailable"}
                  </p>

                </div>

                {(dog.latitude !== null ||
                  dog.longitude !== null) && (

                  <div className="sm:col-span-2">

                    <p className="text-sm font-semibold text-[#9bbab3]">
                      Coordinates
                    </p>

                    <p className="mt-1 text-[#c3ded8]">
                      {dog.latitude ?? "—"},{" "}
                      {dog.longitude ?? "—"}
                    </p>

                  </div>

                )}

              </div>

            </section>

            {/* CIRCUMSTANCES */}

            {dog.circumstances && (
              <section className="mt-6 rounded-xl border border-[#1b5b51] p-5 sm:p-6">

                <h3 className="text-xl font-bold">
                  What Happened?
                </h3>

                <p className="mt-3 leading-relaxed text-[#c3ded8]">
                  {dog.circumstances}
                </p>

              </section>
            )}

            {/* REWARD */}

            {dog.reward_offered && (
              <section className="mt-6 rounded-xl border border-[#1b5b51] bg-[#003d35] p-5 sm:p-6">

                <h3 className="text-xl font-bold">
                  Reward
                </h3>

                <p className="mt-3 text-[#c3ded8]">
                  🎁 Reward offered
                  {dog.reward_amount !== null
                    ? ` — $${dog.reward_amount.toLocaleString()}`
                    : ""}
                </p>

              </section>
            )}

            {/* REPORT MANAGEMENT */}

            <ReportManagement
              reportId={dog.id}
              status={dog.status}
            />

            {/* EDIT / BACK */}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">

              <Link
                href={`/dogs/${dog.id}/edit`}
                className="rounded-md bg-[#078c78] px-6 py-3 text-center font-bold text-white transition hover:bg-[#067966]"
              >
                Edit Report
              </Link>

              <Link
                href="/dashboard"
                className="rounded-md border border-[#1b5b51] px-6 py-3 text-center font-semibold transition hover:border-[#fbb12c] hover:text-[#fbb12c]"
              >
                Back to My Reports
              </Link>

            </div>

            {/* SHARE */}

            <section className="mt-6 rounded-xl border border-[#1b5b51] p-5 sm:p-6">

              <h3 className="text-xl font-bold">
                Share This Report
              </h3>

              <p className="mt-2 leading-relaxed text-[#c3ded8]">
                Help spread the word by sharing this report with
                people in your community.
              </p>

              <CopyReportLink />

            </section>

          </div>
        </section>
      </div>
    </main>
  );
}

