"use client";
import Link from "next/link";
import { useMemo } from "react";

import React, { useState, useEffect, useRef, useCallback} from 'react';
import FishCropMatch from "./fishmatch";

const BubbleBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    {[...Array(18)].map((_, i) => {
      const size = 12 + (i * 7.3) % 24;
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


export default function MiniGame5() {
  const bubbleBackground = useMemo(() => <BubbleBackground />, []);
  



  return (
    <div className="flex min-h-screen items-center justify-center dark:bg-black">
      <BubbleBackground />
      
      <main className="card" >
        
        <div className="max-w-2xl mx-auto">
  
  <h1 className="text-3xl font-semibold text-center text-[var(--color-text-secondary)] dark:text-zinc-50">
    Fish & Crop Match
  </h1>

  
  <h2 className="text-left mt-4 text-xl">
    Did you know that some plants and fish grow better together?
  </h2>
  <br></br>

  <p className="text-left">
    In special farms called aquaponics farms, fish and plants help each other grow! It works by having fish live in water and produce waste.
    That waste turns into nutrients which plants needs to grow big and healthy. As plants clean the water, the fish get fresh, clean water again! It’s a team effort!
  </p>

  <br></br>

  <ul className="mt-3 text-gray-800 space-y-1">
  <li>🐟 <strong>Tilapia</strong> loves to help lettuce and basil grow!</li>
  <li>🐠 <strong>Trout</strong> likes spinach and arugula!</li>
  <li>🐟 <strong>Catfish</strong> helps tomatoes and cucumbers!</li>
  <li>🐠 <strong>Koi</strong> is friends with watercress and mint!</li>
</ul>

  <h2 className="text-left mt-6 font-semibold">
    How to play the game:
  </h2>
  <p className="text-left">
    Below are cards with different crops and different fish. Using what you just learned,
    click on the plant cards and slide to the fish it grows best with. After you have correctly matched each pair and gotten a score of 3,
    continue to the next game.
  </p>

</div>

        <FishCropMatch/>

        <nav className="mt-8 flex gap-4">
          <Link href="/" className="text-foreground">Home</Link>
          {/* <Link href="/mini-game-4" className="text-foreground">Prev</Link>
          <Link href="/mini-game-1" className="text-foreground">Next</Link> */}
          <Link href="/mini-game-5/lettuce-game" className="text-foreground">Next Game</Link>
        </nav>
      </main>
      
    </div>
    
  );
}
