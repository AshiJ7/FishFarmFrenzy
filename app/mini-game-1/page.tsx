"use client";

import Link from "next/link";
import FishFeeding from "./FishFeeding";
import { useMemo } from "react";


const BubbleBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
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
      @keyframes gentleFloat {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-6px); }
      }
      @keyframes rotateBounce {
        0% { transform: rotate(0deg); }
        50% { transform: rotate(10deg); }
        100% { transform: rotate(0deg); }
      }
    `}</style>
  </div>
);

export default function MiniGame1() {
  const bubbleBackground = useMemo(() => <BubbleBackground />, []);
  
  return (
    <div className="flex min-h-screen items-center justify-center font-sans dark:bg-black">
        {bubbleBackground}
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
