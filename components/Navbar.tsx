"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  createClient,
  hasSupabaseConfig,
} from "@/utils/supabase/client";
import UserAvatar from "@/components/UserAvatar";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const [authAvailable] = useState(() => hasSupabaseConfig());

  useEffect(() => {
    if (!authAvailable) return;

    const supabase = createClient();

    async function checkUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(session?.user ?? null);
    }

    void checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [authAvailable]);

  async function handleLogout() {
    const supabase = createClient();

    await supabase.auth.signOut({
      scope: "global",
    });

    setUser(null);
    setOpen(false);
    window.location.href = "/login";
  }

  const userName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.user_metadata?.display_name ||
    user?.email?.split("@")[0] ||
    "PawSearch User";

  const avatarUrl =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    null;

  return (
    <header className="border-b border-gray-500 bg-[#b5b5b5]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}

        <Link
          href="/"
          className="text-2xl font-bold tracking-tight text-black transition hover:text-gray-700"
        >
          🐾 PawSearch
        </Link>

        {/* Desktop Navigation */}

        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className="font-semibold text-black-800 transition hover:text-black"
          >
            Home
          </Link>

          <Link
            href="/dogs"
            className="font-semibold text-black-800 transition hover:text-black"
          >
            Missing Pets
          </Link>

          <Link
            href="/how-it-works"
            className="font-semibold text-black-800 transition hover:text-black"
          >
            How It Works
          </Link>

          {user && (
            <Link
              href="/messages"
              className="font-semibold text-black-800 transition hover:text-black"
            >
              Messages
            </Link>
          )}
        </div>

        {/* Account */}

        <div className="relative">
          {user ? (
            <>
              <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                className="flex items-center rounded-full"
                aria-label="Open profile menu"
                aria-expanded={open}
              >
                <UserAvatar
                  name={userName}
                  avatarUrl={avatarUrl}
                  className="h-10 w-10 border border-gray-400 transition hover:border-[#fbb12c]"
                  textClassName="text-sm"
                />
              </button>

              {open && (
                <div className="absolute right-0 z-50 mt-3 w-56 rounded-2xl border border-gray-300 bg-white p-3 shadow-lg">
                  <div className="border-b border-gray-200 px-2 pb-3">
                    <p className="font-semibold text-black">
                      {userName}
                    </p>

                    <p className="truncate text-sm text-gray-500">
                      {user.email}
                    </p>
                  </div>

                  <Link
                    href="/me"
                    onClick={() => setOpen(false)}
                    className="mt-3 block w-full rounded-xl px-3 py-2 text-left font-semibold text-black transition hover:bg-gray-100"
                  >
                    My Reports
                  </Link>

                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="mt-1 block w-full rounded-xl px-3 py-2 text-left text-gray-700 transition hover:bg-gray-100 hover:text-black"
                  >
                    My Information
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-1 w-full rounded-xl px-3 py-2 text-left text-red-600 transition hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : authAvailable ? (
            <Link
              href="/login"
              className="rounded-xl border border-gray-500 bg-white/40 px-5 py-2 font-semibold text-black transition hover:border-[#fbb12c] hover:bg-white"
            >
              Login
            </Link>
          ) : (
            <span className="text-sm text-gray-700">
              Login unavailable locally
            </span>
          )}
        </div>
      </nav>
    </header>
  );
}