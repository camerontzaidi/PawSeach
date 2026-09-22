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

  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
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
    console.error("Error loading dog photos:", photosError);
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
    photoUrls.find((photo) => photo.isPrimary)?.url ??
    photoUrls[0]?.url ??
    null;

  return (
    <main className="min-h-screen bg-gradient-to-r from-white via-[#e4e4e4] to-[#b5b5b5] px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl">
        {/* BACK */}

        <Link
          href="/dashboard"
          className="text-sm font-semibold text-gray-600 transition hover:text-black"
        >
          ← Back to My Reports
        </Link>

        {/* HEADER */}

        <div className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            My Report
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-black sm:text-5xl">
            Manage {dog.dog_name}
          </h1>

          <p className="mt-3 text-lg text-gray-600">
            View your report and update its status.
          </p>
        </div>

        {/* REPORT */}

        <section className="mt-8 overflow-hidden rounded-3xl bg-white shadow-sm">
          {/* PHOTO */}

          <div className="flex h-80 items-center justify-center bg-gray-100">
            {primaryPhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={primaryPhoto}
                alt={dog.dog_name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-8xl">🐕</span>
            )}
          </div>

          <div className="p-6 sm:p-8">
            {/* NAME + STATUS */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-3xl font-bold text-black">
                  {dog.dog_name}
                </h2>

                <p className="mt-1 text-lg text-gray-500">
                  {dog.breed || "Unknown breed"}
                </p>
              </div>

              <span
                className={`h-fit rounded-full border px-4 py-2 text-sm font-bold ${
                  dog.status.toLowerCase() === "reunited"
                    ? "border-gray-300 bg-gray-100 text-gray-700"
                    : dog.status.toLowerCase() === "closed"
                      ? "border-gray-300 bg-gray-50 text-gray-500"
                      : "border-[#fbb12c] bg-[#fff7df] text-gray-800"
                }`}
              >
                {formatStatus(dog.status)}
              </span>
            </div>

            {/* DOG INFORMATION */}

            <section className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                  01
                </div>

                <div>
                  <h3 className="text-xl font-bold text-black">
                    Report Information
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Information currently attached to this report.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4 text-sm leading-6 text-gray-600">
                {dog.location_description && (
                  <div>
                    <p className="font-semibold text-black">Location</p>
                    <p className="mt-1">
                      📍 {dog.location_description}
                    </p>
                  </div>
                )}

                {dog.last_seen_at && (
                  <div>
                    <p className="font-semibold text-black">Last seen</p>
                    <p className="mt-1">
                      📅 {formatDate(dog.last_seen_at)}
                    </p>
                  </div>
                )}

                {dog.description && (
                  <div>
                    <p className="font-semibold text-black">Description</p>
                    <p className="mt-1">📝 {dog.description}</p>
                  </div>
                )}

                {dog.latitude !== null &&
                  dog.longitude !== null && (
                    <div>
                      <p className="font-semibold text-black">
                        Coordinates
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {dog.latitude}, {dog.longitude}
                      </p>
                    </div>
                  )}
              </div>
            </section>

            {/* REPORT MANAGEMENT */}

            <section className="mt-8">
              <div className="mb-5 flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                  02
                </div>

                <div>
                  <h3 className="text-xl font-bold text-black">
                    Manage Report
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Update the status or take other actions on your report.
                  </p>
                </div>
              </div>

              <ReportManagement
                reportId={dog.id}
                status={dog.status}
              />
            </section>
          </div>
        </section>

        {/* ADDITIONAL PHOTOS */}

        {photoUrls.length > 1 && (
          <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                03
              </div>

              <div>
                <h2 className="text-xl font-bold text-black sm:text-2xl">
                  Additional Photos
                </h2>

                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Other photos attached to this pet report.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {photoUrls
                .filter((photo) => photo.url !== primaryPhoto)
                .map((photo) => (
                  <div
                    key={photo.id}
                    className="overflow-hidden rounded-2xl bg-gray-100"
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