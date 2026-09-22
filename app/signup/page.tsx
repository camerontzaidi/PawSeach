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
    <main className="min-h-screen bg-gradient-to-r from-white via-[#e4e4e4] to-[#b5b5b5] px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-md">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            PawSearch
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-black">
            Create your account
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-600">
            Create an account to manage your reports and keep your activity in
            one place.
          </p>
        </div>

        <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSignup} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="first-name"
                  className="mb-2 block text-sm font-semibold text-black"
                >
                  First name
                </label>

                <input
                  id="first-name"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <div>
                <label
                  htmlFor="last-name"
                  className="mb-2 block text-sm font-semibold text-black"
                >
                  Last name
                </label>

                <input
                  id="last-name"
                  type="text"
                  autoComplete="family-name"
                  required
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-gray-200"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="signup-email"
                className="mb-2 block text-sm font-semibold text-black"
              >
                Email
              </label>

              <input
                id="signup-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-gray-200"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="signup-password"
                className="mb-2 block text-sm font-semibold text-black"
              >
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
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-gray-200"
                placeholder="At least 6 characters"
              />
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="mb-2 block text-sm font-semibold text-black"
              >
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
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-gray-200"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-[#fbb12c] px-6 py-3 font-bold text-black transition hover:bg-[#ffc34d] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {message && (
            <p
              role="status"
              className={`mt-5 rounded-xl border px-4 py-3 text-sm ${
                success
                  ? "border-gray-300 bg-gray-50 text-gray-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {message}
            </p>
          )}

          <p className="mt-6 text-center text-xs leading-5 text-gray-500">
            By creating an account, you agree to PawSearch&apos;s{" "}
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

          <div className="mt-6 border-t border-gray-200 pt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-black underline underline-offset-2 hover:text-gray-600"
              >
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}