"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/utils/supabase/client";

function getSafeNext() {
  if (typeof window === "undefined") return "/";

  const value = new URLSearchParams(window.location.search).get("next");

  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

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
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
          next,
        )}`,
      },
    });

    if (error) {
      setMessage(error.message);
    }
  };

  const handleEmailLogin = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
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
    <main className="min-h-screen bg-gradient-to-r from-white via-[#e4e4e4] to-[#b5b5b5] px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-md">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            PawSearch
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-black">
            Welcome back
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-600">
            Sign in to manage your reports, message pet owners, and keep your
            PawSearch activity in one place.
          </p>
        </div>

        <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          {/* GOOGLE */}

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-6 py-3 font-bold text-black transition hover:border-[#fbb12c] hover:bg-gray-50"
          >
            Continue with Google
          </button>

          {/* DIVIDER */}

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-200" />

            <span className="text-xs font-semibold text-gray-400">
              OR
            </span>

            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* EMAIL LOGIN */}

          <form onSubmit={handleEmailLogin} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-black"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black outline-none transition placeholder:text-gray-400 focus:border-[#fbb12c] focus:ring-2 focus:ring-[#fbb12c]/20"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-black"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black outline-none transition placeholder:text-gray-400 focus:border-[#fbb12c] focus:ring-2 focus:ring-[#fbb12c]/20"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-[#fbb12c] px-6 py-3 font-bold text-black transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* ERROR */}

          {message && (
            <p
              role="alert"
              className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {message}
            </p>
          )}

          {/* SIGN UP */}

          <div className="mt-6 border-t border-gray-200 pt-6 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-bold text-black underline underline-offset-2 hover:text-gray-600"
              >
                Create account
              </Link>
            </p>
          </div>

          {/* TERMS */}

          <p className="mt-5 text-center text-xs leading-5 text-gray-500">
            By continuing, you agree to PawSearch&apos;s{" "}
            <Link
              href="/terms"
              className="font-semibold text-black underline underline-offset-2 hover:text-gray-600"
            >
              Terms of Service
            </Link>{" "}
            and acknowledge the{" "}
            <Link
              href="/privacy"
              className="font-semibold text-black underline underline-offset-2 hover:text-gray-600"
            >
              Privacy Policy
            </Link>
            .
          </p>

          {/* GUEST */}

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-200" />

            <span className="text-xs font-semibold text-gray-400">
              OR
            </span>

            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <Link
            href="/"
            className="block w-full rounded-xl border border-gray-300 px-6 py-3 text-center font-bold text-black transition hover:border-[#fbb12c] hover:bg-gray-50"
          >
            Continue Browsing as Guest
          </Link>
        </section>

        <p className="mt-6 text-center text-xs leading-5 text-gray-500">
          Guest access is read-only. An account is required for actions that
          create, change, or message through PawSearch.
        </p>
      </div>
    </main>
  );
}