import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

import CopyReportLink from "@/components/CopyReportLink";
import MessagePetOwner from "@/components/MessagePetOwner";

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

type ProfileLocation = {
  city: string | null;
  zip_code: string | null;
};

function formatDateTime(date: string | null) {
  if (!date) return "Date unavailable";

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
  if (!value) return "Not provided";

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

  /*
   * GET CURRENT USER
   */

  const {
    data: { user },
  } = await supabase.auth.getUser();

  /*
   * GET REAL DOG REPORT
   */

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
    console.error("VIEW REPORT - Supabase error:", dogError);
  }

  if (!dogData) {
    console.error("VIEW REPORT - No dog found for ID:", id);
    notFound();
  }

  const dog = dogData as Dog;
  const isLoggedIn = Boolean(user);
  const isOwner = user?.id === dog.owner_id;

  /*
   * GET EXISTING MESSAGE REQUEST
   */

  type ExistingConversation = {
    id: string;
    status: "pending" | "accepted" | "declined";
  };

  let existingConversation: ExistingConversation | null = null;

  if (user && !isOwner) {
    const {
      data: existingConversationData,
      error: existingConversationError,
    } = await supabase
      .from("conversations")
      .select("id, status")
      .eq("dog_id", dog.id)
      .eq("requester_id", user.id)
      .maybeSingle();

    if (existingConversationError) {
      console.error(
        "VIEW REPORT - Error loading existing message request:",
        existingConversationError,
      );
    } else if (existingConversationData) {
      existingConversation = {
        id: existingConversationData.id,
        status:
          existingConversationData.status as ExistingConversation["status"],
      };
    }
  }

  /*
   * GET REPORT OWNER'S CITY + ZIP CODE
   */

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("city, zip_code")
    .eq("id", dog.owner_id)
    .maybeSingle();

  if (profileError) {
    console.error(
      "VIEW REPORT - Error loading profile location:",
      profileError,
    );
  }

  const profileLocation = (profileData as ProfileLocation | null) ?? null;

  /*
   * GET DOG PHOTOS
   */

  const { data: photosData, error: photosError } = await supabase
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
    photos.find((photo) => photo.is_primary) ?? photos[0] ?? null;

  /*
   * CONVERT STORAGE PATH TO PUBLIC IMAGE URL
   */

  let photoUrl: string | null = null;

  if (primaryPhoto?.storage_path) {
    const { data: publicUrlData } = supabase.storage
      .from("dog-photos")
      .getPublicUrl(primaryPhoto.storage_path);

    photoUrl = publicUrlData.publicUrl;
  }

  return (
    <main className="min-h-screen bg-gradient-to-r from-white via-[#e4e4e4] to-[#b5b5b5] px-4 py-10 text-black sm:px-6 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm font-semibold text-gray-600 transition hover:text-black"
        >
          ← Back to My Reports
        </Link>

        <div className="mt-6 max-w-3xl">
          <span className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">
            Missing Pet Report
          </span>

          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">
            {dog.dog_name}
          </h1>

          <p className="mt-3 text-lg text-gray-600">
            Help bring this pet home.
          </p>
        </div>

        {/* MAIN REPORT */}

        <section className="mt-8 overflow-hidden rounded-3xl bg-white shadow-sm">
          {/* PHOTO */}

          <div className="flex h-64 items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 sm:h-96">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={dog.dog_name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-8xl">🐕</span>
            )}
          </div>

          <div className="p-5 sm:p-8">
            {/* NAME + STATUS */}

            <div className="flex flex-col gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-3xl font-bold">{dog.dog_name}</h2>

                <p className="mt-1 text-lg text-gray-600">
                  {dog.breed || "Unknown breed"}
                </p>
              </div>

              <span
                className={`w-fit rounded-full px-4 py-2 text-sm font-bold ${
                  dog.status.toLowerCase() === "missing"
                    ? "bg-[#fbb12c] text-black"
                    : "bg-gray-200 text-black"
                }`}
              >
                {formatStatus(dog.status)}
              </span>
            </div>

            {/* PET INFORMATION */}

            <section className="mt-8">
              <h3 className="text-2xl font-bold">Pet Information</h3>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Primary Color
                  </p>
                  <p className="mt-1 text-gray-700">
                    {formatValue(dog.primary_color)}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Secondary Color
                  </p>
                  <p className="mt-1 text-gray-700">
                    {formatValue(dog.secondary_color)}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Sex
                  </p>
                  <p className="mt-1 text-gray-700">
                    {formatValue(dog.sex)}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Size
                  </p>
                  <p className="mt-1 text-gray-700">
                    {formatValue(dog.size)}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Estimated Birth Year
                  </p>
                  <p className="mt-1 text-gray-700">
                    {dog.estimated_birth_year ?? "Unknown"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Microchipped
                  </p>
                  <p className="mt-1 text-gray-700">
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
                  <p className="text-sm font-semibold text-gray-500">
                    Description
                  </p>
                  <p className="mt-2 leading-relaxed text-gray-700">
                    {dog.description}
                  </p>
                </div>
              )}
            </section>

            {/* LAST SEEN */}

            <section className="mt-8 rounded-3xl border border-gray-200 bg-gray-50 p-5 sm:p-6">
              <h3 className="text-xl font-bold">Last Seen Information</h3>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Date & Time
                  </p>

                  <p className="mt-1 text-gray-700">
                    📅 {formatDateTime(dog.last_seen_at)}
                  </p>

                  {dog.time_is_approximate && (
                    <p className="mt-1 text-sm text-gray-600">
                      Time is approximate
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Location
                  </p>

                  <p className="mt-1 text-gray-700">
                    📍 {dog.location_description || "Location unavailable"}
                  </p>

                  {(profileLocation?.city || profileLocation?.zip_code) && (
                    <p className="mt-1 text-sm text-gray-600">
                      {profileLocation?.city || "City unavailable"}
                      {profileLocation?.zip_code
                        ? ` · ${profileLocation.zip_code}`
                        : ""}
                    </p>
                  )}
                </div>

                {(dog.latitude !== null || dog.longitude !== null) && (
                  <div className="sm:col-span-2">
                    <p className="text-sm font-semibold text-gray-500">
                      Coordinates
                    </p>

                    <p className="mt-1 text-gray-700">
                      {dog.latitude ?? "—"}, {dog.longitude ?? "—"}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* CIRCUMSTANCES */}

            {dog.circumstances && (
              <section className="mt-6 rounded-3xl border border-gray-200 bg-white p-5 sm:p-6">
                <h3 className="text-xl font-bold">What Happened?</h3>

                <p className="mt-3 leading-relaxed text-gray-700">
                  {dog.circumstances}
                </p>
              </section>
            )}

            {/* REWARD */}

            {dog.reward_offered && (
              <section className="mt-6 rounded-3xl border border-gray-200 bg-gray-50 p-5 sm:p-6">
                <h3 className="text-xl font-bold">Reward</h3>

                <p className="mt-3 text-gray-700">
                  🎁 Reward offered
                  {dog.reward_amount !== null
                    ? ` — $${dog.reward_amount.toLocaleString()}`
                    : ""}
                </p>
              </section>
            )}

            {/* CONTACT / MESSAGING */}

            {!isLoggedIn && (
              <section className="mt-6 rounded-3xl border border-gray-200 bg-gray-50 p-5 sm:p-6">
                <h3 className="text-xl font-bold">
                  Have information about {dog.dog_name}?
                </h3>

                <p className="mt-2 leading-relaxed text-gray-600">
                  Sign in or create an account to send the owner a protected
                  message request. Guest visitors can view reports, but cannot
                  contact owners or change PawSearch data.
                </p>

                <Link
                  href={`/login?next=/dogs/${dog.id}`}
                  className="mt-4 inline-block rounded-md bg-[#fbb12c] px-5 py-2.5 font-bold text-black"
                >
                  Sign In to Message Owner
                </Link>
              </section>
            )}

            {isLoggedIn && !isOwner && (
              <MessagePetOwner
                dogId={dog.id}
                dogName={dog.dog_name}
                existingConversationId={existingConversation?.id ?? null}
                existingStatus={existingConversation?.status ?? null}
              />
            )}

            {isLoggedIn && isOwner && (
              <section className="mt-6 rounded-3xl border border-gray-200 bg-gray-50 p-5 sm:p-6">
                <h3 className="text-xl font-bold">This is your report</h3>

                <p className="mt-2 leading-relaxed text-gray-600">
                  You are viewing your own missing pet report. Messages from
                  other PawSearch users will appear in your messages area once
                  messaging is connected to the database.
                </p>
              </section>
            )}

            {/* SHARE */}

            <section className="mt-6 rounded-3xl border border-gray-200 bg-white p-5 sm:p-6">
              <h3 className="text-xl font-bold">Share This Report</h3>

              <p className="mt-2 leading-relaxed text-gray-700">
                Help spread the word by sharing this report with people in
                your community.
              </p>

              <CopyReportLink />
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}