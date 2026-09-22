"use client";

import {
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

import {
  submitFoundAnimalReport,
  type SubmitFoundReportResult,
} from "./actions";

const inputStyle =
  "w-full rounded-lg border border-gray-300 bg-white p-3 text-black placeholder:text-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black";

export default function FoundAnimalReportPage() {
  const router = useRouter();

  const [isCheckingAuth, setIsCheckingAuth] =
    useState(true);

  const [selectedFiles, setSelectedFiles] =
    useState<File[]>([]);

  const [result, setResult] =
    useState<SubmitFoundReportResult | null>(null);

  const [isPending, startTransition] =
    useTransition();

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace(
          "/login?next=/sightings/report",
        );
        return;
      }

      setIsCheckingAuth(false);
    };

    void checkAuth();
  }, [router]);

  function handlePhotoChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const files = Array.from(
      event.target.files ?? [],
    );

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

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    });
  }

  if (isCheckingAuth) {
    return (
      <main className="min-h-screen bg-gradient-to-r from-white via-[#e4e4e4] to-[#b5b5b5] px-6 py-12 text-black sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-gray-600">
            Checking sign-in status...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-r from-white via-[#e4e4e4] to-[#b5b5b5] px-6 py-12 text-black sm:px-8 lg:px-12">
      <div className="mx-auto max-w-4xl">

        {/* HEADER */}

        <div className="mb-12">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-black">
            Report a Found Pet
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Help reunite a pet with their owner.
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-700">
            Share information about a pet you found so
            their owner and nearby community members can
            take action.
          </p>
        </div>

        {/* RESULT */}

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
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="space-y-8"
        >

          {/* 01. PHOTO */}

          <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-7 flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                01
              </div>

              <div>
                <h2 className="text-2xl font-bold">
                  Photos
                </h2>

                <p className="mt-1 text-gray-600">
                  Clear photos can help the owner recognize
                  their pet.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
              <h3 className="text-xl font-bold">
                Add Photos of the Pet
              </h3>

              <p className="mt-2 text-gray-600">
                Upload 1–5 JPEG, PNG, or WebP photos.
                Each photo must be 5 MB or smaller.
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
                className="mt-5 rounded-lg bg-black px-6 py-3 font-bold text-white transition hover:bg-gray-800"
              >
                Choose Photos
              </button>

              {selectedFiles.length > 0 && (
                <div className="mt-5 text-left">
                  <p className="font-semibold">
                    {selectedFiles.length} photo
                    {selectedFiles.length === 1
                      ? ""
                      : "s"}{" "}
                    selected:
                  </p>

                  <ul className="mt-2 space-y-1 text-sm text-gray-600">
                    {selectedFiles.map(
                      (file) => (
                        <li
                          key={`${file.name}-${file.size}`}
                        >
                          {file.name}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              )}
            </div>
          </section>

          {/* 02. ANIMAL INFORMATION */}

          <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-7 flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                02
              </div>

              <div>
                <h2 className="text-2xl font-bold">
                  Animal Information
                </h2>

                <p className="mt-1 text-gray-600">
                  Tell us what you know about the pet.
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block font-semibold">
                  Breed
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

          {/* 03. FOUND LOCATION */}

          <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-7 flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                03
              </div>

              <div>
                <h2 className="text-2xl font-bold">
                  Where Was the Pet Found?
                </h2>

                <p className="mt-1 text-gray-600">
                  Provide the location and date where the
                  pet was found.
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block font-semibold">
                  Date Found *
                </label>

                <input
                  name="dateFound"
                  type="date"
                  required
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  City *
                </label>

                <input
                  name="city"
                  type="text"
                  placeholder="Fremont"
                  required
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  ZIP Code *
                </label>

                <input
                  name="zip"
                  type="text"
                  placeholder="94536"
                  required
                  className={inputStyle}
                />
              </div>
            </div>
          </section>

          {/* 04. ADDITIONAL DETAILS */}

          <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-7 flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                04
              </div>

              <div>
                <h2 className="text-2xl font-bold">
                  Additional Details
                </h2>

                <p className="mt-1 text-gray-600">
                  Include anything else that may help identify
                  or locate the pet.
                </p>
              </div>
            </div>

            <textarea
              name="description"
              rows={6}
              placeholder="Describe where you found the pet, whether it seemed injured, friendly, wearing tags, or anything else that may help."
              className={`${inputStyle} resize-none`}
            />
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
                : "Submit Found Pet Report"}
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

