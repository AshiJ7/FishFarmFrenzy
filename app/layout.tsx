import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Nunito } from "next/font/google";
import Link from "next/link";
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
  title: "Fish Farm Frenzy",
  description: "Manage your aquaculture projects",
};

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${nunito.variable} antialiased`}
      >
        <header className="w-full border-b bg-white dark:bg-black dark:border-white/[.06]">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
            <Link href="/" className="text-xl font-semibold text-foreground dark:text-zinc-50">Home</Link>
            <nav className="flex items-center gap-3 text-sm">
              {[
                { n: 1, label: "Feeding Frenzy" },
                { n: 2, label: "Cycle Explorer" },
                { n: 3, label: "Save Your Fish Farm" },
                { n: 4, label: "Bacteria Battle" },
                { n: 5, label: "Perfect Pairs" },
              ].map(({ n, label }) => (
                <Link
                  key={n}
                  href={`/mini-game-${n}`}
                  className="rounded-md px-3 py-1 text-foreground hover:bg-black/[.04] dark:hover:bg-white/[.02]"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}
