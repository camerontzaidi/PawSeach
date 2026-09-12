export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-[#003d35] px-6 py-16 text-white">
      <section className="mx-auto max-w-4xl">
        <h1 className="text-center text-4xl font-bold">How PawSearch Works</h1>

        <div className="mt-10 grid gap-6">
          <div className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-8">
            <h2 className="text-2xl font-bold">1. Browse Missing Pets</h2>
            <p className="mt-3 text-[#b7d5ce]">
              Anyone can search public missing-pet reports, view details, and
              explore the community map without creating an account.
            </p>
          </div>

          <div className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-8">
            <h2 className="text-2xl font-bold">2. Sign In to Take Action</h2>
            <p className="mt-3 text-[#b7d5ce]">
              An account is required to publish a missing-pet report, manage a
              report, or contact a pet owner.
            </p>
          </div>

          <div className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-8">
            <h2 className="text-2xl font-bold">3. Send One Message Request</h2>
            <p className="mt-3 text-[#b7d5ce]">
              If you have information about a missing pet, you can send the
              owner one initial message request. You cannot send additional
              messages while the request is pending.
            </p>
          </div>

          <div className="rounded-xl border border-[#1b5b51] bg-[#06483f] p-8">
            <h2 className="text-2xl font-bold">4. Owner Accepts or Declines</h2>
            <p className="mt-3 text-[#b7d5ce]">
              If the owner accepts, both users can continue the conversation
              privately inside PawSearch. Declined requests remain closed.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
