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
      console.error(
        "Error loading dog photos:",
        photosError,
      );
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
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase(),
      );
  }

  // --------------------------------------------------
  // FORMAT DATE
  // --------------------------------------------------

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
      <article
        className="overflow-hidden rounded-2xl border border-[#1b5b51] bg-[#06483f]"
      >
        {/* PHOTO */}

        <div className="flex h-48 items-center justify-center bg-[#00342e]">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt={dog.dog_name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-7xl">
              🐕
            </span>
          )}
        </div>

        <div className="p-6">

          {/* NAME + STATUS */}

          <div className="flex items-start justify-between gap-4">

            <div>
              <h3 className="text-2xl font-bold">
                {dog.dog_name}
              </h3>

              <p className="mt-1 text-[#b7d5ce]">
                {dog.breed || "Unknown breed"}
              </p>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                found
                  ? "bg-[#078c78] text-white"
                  : "bg-[#fbb12c] text-[#003d35]"
              }`}
            >
              {found
                ? "Found"
                : formatStatus(dog.status)}
            </span>

          </div>

          {/* LOCATION / DATE */}

          <div className="mt-5 space-y-2 text-sm text-[#c3ded8]">

            {dog.location_description && (
              <p>
                📍 {dog.location_description}
              </p>
            )}

            {dog.last_seen_at && (
              <p>
                📅 {formatDate(dog.last_seen_at)}
              </p>
            )}

          </div>

          {/* ACTIONS */}

          <div className="mt-6 flex flex-wrap gap-3">

            <Link
              href={`/dogs/${dog.id}`}
              className="rounded-md border border-[#1b5b51] px-4 py-2 font-semibold transition hover:border-[#fbb12c] hover:text-[#fbb12c]"
            >
              View / Change Status
            </Link>

            <Link
              href={`/dogs/${dog.id}/edit`}
              className="rounded-md bg-[#078c78] px-4 py-2 font-bold text-white transition hover:bg-[#067966]"
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
    <main className="min-h-screen bg-[#003d35] px-4 py-10 text-white sm:px-6 sm:py-16">

      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <div>
          <span className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">
            My Reports
          </span>

          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">
            Manage Your Reports
          </h1>

          <p className="mt-3 text-lg text-[#b7d5ce]">
            View and manage your missing pet reports.
          </p>
        </div>

        {/* ========================================== */}
        {/* MISSING PET REPORTS */}
        {/* ========================================== */}

        <section className="mt-12">

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-3xl font-bold">
                My Missing Pet Reports
              </h2>

              <p className="mt-1 text-[#b7d5ce]">
                {missingDogs.length}{" "}
                {missingDogs.length === 1
                  ? "report"
                  : "reports"}
              </p>
            </div>

            <Link
              href="/report"
              className="font-bold text-[#fbb12c] hover:text-[#ffc34d]"
            >
              + New Missing Report
            </Link>

          </div>

          {missingDogs.length === 0 ? (

            <div className="mt-6 rounded-2xl border border-[#1b5b51] bg-[#06483f] p-10 text-center">

              <div className="text-5xl">
                🐕
              </div>

              <h3 className="mt-4 text-xl font-bold">
                No missing pet reports
              </h3>

              <p className="mt-2 text-[#b7d5ce]">
                You don't have any active missing pet
                reports.
              </p>

            </div>

          ) : (

            <div className="mt-6 grid gap-6 md:grid-cols-2">

              {missingDogs.map((dog) => (
                <DogCard
                  key={dog.id}
                  dog={dog}
                />
              ))}

            </div>

          )}

        </section>

        {/* ========================================== */}
        {/* FOUND / REUNITED PET REPORTS */}
        {/* ========================================== */}

        <section className="mt-12">

          <div>
            <h2 className="text-3xl font-bold">
              My Found Animal Reports
            </h2>

            <p className="mt-1 text-[#b7d5ce]">
              {reunitedDogs.length}{" "}
              {reunitedDogs.length === 1
                ? "report"
                : "reports"}
            </p>
          </div>

          {reunitedDogs.length === 0 ? (

            <div className="mt-6 rounded-2xl border border-[#1b5b51] bg-[#06483f] p-10 text-center">

              <div className="text-5xl">
                🎉
              </div>

              <h3 className="mt-4 text-xl font-bold">
                No found animal reports
              </h3>

              <p className="mt-2 text-[#b7d5ce]">
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

        <section className="mt-12">

          <div>
            <h2 className="text-3xl font-bold">
              My Closed Reports
            </h2>

            <p className="mt-1 text-[#b7d5ce]">
              {closedDogs.length}{" "}
              {closedDogs.length === 1
                ? "report"
                : "reports"}
            </p>
          </div>

          {closedDogs.length === 0 ? (

            <div className="mt-6 rounded-2xl border border-[#1b5b51] bg-[#06483f] p-10 text-center">

              <div className="text-5xl">
                📁
              </div>

              <h3 className="mt-4 text-xl font-bold">
                No closed reports
              </h3>

              <p className="mt-2 text-[#b7d5ce]">
                Reports you close will appear here.
              </p>

            </div>

          ) : (

            <div className="mt-6 grid gap-6 md:grid-cols-2">

              {closedDogs.map((dog) => (
                <DogCard
                  key={dog.id}
                  dog={dog}
                />
              ))}

            </div>

          )}

        </section>

      </div>
    </main>
  );
}

