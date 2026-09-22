"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

type ProfileInformationProps = {
  initialName: string;
  email: string;
  initialCity: string;
  initialZip: string;
};

export default function ProfileInformation({
  initialName,
  email,
  initialCity,
  initialZip,
}: ProfileInformationProps) {
  const router = useRouter();

  const [name, setName] = useState(initialName);
  const [city, setCity] = useState(initialCity);
  const [zip, setZip] = useState(initialZip);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError("");

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError(
        "You must be signed in to update your information.",
      );
      setSaving(false);
      return;
    }

    const { error: authError } =
      await supabase.auth.updateUser({
        data: {
          name: name.trim() || "User",
        },
      });

    if (authError) {
      console.error(
        "Error updating account name:",
        authError,
      );

      setError(authError.message);
      setSaving(false);
      return;
    }

    const { error: profileError } =
      await supabase
        .from("profiles")
        .update({
          city: city.trim() || null,
          zip_code: zip.trim() || null,
        })
        .eq("id", user.id);

    if (profileError) {
      console.error(
        "Error updating location:",
        profileError,
      );

      setError(profileError.message);
      setSaving(false);
      return;
    }

    setSaving(false);
    setSaved(true);
    setEditing(false);

    router.refresh();
  }

  function handleCancel() {
    setName(initialName);
    setCity(initialCity);
    setZip(initialZip);
    setEditing(false);
    setSaved(false);
    setError("");
  }

  return (
    <>
      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">
            Account
          </span>

          <h2 className="mt-2 text-2xl font-bold">
            My Information
          </h2>

          <p className="mt-1 text-gray-600">
            Your basic account information.
          </p>
        </div>

        {!editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded-md border border-gray-300 px-5 py-2.5 font-bold transition hover:border-black hover:bg-gray-50"
          >
            Edit Information
          </button>
        )}
      </div>

      {/* INFORMATION */}

      <div className="mt-6 space-y-4">
        {/* NAME */}

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm font-semibold text-gray-500">
            Name
          </p>

          {editing ? (
            <input
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setSaved(false);
              }}
              className="mt-2 w-full rounded-md border border-gray-300 bg-white px-4 py-3 font-semibold text-black outline-none focus:border-black"
            />
          ) : (
            <p className="mt-1 font-semibold text-black">
              {name}
            </p>
          )}
        </div>

        {/* EMAIL */}

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm font-semibold text-gray-500">
            Email
          </p>

          <p className="mt-1 font-semibold text-black">
            {email}
          </p>
        </div>

        {/* SAVED LOCATION */}

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm font-semibold text-gray-500">
            Saved Location
          </p>

          {editing ? (
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <input
                type="text"
                value={city}
                onChange={(event) => {
                  setCity(event.target.value);
                  setSaved(false);
                }}
                placeholder="City"
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 font-semibold text-black outline-none placeholder:text-gray-400 focus:border-black"
              />

              <input
                type="text"
                value={zip}
                onChange={(event) => {
                  setZip(event.target.value);
                  setSaved(false);
                }}
                placeholder="ZIP Code"
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 font-semibold text-black outline-none placeholder:text-gray-400 focus:border-black"
              />
            </div>
          ) : (
            <p className="mt-1 font-semibold text-black">
              {city || zip
                ? `${city}${city && zip ? ", " : ""}${zip}`
                : "No saved location"}
            </p>
          )}
        </div>
      </div>

      {/* ACTIONS */}

      {editing && (
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-md bg-[#fbb12c] px-6 py-3 font-bold text-black transition hover:bg-[#ffc34d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
            className="rounded-md border border-gray-300 px-6 py-3 font-bold text-black transition hover:border-black hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      )}

      {/* SUCCESS */}

      {saved && (
        <p
          role="status"
          className="mt-4 font-semibold text-gray-700"
        >
          ✓ Information updated
        </p>
      )}

      {/* ERROR */}

      {error && (
        <p
          role="alert"
          className="mt-4 font-semibold text-red-600"
        >
          {error}
        </p>
      )}
    </>
  );
}