"use client";
import Link from "next/link";
import Timer from "./timer";


import React, { useState, useEffect, useRef, useCallback} from 'react';
import { randomInt } from "crypto";

interface LettuceData {
  id: number;
  x: number;
  y: number;
  color: string; 
}

interface SalmonData {
  id: number;
  x: number;
  y: number;
  color: string; 
}

export default function SalmonGame() {

  
  const [objects, setObjects] = useState<LettuceData[]>([]);
  const [objects2, setObjects2] = useState<SalmonData[]>([]);
  //everything to track player movement
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  //setting game objects before so everything is fresh
  const startGame = () => {
    setScore(0);
    setScore2(0);
    setObjects([]);
    setObjects2([]);
    setTimeLeft(30);
    setGameOver(false);
    setIsPlaying(true);
  };

  useEffect(() => {
  if (!isPlaying) return;

  if (timeLeft <= 0) {
    setIsPlaying(false);
    setGameOver(true);
    return;
  }

  const timer = setTimeout(() => {
    setTimeLeft(prev => prev - 1);
  }, 1000);

  return () => clearTimeout(timer);
}, [isPlaying, timeLeft]);


  const containerRef = useRef<HTMLDivElement>(null);
 const createLettuce = useCallback(() => {
  if (!containerRef.current) return;

  const containerWidth = containerRef.current.offsetWidth;

  const newObject: LettuceData = {
    id: Date.now(),
    x: Math.random() * (containerWidth - 30), // 30 = object width
    y: 0,
    color: 'green',
  };

  setObjects(prev => [...prev, newObject]);
}, []);



useEffect(() => {
  if (!isPlaying) return;

  const spawnInterval = setInterval(() => {
    createLettuce();
  }, 1000);

  return () => clearInterval(spawnInterval);
}, [createLettuce, isPlaying]);


const createSalmon = useCallback(() => {
  if (!containerRef.current) return;

  const containerWidth = containerRef.current.offsetWidth;

  const newObject: SalmonData = {
    id: Date.now(),
    x: Math.random() * (containerWidth - 30), // 30 = object width
    y: 0,
    color: '#FA8072',
  };

  setObjects2(prev => [...prev, newObject]);
}, []);



useEffect(() => {
  if (!isPlaying) return;

  const spawnInterval = setInterval(() => {
    createSalmon();
  }, 1000);

  return () => clearInterval(spawnInterval);
}, [createSalmon, isPlaying]);


const [position, setPosition] = useState({ x: 200});
  
const basketWidth = 50;
const basketHeight = 50;
const objectSize = 30;
const gravity = Math.floor(Math.random() * (6 - 3 + 1)) + 3;
const [score, setScore] = useState(0);
const [score2, setScore2] = useState(0);

const positionRef = useRef(position);

useEffect(() => {
  positionRef.current = position;
}, [position]);

useEffect(() => {
  if (!isPlaying) return;
  const interval = setInterval(() => {
    setObjects(prevObjects =>
      prevObjects
        .map(obj => ({
          ...obj,
          y: obj.y + gravity
        }))
        .filter(obj => {
          // Collision detection
          const basketLeft = positionRef.current.x;;
          const basketRight = positionRef.current.x + basketWidth;
    const basketTop = 400 - basketHeight;
    const basketBottom = 400;

    const objectLeft = obj.x;
    const objectRight = obj.x + objectSize;
    const objectTop = obj.y;
    const objectBottom = obj.y + objectSize;

    const isColliding =
      objectRight > basketLeft &&
      objectLeft < basketRight &&
      objectBottom > basketTop &&
      objectTop < basketBottom;

    if (isColliding) {
      console.log("HIT!");
      setScore(prev => prev + 0.5);
      return false; // remove the green ball
    }
          // remove if it falls from a spot
          return obj.y < 400;
        })
    );
  }, 30);

  return () => clearInterval(interval);
}, [isPlaying]);
//salmon colider
useEffect(() => {
  if (!isPlaying) return;
  const interval = setInterval(() => {
    setObjects2(prevObjects =>
      prevObjects
        .map(obj => ({
          ...obj,
          y: obj.y + gravity
        }))
        .filter(obj => {
          // Collision detection
          const basketLeft = positionRef.current.x;;
          const basketRight = positionRef.current.x + basketWidth;
    const basketTop = 400 - basketHeight;
    const basketBottom = 400;

    const objectLeft = obj.x;
    const objectRight = obj.x + objectSize;
    const objectTop = obj.y;
    const objectBottom = obj.y + objectSize;

    const isColliding =
      objectRight > basketLeft &&
      objectLeft < basketRight &&
      objectBottom > basketTop &&
      objectTop < basketBottom;

    if (isColliding) {
      console.log("HIT!");
      setScore2(prev => prev + 0.5);
      return false; // remove the green ball
    }
          // remove if it falls from a spot
          return obj.y < 400;
        })
    );
  }, 30);


  return () => clearInterval(interval);
}, [isPlaying]);


  //const [position, setPosition] = useState({ x: 400, y: 480 });
  const moveBy = 10;
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPlaying) return;
    // need this to mount
    divRef.current?.focus(); 
  }, [isPlaying]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case 'ArrowLeft':
        if(position.x < 20){
          break
        }
        else{
          setPosition((prev) => ({ ...prev, x: prev.x - moveBy }));
        }
        break;
      case 'ArrowRight':
        if(position.x > 410){
          break
        }
        else{
          setPosition((prev) => ({ ...prev, x: prev.x + moveBy }));
        }
        
        break;
      default:
        return; 
    }
    event.preventDefault(); 
  };

  



  return (
    <div className="flex min-h-screen items-center justify-center font-sans dark:bg-black">
      <main className="card">
        <h1 className="text-3xl font-semibold text-[var(--color-text-secondary)] dark:text-zinc-50">Aquaponics Adventure</h1>
        <p className="mt-4 max-w-2xl text-center text-lg text-zinc-600 dark:text-zinc-400">
          Blurb about aquaponics and it's benefits goes here. This is the educational section. 
        </p>
        <br></br>
        <h2>How to play</h2>
        <p>After you press the start button, you will use your left and right arrow keys to move your basket to collect salmon and lettuce.
          You have 30 seconds to catch as much as you can before time runs out! After you can click the retry button to start again.
        </p>
        <br></br>
        <div className="text-xl font-bold text-[var(--color-text-primary)]" id="counter">Lettuce Score : <span>{score}</span> Salmon Score : <span>{score2}</span></div>
        <div style={{ marginBottom: "10px" }}>
  {!isPlaying && !gameOver && (
    <button className="p-4 text-left border-2 border-[var(--color-border-light)] rounded-lg hover:border-[var(--teal-medium)] hover:bg-[var(--mint-light)] transition-all text-[var(--color-text-primary)]" onClick={startGame}>Start Game</button>
  )}

  {isPlaying && <div>Time Left: {timeLeft}</div>}

  
  {gameOver && (
    <div>
      <p>Game Over!</p>
      <button className="p-4 text-left border-2 border-[var(--color-border-light)] rounded-lg hover:border-[var(--teal-medium)] hover:bg-[var(--mint-light)] transition-all text-[var(--color-text-primary)]" onClick={startGame}>Retry</button>
    </div>
  )}
</div>
{!gameOver && (
        <div
  className="falling-objects-container"
  ref={containerRef} //canvas for now
  style={{
    position: 'relative',
    width: '500px',
    height: '400px',
    overflow: 'hidden',
    border: '1px solid #ccc',
    backgroundColor: '#f0f0f0',
  }}
>

  {objects.map(obj => (
    <div
      key={obj.id}
      style={{
        position: 'absolute',
        top: `${obj.y}px`,
        left: `${obj.x}px`,
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        fontSize:'20pt',
        }}
        >🥬
      </div>
  ))}

  {objects2.map(obj => (
    <div
      key={obj.id}
      style={{
        position: 'absolute',
        top: `${obj.y}px`,
        left: `${obj.x}px`,
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        fontSize:'20pt',
        }}
        >🐠
      </div>
  ))}

  <div
    ref={divRef}
    onKeyDown={handleKeyDown}
    tabIndex={0}
    style={{
      position: 'absolute',
      bottom: '0px',        // anchoring it to the bottom of the canvas
      left: `${position.x}px`,
      width: '50px',
      height: '50px',
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

  )}

        <nav className="mt-8 flex gap-4">
          <Link href="/" className="text-foreground">Home</Link>
          {/* <Link href="/mini-game-4" className="text-foreground">Prev</Link>
          <Link href="/mini-game-1" className="text-foreground">Next</Link> */}
        </nav>
      </main>
    </div>
  );
}
