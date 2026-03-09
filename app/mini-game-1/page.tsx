"use client";

import Link from "next/link";
import FishFeeding from "./FishFeeding";

export default function MiniGame1() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans dark:bg-black">
      <main className="card">
        <h1 className="text-3xl font-semibold text-center text-[var(--color-text-secondary)] dark:text-zinc-50"> Fish Feeding </h1>
        <p className="mt-2 text-center text-zinc-600 dark:text-zinc-400">
          Pick the best food for your fish to keep them healthy!
        </p>
        <div className="mt-6">
          <FishFeeding />
        </div>
        <nav className="mt-8 flex gap-4 items-center justify-center">
          <Link href="/" className="px-4 py-2 bg-[var(--forest-green)] text-white font-semibold rounded-2xl shadow-md hover:scale-105 hover:bg-[var(--salmon)] hover:text-black transition-transform">Home</Link>
          <Link href="/mini-game-5" className="px-4 py-2 bg-[var(--forest-green)] text-white font-semibold rounded-2xl shadow-md hover:scale-105 hover:bg-[var(--salmon)] hover:text-black transition-transform">Prev</Link>
          <Link href="/mini-game-2" className="px-4 py-2 bg-[var(--forest-green)] text-white font-semibold rounded-2xl shadow-md hover:scale-105 hover:bg-[var(--salmon)] hover:text-black transition-transform">Next</Link>
        </nav>
      </main>
    </div>
  );
}
