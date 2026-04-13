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

  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showInfo, setShowInfo] = useState<boolean>(true);

  const startGame = () => {
    setGameOver(false);
    setIsPlaying(true);
  };
  



  return (
    <div className="flex min-h-screen items-center justify-center dark:bg-black">
      <BubbleBackground />

      {/* INFO MODAL */}
      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">
                <img src="/otter.png" alt="otter" className="w-full h-full object-contain" />
              </span>
              <div className="bg-blue-50 border border-blue-200 rounded-2xl rounded-tl-none px-4 py-2 text-sm text-blue-800 font-medium">
                Hi! I'm Otto the Otter. Let me explain how this works!
              </div>
            </div>
            <h2 className="text-xl font-bold mb-3 text-gray-800">Did you know that some plants and fish grow better together?</h2>
            <h4 className="text-medium mb-3 text-gray-800">In special farms called aquaponics farms, fish and plants help each other grow! It works by having fish live in water and produce waste. That waste turns into nutrients which plants needs to grow big and healthy. As plants clean the water, the fish get fresh, clean water again! It’s a team effort!</h4>
            <ul className="space-y-2 text-sm text-gray-700 mb-6">
              <li className="flex gap-2"><span><img src="/tilapia_image.png" alt="tilapia" style={{ width: "20px", height: "20px", objectFit: "contain" }} /></span><span><strong>Tilapia</strong> loves to help tomatos and basil grow!</span></li>
              <li className="flex gap-2"><span><img src="/trout.png" alt="trout" style={{ width: "24px", height: "24px", objectFit: "contain" }} /></span><span><strong>Trout</strong> likes spinach and arugula!</span></li>
              <li className="flex gap-2"><span><img src="/catfish.png" alt="catfish" style={{ width: "24px", height: "24px", objectFit: "contain" }} /></span><span><strong>Catfish</strong> helps cucumbers and lettuce out!</span></li>
              <li className="flex gap-2"><span><img src="/koi.png" alt="koi" style={{ width: "24px", height: "24px", objectFit: "contain" }} /></span><span><strong>Koi</strong> is friends with watercress and mint!</span></li>
            </ul>
            <button
              onClick={() => setShowInfo(false)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              Let's Play!
            </button>
          </div>
        </div>
      )}
      
      <main className="card" >
        
        <div className="max-w-2xl mx-auto">

          {/* Floating otter button — bottom right */}
        <div className="fixed bottom-6 right-6 z-40 group flex flex-col items-center gap-1">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs font-semibold px-3 py-1 rounded-full shadow pointer-events-none">
            Learn More
          </span>
          <button
            onClick={() => setShowInfo(true)}
            className="bg-blue-100 hover:bg-blue-200 border-2 border-blue-300 rounded-full w-20 h-20 text-4xl shadow-lg transition-colors flex items-center justify-center"
          >
            <span className="text-4xl">
                <img src="/otter.png" alt="otter" className="w-full h-full object-contain" />
              </span>
          </button>
        </div>
  
  <h1 className="text-4xl font-extrabold text-center"
      style={{
        backgroundImage: "linear-gradient(to right, var(--teal-medium), var(--olive-green))",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}>
    Fish & Crop Match
  </h1>

  <h2 className="text-xl font-bold mb-3 text-gray-800">How to play the game:</h2>

            <p className="text-sm text-gray-500 mb-6 italic">
              Below are cards with different crops and different fish. Using what you just learned,
    click on the plant cards and slide to the fish it grows best with. After you have correctly matched each pair and gotten a score of 3,
    continue to the next game.
            </p>
            <p>If you need some help during the game, press the Otter bottom in the bottom right!</p>
            <h2 className="text-center mt-4 text-xl">
    Press Start to begin
  </h2>
  
  <br></br>
  


</div>

      <div style={{ marginBottom: "10px" }}>
  {!isPlaying && !gameOver && (
    <div className="flex justify-center">
    <button className="btn btn-green" onClick={startGame}>Start Game</button>
  </div>
  )}

  {isPlaying && ( 
    <FishCropMatch />
  )}

  
  {gameOver && (
    <div>
      <p>Game Over!</p>
      <button className="btn btn-green" onClick={startGame}>Retry</button>
    </div>
  )}
</div>

        

      </main>
      
    </div>
    
  );
}
