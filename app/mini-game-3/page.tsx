"use client";

import Link from "next/link";
import SaveFishFarmGame from "./savefishfarm";
import { useMemo } from "react";

//bubble animation
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

export default function MiniGame3() {
  const bubbleBackground = useMemo(() => <BubbleBackground />, []);
  
  return (
    <div className="flex min-h-screen items-center justify-center">
      
      {bubbleBackground}
      <main
  className="relative z-10 flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-8 px-8"
  style={{ color: "var(--foreground)" }}   // ← removed backgroundColor
>

  {/* Header card */}
  <div
    className="flex flex-col items-center gap-2 mb-2 w-full py-6 px-8 rounded-3xl shadow-md"
    style={{ backgroundColor: "rgba(255,255,255,0.88)", border: "2px solid var(--color-border-light)" }}
  >
    <div className="flex items-center gap-2 text-5xl" style={{ animation: "bounce 2s infinite" }}>
      <img src="/happy_fish.png" alt="happyfish" style={{ width: "58px", height: "58px", objectFit: "contain" }} />
      <img src="/happy_plant.png" alt="happy_plant" style={{ width: "48px", height: "48px", objectFit: "contain" }} />
      <img src="/star.png" alt="star" style={{ width: "48px", height: "48px", objectFit: "contain" }} />
    </div><h1
      className="text-4xl font-extrabold text-center"
      style={{
        backgroundImage: "linear-gradient(to right, var(--teal-medium), var(--olive-green))",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      Save Your Fish Farm
    </h1>
    <p className="mt-1 text-center" style={{ color: "var(--color-text-secondary)" }}>
      Make the right decisions to keep your aquaponics farm healthy!
    </p>
  </div>

  {/* Game Component */}
  <div className="mt-4 w-full">
    <SaveFishFarmGame />
  </div>

  {/* Nav card */}
  <nav
    className="mt-4 flex gap-4 w-full justify-center py-4 px-8 rounded-3xl shadow-md"
    style={{ backgroundColor: "rgba(255,255,255,0.88)", border: "2px solid var(--color-border-light)" }}
  >
    <Link href="/" className="px-4 py-2 font-semibold rounded-2xl shadow-md transition-transform hover:scale-105"
      style={{ backgroundColor: "var(--teal-medium)", color: "white" }}>Home</Link>
    <Link href="/mini-game-2" className="px-4 py-2 font-semibold rounded-2xl shadow-md transition-transform hover:scale-105"
      style={{ backgroundColor: "var(--teal-medium)", color: "white" }}>Prev</Link>
    <Link href="/mini-game-4" className="px-4 py-2 font-semibold rounded-2xl shadow-md transition-transform hover:scale-105"
      style={{ backgroundColor: "var(--olive-green)", color: "white" }}>Next</Link>
  </nav>

  <style>{`
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50%       { transform: translateY(-10px); }
    }
  `}</style>
</main>
    </div>
  );
}