export default function HowItWorksPage() {
    return (
      <main className="min-h-screen bg-[#003d35] text-white px-6 py-16">
        <section className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold text-center">
            How PawSearch Works
          </h1>
  
          <div className="mt-10 grid gap-6">
            <div className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-8">
              <h2 className="text-2xl font-bold">
                1. Report a Missing Pet
              </h2>
              <p className="mt-3 text-[#b7d5ce]">
                Create a report with photos, details about your pet, and the
                last known location.
              </p>
            </div>
  
            <div className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-8">
              <h2 className="text-2xl font-bold">
                2. Community Helps Search
              </h2>
              <p className="mt-3 text-[#b7d5ce]">
                Neighbors can view reports, share sightings, and help locate
                missing pets.
              </p>
            </div>
  
            <div className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-8">
              <h2 className="text-2xl font-bold">
                3. Reunite Pets With Families
              </h2>
              <p className="mt-3 text-[#b7d5ce]">
                Owners can update their posts when their pet is safely found.
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }