import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#1b5b51] bg-[#002f29] text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/" className="font-bold tracking-tight">
            🐾 PawSearch
          </Link>
          <p className="mt-1 text-sm text-[#9bbab3]">
            Helping communities reunite missing pets with their families.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm" aria-label="Footer navigation">
          <Link href="/how-it-works" className="text-[#b7d5ce] transition hover:text-[#fbb12c]">
            How It Works
          </Link>
          <Link href="/terms" className="text-[#b7d5ce] transition hover:text-[#fbb12c]">
            Terms of Service
          </Link>
          <Link href="/privacy" className="text-[#b7d5ce] transition hover:text-[#fbb12c]">
            Privacy Policy
          </Link>
        </nav>
      </div>

      <div className="border-t border-[#1b5b51]">
        <p className="mx-auto max-w-6xl px-6 py-4 text-xs text-[#789b94]">
          © {new Date().getFullYear()} PawSearch. Community reports are user-submitted and should be independently verified.
        </p>
      </div>
    </footer>
  );
}
