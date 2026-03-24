"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
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
          <button
            onClick={() => signOut()}
            className="ml-2 rounded-md px-3 py-1 text-sm font-semibold transition-colors"
            style={{ color: "var(--salmon)" }}
          >
            Sign Out
          </button>
        </nav>
      </div>
    </header>
  );
}
