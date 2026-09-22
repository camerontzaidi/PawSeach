"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

type LocationSettingsProps = {
  initialCity: string;
  initialZip: string;
};

export default function LocationSettings({
  initialCity,
  initialZip,
}: LocationSettingsProps) {
  const router = useRouter();

  const [city, setCity] = useState(initialCity);
  const [zip, setZip] = useState(initialZip);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSaveLocation() {
    setSaving(true);
    setSaved(false);
    setError("");

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError(
        "You must be signed in to save your location.",
      );

      setSaving(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        city: city.trim() || null,
        zip_code: zip.trim() || null,
      })
      .eq("id", user.id);

    if (updateError) {
      console.error(
        "Error saving location:",
        updateError,
      );

      setError(updateError.message);
      setSaving(false);
      return;
    }

    setSaving(false);
    setSaved(true);

    // Refresh server-rendered pages/data.
    router.refresh();
  }

  return (
    <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          Location
        </p>

        <h2 className="mt-2 text-2xl font-bold text-black">
          Your Location
        </h2>

        <p className="mt-2 text-gray-600">
          Save your city and ZIP code to find missing pets
          near you.
        </p>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {/* CITY */}

        <div>
          <label
            htmlFor="city"
            className="block text-sm font-semibold text-black"
          >
            City
          </label>

          <input
            id="city"
            type="text"
            value={city}
            onChange={(event) => {
              setCity(event.target.value);
              setSaved(false);
            }}
            placeholder="Sacramento"
            className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black outline-none placeholder:text-gray-400 focus:border-[#fbb12c] focus:ring-1 focus:ring-[#fbb12c]"
          />
        </div>

        {/* ZIP */}

        <div>
          <label
            htmlFor="zip"
            className="block text-sm font-semibold text-black"
          >
            ZIP Code
          </label>

          <input
            id="zip"
            type="text"
            value={zip}
            onChange={(event) => {
              setZip(event.target.value);
              setSaved(false);
            }}
            placeholder="95814"
            className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black outline-none placeholder:text-gray-400 focus:border-[#fbb12c] focus:ring-1 focus:ring-[#fbb12c]"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleSaveLocation}
        disabled={saving}
        className="mt-6 rounded-xl bg-black px-8 py-3 font-bold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save Location"}
      </button>

      {saved && (
        <p
          role="status"
          className="mt-4 font-semibold text-black"
        >
          ✓ Location saved
        </p>
      )}

      {error && (
        <p
          role="alert"
          className="mt-4 font-semibold text-red-600"
        >
          {error}
        </p>
      )}
    </section>
  );
}