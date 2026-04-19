"use client";
import Link from "next/link";
import grassImg from "./grass.jpg";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useAuth } from "../../../context/AuthContext";

interface FallingItem {
  id: number;
  x: number;
  y: number;
  color: string;
}

const GAME_H = 400;
const BASKET_WIDTH = 50;
const BASKET_HEIGHT = 50;
const OBJECT_SIZE = 30;
const GRAVITY = 3;

export default function SalmonGame() {
  const [objects, setObjects] = useState<FallingItem[]>([]);
  const [objects2, setObjects2] = useState<FallingItem[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showInfo, setShowInfo] = useState<boolean>(true);
  const [score, setScore] = useState(0);
  const [score2, setScore2] = useState(0);
  const [position, setPosition] = useState({ x: 200 });
  const { user } = useAuth();

  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidthRef = useRef(500);
  const positionRef = useRef(position);
  const divRef = useRef<HTMLDivElement>(null);

  // Track actual container width
  useEffect(() => {
    const update = () => {
      if (containerRef.current) containerWidthRef.current = containerRef.current.offsetWidth;
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => { positionRef.current = position; }, [position]);

  const startGame = () => {
    setScore(0); setScore2(0);
    setObjects([]); setObjects2([]);
    setTimeLeft(30); setGameOver(false);
    setIsPlaying(true); setShowCompletion(false);
    setPosition({ x: Math.max(0, containerWidthRef.current / 2 - BASKET_WIDTH / 2) });
  };

  useEffect(() => {
    if (!isPlaying) return;
    if (timeLeft <= 0) {
      setIsPlaying(false); setGameOver(true); setShowCompletion(true);
      if (user) {
        const ref = doc(db, "users", user.uid);
        getDoc(ref).then((snap) => {
          const data = snap.data();
          if (!data?.tilapiaGame) {
            updateDoc(ref, { gamesCompleted: increment(1), tilapiaGame: true });
          }
        });
      }
      return;
    }
    const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [isPlaying, timeLeft]);

  const createTomato = useCallback(() => {
    if (!containerRef.current) return;
    const w = containerRef.current.offsetWidth;
    setObjects(prev => [...prev, { id: Date.now(), x: Math.random() * (w - OBJECT_SIZE), y: 0, color: 'red' }]);
  }, []);

  const createSalmon = useCallback(() => {
    if (!containerRef.current) return;
    const w = containerRef.current.offsetWidth;
    setObjects2(prev => [...prev, { id: Date.now() + 1, x: Math.random() * (w - OBJECT_SIZE), y: 0, color: '#FA8072' }]);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const t = setInterval(createTomato, 1000);
    return () => clearInterval(t);
  }, [createTomato, isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;
    const t = setInterval(createSalmon, 1000);
    return () => clearInterval(t);
  }, [createSalmon, isPlaying]);

  const makeCollisionFilter = (setScoreFn: (fn: (p: number) => number) => void) =>
    (prevObjects: FallingItem[]) =>
      prevObjects
        .map(obj => ({ ...obj, y: obj.y + GRAVITY }))
        .filter(obj => {
          const bL = positionRef.current.x;
          const bR = positionRef.current.x + BASKET_WIDTH;
          const bTop = GAME_H - BASKET_HEIGHT;
          const isColliding =
            obj.x + OBJECT_SIZE > bL && obj.x < bR &&
            obj.y + OBJECT_SIZE > bTop && obj.y < GAME_H;
          if (isColliding) { setScoreFn(p => p + 0.5); return false; }
          return obj.y < GAME_H;
        });

  useEffect(() => {
    if (!isPlaying) return;
    const iv = setInterval(() => setObjects(makeCollisionFilter(setScore)), 30);
    return () => clearInterval(iv);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;
    const iv = setInterval(() => setObjects2(makeCollisionFilter(setScore2)), 30);
    return () => clearInterval(iv);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;
    divRef.current?.focus();
  }, [isPlaying]);

  const moveBy = 20;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const maxX = containerWidthRef.current - BASKET_WIDTH;
    switch (event.key) {
      case 'ArrowLeft':
        setPosition(prev => ({ x: Math.max(0, prev.x - moveBy) }));
        break;
      case 'ArrowRight':
        setPosition(prev => ({ x: Math.min(maxX, prev.x + moveBy) }));
        break;
      default:
        return;
    }
    event.preventDefault();
  };

  const moveLeft = () => setPosition(prev => ({ x: Math.max(0, prev.x - moveBy) }));
  const moveRight = () => setPosition(prev => ({ x: Math.min(containerWidthRef.current - BASKET_WIDTH, prev.x + moveBy) }));

  const moveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startMove = (dir: 'left' | 'right') => {
    if (moveIntervalRef.current) clearInterval(moveIntervalRef.current);
    const fn = dir === 'left' ? moveLeft : moveRight;
    fn();
    moveIntervalRef.current = setInterval(fn, 80);
  };
  const stopMove = () => {
    if (moveIntervalRef.current) { clearInterval(moveIntervalRef.current); moveIntervalRef.current = null; }
  };

  return (
    <div className="flex min-h-screen items-center justify-center dark:bg-black">
      {/* INFO MODAL */}
      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="shrink-0">
                <img src="/otter.png" alt="otter" className="w-12 h-12 object-contain" />
              </span>
              <div className="bg-blue-50 border border-blue-200 rounded-2xl rounded-tl-none px-4 py-2 text-sm text-blue-800 font-medium">
                Hi! I'm Otto the Otter. Let me explain how this works!
              </div>
            </div>
            <h2 className="text-xl font-bold mb-3 text-gray-800">What is aquaponics?</h2>
            <h4 className="text-sm mb-3 text-gray-800">Aquaponics (AH-kwuh-PON-iks) is a special way of farming that grows plants and fish at the same time!
Here's the big secret: fish and plants are best friends in aquaponics. So how does it work?</h4>
            <ul className="space-y-2 text-sm text-gray-700 mb-6">
              <li className="flex gap-2"><span></span><span><strong>Step 1</strong> — Fish live in a tank and produce waste that goes into the water.</span></li>
              <li className="flex gap-2"><span></span><span><strong>Step 2</strong> — Tiny helpers called bacteria turn that waste into nutrients (plant food!).</span></li>
              <li className="flex gap-2"><span></span><span><strong>Step 3</strong> — Tomatoes and other plants soak up the nutrients and grow big!</span></li>
              <li className="flex gap-2"><span></span><span><strong>Step 4</strong> — By soaking up nutrients, the plants clean the water that flows back to the fish, and the cycle starts again!</span></li>
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

      <main className="card w-full max-w-xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-2"
          style={{
            backgroundImage: "linear-gradient(to right, var(--teal-medium), var(--olive-green))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>Aquaponics Adventure</h1>

        <h2 className="text-lg font-bold mb-2 text-gray-800">How to play:</h2>
        <p className="text-sm text-gray-500 mb-3 italic">
          Press Start, then use the arrow buttons (or keyboard arrows on desktop) to move your basket and catch tomatoes AND tilapia in 30 seconds!
        </p>
        <p className="text-sm mb-3 text-gray-600">If you need help, press the Otter button in the bottom right!</p>

        {/* Floating otter button */}
        <div className="fixed bottom-6 right-6 z-40 group flex flex-col items-center gap-1">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs font-semibold px-3 py-1 rounded-full shadow pointer-events-none">
            Learn More
          </span>
          <button
            onClick={() => setShowInfo(true)}
            className="bg-blue-100 hover:bg-blue-200 border-2 border-blue-300 rounded-full w-16 h-16 shadow-lg transition-colors flex items-center justify-center"
          >
            <img src="../otter.png" alt="otter" className="w-full h-full object-contain p-1" />
          </button>
        </div>

        <div className="text-base font-bold text-[var(--color-text-primary)]">
          Tomatoes: <span>{score}</span> &nbsp; Tilapia: <span>{score2}</span>
        </div>
        <div className="text-base font-bold text-[var(--color-text-primary)] mb-2">
          Money Earned: $<span>{(score * 3) + (score2 * 5)}</span>
        </div>

        {!isPlaying && !gameOver && (
          <button className="btn btn-green mb-3" onClick={startGame}>Start Game</button>
        )}
        {isPlaying && <div className="mb-2 font-semibold text-red-600">Time Left: {timeLeft}s</div>}

        {!gameOver && (
          <>
            {/* Game canvas */}
            <div
              className="falling-objects-container"
              ref={(el) => {
                (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
                (divRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
              }}
              onKeyDown={handleKeyDown}
              tabIndex={0}
              style={{
                backgroundImage: `url(${grassImg.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                outline: 'none',
              }}
            >
              {objects.map(obj => (
                <div key={obj.id} style={{ position: 'absolute', top: `${obj.y}px`, left: `${obj.x}px`, width: '40px', height: '40px' }}>
                  <img src="../tomato.png" alt="tomato" className="w-full h-full object-contain" />
                </div>
              ))}
              {objects2.map(obj => (
                <div key={obj.id} style={{ position: 'absolute', top: `${obj.y}px`, left: `${obj.x}px`, width: '50px', height: '50px' }}>
                  <img src="../tilapia.png" alt="tilapia" className="w-full h-full object-contain" />
                </div>
              ))}
              <div style={{
                position: 'absolute', bottom: '0px', left: `${position.x}px`,
                width: `${BASKET_WIDTH}px`, height: `${BASKET_HEIGHT}px`,
                fontSize: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', outline: 'none',
              }}>
                🧺
              </div>
            </div>

            {/* On-screen touch controls */}
            {isPlaying && (
              <div className="flex justify-center gap-6 mt-3">
                <button
                  className="w-16 h-16 rounded-2xl text-3xl font-bold select-none touch-none"
                  style={{ background: "rgba(255,255,255,0.8)", border: "2px solid #ccc", userSelect: "none" }}
                  onPointerDown={() => startMove('left')}
                  onPointerUp={stopMove}
                  onPointerLeave={stopMove}
                  aria-label="Move left"
                >
                  ←
                </button>
                <button
                  className="w-16 h-16 rounded-2xl text-3xl font-bold select-none touch-none"
                  style={{ background: "rgba(255,255,255,0.8)", border: "2px solid #ccc", userSelect: "none" }}
                  onPointerDown={() => startMove('right')}
                  onPointerUp={stopMove}
                  onPointerLeave={stopMove}
                  aria-label="Move right"
                >
                  →
                </button>
              </div>
            )}
          </>
        )}

        {showCompletion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 text-center">
              <div className="mb-3 flex justify-center">
                <img src="/trophy.png" alt="trophy" className="w-18 h-18 object-contain" />
              </div>
              <h2 className="text-xl font-bold mb-2 text-gray-800">Great job catching tomatoes and tilapia!</h2>
              <p className="text-gray-500 italic">You caught <span>{score}</span> tomatoes and <span>{score2}</span> tilapia!</p>
              <p className="text-gray-500 mb-3 italic">In total you earned $<span>{(score * 3) + (score2 * 5)}</span>!!!</p>
              <p className="text-gray-500 mb-3 italic">Great job! Want to play again or return home?</p>
              <div className="flex gap-3 justify-center">
                <button onClick={startGame} className="btn btn-mint">
                  <span className="flex items-center gap-2 justify-center">
                    <img src="/reverse.png" alt="restart" className="w-5 h-5 object-contain" />
                    Play Again
                  </span>
                </button>
                <a href="/" className="btn btn-green">Home</a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
