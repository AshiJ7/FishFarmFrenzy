"use client";

import Link from "next/link";
import FishFeeding from "./FishFeeding";
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
  const [showInfo, setShowInfo] = useState<boolean>(true);
  
  
  return (
    <div className="flex min-h-screen items-start justify-center px-4 py-6 font-sans dark:bg-black">
        {bubbleBackground}

      {/* INFO MODAL */}
      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">
                <img src="/otter.png" alt="otter" className="w-full h-full object-contain" />
              </span>
              <div className="bg-blue-50 border border-blue-200 rounded-2xl rounded-tl-none px-4 py-2 text-sm text-blue-800 font-medium">
                Hello! I'm Otto the Otter. Let's learn what to feed your fish to keep them healthy!
              </div>
            </div>
            <h2 className="text-xl font-bold mb-3 text-gray-800"> Every Type of Fish Likes Different Food! </h2>
            <ul className="space-y-2 text-sm text-gray-700 mb-6">
              <li className="flex gap-2"><span> There are many different kinds of fish that can be used in aquaponics! Since each type of fish is special, they all need different kinds of food. </span></li>
              <li className="flex gap-2"><span><img src="/happy_plant.png" alt="happyplant" style={{ width: "24px", height: "24px", objectFit: "contain" }} /></span><span> Tilapia and grass carp like <strong> plants and plant-based fish food! </strong> </span></li>
              <li className="flex gap-2"><span><img src="/worms.png" alt="worms" style={{ width: "24px", height: "24px", objectFit: "contain" }} /></span><span> Trout and salmon are carnivorous, so they like <strong> bugs and small fish! </strong> </span></li>
            </ul>
            <p className="text-sm text-gray-500 mb-6 italic">
              Play this game to learn more about the diets of different fish! 
            </p>
            <button
              onClick={() => setShowInfo(false)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              Let's Play!
            </button>
          </div>
        </div>
      )}

        {/* Floating otter button — bottom right */}
        <div className="fixed bottom-6 right-6 z-40 group flex flex-col items-center gap-1">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs font-semibold px-3 py-1 rounded-full shadow pointer-events-none">
            Learn More
          </span>
          <button
            onClick={() => setShowInfo(true)}
            className="bg-blue-100 hover:bg-blue-200 border-2 border-blue-300 rounded-full w-20 h-20 shadow-lg transition-colors flex items-center justify-center overflow-hidden p-1"
          >
            <img src="/otter.png" alt="otter" className="w-full h-full object-contain" />
          </button>
        </div>

      <main className="card mt-4 mb-4">
        <h1 className="text-4xl font-extrabold text-center [font-family:var(--font-nunito)]"
          style={{
          backgroundImage: "linear-gradient(to right, var(--teal-medium), var(--olive-green))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          Fish Feeding
        </h1>
        <p className="mt-2 text-center text-zinc-600 dark:text-zinc-400">
          Pick the best food for your fish to keep them healthy!
        </p>
        <div className="mt-6">
          <FishFeeding />
        </div>
      </main>
    </div>
  );
}
