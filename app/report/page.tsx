"use client";

import { useState, useTransition } from "react";
import {
  submitMissingDogReport,
  type SubmitReportResult,
} from "./actions";
import LocationPicker from "@/components/LocationPicker";

const inputStyle =
  "rounded-md border border-[#9bd8c9] bg-[#003d35] p-3 text-white placeholder:text-[#b7d5ce] focus:border-[#fbb12c] focus:outline-none";

export default function ReportPage() {
  const [result, setResult] =
    useState<SubmitReportResult | null>(null);

  const [isPending, startTransition] =
    useTransition();

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const submissionResult =
        await submitMissingDogReport(formData);

      setResult(submissionResult);

      if (submissionResult.success) {
        form.reset();
      }
    });
  }

  return (
    <main className="min-h-screen bg-[#003d35] px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold">
            Report a Missing Pet 🐾
          </h1>

          <p className="mt-3 text-[#b7d5ce]">
            Help your community bring a missing pet home.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {result && (
            <div
              role="status"
              className={`rounded-lg border p-4 ${
                result.success
                  ? "border-emerald-400 bg-emerald-900/30"
                  : "border-red-400 bg-red-900/30"
              }`}
            >
              <p className="font-bold">
                {result.message}
              </p>

              {result.fieldErrors && (
                <ul className="mt-2 list-disc pl-5">
                  {Object.entries(
                    result.fieldErrors,
                  ).flatMap(
                    ([field, messages]) =>
                      messages.map((message) => (
                        <li
                          key={`${field}-${message}`}
                        >
                          {message}
                        </li>
                      )),
                  )}
                </ul>
              )}
            </div>
          )}

          <section className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-6">
            <h2 className="mb-5 text-2xl font-bold">
              Dog Information
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                name="dogName"
                placeholder="Dog Name *"
                required
                className={inputStyle}
              />

              <input
                name="breed"
                placeholder="Breed"
                className={inputStyle}
              />

              <input
                name="primaryColor"
                placeholder="Primary Color *"
                required
                className={inputStyle}
              />

              <input
                name="secondaryColor"
                placeholder="Secondary Color"
                className={inputStyle}
              />

              <select
                name="sex"
                defaultValue="unknown"
                className={inputStyle}
              >
                <option value="unknown">
                  Sex unknown
                </option>
                <option value="male">
                  Male
                </option>
                <option value="female">
                  Female
                </option>
              </select>

              <select
                name="size"
                defaultValue="unknown"
                className={inputStyle}
              >
                <option value="unknown">
                  Size unknown
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

              <input
                name="estimatedBirthYear"
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                placeholder="Estimated birth year"
                className={inputStyle}
              />

              <label className="flex items-center gap-3 rounded-md border border-[#9bd8c9] p-3">
                <input
                  name="microchipped"
                  type="checkbox"
                />
                Microchipped
              </label>
            </div>

            <textarea
              name="description"
              placeholder="Description and distinctive features..."
              className={`${inputStyle} mt-4 h-32 w-full`}
            />
          </section>

          <section className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-6">
            <h2 className="mb-5 text-2xl font-bold">
              Last Seen Information
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                name="lastSeenAt"
                type="datetime-local"
                required
                className={inputStyle}
              />

              <input
                name="locationDescription"
                placeholder="Last seen location *"
                required
                className={inputStyle}
              />

              <LocationPicker />

              <label className="flex items-center gap-3 rounded-md border border-[#9bd8c9] p-3 md:col-span-2">
                <input
                  name="timeIsApproximate"
                  type="checkbox"
                />
                Last-seen time is approximate
              </label>
            </div>

            <textarea
              name="circumstances"
              placeholder="What happened?"
              className={`${inputStyle} mt-4 h-28 w-full`}
            />
          </section>

          <section className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-6">
            <h2 className="mb-5 text-2xl font-bold">
              Reward
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-md border border-[#9bd8c9] p-3">
                <input
                  name="rewardOffered"
                  type="checkbox"
                />
                Reward offered
              </label>

              <input
                name="rewardAmount"
                type="number"
                min="0"
                step="0.01"
                placeholder="Reward amount"
                className={inputStyle}
              />
            </div>
          </section>

          <section className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-6">
            <h2 className="mb-5 text-2xl font-bold">
              Photos
            </h2>

            <input
              name="photos"
              type="file"
              required
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="block w-full rounded-md border border-[#9bd8c9] bg-[#003d35] p-3 text-white"
            />

            <p className="mt-3 text-sm text-[#b7d5ce]">
              Upload 1–5 JPEG, PNG, or WebP photos.
              Each file must be 5 MB or smaller.
            </p>
          </section>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-md bg-[#fbb12c] px-6 py-4 font-bold text-[#003d35] transition hover:bg-[#ffc34d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending
              ? "Submitting…"
              : "Submit Missing Dog Report"}
          </button>
        </form>
      </div>
    </main>
  );
}