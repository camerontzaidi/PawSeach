"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleLogin = async () => {
    setMessage(null);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage(error.message);
    }
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

      window.location.href = "/";
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-md bg-white px-6 py-3 font-bold text-[#003d35] transition hover:scale-[1.02]"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>

            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#1b5b51]" />
            <span className="text-sm text-[#b7d5ce]">OR</span>
            <div className="h-px flex-1 bg-[#1b5b51]" />
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-md border border-[#1b5b51] bg-[#003d35] px-4 py-3 text-white outline-none transition placeholder:text-[#789b94] focus:border-[#fbb12c]"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-md border border-[#1b5b51] bg-[#003d35] px-4 py-3 text-white outline-none transition placeholder:text-[#789b94] focus:border-[#fbb12c]"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-[#fbb12c] px-6 py-3 font-bold text-[#003d35] transition hover:bg-[#ffc34d] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {message && (
            <p
              role="alert"
              className="mt-4 rounded-md border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200"
            >
              {message}
            </p>
          )}

          <p className="mt-6 text-center text-sm text-[#b7d5ce]">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-bold text-[#fbb12c] hover:text-[#ffc34d]"
            >
              Create account
            </Link>
          </p>

          <p className="mt-5 text-center text-xs leading-relaxed text-[#b7d5ce]">
            By continuing, you agree to PawSearch&apos;s{" "}
            <Link
              href="/terms"
              className="font-semibold text-[#fbb12c] hover:text-[#ffc34d]"
            >
              Terms of Service
            </Link>{" "}
            and acknowledge the{" "}
            <Link
              href="/privacy"
              className="font-semibold text-[#fbb12c] hover:text-[#ffc34d]"
            >
              Privacy Policy
            </Link>
            .
          </p>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#1b5b51]" />
            <span className="text-sm text-[#b7d5ce]">OR</span>
            <div className="h-px flex-1 bg-[#1b5b51]" />
          </div>

          <Link
            href="/"
            className="block w-full rounded-md border border-[#1b5b51] px-6 py-3 text-center font-bold text-white transition hover:border-[#fbb12c] hover:text-[#fbb12c]"
          >
            Continue as Guest
          </Link>
        </section>

        <p className="mt-6 text-center text-sm text-[#b7d5ce]">
          You can still report a found or missing pet without creating an account.
        </p>
      </div>
    </main>
  );
}
