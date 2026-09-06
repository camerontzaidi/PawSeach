"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setSuccess(false);

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            full_name: fullName,
            name: fullName,
          },
        },
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      if (data.session) {
        window.location.href = "/";
        return;
      }

      setSuccess(true);
      setMessage(
        "Account created. Check your email for a confirmation link before signing in."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#003d35] px-6 py-16 text-white">
      <div className="mx-auto max-w-md">
        <h1 className="text-center text-4xl font-bold">
          Create your PawSearch account
        </h1>

        <p className="mt-4 text-center text-[#b7d5ce]">
          Create an account to manage reports and keep your activity in one place.
        </p>

        <section className="mt-10 rounded-xl border border-[#1b5b51] bg-[#06483f] p-8">
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="first-name" className="mb-2 block text-sm font-semibold">
                  First name
                </label>
                <input
                  id="first-name"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  className="w-full rounded-md border border-[#1b5b51] bg-[#003d35] px-4 py-3 text-white outline-none transition placeholder:text-[#789b94] focus:border-[#fbb12c]"
                />
              </div>

              <div>
                <label htmlFor="last-name" className="mb-2 block text-sm font-semibold">
                  Last name
                </label>
                <input
                  id="last-name"
                  type="text"
                  autoComplete="family-name"
                  required
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  className="w-full rounded-md border border-[#1b5b51] bg-[#003d35] px-4 py-3 text-white outline-none transition placeholder:text-[#789b94] focus:border-[#fbb12c]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="signup-email" className="mb-2 block text-sm font-semibold">
                Email
              </label>
              <input
                id="signup-email"
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
              <label htmlFor="signup-password" className="mb-2 block text-sm font-semibold">
                Password
              </label>
              <input
                id="signup-password"
                type="password"
                autoComplete="new-password"
                minLength={6}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-md border border-[#1b5b51] bg-[#003d35] px-4 py-3 text-white outline-none transition placeholder:text-[#789b94] focus:border-[#fbb12c]"
                placeholder="At least 6 characters"
              />
            </div>

            <div>
              <label htmlFor="confirm-password" className="mb-2 block text-sm font-semibold">
                Confirm password
              </label>
              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                minLength={6}
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full rounded-md border border-[#1b5b51] bg-[#003d35] px-4 py-3 text-white outline-none transition placeholder:text-[#789b94] focus:border-[#fbb12c]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-[#fbb12c] px-6 py-3 font-bold text-[#003d35] transition hover:bg-[#ffc34d] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {message && (
            <p
              role="status"
              className={`mt-4 rounded-md border px-4 py-3 text-sm ${
                success
                  ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-100"
                  : "border-red-400/40 bg-red-500/10 text-red-200"
              }`}
            >
              {message}
            </p>
          )}

          <p className="mt-5 text-center text-xs leading-relaxed text-[#b7d5ce]">
            By creating an account, you agree to PawSearch&apos;s{" "}
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

          <p className="mt-6 text-center text-sm text-[#b7d5ce]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-[#fbb12c] hover:text-[#ffc34d]"
            >
              Sign in
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
