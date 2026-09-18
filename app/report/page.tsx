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
"rounded-md border border-[#9bd8c9] bg-[#003d35] p-3 text-white placeholder:text-[#b7d5ce] focus:border-[#fbb12c] focus:outline-none";

type SubmittedReportInfo = {
dogName: string;
breed: string;
city: string;
zipCode: string;
size: string;
locationDescription: string;
circumstances: string;
};

type AiRecommendation = {
title: string;
explanation: string;
priority: "high" | "medium" | "low";
};

type AiRecommendationResponse = {
recommendations: AiRecommendation[];
strategy: string[];
};

export default function ReportPage() {
const [
result,
setResult,
] =
useState<
SubmitReportResult | null
>(null);

const [
submittedReport,
setSubmittedReport,
] =
useState<
SubmittedReportInfo | null
>(null);

const [
isPending,
startTransition,
] =
useTransition();

const [
aiRecommendations,
setAiRecommendations,
] =
useState<AiRecommendationResponse | null>(null);

const [
isLoadingAi,
setIsLoadingAi,
] =
useState(false);

const [
aiError,
setAiError,
] =
useState<string | null>(null);

async function loadAiRecommendations(
reportInfo: SubmittedReportInfo,
) {
setIsLoadingAi(true);
setAiError(null);
setAiRecommendations(null);

try {
  const response = await fetch(
    "/api/ai-recommendations",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        reportInfo,
      ),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ??
        "AI recommendations are unavailable right now.",
    );
  }

  setAiRecommendations(
    data as AiRecommendationResponse,
  );
} catch (error) {
  setAiError(
    error instanceof Error
      ? error.message
      : "AI recommendations are unavailable right now.",
  );
} finally {
  setIsLoadingAi(false);
}
}

