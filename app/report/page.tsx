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
import AiRecommendations, {
  type AiReportInfo,
} from "@/components/AiRecommendations";

const inputStyle =
  "w-full rounded-lg border border-gray-300 bg-white p-3 text-black placeholder:text-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black";

type SubmittedReportInfo = AiReportInfo;

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
      circumstances: String(
        formData.get("circumstances") ?? "",
      ),
      latitude: Number.isFinite(
        Number(formData.get("latitude")),
      )
        ? Number(formData.get("latitude"))
        : null,
      longitude: Number.isFinite(
        Number(formData.get("longitude")),
      )
        ? Number(formData.get("longitude"))
        : null,
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

        {result?.success && submittedReport && (
          <AiRecommendations report={submittedReport} />
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
