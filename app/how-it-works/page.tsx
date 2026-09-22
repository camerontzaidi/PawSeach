export default function HowItWorksPage() {
  const steps = [
    {
      number: "01",
      title: "Browse Missing Pets",
      description:
        "Anyone can search public missing-pet reports, view details, and explore the community map without creating an account.",
    },
    {
      number: "02",
      title: "Sign In to Take Action",
      description:
        "An account is required to publish a missing-pet report, manage a report, or contact a pet owner.",
    },
    {
      number: "03",
      title: "Send One Message Request",
      description:
        "If you have information about a missing pet, you can send the owner one initial message request. You cannot send additional messages while the request is pending.",
    },
    {
      number: "04",
      title: "Owner Accepts or Declines",
      description:
        "If the owner accepts, both users can continue the conversation privately inside PawSearch. Declined requests remain closed.",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-r from-white via-[#e4e4e4] to-[#b5b5b5] px-6 py-12 sm:py-16">
      <section className="mx-auto max-w-4xl">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            PawSearch
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-black sm:text-5xl">
            How PawSearch Works
          </h1>

          <p className="mt-3 max-w-2xl text-lg leading-7 text-gray-600">
            A simple way to search for missing pets, share reports, and
            connect with people who may be able to help.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {steps.map((step) => (
            <section
              key={step.number}
              className="rounded-3xl bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                  {step.number}
                </div>

                <div>
                  <h2 className="text-xl font-bold text-black sm:text-2xl">
                    {step.title}
                  </h2>

                  <p className="mt-2 text-[15px] leading-7 text-gray-600">
                    {step.description}
                  </p>
                </div>
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}