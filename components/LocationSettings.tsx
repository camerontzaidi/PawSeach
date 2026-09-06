"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  createClient,
} from "@/utils/supabase/client";

type LocationSettingsProps = {
  initialCity: string;
  initialZip: string;
};

export default function LocationSettings({
  initialCity,
  initialZip,
}: LocationSettingsProps) {
  const router = useRouter();

  const [city, setCity] =
    useState(initialCity);

  const [zip, setZip] =
    useState(initialZip);

  const [saving, setSaving] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSaveLocation() {
    setSaving(true);
    setSaved(false);
    setError("");

    const supabase =
      createClient();

    const {
      data: {
        user,
      },
    } = await supabase.auth.getUser();

    if (!user) {
      setError(
        "You must be signed in to save your location.",
      );

      setSaving(false);
      return;
    }

    const {
      error: updateError,
    } = await supabase
      .from("profiles")
      .update({
        city:
          city.trim() ||
          null,

        zip_code:
          zip.trim() ||
          null,
      })
      .eq(
        "id",
        user.id,
      );

    if (updateError) {
      console.error(
        "Error saving location:",
        updateError,
      );

      setError(
        updateError.message,
      );

      setSaving(false);
      return;
    }

    setSaving(false);
    setSaved(true);

    // Refresh server-rendered pages/data.
    router.refresh();
  }

  return (
    <section className="mt-8 rounded-2xl border border-[#1b5b51] bg-[#06483f] p-6 sm:p-8">

      <div>

        <span className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">
          Location
        </span>

        <h2 className="mt-2 text-2xl font-bold">
          Your Location
        </h2>

        <p className="mt-2 text-[#b7d5ce]">
          Save your city and ZIP code to find missing pets
          near you.
        </p>

      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">

        {/* CITY */}

        <div>

          <label
            htmlFor="city"
            className="block font-semibold"
          >
            City
          </label>

          <input
            id="city"
            type="text"
            value={city}
            onChange={(event) => {
              setCity(
                event.target.value,
              );

              setSaved(false);
            }}
            placeholder="Sacramento"
            className="mt-2 w-full rounded-md border border-[#1b5b51] bg-[#003d35] px-4 py-3 text-white outline-none placeholder:text-[#9bbab3] focus:border-[#fbb12c]"
          />

        </div>

        {/* ZIP */}

        <div>

          <label
            htmlFor="zip"
            className="block font-semibold"
          >
            ZIP Code
          </label>

          <input
            id="zip"
            type="text"
            value={zip}
            onChange={(event) => {
              setZip(
                event.target.value,
              );

              setSaved(false);
            }}
            placeholder="95814"
            className="mt-2 w-full rounded-md border border-[#1b5b51] bg-[#003d35] px-4 py-3 text-white outline-none placeholder:text-[#9bbab3] focus:border-[#fbb12c]"
          />

        </div>

      </div>

      <button
        type="button"
        onClick={handleSaveLocation}
        disabled={saving}
        className="mt-6 rounded-md bg-[#fbb12c] px-8 py-3 font-bold text-[#003d35] transition hover:bg-[#ffc34d] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving
          ? "Saving..."
          : "Save Location"}
      </button>

      {saved && (
        <p
          role="status"
          className="mt-4 font-semibold text-[#fbb12c]"
        >
          ✓ Location saved
        </p>
      )}

      {error && (
        <p
          role="alert"
          className="mt-4 font-semibold text-red-300"
        >
          {error}
        </p>
      )}

    </section>
  );
}