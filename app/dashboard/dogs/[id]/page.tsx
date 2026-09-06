import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import ReportManagement from "@/components/ReportManagement";

type Dog = {
  id: string;
  owner_id: string;
  dog_name: string;
  breed: string | null;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  status: string;
  created_at: string;
  last_seen_at: string | null;
  location_description: string | null;
};

type DogPhoto = {
  id: string;
  dog_id: string;
  storage_path: string;
  is_primary: boolean;
};

function formatStatus(status: string) {
  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(date: string | null) {
  if (!date) {
    return "Date unavailable";
  }

  return new Date(date).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    },
  );
}

export default async function DashboardDogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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
  // GET DOG
  //
  // IMPORTANT:
  // Only load a dog if the current user owns it.
  // --------------------------------------------------

  const {
    data: dogData,
    error: dogError,
  } = await supabase
    .from("dogs")
    .select(
      `
        id,
        owner_id,
        dog_name,
        breed,
        description,
        latitude,
        longitude,
        status,
        created_at,
        last_seen_at,
        location_description
      `,
    )
    .eq("id", id)
    .eq("owner_id", user.id)
    .single();

  if (dogError || !dogData) {
    notFound();
  }

  const dog = dogData as Dog;

  // --------------------------------------------------
  // GET PHOTOS
  // --------------------------------------------------

  const {
    data: photosData,
    error: photosError,
  } = await supabase
    .from("dog_photos")
    .select(
      `
        id,
        dog_id,
        storage_path,
        is_primary
      `,
    )
    .eq("dog_id", dog.id)
    .order("is_primary", {
      ascending: false,
    });

  if (photosError) {
    console.error(
      "Error loading dog photos:",
      photosError,
    );
  }

  const photos = (photosData ?? []) as DogPhoto[];

  // --------------------------------------------------
  // BUILD PHOTO URLS
  // --------------------------------------------------

  const photoUrls = photos.map((photo) => {
    const {
      data: { publicUrl },
    } = supabase.storage
      .from("dog-photos")
      .getPublicUrl(photo.storage_path);

    return {
      id: photo.id,
      url: publicUrl,
      isPrimary: photo.is_primary,
    };
  });

  const primaryPhoto =
    photoUrls.find(
      (photo) => photo.isPrimary,
    )?.url ??
    photoUrls[0]?.url ??
    null;

  return (
    <main className="min-h-screen bg-[#003d35] px-4 py-10 text-white sm:px-6 sm:py-16">
      <div className="mx-auto max-w-4xl">

        {/* BACK */}

        <Link
          href="/dashboard"
          className="text-sm font-semibold text-[#b7d5ce] transition hover:text-[#fbb12c]"
        >
          ← Back to My Reports
        </Link>

        {/* HEADER */}

        <div className="mt-6">
          <span className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">
            My Report
          </span>

          <h1 className="mt-2 text-4xl font-bold">
            Manage {dog.dog_name}
          </h1>

          <p className="mt-2 text-[#b7d5ce]">
            View your report and update its status.
          </p>
        </div>

        {/* REPORT */}

        <section className="mt-8 overflow-hidden rounded-2xl border border-[#1b5b51] bg-[#06483f]">

          {/* PHOTO */}

          <div className="flex h-80 items-center justify-center bg-[#00342e]">
            {primaryPhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={primaryPhoto}
                alt={dog.dog_name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-8xl">
                🐕
              </span>
            )}
          </div>

          <div className="p-6 sm:p-8">

            {/* NAME + STATUS */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-3xl font-bold">
                  {dog.dog_name}
                </h2>

                <p className="mt-1 text-lg text-[#b7d5ce]">
                  {dog.breed || "Unknown breed"}
                </p>
              </div>

              <span className="h-fit rounded-full bg-[#fbb12c] px-4 py-2 text-sm font-bold text-[#003d35]">
                {formatStatus(dog.status)}
              </span>
            </div>

            {/* DOG INFORMATION */}

            <section className="mt-8 rounded-xl border border-[#1b5b51] bg-[#003d35] p-5">
              <h3 className="text-xl font-bold">
                Report Information
              </h3>

              <div className="mt-4 space-y-3 text-[#c3ded8]">

                {dog.location_description && (
                  <p>
                    📍 Location:{" "}
                    {dog.location_description}
                  </p>
                )}

                {dog.last_seen_at && (
                  <p>
                    📅 Last seen:{" "}
                    {formatDate(
                      dog.last_seen_at,
                    )}
                  </p>
                )}

                {dog.description && (
                  <p>
                    📝 {dog.description}
                  </p>
                )}

                {dog.latitude !== null &&
                  dog.longitude !== null && (
                    <p className="text-sm text-[#9bbab3]">
                      Coordinates:{" "}
                      {dog.latitude},{" "}
                      {dog.longitude}
                    </p>
                  )}

              </div>
            </section>

            {/* REPORT MANAGEMENT */}

            <section className="mt-6">
              <ReportManagement
                reportId={dog.id}
                status={dog.status}
              />
            </section>

          </div>
        </section>

        {/* ADDITIONAL PHOTOS */}

        {photoUrls.length > 1 && (
          <section className="mt-8 rounded-2xl border border-[#1b5b51] bg-[#06483f] p-6 sm:p-8">

            <h2 className="text-2xl font-bold">
              Additional Photos
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {photoUrls
                .filter(
                  (photo) =>
                    photo.url !== primaryPhoto,
                )
                .map((photo) => (
                  <div
                    key={photo.id}
                    className="overflow-hidden rounded-xl bg-[#00342e]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.url}
                      alt={`${dog.dog_name} additional photo`}
                      className="h-64 w-full object-cover"
                    />
                  </div>
                ))}
            </div>

          </section>
        )}

      </div>
    </main>
  );
}