export default function DogsPage() {
    return (
      <main className="min-h-screen bg-[#003d35] text-white px-6 py-16">
        <section className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold">
            Latest Missing Pet Reports
          </h1>
  
          <p className="mt-4 text-[#b7d5ce]">
            Enter your ZIP code to find missing pets near you.
          </p>
  
          <div className="mt-8 rounded-xl border border-[#1b5b51] bg-[#06483f] p-10">
            <p className="text-[#b7d5ce]">
              Search and pet reports will appear here.
            </p>
          </div>
        </section>
      </main>
    );
  }