function handleSubmit(
event: React.FormEvent<HTMLFormElement>,
) {
event.preventDefault();


const form =
  event.currentTarget;

const formData =
  new FormData(form);

/*
 * Save this information before
 * resetting the form so we can
 * display personalized recommendations.
 */
const reportInfo:
  SubmittedReportInfo = {
    dogName:
      String(
        formData.get(
          "dogName",
        ) ?? "",
      ),

    breed:
      String(
        formData.get(
          "breed",
        ) ?? "",
      ),

    city:
      String(
        formData.get(
          "city",
        ) ?? "",
      ),

    zipCode:
      String(
        formData.get(
          "zip_code",
        ) ?? "",
      ),

    size:
      String(
        formData.get(
          "size",
        ) ?? "",
      ),

    locationDescription:
      String(
        formData.get(
          "locationDescription",
        ) ?? "",
      ),

    circumstances:
      String(
        formData.get(
          "circumstances",
        ) ?? "",
      ),
  };

startTransition(
  async () => {
    const submissionResult =
      await submitMissingDogReport(
        formData,
      );

    setResult(
      submissionResult,
    );

    if (
      submissionResult.success
    ) {
      setSubmittedReport(
        reportInfo,
      );

      void loadAiRecommendations(
        reportInfo,
      );

      form.reset();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      setSubmittedReport(
        null,
      );

      setAiRecommendations(
        null,
      );

      setAiError(
        null,
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  },
);


}

return ( <main className="min-h-screen bg-[#003d35] px-6 py-10 text-white"> <div className="mx-auto max-w-3xl">


    {/* HEADER */}

    <div className="mb-10 text-center">
      <h1 className="text-4xl font-bold">
        Report a Missing Pet 🐾
      </h1>

      <p className="mt-3 text-[#b7d5ce]">
        Help your community bring
        a missing pet home.
      </p>
    </div>

    {/* SUCCESS / ERROR MESSAGE */}

    {result && (
      <div
        role={
          result.success
            ? "status"
            : "alert"
        }
        className={`mb-6 rounded-lg border p-4 ${
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
              ([
                field,
                messages,
              ]) =>
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
        <section className="mb-8 overflow-hidden rounded-xl border border-[#fbb12c]/60 bg-[#06483f]">

          {/* AI HEADER */}

          <div className="border-b border-[#fbb12c]/30 bg-[#003d35] px-6 py-5">
            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fbb12c] text-2xl">
                🤖
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#fbb12c]">
                  PawSearch AI Recommendations
                </h2>

                <p className="mt-1 text-sm text-[#b7d5ce]">
                  Personalized suggestions based
                  on your submitted report.
                </p>
              </div>

            </div>
          </div>

          <div className="p-6">

            {/* INTRO */}

            <p className="text-lg leading-7 text-white">
              Based on{" "}

              <span className="font-bold text-[#fbb12c]">
                {submittedReport.dogName ||
                  "your dog's"}
              </span>

              {submittedReport.breed
                ? ` ${submittedReport.breed} breed`
                : ""}

              {submittedReport.city
                ? ` and the last known area in ${submittedReport.city}`
                : ""}

              {submittedReport.zipCode
                ? `, ZIP code ${submittedReport.zipCode}`
                : ""}

              , here are some places and actions
              PawSearch recommends checking first.
            </p>

            {isLoadingAi && (
              <div className="mt-6 rounded-lg border border-[#1b5b51] bg-[#003d35] p-5 text-[#b7d5ce]">
                🤖 Generating personalized search recommendations...
              </div>
            )}

            {aiError && (
              <div className="mt-6 rounded-lg border border-[#1b5b51] bg-[#003d35] p-5">
                <p className="font-bold text-[#fbb12c]">
                  AI recommendations are temporarily unavailable.
                </p>
                <p className="mt-2 text-sm text-[#b7d5ce]">
                  Your missing-pet report was still submitted successfully.
                  {` ${aiError}`}
                </p>
              </div>
            )}

            {aiRecommendations && (
              <>
                {/* RECOMMENDED PLACES */}

                <div className="mt-6">
                  <h3 className="text-xl font-bold">
                    📍 Recommended Areas to Check
                  </h3>

                  <div className="mt-4 space-y-4">
                    {aiRecommendations.recommendations.map(
                      (
                        recommendation,
                        index,
                      ) => (
                        <div
                          key={`${recommendation.title}-${index}`}
                          className="rounded-lg border border-[#1b5b51] bg-[#003d35] p-4"
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-bold text-[#fbb12c]">
                              {recommendation.title}
                            </h4>

                            <span className="rounded-full border border-[#1b5b51] px-2 py-1 text-xs uppercase text-[#b7d5ce]">
                              {recommendation.priority} priority
                            </span>
                          </div>

                          <p className="mt-2 text-sm leading-6 text-[#b7d5ce]">
                            {recommendation.explanation}
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* SEARCH STRATEGY */}

                <div className="mt-7">
                  <h3 className="text-xl font-bold">
                    🔍 Suggested Search Strategy
                  </h3>

                  <ol className="mt-4 space-y-3 text-[#b7d5ce]">
                    {aiRecommendations.strategy.map(
                      (step, index) => (
                        <li
                          key={`${step}-${index}`}
                          className="flex gap-3"
                        >
                          <span className="font-bold text-[#fbb12c]">
                            {index + 1}.
                          </span>
                          <span>
                            {step}
                          </span>
                        </li>
                      ),
                    )}
                  </ol>
                </div>
              </>
            )}

            {/* AI DISCLAIMER */}

            <div className="mt-7 rounded-lg border border-[#1b5b51] bg-[#003d35] p-4">
              <p className="text-sm leading-6 text-[#b7d5ce]">

                <span className="font-bold text-[#fbb12c]">
                  🤖 PawSearch AI Note:
                </span>

                {" "}

                These are AI-generated search suggestions
                based on the information in your report.
                They are possibilities, not confirmed
                sightings or predictions of your dog&apos;s
                location. Use normal safety precautions
                while searching.
              </p>
            </div>

          </div>
        </section>
      )}

    {/* FORM */}

    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >

      {/* DOG INFORMATION */}

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
            max={
              new Date().getFullYear()
            }
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

      {/* LAST SEEN INFORMATION */}

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

          <LocationPicker
            locationFieldName="locationDescription"
            cityFieldName="city"
            zipFieldName="zip_code"
          />

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

      {/* SECURE CONTACT */}

      <section className="rounded-xl border border-[#fbb12c]/60 bg-[#06483f] p-6">
        <h2 className="text-2xl font-bold">🛡️ PawSearch Messaging</h2>
        <p className="mt-3 leading-relaxed text-[#b7d5ce]">
          Your personal phone number and email address are not required on
          this public report. Signed-in community members can send you one
          protected message request. They cannot send another message unless
          you accept the request in Messages.
        </p>
      </section>

      {/* REWARD */}

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

      {/* PHOTOS */}

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

      {/* SUBMIT */}

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
