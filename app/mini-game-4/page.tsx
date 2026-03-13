"use client";

import Link from "next/link";
import BacteriaGame from "./BacteriaGame";
import { useMemo } from "react";

const BubbleBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    {[...Array(18)].map((_, i) => {
      const size = 12 + Math.random() * 24;
      return (
        <div
          key={i}
          className="absolute rounded-full opacity-40"
          style={{
            bottom: "-60px",
            left: `${Math.random() * 100}%`,
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: "var(--periwinkle)",
            animation: `floatUp ${8 + Math.random() * 8}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      );
    })}
    <style>{`
      @keyframes floatUp {
        0% { transform: translateY(0) scale(1); opacity: 0.4; }
        100% { transform: translateY(-120vh) scale(1.3); opacity: 0; }
      }
    `}</style>
  </div>
);

const OtterMascot = ({ message }: { message: string }) => (
  <div className="flex items-start gap-4 bg-white p-4 rounded-2xl shadow-md mb-6 w-full">
    <div className="text-5xl">🦦</div>
    <div className="bg-[var(--mint-light)] p-3 rounded-xl text-gray-700 text-sm">
      {message}
    </div>
  </div>
);

export default function MiniGame4() {
  const bubbleBackground = useMemo(() => <BubbleBackground />, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FDF6EC] to-[#D6F4FF] p-8">
      {bubbleBackground}

      <main className="relative z-10 flex w-full max-w-3xl flex-col items-center py-8 px-8 bg-gradient-to-b from-[#FFF9F2] to-[#E8F8F5] rounded-3xl shadow-2xl border-4 border-white">
        <OtterMascot message="Switch between Nitrosomonas and Nitrobacter to complete the nitrogen cycle! Ammonia → Nitrite → Nitrate → Plant growth! 🦠🌿" />

        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
          Bacteria Battle
        </h1>
        <p className="mb-6 text-center text-[var(--color-text-secondary)]">
          Control two types of bacteria to convert ammonia into plant food. Switch with Space or the on-screen button!
        </p>

        <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
          <BacteriaGame />
        </div>

        <nav className="mt-8 flex gap-4">
          <Link
            href="/"
            className="px-4 py-2 bg-[var(--teal-medium)] text-white font-semibold rounded-2xl shadow-md hover:scale-105 transition-transform"
          >
            Home
          </Link>
          <Link
            href="/mini-game-3"
            className="px-4 py-2 bg-[var(--teal-medium)] text-white font-semibold rounded-2xl shadow-md hover:scale-105 transition-transform"
          >
            Prev
          </Link>
          <Link
            href="/mini-game-5"
            className="px-4 py-2 bg-[var(--olive-green)] text-white font-semibold rounded-2xl shadow-md hover:scale-105 transition-transform"
          >
            Next
          </Link>
        </nav>
      </main>
    </div>
  );
}
