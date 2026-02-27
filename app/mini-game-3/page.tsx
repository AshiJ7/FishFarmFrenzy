"use client";

import Link from "next/link";
import SaveFishFarmGame from "./savefishfarm";

export default function MiniGame3() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-8 px-8 rounded-2xl shadow-lg"
            style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}>
        {/* Cute Header */}
        <div className="flex flex-col items-center gap-2">
          {/* Emoji banner with bounce */}
          <div className="text-5xl animate-bounce" style={{ color: "var(--teal-medium)" }}>🐟🌿✨</div>

          {/* Gradient title using palette */}
          <h1 className="text-4xl font-extrabold text-center bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(to right, var(--mint-light), var(--periwinkle))" }}>
            Save Your Fish Farm
          </h1>

          <p className="mt-1 text-center" style={{ color: "var(--color-text-secondary)" }}>
            Make the right decisions to keep your aquaponics farm healthy!
          </p>
        </div>

        {/* Game Component */}
        <div className="mt-6 w-full">
          <SaveFishFarmGame />
        </div>

        {/* Navigation */}
        <nav className="mt-8 flex gap-4">
          <Link href="/" style={{ color: "var(--teal-medium)" }}
                className="hover:underline transition-all">Home</Link>
          <Link href="/mini-game-2" style={{ color: "var(--teal-medium)" }}
                className="hover:underline transition-all">Prev</Link>
          <Link href="/mini-game-4" style={{ color: "var(--teal-medium)" }}
                className="hover:underline transition-all">Next</Link>
        </nav>

        <style>{`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .animate-bounce {
            animation: bounce 2s infinite;
          }
        `}</style>
      </main>
    </div>
  );
}