export default function FoundAnimalReportPage() {
    return (
      <main className="min-h-screen bg-[#003d35] px-6 py-10 text-white">
        <div className="mx-auto max-w-4xl">
  
          {/* Header */}
          <h1 className="text-4xl font-bold">
            Report a Found Animal
          </h1>
  
          <p className="mt-2 text-[#b7d5ce]">
            Help reunite this pet with its family by sharing as much information as possible.
          </p>
  
          {/* Form Card */}
          <section className="mt-8 rounded-xl border border-[#1b5b51] bg-[#06483f] p-6">
  
            {/* Photo Upload */}
            <div className="rounded-lg border-2 border-dashed border-[#1b5b51] p-8 text-center">
              <p className="text-5xl">📷</p>
  
              <h2 className="mt-4 text-xl font-bold">
                Upload Photo
              </h2>
  
              <p className="mt-2 text-[#b7d5ce]">
                Add a clear photo of the animal you found.
              </p>
  
              <button className="mt-4 rounded-md bg-[#fbb12c] px-6 py-3 font-bold text-[#003d35]">
                Choose Photo
              </button>
            </div>
  
            {/* Animal Information */}
            <div className="mt-8 rounded-lg border border-[#1b5b51] p-5">
  
              <h2 className="text-2xl font-bold">
                Animal Information
              </h2>
  
              <div className="mt-6 grid gap-6 md:grid-cols-2">
  
                <div>
                  <label className="mb-2 block font-semibold">
                    Breed (if known)
                  </label>
  
                  <input
                    type="text"
                    placeholder="Golden Retriever"
                    className="w-full rounded-md bg-[#003d35] p-3 text-white outline-none"
                  />
                </div>
  
                <div>
                  <label className="mb-2 block font-semibold">
                    Color
                  </label>
  
                  <input
                    type="text"
                    placeholder="Golden"
                    className="w-full rounded-md bg-[#003d35] p-3 text-white outline-none"
                  />
                </div>
  
                <div>
                  <label className="mb-2 block font-semibold">
                    Approximate Size
                  </label>
  
                  <select className="w-full rounded-md bg-[#003d35] p-3 text-white outline-none">
                    <option>Small</option>
                    <option>Medium</option>
                    <option>Large</option>
                  </select>
                </div>
  
                <div>
                  <label className="mb-2 block font-semibold">
                    Collar?
                  </label>
  
                  <select className="w-full rounded-md bg-[#003d35] p-3 text-white outline-none">
                    <option>Yes</option>
                    <option>No</option>
                    <option>Unsure</option>
                  </select>
                </div>
  
              </div>
  
            </div>
  
            {/* Where Found */}
            <div className="mt-6 rounded-lg border border-[#1b5b51] p-5">
  
              <h2 className="text-2xl font-bold">
                Where Was the Animal Found?
              </h2>
  
              <div className="mt-6 grid gap-6 md:grid-cols-2">
  
                <div>
                  <label className="mb-2 block font-semibold">
                    Date Found
                  </label>
  
                  <input
                    type="date"
                    className="w-full rounded-md bg-[#003d35] p-3 text-white outline-none"
                  />
                </div>
  
                <div>
                  <label className="mb-2 block font-semibold">
                    City
                  </label>
  
                  <input
                    type="text"
                    placeholder="Fremont"
                    className="w-full rounded-md bg-[#003d35] p-3 text-white outline-none"
                  />
                </div>
  
                <div>
                  <label className="mb-2 block font-semibold">
                    ZIP Code
                  </label>
  
                  <input
                    type="text"
                    placeholder="94536"
                    className="w-full rounded-md bg-[#003d35] p-3 text-white outline-none"
                  />
                </div>
  
              </div>
  
            </div>
  
            {/* Description */}
            <div className="mt-6 rounded-lg border border-[#1b5b51] p-5">
  
              <h2 className="text-2xl font-bold">
                Additional Details
              </h2>
  
              <textarea
                rows={6}
                placeholder="Describe where you found the animal, whether it seemed injured, friendly, wearing tags, etc."
                className="mt-4 w-full rounded-md bg-[#003d35] p-4 text-white outline-none"
              />
  
            </div>
  
            {/* Submit */}
            <div className="mt-8 text-center">
  
              <button className="rounded-md bg-[#fbb12c] px-8 py-4 text-lg font-bold text-[#003d35]">
                Submit Found Animal Report
              </button>
  
            </div>
  
          </section>
  
        </div>
      </main>
    );
  }