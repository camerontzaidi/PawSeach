"use client";

import { useEffect, useState } from "react";

export type AiReportInfo = {
  dogName: string;
  breed: string;
  city: string;
  zipCode: string;
  size: string;
  locationDescription: string;
  circumstances: string;
  latitude: number | null;
  longitude: number | null;
};

type Recommendation = {
  title: string;
  explanation: string;
  priority: "high" | "medium" | "low";
};

type AiResponse = {
  recommendations: Recommendation[];
  strategy: string[];
  error?: string;
};

export default function AiRecommendations({
  report,
}: {
  report: AiReportInfo;
}) {
  const [data, setData] = useState<AiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadRecommendations() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/ai-recommendations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(report),
        });

        const result = (await response.json()) as AiResponse;

        if (!response.ok) {
          throw new Error(
            result.error ||
              "Personalized recommendations are temporarily unavailable.",
          );
        }

        if (!cancelled) {
          setData(result);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Personalized recommendations are temporarily unavailable.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadRecommendations();

    return () => {
      cancelled = true;
    };
  }, [report]);

  return (
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
              Personalized suggestions based on your pet and the exact
              last-seen location you selected.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <p className="text-lg leading-8 text-gray-700">
          Using the details in{" "}
          <span className="font-bold text-black">
            {report.dogName ? `${report.dogName}'s report` : "your report"}
          </span>
          {report.locationDescription
            ? ` and the last-known location near ${report.locationDescription}`
            : ""}
          , here are the areas and search steps to prioritize first.
        </p>

        {loading && (
          <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <p className="font-semibold text-gray-700">
              Generating personalized search recommendations...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <p className="font-semibold text-gray-700">
              {error}
            </p>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Your missing-pet report was still submitted successfully.
            </p>
          </div>
        )}

        {!loading && data && (
          <>
            <div className="mt-8">
              <h3 className="text-xl font-bold">
                Recommended Areas to Check
              </h3>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {data.recommendations.map((recommendation, index) => (
                  <div
                    key={`${recommendation.title}-${index}`}
                    className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
                        {String(index + 1).padStart(2, "0")}
                      </p>

                      <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        {recommendation.priority}
                      </span>
                    </div>

                    <h4 className="mt-2 font-bold">
                      {recommendation.title}
                    </h4>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {recommendation.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-bold">
                Suggested Search Strategy
              </h3>

              <ol className="mt-4 space-y-4">
                {data.strategy.map((step, index) => (
                  <li
                    key={`${index}-${step}`}
                    className="flex gap-4"
                  >
                    <span className="font-bold">
                      {index + 1}.
                    </span>
                    <span className="text-gray-600">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <p className="text-sm leading-6 text-gray-600">
                <span className="font-bold text-black">
                  PawSearch AI Note:
                </span>{" "}
                These suggestions are generated from the information in your
                report. They are search ideas, not confirmed sightings or
                known locations of your pet.
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
