export default function FoundDogReportPage() {

    const dog = {
      name: "Max",
      breed: "Golden Retriever",
      description:
        "Friendly dog found wearing a red collar. Found near the neighborhood park.",
      foundDate: "July 26, 2026",
      location: "Fremont, California",
      latitude: "37.5485",
      longitude: "-121.9886",
      status: "Found",
    };
  
  
    return (
      <main className="min-h-screen bg-[#003d35] px-6 py-10 text-white">
  
        <div className="mx-auto max-w-4xl">
  
  
          {/* Header */}
          <h1 className="text-4xl font-bold">
            Found Dog Report
          </h1>
  
          <p className="mt-2 text-[#b7d5ce]">
            Help reunite this pet with their family.
          </p>
  
  
  
          {/* Main Card */}
          <section className="mt-8 rounded-xl border border-[#1b5b51] bg-[#06483f] p-6">
  
  
            {/* Photo */}
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
  
  
              <span className="h-fit rounded-full bg-[#078c78] px-4 py-2 font-bold text-white">
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
  
  
  
  
            {/* Found Information */}
            <div className="mt-6 rounded-lg border border-[#1b5b51] p-5">
  
              <h3 className="text-xl font-bold">
                Found Information
              </h3>
  
  
              <div className="mt-4 space-y-3 text-[#c3ded8]">
  
                <p>
                  📅 Date Found: {dog.foundDate}
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
  
  
  
  
  
            {/* Contact Finder */}
            <div className="mt-6 rounded-lg border border-[#1b5b51] p-5">
  
  
              <h3 className="text-xl font-bold">
                Think This Is Your Dog?
              </h3>
  
  
              <p className="mt-3 text-[#c3ded8]">
                If you believe this animal belongs to you,
                send a message request to the person who
                found this dog.
              </p>
  
  
              <ul className="mt-4 space-y-2 text-sm text-[#b7d5ce]">
  
                <li>
                  ✓ You can only send one message request
                </li>
  
                <li>
                  ✓ Your contact information stays private
                </li>
  
                <li>
                  ✓ The finder must accept before chatting
                </li>
  
              </ul>
  
  
  
              <button className="mt-5 rounded-md bg-[#078c78] px-6 py-3 font-bold text-white">
                Contact Finder
              </button>
  
  
            </div>
  
  
          </section>
  
  
        </div>
  
      </main>
    );
  }