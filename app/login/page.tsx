export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#003d35] px-6 py-16 text-white">

      <div className="mx-auto max-w-md">

        <h1 className="text-center text-4xl font-bold">
          Welcome to PawSearch
        </h1>


        <p className="mt-4 text-center text-[#b7d5ce]">
          Sign in to manage your reports and communicate with other users.
        </p>



        <section className="mt-10 rounded-xl border border-[#1b5b51] bg-[#06483f] p-8">


          {/* Google Login */}
          <a
            href="/login/google"
            className="block w-full rounded-md bg-white px-6 py-3 text-center font-bold text-[#003d35] transition hover:scale-[1.02]"
          >
            Continue with Google
          </a>



          {/* Divider */}
          <div className="my-6 flex items-center gap-4">

            <div className="h-px flex-1 bg-[#1b5b51]" />

            <span className="text-sm text-[#b7d5ce]">
              OR
            </span>

            <div className="h-px flex-1 bg-[#1b5b51]" />

          </div>




          {/* Guest */}
          <a
            href="/"
            className="block w-full rounded-md border border-[#1b5b51] px-6 py-3 text-center font-bold text-white transition hover:border-[#fbb12c] hover:text-[#fbb12c]"
          >
            Continue as Guest
          </a>


        </section>



        <p className="mt-6 text-center text-sm text-[#b7d5ce]">
          You can still report a found or missing pet without creating an account.
        </p>


      </div>


    </main>
  );
}