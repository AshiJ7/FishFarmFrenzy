"use client";
import Link from "next/link";
import grassImg from './grass.jpg';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useAuth } from "../../../context/AuthContext";

interface LettuceData {
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

export default function LettuceGame() {
  const [objects, setObjects] = useState<LettuceData[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidthRef = useRef(500);

  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showInfo, setShowInfo] = useState<boolean>(true);
  const [showCompletion, setShowCompletion] = useState(false);
  const [score, setScore] = useState(0);
  const [position, setPosition] = useState({ x: 200 });
  const { user } = useAuth();

  // Track actual container width for responsive bounds
  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        containerWidthRef.current = containerRef.current.offsetWidth;
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const startGame = () => {
    setScore(0);
    setObjects([]);
    setTimeLeft(30);
    setGameOver(false);
    setIsPlaying(true);
    setShowCompletion(false);
    // Reset basket to center of container
    setPosition({ x: Math.max(0, containerWidthRef.current / 2 - BASKET_WIDTH / 2) });
  };

  useEffect(() => {
    if (!isPlaying) return;
    if (timeLeft <= 0) {
      setIsPlaying(false);
      setGameOver(true);
      setShowCompletion(true);
      if (user) {
        const ref = doc(db, "users", user.uid);
        getDoc(ref).then((snap) => {
          const data = snap.data();
          if (!data?.tomatoCompleted) {
            updateDoc(ref, { gamesCompleted: increment(1), tomatoCompleted: true });
          }
        });
      }
      return;
    }
    const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [isPlaying, timeLeft]);

  const createLettuce = useCallback(() => {
    if (!containerRef.current) return;
    const w = containerRef.current.offsetWidth;
    setObjects(prev => [...prev, {
      id: Date.now(),
      x: Math.random() * (w - OBJECT_SIZE),
      y: 0,
      color: 'green',
    }]);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const spawnInterval = setInterval(createLettuce, 1000);
    return () => clearInterval(spawnInterval);
  }, [createLettuce, isPlaying]);

  const positionRef = useRef(position);
  useEffect(() => { positionRef.current = position; }, [position]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setObjects(prevObjects =>
        prevObjects
          .map(obj => ({ ...obj, y: obj.y + GRAVITY }))
          .filter(obj => {
            const basketLeft = positionRef.current.x;
            const basketRight = positionRef.current.x + BASKET_WIDTH;
            const basketTop = GAME_H - BASKET_HEIGHT;

            const isColliding =
              obj.x + OBJECT_SIZE > basketLeft &&
              obj.x < basketRight &&
              obj.y + OBJECT_SIZE > basketTop &&
              obj.y < GAME_H;

            if (isColliding) {
              setScore(prev => prev + 0.5);
              return false;
            }
            return obj.y < GAME_H;
          })
      );
    }, 30);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const moveBy = 20;

  useEffect(() => {
    if (!isPlaying) return;
    containerRef.current?.focus();
  }, [isPlaying]);

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

  const moveLeft = () => {
    setPosition(prev => ({ x: Math.max(0, prev.x - moveBy) }));
  };
  const moveRight = () => {
    const maxX = containerWidthRef.current - BASKET_WIDTH;
    setPosition(prev => ({ x: Math.min(maxX, prev.x + moveBy) }));
  };

  // Continuous press support for touch
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
              <span className="text-4xl shrink-0">
                <img src="/otter.png" alt="otter" className="w-12 h-12 object-contain" />
              </span>
              <div className="bg-blue-50 border border-blue-200 rounded-2xl rounded-tl-none px-4 py-2 text-sm text-blue-800 font-medium">
                Hi! I'm Otto the Otter. Let me explain how this works!
              </div>
            </div>
            <h2 className="text-xl font-bold mb-3 text-gray-800">What is a regular farm?</h2>
            <h4 className="text-sm mb-3 text-gray-800">Have you ever seen a big field full of green plants growing in the dirt? That's a traditional farm!
On a regular farm, farmers need a lot of things to grow food:</h4>
            <ul className="space-y-2 text-sm text-gray-700 mb-6">
              <li className="flex gap-2"><img src="/spinach.png" alt="water" style={{ width: "24px", height: "24px", objectFit: "contain" }} /><span><strong>Water</strong> — They spray water on the plants every single day</span></li>
              <li className="flex gap-2"><img src="/rice_bran.png" alt="dirt" style={{ width: "24px", height: "24px", objectFit: "contain" }} /><span><strong>Soil</strong> — The dirt holds the plants and gives them food</span></li>
              <li className="flex gap-2"><img src="/happy_plant.png" alt="sunlight" style={{ width: "24px", height: "24px", objectFit: "contain" }} /><span><strong>Sunlight</strong> — Plants use sunlight to grow big and strong</span></li>
              <li className="flex gap-2"><img src="/water_plant.png" alt="fertilizer" style={{ width: "24px", height: "24px", objectFit: "contain" }} /><span><strong>Fertilizer</strong> — Special plant food added to the dirt</span></li>
            </ul>
            <h4 className="text-sm mb-4 text-gray-800">But here's something to think about... regular farms only grow ONE thing at a time. A tomato farm only grows tomatoes. Regular farms also use a LOT of water. In fact, it can take up to 96 cups of water just to grow one tomato plant! Most of that water gets used up or soaks into the ground and is gone.</h4>
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
          }}>Tomato Catcher</h1>

        <h2 className="text-lg font-bold mb-2 text-gray-800">How to play:</h2>
        <p className="text-sm text-gray-500 mb-3 italic">
          Press Start, then use the arrow buttons (or keyboard arrows on desktop) to move your basket and catch as many tomatoes as you can in 30 seconds!
        </p>
        <p className="text-sm mb-4 text-gray-600">If you need help during the game, press the Otter button in the bottom right!</p>

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

        {!isPlaying && !gameOver && (
          <button className="btn btn-green mb-3" onClick={startGame}>Start Game</button>
        )}

        <div className="text-base font-bold text-[var(--color-text-primary)]">Tomato Score: <span>{score}</span></div>
        <div className="text-base font-bold text-[var(--color-text-primary)] mb-2">Money Earned: $<span>{(score * 3)}</span></div>

        {isPlaying && <div className="mb-2 font-semibold text-red-600">Time Left: {timeLeft}s</div>}

        {!gameOver && (
          <>
            {/* Game canvas */}
            <div
              className="falling-objects-container"
              ref={containerRef}
              style={{
                backgroundImage: `url(${grassImg.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                outline: 'none',
              }}
              onKeyDown={handleKeyDown}
              tabIndex={0}
            >
              {objects.map(obj => (
                <div
                  key={obj.id}
                  style={{
                    position: 'absolute',
                    top: `${obj.y}px`,
                    left: `${obj.x}px`,
                    width: `${OBJECT_SIZE + 10}px`,
                    height: `${OBJECT_SIZE + 10}px`,
                  }}
                >
                  <img src="../tomato.png" alt="tomato" className="w-full h-full object-contain" />
                </div>
              ))}
              <div
                style={{
                  position: 'absolute',
                  bottom: '0px',
                  left: `${position.x}px`,
                  width: `${BASKET_WIDTH}px`,
                  height: `${BASKET_HEIGHT}px`,
                  fontSize: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  outline: 'none',
                }}
              >
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
              <h2 className="text-xl font-bold mb-2 text-gray-800">Great job catching tomatoes!</h2>
              <p className="text-gray-500 italic">You caught <span>{score}</span> tomatoes!</p>
              <p className="text-gray-500 mb-3 italic">In total you earned $<span>{(score * 3)}</span>!!!</p>
              <p className="text-gray-500 mb-3 italic">Great job! Want to play again and earn more?</p>
              <div className="flex gap-3 justify-center">
                <button onClick={startGame} className="btn btn-mint">
                  <span className="flex items-center gap-2 justify-center">
                    <img src="/reverse.png" alt="restart" className="w-5 h-5 object-contain" />
                    Play Again
                  </span>
                </button>
                <a href="/mini-game-5/salmon-game" className="btn btn-green">
                  <span className="flex items-center gap-2 justify-center">
                    Next Game
                    <img src="/happy_fish.png" alt="fish" className="w-5 h-5 object-contain" />
                  </span>
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
