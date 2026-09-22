"use client";

import {
  useState,
  useTransition,
} from "react";

import {
  submitMissingDogReport,
  type SubmitReportResult,
} from "./actions";

import LocationPicker from "@/components/LocationPicker";

const inputStyle =
  "w-full rounded-lg border border-gray-300 bg-white p-3 text-black placeholder:text-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black";

type SubmittedReportInfo = {
  dogName: string;
  breed: string;
  city: string;
  zipCode: string;
  size: string;
  locationDescription: string;
};

export default function ReportPage() {
  const [result, setResult] =
    useState<SubmitReportResult | null>(null);

  const [submittedReport, setSubmittedReport] =
    useState<SubmittedReportInfo | null>(null);

  const [isPending, startTransition] =
    useTransition();

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const reportInfo: SubmittedReportInfo = {
      dogName: String(
        formData.get("dogName") ?? "",
      ),
      breed: String(
        formData.get("breed") ?? "",
      ),
      city: String(
        formData.get("city") ?? "",
      ),
      zipCode: String(
        formData.get("zip_code") ?? "",
      ),
      size: String(
        formData.get("size") ?? "",
      ),
      locationDescription: String(
        formData.get(
          "locationDescription",
        ) ?? "",
      ),
    };

    startTransition(async () => {
      const submissionResult =
        await submitMissingDogReport(formData);

      setResult(submissionResult);

      if (submissionResult.success) {
        setSubmittedReport(reportInfo);

        form.reset();

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } else {
        setSubmittedReport(null);

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    });
  }

  return (
    <main className="min-h-screen bg-gradient-to-r from-white via-[#e4e4e4] to-[#b5b5b5] px-6 py-12 text-black sm:px-8 lg:px-12">
      <div className="mx-auto max-w-4xl">

        {/* HEADER */}

        <div className="mb-12">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-black">
            Report a Missing Pet
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Help bring your pet home.
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-700">
            Share information about your missing pet so
            your community can help look for them.
          </p>
        </div>

        {/* SUCCESS / ERROR */}

        {result && (
          <div
            role={
              result.success
                ? "status"
                : "alert"
            }
            className={`mb-8 rounded-2xl border bg-white p-5 shadow-sm ${
              result.success
                ? "border-gray-300"
                : "border-red-300"
            }`}
          >
            <p className="font-bold">
              {result.message}
            </p>

            {result.fieldErrors && (
              <ul className="mt-3 list-disc pl-5 text-sm text-gray-700">
                {Object.entries(
                  result.fieldErrors,
                ).flatMap(
                  ([field, messages]) =>
                    messages.map(
                      (message) => (
                        <li
                          key={`${field}-${message}`}
                        >
                          {message}
                        </li>
                      ),
                    ),
                )}
              </ul>
            )}
          </div>
        )}

        {/* AI RECOMMENDATIONS */}

        {result?.success &&
          submittedReport && (
            <section className="mb-8 overflow-hidden rounded-3xl bg-white shadow-sm">
              <div className="border-b border-gray-200 px-6 py-6 sm:px-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                    AI
                  </div>

                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.15em] text-gray-500">
                      PawSearch
                    </p>

                    <h2 className="mt-1 text-2xl font-bold">
                      Search Recommendations
                    </h2>

                    <p className="mt-2 text-gray-600">
                      Suggestions based on the information
                      in your report.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8">

                <p className="text-lg leading-8 text-gray-700">
                  Based on{" "}
                  <span className="font-bold text-black">
                    {submittedReport.dogName ||
                      "your pet"}
                  </span>
                  {submittedReport.breed
                    ? `, ${submittedReport.breed}`
                    : ""}
                  {submittedReport.city
                    ? `, and the last known area in ${submittedReport.city}`
                    : ""}
                  {submittedReport.zipCode
                    ? ` (${submittedReport.zipCode})`
                    : ""}
                  , here are some places and actions to
                  consider checking first.
                </p>

                <div className="mt-8">
                  <h3 className="text-xl font-bold">
                    Recommended Areas to Check
                  </h3>

                  <div className="mt-4 grid gap-4 md:grid-cols-3">

                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                      <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
                        01
                      </p>

                      <h4 className="mt-2 font-bold">
                        Parks & Open Spaces
                      </h4>

                      <p className="mt-2 text-sm leading-6 text-gray-600">
                        Check nearby parks, trails,
                        fields, and other open areas
                        around the last known location.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                      <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
                        02
                      </p>

                      <h4 className="mt-2 font-bold">
                        Nearby Neighborhoods
                      </h4>

                      <p className="mt-2 text-sm leading-6 text-gray-600">
                        Ask nearby residents to check
                        yards, garages, sheds, and
                        other enclosed spaces.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                      <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
                        03
                      </p>

                      <h4 className="mt-2 font-bold">
                        Sheltered Areas
                      </h4>

                      <p className="mt-2 text-sm leading-6 text-gray-600">
                        Check under porches, decks,
                        vehicles, bushes, and other
                        quiet sheltered areas.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-bold">
                    Suggested Search Strategy
                  </h3>

                  <ol className="mt-4 space-y-4">
                    <li className="flex gap-4">
                      <span className="font-bold">
                        1.
                      </span>

                      <span className="text-gray-600">
                        Start closest to the last known
                        location
                        {submittedReport.locationDescription
                          ? ` (${submittedReport.locationDescription})`
                          : ""}
                        .
                      </span>
                    </li>

                    <li className="flex gap-4">
                      <span className="font-bold">
                        2.
                      </span>

                      <span className="text-gray-600">
                        Gradually expand your search
                        outward instead of immediately
                        searching far away.
                      </span>
                    </li>

                    <li className="flex gap-4">
                      <span className="font-bold">
                        3.
                      </span>

                      <span className="text-gray-600">
                        Ask nearby residents to check
                        enclosed spaces.
                      </span>
                    </li>

                    <li className="flex gap-4">
                      <span className="font-bold">
                        4.
                      </span>

                      <span className="text-gray-600">
                        Share your PawSearch report with
                        people in the surrounding area.
                      </span>
                    </li>
                  </ol>
                </div>

                <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-5">
                  <p className="text-sm leading-6 text-gray-600">
                    <span className="font-bold text-black">
                      PawSearch AI Note:
                    </span>{" "}
                    These are currently example search
                    suggestions. Future versions can use
                    AI and location data to identify
                    specific nearby areas based on the
                    report.
                  </p>
                </div>
              </div>
            </section>
          )}

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          {/* 01. PET INFORMATION */}

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
                  Tell us about your missing pet.
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block font-semibold">
                  Pet Name *
                </label>

                <input
                  name="dogName"
                  placeholder="Max"
                  required
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  Breed
                </label>

                <input
                  name="breed"
                  placeholder="Golden Retriever"
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  Primary Color *
                </label>

                <input
                  name="primaryColor"
                  placeholder="Golden"
                  required
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  Secondary Color
                </label>

                <input
                  name="secondaryColor"
                  placeholder="White"
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  Sex
                </label>

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
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  Size
                </label>

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
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  Estimated Birth Year
                </label>

                <input
                  name="estimatedBirthYear"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  placeholder="2021"
                  className={inputStyle}
                />
              </div>

              <label className="flex items-center gap-3 rounded-lg border border-gray-300 bg-white p-3">
                <input
                  name="microchipped"
                  type="checkbox"
                  className="h-4 w-4 accent-black"
                />

                <span className="font-semibold">
                  Microchipped
                </span>
              </label>
            </div>

            <textarea
              name="description"
              placeholder="Description and distinctive features..."
              className={`${inputStyle} mt-5 h-32 resize-none`}
            />
          </section>

          {/* 02. LAST SEEN */}
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
        Tell us when and where your pet was last seen.
      </p>
    </div>
  </div>

  <div className="grid gap-5 md:grid-cols-2">
    <div>
      <label
        htmlFor="lastSeenAt"
        className="mb-2 block font-semibold"
      >
        Last Seen *
      </label>

      <input
        id="lastSeenAt"
        name="lastSeenAt"
        type="datetime-local"
        required
        className={inputStyle}
      />
    </div>

    <div className="md:col-span-2">
      <LocationPicker
        locationFieldName="locationDescription"
        cityFieldName="city"
        zipFieldName="zip_code"
      />
    </div>

    <label className="flex items-center gap-3 rounded-lg border border-gray-300 bg-white p-3 md:col-span-2">
      <input
        name="timeIsApproximate"
        type="checkbox"
        className="h-4 w-4 accent-black"
      />

      <span className="font-semibold">
        Last-seen time is approximate
      </span>
    </label>
  </div>

  <textarea
    name="circumstances"
    placeholder="What happened? Include any useful details about when your pet went missing."
    className={`${inputStyle} mt-5 h-28 w-full resize-none`}
  />
</section>

          {/* 03. REWARD */}

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
                  Let people know if you are offering a
                  reward.
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <label className="flex items-center gap-3 rounded-lg border border-gray-300 bg-white p-3">
                <input
                  name="rewardOffered"
                  type="checkbox"
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
                placeholder="Reward amount"
                className={inputStyle}
              />
            </div>
          </section>

          {/* 04. PHOTOS */}

          <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-7 flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                04
              </div>

              <div>
                <h2 className="text-2xl font-bold">
                  Photos
                </h2>

                <p className="mt-1 text-gray-600">
                  Add clear photos that can help people
                  recognize your pet.
                </p>
              </div>
            </div>

            <input
              name="photos"
              type="file"
              required
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="block w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-black file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
            />

            <p className="mt-3 text-sm text-gray-500">
              Upload 1–5 JPEG, PNG, or WebP photos.
              Each file must be 5 MB or smaller.
            </p>
          </section>

          {/* SUBMIT */}

          <div className="pb-8">
            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-xl bg-black px-6 py-4 text-base font-bold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending
                ? "Submitting..."
                : "Submit Missing Pet Report"}
            </button>

            <p className="mt-4 text-center text-sm text-gray-600">
              Please review your information before
              submitting.
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
