import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="w-full border-b bg-white dark:bg-black dark:border-white/[.06]">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
            <Link href="/" className="text-xl font-semibold text-foreground dark:text-zinc-50">Home</Link>
            <nav className="flex items-center gap-3 text-sm">
              {Array.from({ length: 5 }).map((_, i) => {
                const n = i + 1;
                return (
                  <Link
                    key={n}
                    href={`/mini-game-${n}`}
                    className="rounded-md px-3 py-1 text-foreground hover:bg-black/[.04] dark:hover:bg-white/[.02]"
                  >
                    Mini-game {n}
                  </Link>
                );
              })}
            </nav>
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}
