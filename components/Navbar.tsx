"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  createClient,
  hasSupabaseConfig,
} from "@/utils/supabase/client";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const [authAvailable] = useState(() => hasSupabaseConfig());

  useEffect(() => {
    if (!authAvailable) {
      return;
    }

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

    return () => {
      subscription.unsubscribe();
    };
  }, [authAvailable]);

  async function handleLogout() {
    try {
      const supabase = createClient();

      await supabase.auth.signOut({
        scope: "global",
      });

      setUser(null);
      setOpen(false);

      window.location.href = "/login";
    } catch (error) {
      console.error("Could not sign out:", error);
    }
  }

  return (
    <header className="border-b border-[#1b5b51] bg-[#003d35]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 text-white">

        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight"
        >
          🐾 PawSearch
        </Link>

        {/* Main Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className="font-semibold transition hover:text-[#fbb12c]"
          >
            Home
          </Link>

          <Link
            href="/dogs"
            className="font-semibold transition hover:text-[#fbb12c]"
          >
            Missing Pets
          </Link>

          <Link
            href="/sightings"
            className="font-semibold transition hover:text-[#fbb12c]"
          >
            Found Animals
          </Link>

          <Link
            href="/how-it-works"
            className="font-semibold transition hover:text-[#fbb12c]"
          >
            How It Works
          </Link>
        </div>

        {/* Login / Profile */}
        <div className="relative">
          {user ? (
            <>
              {/* Profile Button */}
              <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                className="flex items-center"
                aria-label="Open profile menu"
                aria-expanded={open}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    user.user_metadata?.avatar_url ||
                    user.user_metadata?.picture ||
                    "/default-avatar.png"
                  }
                  alt="Profile"
                  className="h-10 w-10 rounded-full border border-[#1b5b51] transition hover:border-[#fbb12c]"
                />
              </button>

              {/* Dropdown */}
              {open && (
                <div className="absolute right-0 z-50 mt-3 w-56 rounded-xl border border-[#1b5b51] bg-[#06483f] p-3 shadow-lg">

                  {/* User Information */}
                  <div className="border-b border-[#1b5b51] pb-3">
                    <p className="font-semibold">
                      {user.user_metadata?.full_name ||
                        user.user_metadata?.name ||
                        "PawSearch User"}
                    </p>

                    <p className="truncate text-sm text-[#b7d5ce]">
                      {user.email}
                    </p>
                  </div>

                  {/* Me */}
                  <Link
                    href="/me"
                    onClick={() => setOpen(false)}
                    className="mt-3 block w-full rounded-md px-3 py-2 text-left font-semibold transition hover:bg-[#1b5b51] hover:text-[#fbb12c]"
                  >
                    Me
                  </Link>

                  {/* Profile */}
                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="mt-1 block w-full rounded-md px-3 py-2 text-left transition hover:bg-[#1b5b51]"
                  >
                    Profile
                  </Link>

                  {/* Logout */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-1 w-full rounded-md px-3 py-2 text-left text-red-300 transition hover:bg-[#1b5b51]"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : authAvailable ? (
            <Link
              href="/login"
              className="rounded-md border border-[#1b5b51] px-5 py-2 font-semibold transition hover:border-[#fbb12c] hover:text-[#fbb12c]"
            >
              Login
            </Link>
          ) : (
            <span className="text-sm text-[#b7d5ce]">
              Login unavailable locally
            </span>
          )}
        </div>
      </nav>
    </header>
  );
}