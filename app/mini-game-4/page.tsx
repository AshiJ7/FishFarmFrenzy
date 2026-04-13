"use client";

import Link from "next/link";
import BacteriaGame from "./BacteriaGame";
import { useMemo, useState } from "react";

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
    `}</style>
  </div>
);

export default function MiniGame4() {
  const bubbleBackground = useMemo(() => <BubbleBackground />, []);
  const [showInfo, setShowInfo] = useState<boolean>(true);
  // Track whether the player has dismissed the tutorial at least once.
  // The Phaser game should not start until they have, otherwise it runs
  // (and drains oxygen / spawns ammonia) behind the modal. Re-opening the
  // tutorial via the otter button later must NOT unmount the game and lose
  // progress, so we key mounting on this flag rather than on `showInfo`.
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  const dismissTutorial = () => {
    setShowInfo(false);
    setHasStarted(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      {bubbleBackground}

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">
                <img src="/otter.png" alt="otter" className="w-26 h-26 object-contain" />
              </span>
              <div
                className="rounded-2xl rounded-tl-none px-4 py-2 text-sm text-gray-800 font-medium"
                style={{ backgroundColor: "var(--mint-light)", border: "1px solid rgba(107,142,78,0.3)" }}
              >
                Hi! I&apos;m Otto the Otter. Let me tell you about the invisible heroes of aquaponics — bacteria!
              </div>
            </div>
            <h2 className="text-xl font-bold mb-3 text-gray-800">Bacteria Make It All Work!</h2>
            <ul className="space-y-2 text-sm text-gray-700 mb-6">
              <li className="flex gap-2"><span><img src="/bacteria.png" alt="bacteria" style={{ width: "24px", height: "24px", objectFit: "contain" }} /></span><span>Fish produce toxic <strong>ammonia (NH&#x2083;)</strong> as waste. Too much ammonia kills fish!</span></li>
              <li className="flex gap-2"><span>🟢</span><span><strong>Nitrosomonas</strong> bacteria eat ammonia and turn it into <strong>nitrite (NO&#x2082;&#x207B;)</strong>.</span></li>
              <li className="flex gap-2"><span>🟣</span><span><strong>Nitrobacter</strong> bacteria eat nitrite and turn it into <strong>nitrate (NO&#x2083;&#x207B;)</strong>, or plant food!</span></li>
              <li className="flex gap-2"><span><img src="/water_plant.png" alt="plant" style={{ width: "24px", height: "24px", objectFit: "contain" }} /></span><span>Plants absorb the nitrate and grow. The cycle keeps fish safe and plants fed!</span></li>
              <li className="flex gap-2"><span>💨</span><span>Both bacteria need <strong>oxygen</strong> to survive! Don&apos;t forget to collect bubbles!</span></li>
            </ul>
            <p className="text-sm text-gray-500 mb-6 italic">
              Switch between bacteria with Space to manage the nitrogen cycle and keep the fish alive!
            </p>
            <button
              onClick={dismissTutorial}
              className="w-full font-semibold py-2 rounded-lg transition-colors text-white hover:opacity-90"
              style={{ backgroundColor: "var(--olive-green)" }}
            >
              Let&apos;s Play!
            </button>
          </div>
        </div>
      )}

      {/* Floating otter button */}
      <div className="fixed bottom-6 right-6 z-40 group flex flex-col items-center gap-1">
        <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs font-semibold px-3 py-1 rounded-full shadow pointer-events-none">
          Learn More
        </span>
        <button
          onClick={() => setShowInfo(true)}
          className="rounded-full w-20 h-20 shadow-lg transition-colors flex items-center justify-center overflow-hidden p-1 border-2"
          style={{ backgroundColor: "var(--mint-light)", borderColor: "var(--olive-green)" }}
        >
          <img src="/otter.png" alt="otter" className="w-full h-full object-contain" />
        </button>
      </div>

      <main
        className="relative z-10 flex w-full max-w-5xl flex-col items-center py-8 px-8"
        style={{ color: "var(--foreground)" }}
      >
        {/* Header card */}
        <div
          className="flex flex-col items-center gap-2 mb-4 w-full py-6 px-8 rounded-3xl shadow-md"
          style={{ backgroundColor: "rgba(255,255,255,0.88)", border: "2px solid var(--color-border-light)" }}
        >
          <div className="flex items-center gap-2 text-5xl" style={{ animation: "bounce 2s infinite" }}>
            <img src="/boxing_glove.png" alt="glove" style={{ width: "60px", height: "60px", objectFit: "contain" }} />
            <img src="/bacteria.png" alt="bacteria" style={{ width: "50px", height: "50px", objectFit: "contain" }} /></div>
          <h1
            className="text-4xl font-extrabold text-center"
            style={{
              backgroundImage: "linear-gradient(to right, var(--teal-medium), var(--olive-green))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Bacteria Battle
          </h1>
          <p className="mt-1 text-center" style={{ color: "var(--color-text-secondary)" }}>
            Control two types of bacteria to convert ammonia into plant food. Switch with Space or the on-screen button!
          </p>
        </div>

        {/* Game — only mount once the tutorial has been dismissed for the
            first time so the Phaser scene doesn't start (and drain oxygen /
            spawn ammonia) while the user is still reading the modal. We key
            off `hasStarted` rather than `!showInfo` so reopening the tutorial
            mid-game via the otter button doesn't unmount and reset the game. */}
        <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ border: "2px solid var(--color-border-light)" }}>
          {hasStarted && <BacteriaGame />}
        </div>

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
