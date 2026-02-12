import Link from "next/link";
import FlipCard from "./flipcard";
export default function MiniGame5() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-24 px-8 bg-white dark:bg-black">
        <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">Mini-game 5</h1>
        <p className="mt-4 max-w-2xl text-center text-lg text-zinc-600 dark:text-zinc-400">
          Placeholder for mini-game 5.
        </p>
        <FlipCard
            front={<span>How much money does typical farming make?</span>}
            back={<span>Will fill in with accurate data</span>}
          />

          <FlipCard
            front={<span>How much time does traditional farming take to produce lettuce?</span>}
            back={<span>Will fill in with accurate data</span>}
          />
        <nav className="mt-8 flex gap-4">
          <Link href="/" className="text-foreground">Home</Link>
          <Link href="/mini-game-4" className="text-foreground">Prev</Link>
          <Link href="/mini-game-1" className="text-foreground">Next</Link>
        </nav>
      </main>
    </div>
  );
}
