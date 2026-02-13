"use client";

import Link from "next/link";
import BacteriaGame from "./BacteriaGame";

export default function MiniGame4() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-8 px-8 bg-white dark:bg-black">
        <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">Control Bacteria</h1>
        <p className="mt-2 text-center text-zinc-600 dark:text-zinc-400">
          Guide your bacteria through the tank to eat nutrients and keep the fish alive!
        </p>
        <div className="mt-6">
          <BacteriaGame />
        </div>
        <nav className="mt-8 flex gap-4">
          <Link href="/" className="text-foreground">Home</Link>
          <Link href="/mini-game-3" className="text-foreground">Prev</Link>
          <Link href="/mini-game-5" className="text-foreground">Next</Link>
        </nav>
      </main>
    </div>
  );
}
