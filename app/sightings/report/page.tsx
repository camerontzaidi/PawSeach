"use client";

import { useState, useTransition } from "react";
import {
  submitFoundDogReport,
  type SubmitFoundReportResult,
} from "./actions";

const inputStyle =
  "w-full rounded-md border border-[#1b5b51] bg-[#003d35] p-3 text-white placeholder:text-[#b7d5ce] outline-none focus:border-[#fbb12c]";

export default function FoundAnimalReportPage() {
  const [result, setResult] = useState<SubmitFoundReportResult | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const submissionResult = await submitFoundDogReport(formData);
      setResult(submissionResult);
      if (submissionResult.success) form.reset();
    });
  }

  return (
    <main className="min-h-screen bg-[#003d35] px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold">Report a Found Animal</h1>
        <p className="mt-2 text-[#b7d5ce]">
          Help reunite this pet with its family by sharing as much information as possible.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {result && (
            <div
              role="status"
              className={`rounded-lg border p-4 ${
                result.success
                  ? "border-emerald-400 bg-emerald-900/30"
                  : "border-red-400 bg-red-900/30"
              }`}
            >
              <p className="font-bold">{result.message}</p>
              {result.fieldErrors && (
                <ul className="mt-2 list-disc pl-5">
                  {Object.entries(result.fieldErrors).flatMap(([field, messages]) =>
                    messages.map((message) => <li key={`${field}-${message}`}>{message}</li>),
                  )}
                </ul>
              )}
            </div>
          )}

          <section className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-6">
            <div className="rounded-lg border-2 border-dashed border-[#1b5b51] p-8 text-center">
              <p className="text-5xl">📷</p>
              <h2 className="mt-4 text-xl font-bold">Upload Photos</h2>
              <p className="mt-2 text-[#b7d5ce]">Add clear photos of the animal you found.</p>
              <input
                name="photos"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="mt-4 block w-full rounded-md border border-[#1b5b51] bg-[#003d35] p-3 text-white"
              />
              <p className="mt-2 text-sm text-[#b7d5ce]">
                Upload 1–5 JPEG, PNG, or WebP photos. Each file must be 5 MB or smaller.
              </p>
            </div>

            <div className="mt-8 rounded-lg border border-[#1b5b51] p-5">
              <h2 className="text-2xl font-bold">Animal Information</h2>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block font-semibold">Breed (if known)</span>
                  <input name="breed" type="text" placeholder="Golden Retriever" className={inputStyle} />
                </label>
                <label className="block">
                  <span className="mb-2 block font-semibold">Color *</span>
                  <input name="color" type="text" placeholder="Golden" className={inputStyle} />
                </label>
                <label className="block">
                  <span className="mb-2 block font-semibold">Approximate Size</span>
                  <select name="size" defaultValue="unknown" className={inputStyle}>
                    <option value="unknown">Unknown</option>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block font-semibold">Collar?</span>
                  <select name="collarStatus" defaultValue="unsure" className={inputStyle}>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="unsure">Unsure</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-[#1b5b51] p-5">
              <h2 className="text-2xl font-bold">Where Was the Animal Found?</h2>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block font-semibold">Date Found *</span>
                  <input name="foundDate" type="date" className={inputStyle} />
                </label>
                <label className="block">
                  <span className="mb-2 block font-semibold">City *</span>
                  <input name="city" type="text" placeholder="Fremont" className={inputStyle} />
                </label>
                <label className="block">
                  <span className="mb-2 block font-semibold">ZIP Code *</span>
                  <input
                    name="zipCode"
                    type="text"
                    inputMode="numeric"
                    placeholder="94536"
                    className={inputStyle}
                  />
                </label>
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-[#1b5b51] p-5">
              <h2 className="text-2xl font-bold">Additional Details</h2>
              <textarea
                name="details"
                rows={6}
                placeholder="Describe where you found the animal, whether it seemed injured, friendly, wearing tags, etc."
                className={`${inputStyle} mt-4`}
              />
            </div>

            <div className="mt-8 text-center">
              <button
                type="submit"
                disabled={isPending}
                className="rounded-md bg-[#fbb12c] px-8 py-4 text-lg font-bold text-[#003d35] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Submitting…" : "Submit Found Animal Report"}
              </button>
            </div>
          </section>
        </form>
      </div>
    </main>
  );
}
