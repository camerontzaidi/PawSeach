"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

type AccountInformationProps = {
  initialName: string;
  email: string;
  initialCity: string;
  initialZip: string;
};

export default function AccountInformation({
  initialName,
  email,
  initialCity,
  initialZip,
}: AccountInformationProps) {
  const [name, setName] = useState(initialName);
  const [city, setCity] = useState(initialCity);
  const [zip, setZip] = useState(initialZip);

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
      setError("You must be signed in to update your information.");
      setSaving(false);
      return;
    }

    /*
     * Update the user's name in Supabase Auth metadata.
     */
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        name: name.trim(),
      },
    });

    if (authError) {
      console.error("Error updating name:", authError);
      setError(authError.message);
      setSaving(false);
      return;
    }

    /*
     * Update the same profile location used by /me.
     */
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        city: city.trim() || null,
        zip_code: zip.trim() || null,
      })
      .eq("id", user.id);

    if (profileError) {
      console.error("Error updating location:", profileError);
      setError(profileError.message);
      setSaving(false);
      return;
    }

    setSaved(true);
    setSaving(false);

    /*
     * Refresh the page so the top profile section
     * immediately displays the newly saved name.
     */
    window.location.reload();
  }

  return (
    <section className="rounded-2xl border border-[#1b5b51] bg-[#06483f] p-6 sm:p-8">
      <span className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">
        Account
      </span>

      <h2 className="mt-2 text-2xl font-bold">
        My Information
      </h2>

      <p className="mt-1 text-[#b7d5ce]">
        Manage your basic account information and saved location.
      </p>

      <div className="mt-6 space-y-5">
        {/* NAME */}
        <div>
          <label
            htmlFor="account-name"
            className="block text-sm font-semibold text-[#c3ded8]"
          >
            Name
          </label>

          <input
            id="account-name"
            type="text"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setSaved(false);
            }}
            className="mt-2 w-full rounded-md border border-[#9bd8c9] bg-[#003d35] p-3 text-white outline-none focus:border-[#fbb12c]"
          />
        </div>

        {/* EMAIL */}
        <div>
          <label className="block text-sm font-semibold text-[#c3ded8]">
            Email
          </label>

          <div className="mt-2 rounded-md border border-[#1b5b51] bg-[#003d35] p-3 text-[#b7d5ce]">
            {email}
          </div>

          <p className="mt-2 text-xs text-[#9bbab3]">
            Email changes can be managed through your account
            authentication settings.
          </p>
        </div>

        {/* CITY */}
        <div>
          <label
            htmlFor="account-city"
            className="block text-sm font-semibold text-[#c3ded8]"
          >
            Saved City
          </label>

          <input
            id="account-city"
            type="text"
            value={city}
            onChange={(event) => {
              setCity(event.target.value);
              setSaved(false);
            }}
            placeholder="Sacramento"
            className="mt-2 w-full rounded-md border border-[#9bd8c9] bg-[#003d35] p-3 text-white outline-none placeholder:text-[#9bbab3] focus:border-[#fbb12c]"
          />
        </div>

        {/* ZIP */}
        <div>
          <label
            htmlFor="account-zip"
            className="block text-sm font-semibold text-[#c3ded8]"
          >
            ZIP Code
          </label>

          <input
            id="account-zip"
            type="text"
            value={zip}
            onChange={(event) => {
              setZip(event.target.value);
              setSaved(false);
            }}
            placeholder="95814"
            className="mt-2 w-full rounded-md border border-[#9bd8c9] bg-[#003d35] p-3 text-white outline-none placeholder:text-[#9bbab3] focus:border-[#fbb12c]"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="mt-6 rounded-md bg-[#fbb12c] px-7 py-3 font-bold text-[#003d35] transition hover:bg-[#ffc34d] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>

      {saved && (
        <p
          role="status"
          className="mt-4 font-semibold text-[#fbb12c]"
        >
          ✓ Your information has been saved.
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