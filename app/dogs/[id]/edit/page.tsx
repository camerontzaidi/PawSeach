"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import LocationPicker from "@/components/LocationPicker";

const inputStyle =
  "w-full rounded-md border border-[#9bd8c9] bg-[#003d35] p-3 text-white placeholder:text-[#b7d5ce] focus:border-[#fbb12c] focus:outline-none";

export default function EditDogReportPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  // Temporary UI data.
  // Replace this with backend data when report update actions are connected.
  const [formData, setFormData] = useState({
    dogName: "Max",
    breed: "Golden Retriever",
    primaryColor: "Golden",
    secondaryColor: "",
    sex: "male",
    size: "large",
    estimatedBirthYear: "",
    microchipped: true,
    lastSeenAt: "2026-07-26T14:00",
    locationDescription: "Near the neighborhood park",
    timeIsApproximate: false,
    description:
      "Friendly dog with a red collar. Last seen running near the neighborhood park.",
    circumstances:
      "Max went missing and was last seen near the neighborhood park. Please contact the owner if you believe you have found him.",
    rewardOffered: false,
    rewardAmount: "",
  });

  const [saved, setSaved] = useState(false);

  function updateField(
    field: keyof typeof formData,
    value: string | boolean,
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    setSaved(false);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // UI only for now.
    // Later this will call the backend update action.
    setSaved(true);

    setTimeout(() => {
      router.push(`/dogs/${params.id}`);
    }, 700);
  }

  return (
    <main className="min-h-screen bg-[#003d35] px-4 py-10 text-white sm:px-6 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <Link
          href={`/dogs/${params.id}`}
          className="inline-flex items-center text-sm font-semibold text-[#b7d5ce] transition hover:text-[#fbb12c]"
        >
          ← Back to Report
        </Link>

        <div className="mt-6">
          <span className="text-sm font-semibold uppercase tracking-wide text-[#fbb12c]">
            Edit Report
          </span>

          <h1 className="mt-2 text-4xl font-bold">
            Edit Missing Pet Report
          </h1>

          <p className="mt-3 text-lg text-[#b7d5ce]">
            Update the information for this missing pet report.
          </p>
        </div>

        {saved && (
          <div
            role="status"
            className="mt-6 rounded-lg border border-emerald-400 bg-emerald-900/30 p-4"
          >
            <p className="font-bold">
              ✓ Changes saved successfully. Returning to the report...
            </p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-8"
        >
          {/* DOG INFORMATION */}
          <section className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-6">
            <h2 className="mb-5 text-2xl font-bold">
              Pet Information
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="dogName"
                  className="mb-2 block font-semibold"
                >
                  Pet Name *
                </label>

                <input
                  id="dogName"
                  value={formData.dogName}
                  onChange={(event) =>
                    updateField("dogName", event.target.value)
                  }
                  required
                  className={inputStyle}
                />
              </div>

              <div>
                <label
                  htmlFor="breed"
                  className="mb-2 block font-semibold"
                >
                  Breed
                </label>

                <input
                  id="breed"
                  value={formData.breed}
                  onChange={(event) =>
                    updateField("breed", event.target.value)
                  }
                  className={inputStyle}
                />
              </div>

              <div>
                <label
                  htmlFor="primaryColor"
                  className="mb-2 block font-semibold"
                >
                  Primary Color *
                </label>

                <input
                  id="primaryColor"
                  value={formData.primaryColor}
                  onChange={(event) =>
                    updateField(
                      "primaryColor",
                      event.target.value,
                    )
                  }
                  required
                  className={inputStyle}
                />
              </div>

              <div>
                <label
                  htmlFor="secondaryColor"
                  className="mb-2 block font-semibold"
                >
                  Secondary Color
                </label>

                <input
                  id="secondaryColor"
                  value={formData.secondaryColor}
                  onChange={(event) =>
                    updateField(
                      "secondaryColor",
                      event.target.value,
                    )
                  }
                  className={inputStyle}
                />
              </div>

              <div>
                <label
                  htmlFor="sex"
                  className="mb-2 block font-semibold"
                >
                  Sex
                </label>

                <select
                  id="sex"
                  value={formData.sex}
                  onChange={(event) =>
                    updateField("sex", event.target.value)
                  }
                  className={inputStyle}
                >
                  <option value="unknown">
                    Unknown
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
                <label
                  htmlFor="size"
                  className="mb-2 block font-semibold"
                >
                  Size
                </label>

                <select
                  id="size"
                  value={formData.size}
                  onChange={(event) =>
                    updateField("size", event.target.value)
                  }
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
                <label
                  htmlFor="estimatedBirthYear"
                  className="mb-2 block font-semibold"
                >
                  Estimated Birth Year
                </label>

                <input
                  id="estimatedBirthYear"
                  type="number"
                  value={formData.estimatedBirthYear}
                  onChange={(event) =>
                    updateField(
                      "estimatedBirthYear",
                      event.target.value,
                    )
                  }
                  min="1900"
                  max={new Date().getFullYear()}
                  placeholder="Unknown"
                  className={inputStyle}
                />
              </div>

              <label className="flex items-center gap-3 rounded-md border border-[#9bd8c9] p-3">
                <input
                  type="checkbox"
                  checked={formData.microchipped}
                  onChange={(event) =>
                    updateField(
                      "microchipped",
                      event.target.checked,
                    )
                  }
                />

                Microchipped
              </label>
            </div>

            <div className="mt-5">
              <label
                htmlFor="description"
                className="mb-2 block font-semibold"
              >
                Description
              </label>

              <textarea
                id="description"
                rows={5}
                value={formData.description}
                onChange={(event) =>
                  updateField(
                    "description",
                    event.target.value,
                  )
                }
                className={inputStyle}
              />
            </div>
          </section>

          {/* LAST SEEN */}
          <section className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-6">
            <h2 className="mb-5 text-2xl font-bold">
              Last Seen Information
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="lastSeenAt"
                  className="mb-2 block font-semibold"
                >
                  Last Seen Date and Time *
                </label>

                <input
                  id="lastSeenAt"
                  type="datetime-local"
                  value={formData.lastSeenAt}
                  onChange={(event) =>
                    updateField(
                      "lastSeenAt",
                      event.target.value,
                    )
                  }
                  required
                  className={inputStyle}
                />
              </div>

              <div>
                <label
                  htmlFor="locationDescription"
                  className="mb-2 block font-semibold"
                >
                  Location *
                </label>

                <input
                  id="locationDescription"
                  value={formData.locationDescription}
                  onChange={(event) =>
                    updateField(
                      "locationDescription",
                      event.target.value,
                    )
                  }
                  required
                  className={inputStyle}
                />
              </div>

              <div className="md:col-span-2">
                <LocationPicker />
              </div>

              <label className="flex items-center gap-3 rounded-md border border-[#9bd8c9] p-3 md:col-span-2">
                <input
                  type="checkbox"
                  checked={formData.timeIsApproximate}
                  onChange={(event) =>
                    updateField(
                      "timeIsApproximate",
                      event.target.checked,
                    )
                  }
                />

                Last-seen time is approximate
              </label>
            </div>

            <div className="mt-5">
              <label
                htmlFor="circumstances"
                className="mb-2 block font-semibold"
              >
                What Happened?
              </label>

              <textarea
                id="circumstances"
                rows={5}
                value={formData.circumstances}
                onChange={(event) =>
                  updateField(
                    "circumstances",
                    event.target.value,
                  )
                }
                className={inputStyle}
              />
            </div>
          </section>

          {/* REWARD */}
          <section className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-6">
            <h2 className="mb-5 text-2xl font-bold">
              Reward
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-md border border-[#9bd8c9] p-3">
                <input
                  type="checkbox"
                  checked={formData.rewardOffered}
                  onChange={(event) =>
                    updateField(
                      "rewardOffered",
                      event.target.checked,
                    )
                  }
                />

                Reward offered
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.rewardAmount}
                onChange={(event) =>
                  updateField(
                    "rewardAmount",
                    event.target.value,
                  )
                }
                disabled={!formData.rewardOffered}
                placeholder="Reward amount"
                className={`${inputStyle} disabled:cursor-not-allowed disabled:opacity-50`}
              />
            </div>
          </section>

          {/* PHOTOS */}
          <section className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-6">
            <h2 className="text-2xl font-bold">
              Photos
            </h2>

            <p className="mt-2 text-[#b7d5ce]">
              Photo editing can be connected when the report update
              backend is added.
            </p>

            <div className="mt-5 flex h-40 items-center justify-center rounded-xl border-2 border-dashed border-[#1b5b51] bg-[#003d35] text-6xl">
              🐕
            </div>
          </section>

          {/* ACTIONS */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href={`/dogs/${params.id}`}
              className="rounded-md border border-[#1b5b51] px-6 py-3 text-center font-bold transition hover:border-[#fbb12c] hover:text-[#fbb12c]"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="rounded-md bg-[#fbb12c] px-8 py-3 font-bold text-[#003d35] transition hover:bg-[#ffc34d]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
