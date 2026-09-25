"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const dogImages = [
  "/dogs/dog1.jpg",
  "/dogs/dog2.jpg",
  "/dogs/dog3.jpg",
  "/dogs/dog4.jpg",
];

export default function HomePage() {
  const [currentImage, setCurrentImage] = useState(0);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % dogImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const supabase = createClient();

    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setIsSignedIn(!!session);
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsSignedIn(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <main className="bg-white text-black">

      {/* HERO */}
      <section className="relative min-h-[720px] overflow-hidden">
        {dogImages.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              index === currentImage ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}

        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/60 to-transparent" />

        <div className="relative z-10 flex min-h-[720px] items-center">
          <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
            <div className="max-w-2xl">
              <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-black">
                Community-powered pet search
              </p>

              <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-black sm:text-6xl lg:text-7xl">
                Every missing pet deserves to find their way home.
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-8 text-gray-800 sm:text-xl">
                PawSearch helps pet owners, neighbors, and communities work
                together to find missing pets and share important information.
              </p>

              {!isSignedIn && (
                <div className="mt-9">
                  <Link
                    href="/login"
                    className="inline-flex items-center rounded-full bg-black px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {dogImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              aria-label={`Show dog photo ${index + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                index === currentImage
                  ? "w-10 bg-black"
                  : "w-5 bg-black/40"
              }`}
            />
          ))}
        </div>
      </section>

      {/* 1. GET INVOLVED */}
      <section className="bg-gradient-to-r from-white via-[#e4e4e4] to-[#b5b5b5] px-6 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 max-w-2xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-black">
              1. Get Involved
            </p>

            <h2 className="text-4xl font-bold tracking-tight text-black sm:text-5xl">
              Start where you can help.
            </h2>

            <p className="mt-5 text-lg leading-8 text-black">
              Whether your pet is missing, you found one, or you simply want
              to help, there is a way to get involved.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">

            {/* 01 */}
            <Link
              href="/report"
              className="group rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                01
              </div>

              <h3 className="text-2xl font-bold text-black">
                Report a Missing Pet
              </h3>

              <p className="mt-4 leading-7 text-gray-600">
                Create a report with important details to help your community
                recognize and locate your pet.
              </p>

              <span className="mt-7 inline-block text-sm font-bold text-black group-hover:underline">
                Create a report →
              </span>
            </Link>

            {/* 02 */}
            <Link
              href="/sightings/report"
              className="group rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                02
              </div>

              <h3 className="text-2xl font-bold text-black">
                Report a Found Pet
              </h3>

              <p className="mt-4 leading-7 text-gray-600">
                Found a pet that may be lost? Share the information so their
                owner has a better chance of finding them.
              </p>

              <span className="mt-7 inline-block text-sm font-bold text-black group-hover:underline">
                Report a found pet →
              </span>
            </Link>

            {/* 03 */}
            <Link
              href="/dogs"
              className="group rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                03
              </div>

              <h3 className="text-2xl font-bold text-black">
                Search Missing Pets
              </h3>

              <p className="mt-4 leading-7 text-gray-600">
                Browse nearby reports and keep an eye out for pets that may
                need your help.
              </p>

              <span className="mt-7 inline-block text-sm font-bold text-black group-hover:underline">
                Browse reports →
              </span>
            </Link>

          </div>
        </div>
      </section>

      {/* 2. HOW PAWSEARCH WORKS */}
      <section className="bg-white px-6 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">

          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-black">
              2. How PawSearch Works
            </p>

            <h2 className="text-4xl font-bold tracking-tight text-black sm:text-5xl">
              Helping people take action when it matters.
            </h2>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              PawSearch makes it easier to share information, discover nearby
              reports, and connect missing pets with the people looking for
              them.
            </p>

            <Link
              href="/how-it-works"
              className="mt-7 inline-flex font-semibold text-black underline underline-offset-4"
            >
              Learn how it works →
            </Link>
          </div>

          <div className="mt-16 grid gap-10 border-t border-gray-200 pt-10 md:grid-cols-3">

            <div>
              <span className="text-sm font-bold text-black">01</span>

              <h3 className="mt-3 text-xl font-bold text-black">
                Owners share a report
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Important details about a missing pet are shared with the
                community.
              </p>
            </div>

            <div>
              <span className="text-sm font-bold text-black">02</span>

              <h3 className="mt-3 text-xl font-bold text-black">
                The community searches
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Neighbors can browse reports and keep an eye out for pets in
                their area.
              </p>
            </div>

            <div>
              <span className="text-sm font-bold text-black">03</span>

              <h3 className="mt-3 text-xl font-bold text-black">
                Information reaches owners
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Sightings and useful information can help owners move closer
                to bringing their pets home.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 3. HOW WE'RE DIFFERENT */}
      <section className="bg-gradient-to-r from-white via-[#e4e4e4] to-[#b5b5b5] px-6 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">

          <div className="grid items-center gap-14 lg:grid-cols-2">

            {/* TEXT */}
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-black">
                3. How We&apos;re Different
              </p>

              <h2 className="text-4xl font-bold tracking-tight text-black sm:text-5xl">
                More than a missing pet report.
              </h2>

              <p className="mt-5 max-w-xl text-lg leading-8 text-gray-700">
                PawSearch combines location-based search with intelligent
                recommendations to help communities focus their efforts where
                they matter most.
              </p>

              <div className="mt-10 space-y-8">

                {/* MAP FEATURE */}
                <div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                      01
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-black">
                        Find missing pets near you
                      </h3>

                      <p className="mt-2 leading-7 text-gray-600">
                        Explore missing-pet reports on an interactive map and
                        save your location to quickly see reports in your area.
                      </p>
                    </div>
                  </div>
                </div>

                {/* AI FEATURE */}
                <div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                      02
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-black">
                        AI-powered search suggestions
                      </h3>

                      <p className="mt-2 leading-7 text-gray-600">
                        PawSearch uses a dog&apos;s location and other details to
                        suggest areas where the dog may be more likely to be
                        found.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* MAP IMAGE */}
            <div className="relative">
              <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">
                <img
                  src="/Map/Map.jpg"
                  alt="PawSearch map showing missing pet reports"
                  className="h-auto w-full object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. ABOUT THE TEAM */}
      <section className="relative min-h-[650px] overflow-hidden">

        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/team/team.jpg')" }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/65 to-transparent" />

        <div className="relative z-10 flex min-h-[650px] items-center">
          <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:px-8 lg:px-12">

            <div className="max-w-xl">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-black">
                4. About the Team
              </p>

              <h2 className="text-4xl font-bold tracking-tight text-black sm:text-5xl">
                Built by people who care about bringing pets home.
              </h2>

              <p className="mt-6 text-lg leading-8 text-gray-800">
                PawSearch was created by a team of students who wanted to make
                the process of finding missing pets more connected,
                accessible, and community-driven.
              </p>
            </div>

          </div>
        </div>

      </section>
    </main>
  );
}