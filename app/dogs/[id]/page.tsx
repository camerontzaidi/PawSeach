import Link from "next/link";
export default function DogReportPage() {
    // Temporary fake data
    // Later we will replace this with Supabase data
    const dog = {
      name: "Max",
      breed: "Golden Retriever",
      description:
        "Friendly dog with a red collar. Last seen running near the neighborhood park.",
      lastSeenDate: "July 26, 2026",
      location: "Fremont, California",
      latitude: "37.5485",
      longitude: "-121.9886",
      status: "Missing",
    };
  
    return (
      <main className="min-h-screen bg-[#003d35] px-6 py-10 text-white">
        <div className="mx-auto max-w-4xl">
  
          {/* Header */}
          <h1 className="text-4xl font-bold">
            Missing Dog Report
          </h1>
  
          <p className="mt-2 text-[#b7d5ce]">
            Help bring this pet home.
          </p>
  
  
          {/* Main Report Card */}
          <section className="mt-8 rounded-xl border border-[#1b5b51] bg-[#06483f] p-6">
  
            {/* Photo Placeholder */}
            <div className="flex h-80 items-center justify-center rounded-lg bg-[#003d35] text-6xl">
              🐕
            </div>
  
  
            {/* Name + Status */}
            <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row">
  
              <div>
                <h2 className="text-3xl font-bold">
                  {dog.name}
                </h2>
  
                <p className="mt-1 text-[#b7d5ce]">
                  {dog.breed}
                </p>
              </div>
  
  
              <span className="h-fit rounded-full bg-[#fbb12c] px-4 py-2 font-bold text-[#003d35]">
                {dog.status}
              </span>
  
            </div>
  
  
            {/* Dog Information */}
            <div className="mt-8 rounded-lg border border-[#1b5b51] p-5">
  
              <h3 className="text-xl font-bold">
                Dog Information
              </h3>
  
              <p className="mt-4 text-[#c3ded8]">
                {dog.description}
              </p>
  
            </div>
  
  
            {/* Last Seen */}
            <div className="mt-6 rounded-lg border border-[#1b5b51] p-5">
  
              <h3 className="text-xl font-bold">
                Last Seen Information
              </h3>
  
              <div className="mt-4 space-y-3 text-[#c3ded8]">
  
                <p>
                  📅 Date: {dog.lastSeenDate}
                </p>
  
                <p>
                  📍 Location: {dog.location}
                </p>
  
                <p>
                  Coordinates:
                  <br />
                  {dog.latitude}, {dog.longitude}
                </p>
  
              </div>
  
            </div>
  
  
            {/* Circumstances */}
            <div className="mt-6 rounded-lg border border-[#1b5b51] p-5">
  
              <h3 className="text-xl font-bold">
                Circumstances
              </h3>
  
              <p className="mt-4 text-[#c3ded8]">
                Max went missing and was last seen nearby.
                Please contact the owner if found.
              </p>
  
            </div>
  
  
            {/* Share + Contact Owner Controls */}
            <div className="mt-6 rounded-lg border border-[#1b5b51] p-5">

              <h3 className="text-xl font-bold">
                Share This Report
              </h3>

              <p className="mt-3 text-[#c3ded8]">
                Help spread the word and increase the chance of
                bringing this pet home.
              </p>

              <button className="mt-4 rounded-md bg-[#fbb12c] px-6 py-3 font-bold text-[#003d35]">
                Copy Report Link
              </button>


              {/* Contact Owner */}
              <div className="mt-8 rounded-lg border border-[#1b5b51] bg-[#003d35] p-5">

                <h3 className="text-xl font-bold">
                  Think You Found This Dog?
                </h3>

                <p className="mt-3 text-[#c3ded8]">
                  If you believe you found this dog, you can send
                  a message request to the owner.
                </p>


                <ul className="mt-4 space-y-2 text-sm text-[#b7d5ce]">

                  <li>
                    ✓ You can only send one message request
                  </li>

                  <li>
                    ✓ Your contact information stays private
                  </li>

                  <li>
                    ✓ The owner must accept before chatting
                  </li>

                </ul>


                <Link
                  href="/dogs/test/contact"
                  className="mt-5 inline-block rounded-md bg-[#078c78] px-6 py-3 font-bold text-white"
                >
                  Contact Owner
                </Link>

              </div>

            </div>
  
          </section>
  
  
{/* Future States */}
{/*
  Future states after Supabase integration:

  - Loading report...
  - No dog report found.
  - Unable to load report.
*/}
  
        </div>
      </main>
    );
  }