"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function checkUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(session?.user ?? null);
    }

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    const supabase = createClient();

    await supabase.auth.signOut({
      scope: "global",
    });

    setUser(null);

    window.location.href = "/login";
  }

  return (
    <header className="border-b border-[#1b5b51] bg-[#003d35]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">

        <a
          href="/"
          className="text-2xl font-bold tracking-tight"
        >
          🐾 PawSearch
        </a>

        <div className="relative">

          {user ? (
            <>
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center"
              >
                <img
                  src={
                    user.user_metadata?.avatar_url ||
                    user.user_metadata?.picture ||
                    "/default-avatar.png"
                  }
                  alt="Profile"
                  className="h-10 w-10 rounded-full border border-[#1b5b51] hover:border-[#fbb12c]"
                />
              </button>

              {open && (
                <div className="absolute right-0 mt-3 w-56 rounded-xl border border-[#1b5b51] bg-[#06483f] p-3 shadow-lg">

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

                  <button
                    className="mt-3 w-full rounded-md px-3 py-2 text-left transition hover:bg-[#1b5b51]"
                  >
                    Profile
                  </button>

                  <button
                    onClick={handleLogout}
                    className="mt-1 w-full rounded-md px-3 py-2 text-left text-red-300 transition hover:bg-[#1b5b51]"
                  >
                    Logout
                  </button>

                </div>
              )}
            </>
          ) : (
            <a
              href="/login"
              className="rounded-md border border-[#1b5b51] px-5 py-2 font-semibold transition hover:border-[#fbb12c] hover:text-[#fbb12c]"
            >
              Login
            </a>
          )}

        </div>

      </nav>
    </header>
  );
}
