"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/utils/supabase/client";

function getSafeNext() {
  if (typeof window === "undefined") return "/";
  const value = new URLSearchParams(window.location.search).get("next");
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleLogin = async () => {
    setMessage(null);
    const supabase = createClient();
    const next = getSafeNext();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });

    if (error) setMessage(error.message);
  };

  const handleEmailLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      window.location.href = getSafeNext();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#003d35] px-6 py-16 text-white">
      <div className="mx-auto max-w-md">
        <h1 className="text-center text-4xl font-bold">Welcome to PawSearch</h1>

        <p className="mt-4 text-center text-[#b7d5ce]">
          Browse without an account. Sign in to report a missing pet, manage
          reports, or message a pet owner.
        </p>

        <section className="mt-10 rounded-xl border border-[#1b5b51] bg-[#06483f] p-8">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-md bg-white px-6 py-3 font-bold text-[#003d35] transition hover:scale-[1.02]"
          >
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#1b5b51]" />
            <span className="text-sm text-[#b7d5ce]">OR</span>
            <div className="h-px flex-1 bg-[#1b5b51]" />
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-md border border-[#1b5b51] bg-[#003d35] px-4 py-3 text-white outline-none focus:border-[#fbb12c]"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-md border border-[#1b5b51] bg-[#003d35] px-4 py-3 text-white outline-none focus:border-[#fbb12c]"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-[#fbb12c] px-6 py-3 font-bold text-[#003d35] disabled:opacity-60"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {message && (
            <p role="alert" className="mt-4 rounded-md border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {message}
            </p>
          )}

          <p className="mt-6 text-center text-sm text-[#b7d5ce]">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-bold text-[#fbb12c]">Create account</Link>
          </p>

          <p className="mt-5 text-center text-xs leading-relaxed text-[#b7d5ce]">
            By continuing, you agree to PawSearch&apos;s{" "}
            <Link href="/terms" className="font-semibold text-[#fbb12c]">Terms of Service</Link>{" "}
            and acknowledge the{" "}
            <Link href="/privacy" className="font-semibold text-[#fbb12c]">Privacy Policy</Link>.
          </p>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#1b5b51]" />
            <span className="text-sm text-[#b7d5ce]">OR</span>
            <div className="h-px flex-1 bg-[#1b5b51]" />
          </div>

          <Link
            href="/"
            className="block w-full rounded-md border border-[#1b5b51] px-6 py-3 text-center font-bold text-white"
          >
            Continue Browsing as Guest
          </Link>
        </section>

        <p className="mt-6 text-center text-sm text-[#b7d5ce]">
          Guest access is read-only. An account is required for actions that
          create, change, or message through PawSearch.
        </p>
      </div>
    </main>
  );
}
