import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

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

export default async function DashboardPage() {
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
  // GET USER'S DOG REPORTS
  // --------------------------------------------------

  const { data: dogsData, error: dogsError } = await supabase
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
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  if (dogsError) {
    console.error("Error loading dog reports:", dogsError);
  }

  const dogs = (dogsData ?? []) as Dog[];

  // --------------------------------------------------
  // SPLIT DOG REPORTS BY STATUS
  // --------------------------------------------------

  const missingDogs = dogs.filter(
    (dog) => dog.status.toLowerCase() === "missing",
  );

  const reunitedDogs = dogs.filter(
    (dog) => dog.status.toLowerCase() === "reunited",
  );

  const closedDogs = dogs.filter(
    (dog) => dog.status.toLowerCase() === "closed",
  );

  // --------------------------------------------------
  // GET DOG PHOTOS
  // --------------------------------------------------

  let dogPhotos: DogPhoto[] = [];

  if (dogs.length > 0) {
    const dogIds = dogs.map((dog) => dog.id);

    const { data: photosData, error: photosError } =
      await supabase
        .from("dog_photos")
        .select(
          `
            id,
            dog_id,
            storage_path,
            is_primary
          `,
        )
        .in("dog_id", dogIds)
        .order("is_primary", { ascending: false });

    if (photosError) {
      console.error("Error loading dog photos:", photosError);
    }

    dogPhotos = (photosData ?? []) as DogPhoto[];
  }

  // --------------------------------------------------
  // GET PRIMARY DOG PHOTO
  // --------------------------------------------------

  function getDogPhoto(dogId: string) {
    const photo = dogPhotos.find(
      (item) =>
        item.dog_id === dogId &&
        item.is_primary,
    );

    if (!photo) {
      return null;
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("dog-photos")
      .getPublicUrl(photo.storage_path);

    return publicUrl;
  }

  // --------------------------------------------------
  // FORMAT STATUS
  // --------------------------------------------------

  function formatStatus(status: string) {
    return status
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  // --------------------------------------------------
  // FORMAT DATE
  // --------------------------------------------------

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

  // --------------------------------------------------
  // DOG CARD
  // --------------------------------------------------

  function DogCard({
    dog,
    found,
  }: {
    dog: Dog;
    found?: boolean;
  }) {
    const photo = getDogPhoto(dog.id);

    return (
      <article className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        {/* PHOTO */}

        <div className="flex h-56 items-center justify-center bg-gray-100">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt={dog.dog_name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-7xl">🐕</span>
          )}
        </div>

        <div className="p-6">
          {/* NAME + STATUS */}

          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-2xl font-bold text-black">
                {dog.dog_name}
              </h3>

              <p className="mt-1 text-gray-500">
                {dog.breed || "Unknown breed"}
              </p>
            </div>

            <span
              className={`shrink-0 rounded-full border px-3 py-1 text-xs font-bold ${
                found
                  ? "border-gray-300 bg-gray-100 text-gray-700"
                  : dog.status.toLowerCase() === "closed"
                    ? "border-gray-300 bg-gray-50 text-gray-500"
                    : "border-[#fbb12c] bg-[#fff7df] text-gray-800"
              }`}
            >
              {found ? "Reunited" : formatStatus(dog.status)}
            </span>
          </div>

          {/* LOCATION / DATE */}

          <div className="mt-5 space-y-2 text-sm text-gray-600">
            {dog.location_description && (
              <p>📍 {dog.location_description}</p>
            )}

            {dog.last_seen_at && (
              <p>📅 {formatDate(dog.last_seen_at)}</p>
            )}
          </div>

          {/* ACTIONS */}

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/dashboard/dogs/${dog.id}`}
              className="rounded-xl border border-gray-300 px-4 py-2 font-semibold text-black transition hover:border-[#fbb12c] hover:bg-gray-50"
            >
              View / Change Status
            </Link>

            <Link
              href={`/dogs/${dog.id}/edit`}
              className="rounded-xl bg-black px-4 py-2 font-bold text-white transition hover:bg-gray-800"
            >
              Edit Info
            </Link>
          </div>
        </div>
      </article>
    );
  }

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <main className="min-h-screen bg-gradient-to-r from-white via-[#e4e4e4] to-[#b5b5b5] px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            My Reports
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-black sm:text-5xl">
            Manage Your Reports
          </h1>

          <p className="mt-3 max-w-2xl text-lg text-gray-600">
            View and manage your missing pet reports.
          </p>
        </div>

        {/* ========================================== */}
        {/* MISSING PET REPORTS */}
        {/* ========================================== */}

        <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                01
              </div>

              <div>
                <h2 className="text-xl font-bold text-black sm:text-2xl">
                  My Missing Pet Reports
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                  {missingDogs.length}{" "}
                  {missingDogs.length === 1 ? "report" : "reports"}
                </p>
              </div>
            </div>

            <Link
              href="/report"
              className="font-bold text-black underline underline-offset-4 transition hover:text-gray-600 sm:mt-1"
            >
              + New Missing Report
            </Link>
          </div>

          {missingDogs.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-10 text-center">
              <div className="text-5xl">🐕</div>

              <h3 className="mt-4 text-xl font-bold text-black">
                No missing pet reports
              </h3>

              <p className="mt-2 text-gray-600">
                You don&apos;t have any active missing pet reports.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {missingDogs.map((dog) => (
                <DogCard key={dog.id} dog={dog} />
              ))}
            </div>
          )}
        </section>

        {/* ========================================== */}
        {/* REUNITED PET REPORTS */}
        {/* ========================================== */}

        <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
              02
            </div>

            <div>
              <h2 className="text-xl font-bold text-black sm:text-2xl">
                Reunited Pets
              </h2>

              <p className="mt-1 text-sm text-gray-600">
                {reunitedDogs.length}{" "}
                {reunitedDogs.length === 1 ? "report" : "reports"}
              </p>
            </div>
          </div>

          {reunitedDogs.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-10 text-center">
              <div className="text-5xl">🎉</div>

              <h3 className="mt-4 text-xl font-bold text-black">
                No reunited pets yet
              </h3>

              <p className="mt-2 text-gray-600">
                Pets you mark as reunited will appear here.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {reunitedDogs.map((dog) => (
                <DogCard
                  key={dog.id}
                  dog={dog}
                  found
                />
              ))}
            </div>
          )}
        </section>

        {/* ========================================== */}
        {/* CLOSED REPORTS */}
        {/* ========================================== */}

        <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
              03
            </div>

            <div>
              <h2 className="text-xl font-bold text-black sm:text-2xl">
                My Closed Reports
              </h2>

              <p className="mt-1 text-sm text-gray-600">
                {closedDogs.length}{" "}
                {closedDogs.length === 1 ? "report" : "reports"}
              </p>
            </div>
          </div>

          {closedDogs.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-10 text-center">
              <div className="text-5xl">📁</div>

              <h3 className="mt-4 text-xl font-bold text-black">
                No closed reports
              </h3>

              <p className="mt-2 text-gray-600">
                Reports you close will appear here.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {closedDogs.map((dog) => (
                <DogCard key={dog.id} dog={dog} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}