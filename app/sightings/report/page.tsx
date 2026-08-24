"use client";

import { useRef, useState, useTransition } from "react";
import {
  submitFoundAnimalReport,
  type SubmitFoundReportResult,
} from "./actions";
import LocationPicker from "@/components/LocationPicker";

const inputStyle =
  "w-full rounded-md border border-[#9bd8c9] bg-[#003d35] p-3 text-white placeholder:text-[#b7d5ce] focus:border-[#fbb12c] focus:outline-none";

export default function FoundAnimalReportPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [result, setResult] =
    useState<SubmitFoundReportResult | null>(null);
  const [isPending, startTransition] = useTransition();

  function handlePhotoChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const files = Array.from(event.target.files ?? []);
    setSelectedFiles(files);
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const submissionResult =
        await submitFoundAnimalReport(formData);

      setResult(submissionResult);

      if (submissionResult.success) {
        form.reset();
        setSelectedFiles([]);
      }
    });
  }

  return (
    <main className="min-h-screen bg-[#003d35] px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">

        <h1 className="text-4xl font-bold">
          Report a Found Animal
        </h1>

        <p className="mt-2 text-[#b7d5ce]">
          Help reunite this pet with its family by sharing as much
          information as possible.
        </p>

        {result && (
          <div
            role="status"
            className={`mt-6 rounded-lg border p-4 ${
              result.success
                ? "border-emerald-400 bg-emerald-900/30"
                : "border-red-400 bg-red-900/30"
            }`}
          >
            <p className="font-bold">{result.message}</p>

            {result.fieldErrors && (
              <ul className="mt-2 list-disc pl-5">
                {Object.entries(result.fieldErrors).flatMap(
                  ([field, messages]) =>
                    messages.map((message) => (
                      <li key={`${field}-${message}`}>
                        {message}
                      </li>
                    )),
                )}
              </ul>
            )}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="mt-8 space-y-6"
        >

          {/* PHOTO */}
          <section className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-6">
            <h2 className="text-2xl font-bold">
              Photo
            </h2>

            <div className="mt-5 rounded-lg border-2 border-dashed border-[#1b5b51] p-8 text-center">

              <p className="text-5xl">
                📷
              </p>

              <h3 className="mt-4 text-xl font-bold">
                Add Photos of the Animal
              </h3>

              <p className="mt-2 text-[#b7d5ce]">
                Upload 1–5 JPEG, PNG, or WebP photos. Each photo must
                be 5 MB or smaller.
              </p>

              <input
                ref={fileInputRef}
                name="photos"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handlePhotoChange}
                className="hidden"
              />

              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="mt-5 rounded-md bg-[#fbb12c] px-6 py-3 font-bold text-[#003d35] hover:bg-[#ffc34d]"
              >
                Choose Photos
              </button>

              {selectedFiles.length > 0 && (
                <div className="mt-5 text-left">

                  <p className="font-semibold">
                    {selectedFiles.length} photo
                    {selectedFiles.length === 1 ? "" : "s"}{" "}
                    selected:
                  </p>

                  <ul className="mt-2 space-y-1 text-sm text-[#b7d5ce]">
                    {selectedFiles.map((file) => (
                      <li
                        key={`${file.name}-${file.size}`}
                      >
                        ✓ {file.name}
                      </li>
                    ))}
                  </ul>

                </div>
              )}

            </div>
          </section>

          {/* ANIMAL INFORMATION */}
          <section className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-6">

            <h2 className="text-2xl font-bold">
              Animal Information
            </h2>

            <div className="mt-6 grid gap-6 md:grid-cols-2">

              <div>
                <label className="mb-2 block font-semibold">
                  Breed (if known)
                </label>

                <input
                  name="breed"
                  type="text"
                  placeholder="Golden Retriever"
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  Color *
                </label>

                <input
                  name="color"
                  type="text"
                  placeholder="Golden"
                  required
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  Approximate Size
                </label>

                <select
                  name="size"
                  defaultValue="unknown"
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
                <label className="mb-2 block font-semibold">
                  Collar?
                </label>

                <select
                  name="collar"
                  defaultValue="unsure"
                  className={inputStyle}
                >
                  <option value="yes">
                    Yes
                  </option>

                  <option value="no">
                    No
                  </option>

                  <option value="unsure">
                    Unsure
                  </option>
                </select>
              </div>

            </div>
          </section>

          {/* FOUND LOCATION */}
          <section className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-6">

            <h2 className="text-2xl font-bold">
              Where Was the Animal Found?
            </h2>

            <p className="mt-2 text-[#b7d5ce]">
              Select the location on the map. City, state, and ZIP
              code will be filled in automatically when available.
            </p>

            <div className="mt-6 grid gap-6 md:grid-cols-2">

              {/* DATE */}
              <div>
                <label
                  htmlFor="dateFound"
                  className="mb-2 block font-semibold"
                >
                  Date Found *
                </label>

                <input
                  id="dateFound"
                  name="dateFound"
                  type="date"
                  required
                  className={inputStyle}
                />
              </div>

              {/* CITY + STATE */}
              <div>
                <label
                  htmlFor="city"
                  className="mb-2 block font-semibold"
                >
                  City, State
                </label>

                <input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="Automatically filled from map"
                  className={inputStyle}
                />
              </div>

              {/* ZIP */}
              <div>
                <label
                  htmlFor="zip"
                  className="mb-2 block font-semibold"
                >
                  ZIP Code
                </label>

                <input
                  id="zip"
                  name="zip"
                  type="text"
                  placeholder="Automatically filled from map"
                  className={inputStyle}
                />
              </div>

              {/* MAP */}
              <div className="md:col-span-2">
                <LocationPicker
                  cityFieldName="city"
                  zipFieldName="zip"
                />
              </div>

            </div>
          </section>

          {/* ADDITIONAL DETAILS */}
          <section className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-6">

            <h2 className="text-2xl font-bold">
              Additional Details
            </h2>

            <textarea
              name="description"
              rows={6}
              placeholder="Describe where you found the animal, whether it seemed injured, friendly, wearing tags, etc."
              className={`${inputStyle} mt-4`}
            />

          </section>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-md bg-[#fbb12c] px-8 py-4 text-lg font-bold text-[#003d35] hover:bg-[#ffc34d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending
              ? "Submitting..."
              : "Submit Found Animal Report"}
          </button>

        </form>
      </div>
    </main>
  );
}