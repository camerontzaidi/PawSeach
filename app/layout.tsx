import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PawSearch",
  description:
    "Community-powered platform to help reunite missing pets with their families.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >

      <body className="min-h-full flex flex-col bg-[#003d35] text-white">


        {/* Navigation */}
        <header className="border-b border-[#1b5b51] bg-[#003d35]">

          <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">


            {/* Logo */}
            <a
              href="/"
              className="text-2xl font-bold tracking-tight"
            >
              🐾 PawSearch
            </a>



            {/* Links */}
            <div className="hidden items-center gap-6 md:flex">


              <a
                href="/"
                className="text-[#c3ded8] transition hover:text-[#fbb12c]"
              >
                Home
              </a>


              <a
                href="/dogs"
                className="text-[#c3ded8] transition hover:text-[#fbb12c]"
              >
                Missing Pets
              </a>


              <a
                href="/sightings"
                className="text-[#c3ded8] transition hover:text-[#fbb12c]"
              >
                Found Animals
              </a>


              <a
                href="/report"
                className="text-[#c3ded8] transition hover:text-[#fbb12c]"
              >
                Report Missing
              </a>


              <a
                href="/sightings/report"
                className="text-[#c3ded8] transition hover:text-[#fbb12c]"
              >
                Report Found
              </a>


            </div>



            {/* Login */}
            <a
              href="/login"
              className="rounded-md border border-[#1b5b51] px-5 py-2 font-semibold transition hover:border-[#fbb12c] hover:text-[#fbb12c]"
            >
              Login
            </a>


          </nav>

        </header>



        {children}


      </body>

    </html>
  );
}