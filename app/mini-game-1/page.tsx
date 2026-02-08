"use client";

import Link from "next/link";
import PhaserGame from "../../src/components/PhaserGame";

export default function MiniGame1() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-8 px-8 bg-white dark:bg-black">
        <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">Mini-game 1</h1>
        <div className="mt-6">
          <PhaserGame />
        </div>
        <nav className="mt-8 flex gap-4">
          <Link href="/" className="text-foreground">Home</Link>
          <Link href="/mini-game-5" className="text-foreground">Prev</Link>
          <Link href="/mini-game-2" className="text-foreground">Next</Link>
        </nav>
      </main>
    </div>
  );
}
