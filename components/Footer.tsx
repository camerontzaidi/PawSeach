import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-500 bg-[#b5b5b5] text-black">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/"
            className="font-bold tracking-tight text-black transition hover:text-gray-700"
          >
            🐾 PawSearch
          </Link>

          <p className="mt-1 text-sm text-black">
            Helping communities reunite missing pets with their families.
          </p>
        </div>

        <nav
          className="flex flex-wrap gap-x-5 gap-y-2 text-sm"
          aria-label="Footer navigation"
        >
          <Link
            href="/how-it-works"
            className="font-semibold text-black transition hover:text-gray-700"
          >
            How It Works
          </Link>

          <Link
            href="/terms"
            className="font-semibold text-black transition hover:text-gray-700"
          >
            Terms of Service
          </Link>

          <Link
            href="/privacy"
            className="font-semibold text-black transition hover:text-gray-700"
          >
            Privacy Policy
          </Link>
        </nav>
      </div>

      <div className="border-t border-gray-500">
        <p className="mx-auto max-w-6xl px-6 py-4 text-xs text-black">
          © {new Date().getFullYear()} PawSearch. Community reports are
          user-submitted and should be independently verified.
        </p>
      </div>
    </footer>
  );
}