"use client";

import { useState } from "react";

export default function ReportPage() {
  const [errors, setErrors] = useState<string[]>([]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = new FormData(e.currentTarget);

    const newErrors: string[] = [];

    if (!form.get("name")) {
      newErrors.push("Dog name is required.");
    }

    if (!form.get("breed")) {
      newErrors.push("Breed is required.");
    }

    if (!form.get("location")) {
      newErrors.push("Last seen location is required.");
    }

    if (!form.get("date")) {
      newErrors.push("Last seen date is required.");
    }

    setErrors(newErrors);

    if (newErrors.length === 0) {
      alert("Report submitted successfully!");
      e.currentTarget.reset();
    }
  }

  const inputStyle =
    "rounded-md border border-[#9bd8c9] bg-[#003d35] p-3 text-white placeholder:text-[#b7d5ce] focus:border-[#fbb12c] focus:outline-none";

  return (
    <main className="min-h-screen bg-[#003d35] px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
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

          {/* Errors */}
          {errors.length > 0 && (
            <div className="rounded-lg border border-red-400 bg-red-900/30 p-4">
              <p className="font-bold">
                Please fix the following:
              </p>

              <ul className="mt-2 list-disc pl-5">
                {errors.map((error) => (
                  <li key={error}>
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}


          {/* Dog Information */}
          <section className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-6">

            <h2 className="mb-5 text-2xl font-bold">
              Dog Information
            </h2>

            <div className="grid gap-4 md:grid-cols-2">

              <input
                name="name"
                placeholder="Dog Name *"
                className={inputStyle}
              />

              <input
                name="breed"
                placeholder="Breed *"
                className={inputStyle}
              />

              <input
                name="primaryColor"
                placeholder="Primary Color"
                className={inputStyle}
              />

              <input
                name="age"
                placeholder="Age"
                className={inputStyle}
              />

            </div>


            <textarea
              name="description"
              placeholder="Description and distinctive features..."
              className={`${inputStyle} mt-4 h-32 w-full`}
            />

          </section>



          {/* Missing Information */}
          <section className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-6">

            <h2 className="mb-5 text-2xl font-bold">
              Last Seen Information
            </h2>


            <div className="grid gap-4 md:grid-cols-2">

              <input
                name="date"
                type="date"
                className={inputStyle}
              />


              <input
                name="location"
                placeholder="Last seen location *"
                className={inputStyle}
              />

            </div>


            <textarea
              name="circumstances"
              placeholder="What happened?"
              className={`${inputStyle} mt-4 h-28 w-full`}
            />

          </section>



          {/* Photo Upload */}
          <section className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-6">

            <h2 className="mb-5 text-2xl font-bold">
              Photos
            </h2>


            <input
              type="file"
              accept="image/*"
              multiple
              className="block w-full rounded-md border border-[#9bd8c9] bg-[#003d35] p-3 text-white"
            />

            <p className="mt-3 text-sm text-[#b7d5ce]">
              Upload clear photos of the missing pet.
            </p>

          </section>



          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-md bg-[#fbb12c] px-6 py-4 font-bold text-[#003d35] transition hover:bg-[#ffc34d]"
          >
            Submit Missing Dog Report
          </button>


        </form>

      </div>
    </main>
  );
}