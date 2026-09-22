"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LocationPicker from "@/components/LocationPicker";
import { createClient } from "@/utils/supabase/client";

const inputStyle =
  "w-full rounded-md border border-gray-300 bg-white p-3 text-black placeholder:text-gray-400 outline-none focus:border-black";

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
  last_seen_at: string | null;
  location_description: string | null;
  latitude: number | null;
  longitude: number | null;
  time_is_approximate: boolean | null;
  description: string | null;
  circumstances: string | null;
  reward_offered: boolean | null;
  reward_amount: number | null;
};

export default function EditDogReportPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [formData, setFormData] = useState({
    dogName: "",
    breed: "",
    primaryColor: "",
    secondaryColor: "",
    sex: "unknown",
    size: "unknown",
    estimatedBirthYear: "",
    microchipped: false,
    lastSeenAt: "",
    locationDescription: "",
    latitude: "",
    longitude: "",
    timeIsApproximate: false,
    description: "",
    circumstances: "",
    rewardOffered: false,
    rewardAmount: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadDog() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error: fetchError } = await supabase
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
          last_seen_at,
          location_description,
          latitude,
          longitude,
          time_is_approximate,
          description,
          circumstances,
          reward_offered,
          reward_amount
        `)
        .eq("id", params.id)
        .eq("owner_id", user.id)
        .single();

      if (fetchError || !data) {
        console.error("Error loading dog:", fetchError);
        setError("Unable to load this report.");
        setLoading(false);
        return;
      }

      const dog = data as Dog;

      setFormData({
        dogName: dog.dog_name ?? "",
        breed: dog.breed ?? "",
        primaryColor: dog.primary_color ?? "",
        secondaryColor: dog.secondary_color ?? "",
        sex: dog.sex ?? "unknown",
        size: dog.size ?? "unknown",
        estimatedBirthYear:
          dog.estimated_birth_year?.toString() ?? "",
        microchipped: dog.microchipped ?? false,
        lastSeenAt: dog.last_seen_at
          ? new Date(dog.last_seen_at)
              .toISOString()
              .slice(0, 16)
          : "",
        locationDescription:
          dog.location_description ?? "",
        latitude: dog.latitude?.toString() ?? "",
        longitude: dog.longitude?.toString() ?? "",
        timeIsApproximate:
          dog.time_is_approximate ?? false,
        description: dog.description ?? "",
        circumstances: dog.circumstances ?? "",
        rewardOffered:
          dog.reward_offered ?? false,
        rewardAmount:
          dog.reward_amount?.toString() ?? "",
      });

      setLoading(false);
    }

    loadDog();
  }, [params.id, router]);

  function updateField(
    field: keyof typeof formData,
    value: string | boolean,
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    setSaved(false);
    setError("");
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setSaving(true);
    setSaved(false);
    setError("");

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { error: updateError } = await supabase
      .from("dogs")
      .update({
        dog_name: formData.dogName,
        breed: formData.breed || null,
        primary_color:
          formData.primaryColor || null,
        secondary_color:
          formData.secondaryColor || null,
        sex: formData.sex,
        size: formData.size,
        estimated_birth_year:
          formData.estimatedBirthYear
            ? Number(formData.estimatedBirthYear)
            : null,
        microchipped: formData.microchipped,
        last_seen_at:
          formData.lastSeenAt
            ? new Date(formData.lastSeenAt).toISOString()
            : null,
        location_description:
          formData.locationDescription || null,
        latitude:
          formData.latitude
            ? Number(formData.latitude)
            : null,
        longitude:
          formData.longitude
            ? Number(formData.longitude)
            : null,
        time_is_approximate:
          formData.timeIsApproximate,
        description:
          formData.description || null,
        circumstances:
          formData.circumstances || null,
        reward_offered:
          formData.rewardOffered,
        reward_amount:
          formData.rewardOffered &&
          formData.rewardAmount
            ? Number(formData.rewardAmount)
            : null,
      })
      .eq("id", params.id)
      .eq("owner_id", user.id);

    if (updateError) {
      console.error(
        "Error updating dog:",
        updateError,
      );

      setError(
        "Unable to save your changes. Please try again.",
      );

      setSaving(false);
      return;
    }

    setSaved(true);
    setSaving(false);

    setTimeout(() => {
      router.push(`/dogs/${params.id}`);
      router.refresh();
    }, 700);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-r from-white via-[#e4e4e4] to-[#b5b5b5] px-4 py-10 text-black sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
            <p className="text-lg font-semibold">
              Loading report...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error && !formData.dogName) {
    return (
      <main className="min-h-screen bg-gradient-to-r from-white via-[#e4e4e4] to-[#b5b5b5] px-4 py-10 text-black sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-gray-600 transition hover:text-black"
          >
            ← Back to My Reports
          </Link>

          <div className="mt-8 rounded-3xl border border-red-200 bg-white p-6 shadow-sm">
            <p className="font-bold text-red-600">
              {error}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-r from-white via-[#e4e4e4] to-[#b5b5b5] px-4 py-10 text-black sm:px-6 sm:py-16">
      <div className="mx-auto max-w-4xl">

        <Link
          href={`/dogs/${params.id}`}
          className="inline-flex items-center text-sm font-semibold text-gray-600 transition hover:text-black"
        >
          ← Back to Report
        </Link>

        <div className="mt-6">
          <span className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">
            Edit Report
          </span>

          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Edit Missing Pet Report
          </h1>

          <p className="mt-3 max-w-2xl text-lg leading-7 text-gray-600">
            Update the information for this missing pet report.
          </p>
        </div>

        {saved && (
          <div
            role="status"
            className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <p className="font-bold text-gray-700">
              ✓ Changes saved successfully. Returning to the report...
            </p>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-2xl border border-red-200 bg-white p-4 shadow-sm"
          >
            <p className="font-bold text-red-600">
              {error}
            </p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-8"
        >

          {/* PET INFORMATION */}

          <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-7 flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                01
              </div>

              <div>
                <h2 className="text-2xl font-bold">
                  Pet Information
                </h2>

                <p className="mt-1 text-gray-600">
                  Update your pet's identifying information.
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label
                  htmlFor="dogName"
                  className="mb-2 block font-semibold"
                >
                  Pet Name *
                </label>

                <input
                  id="dogName"
                  value={formData.dogName}
                  onChange={(event) =>
                    updateField(
                      "dogName",
                      event.target.value,
                    )
                  }
                  required
                  className={inputStyle}
                />
              </div>

              <div>
                <label
                  htmlFor="breed"
                  className="mb-2 block font-semibold"
                >
                  Breed
                </label>

                <input
                  id="breed"
                  value={formData.breed}
                  onChange={(event) =>
                    updateField(
                      "breed",
                      event.target.value,
                    )
                  }
                  className={inputStyle}
                />
              </div>

              <div>
                <label
                  htmlFor="primaryColor"
                  className="mb-2 block font-semibold"
                >
                  Primary Color *
                </label>

                <input
                  id="primaryColor"
                  value={formData.primaryColor}
                  onChange={(event) =>
                    updateField(
                      "primaryColor",
                      event.target.value,
                    )
                  }
                  required
                  className={inputStyle}
                />
              </div>

              <div>
                <label
                  htmlFor="secondaryColor"
                  className="mb-2 block font-semibold"
                >
                  Secondary Color
                </label>

                <input
                  id="secondaryColor"
                  value={formData.secondaryColor}
                  onChange={(event) =>
                    updateField(
                      "secondaryColor",
                      event.target.value,
                    )
                  }
                  className={inputStyle}
                />
              </div>

              <div>
                <label
                  htmlFor="sex"
                  className="mb-2 block font-semibold"
                >
                  Sex
                </label>

                <select
                  id="sex"
                  value={formData.sex}
                  onChange={(event) =>
                    updateField(
                      "sex",
                      event.target.value,
                    )
                  }
                  className={inputStyle}
                >
                  <option value="unknown">
                    Unknown
                  </option>

                  <option value="male">
                    Male
                  </option>

                  <option value="female">
                    Female
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="size"
                  className="mb-2 block font-semibold"
                >
                  Size
                </label>

                <select
                  id="size"
                  value={formData.size}
                  onChange={(event) =>
                    updateField(
                      "size",
                      event.target.value,
                    )
                  }
                  className={inputStyle}
                >
                  <option value="unknown">
                    Unknown
                  </option>

                  <option value="small">
                    Small
                  </option>

                  <option value="medium">
                    Medium
                  </option>

                  <option value="large">
                    Large
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="estimatedBirthYear"
                  className="mb-2 block font-semibold"
                >
                  Estimated Birth Year
                </label>

                <input
                  id="estimatedBirthYear"
                  type="number"
                  value={formData.estimatedBirthYear}
                  onChange={(event) =>
                    updateField(
                      "estimatedBirthYear",
                      event.target.value,
                    )
                  }
                  min="1900"
                  max={new Date().getFullYear()}
                  placeholder="Unknown"
                  className={inputStyle}
                />
              </div>

              <label className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <input
                  type="checkbox"
                  checked={formData.microchipped}
                  onChange={(event) =>
                    updateField(
                      "microchipped",
                      event.target.checked,
                    )
                  }
                  className="h-4 w-4 accent-black"
                />

                <span className="font-semibold">
                  Microchipped
                </span>
              </label>

            </div>

            <textarea
              value={formData.description}
              onChange={(event) =>
                updateField(
                  "description",
                  event.target.value,
                )
              }
              placeholder="Description and distinctive features..."
              className={`${inputStyle} mt-5 h-32 resize-none`}
            />
          </section>

          {/* LAST SEEN */}

          <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-7 flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                02
              </div>

              <div>
                <h2 className="text-2xl font-bold">
                  Last Seen Information
                </h2>

                <p className="mt-1 text-gray-600">
                  Update when and where your pet was last seen.
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label
                  htmlFor="lastSeenAt"
                  className="mb-2 block font-semibold"
                >
                  Last Seen Date & Time *
                </label>

                <input
                  id="lastSeenAt"
                  type="datetime-local"
                  value={formData.lastSeenAt}
                  onChange={(event) =>
                    updateField(
                      "lastSeenAt",
                      event.target.value,
                    )
                  }
                  required
                  className={inputStyle}
                />
              </div>

              <div className="md:col-span-2">
                <LocationPicker />
              </div>

              <div>
                <label
                  htmlFor="latitude"
                  className="mb-2 block font-semibold"
                >
                  Latitude
                </label>

                <input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(event) =>
                    updateField(
                      "latitude",
                      event.target.value,
                    )
                  }
                  className={inputStyle}
                />
              </div>

              <div>
                <label
                  htmlFor="longitude"
                  className="mb-2 block font-semibold"
                >
                  Longitude
                </label>

                <input
                  id="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(event) =>
                    updateField(
                      "longitude",
                      event.target.value,
                    )
                  }
                  className={inputStyle}
                />
              </div>

              <label className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 md:col-span-2">
                <input
                  type="checkbox"
                  checked={formData.timeIsApproximate}
                  onChange={(event) =>
                    updateField(
                      "timeIsApproximate",
                      event.target.checked,
                    )
                  }
                  className="h-4 w-4 accent-black"
                />

                <span className="font-semibold">
                  Last-seen time is approximate
                </span>
              </label>

            </div>

            <textarea
              value={formData.circumstances}
              onChange={(event) =>
                updateField(
                  "circumstances",
                  event.target.value,
                )
              }
              placeholder="What happened?"
              className={`${inputStyle} mt-5 h-28 resize-none`}
            />
          </section>

          {/* REWARD */}

          <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-7 flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                03
              </div>

              <div>
                <h2 className="text-2xl font-bold">
                  Reward
                </h2>

                <p className="mt-1 text-gray-600">
                  Let people know if a reward is being offered.
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <label className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <input
                  type="checkbox"
                  checked={formData.rewardOffered}
                  onChange={(event) =>
                    updateField(
                      "rewardOffered",
                      event.target.checked,
                    )
                  }
                  className="h-4 w-4 accent-black"
                />

                <span className="font-semibold">
                  Reward offered
                </span>
              </label>

              <input
                name="rewardAmount"
                type="number"
                min="0"
                step="0.01"
                value={formData.rewardAmount}
                onChange={(event) =>
                  updateField(
                    "rewardAmount",
                    event.target.value,
                  )
                }
                disabled={!formData.rewardOffered}
                placeholder="Reward amount"
                className={`${inputStyle} disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400`}
              />

            </div>
          </section>

          {/* ACTIONS */}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link
              href={`/dogs/${params.id}`}
              className="rounded-md border border-gray-300 bg-white px-6 py-3 text-center font-semibold text-black transition hover:border-black hover:bg-gray-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-[#fbb12c] px-8 py-3 font-bold text-black transition hover:bg-[#ffc34d] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving Changes..."
                : "Save Changes"}
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}