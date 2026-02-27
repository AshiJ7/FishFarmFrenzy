"use client";
import Link from "next/link";
import Timer from "./timer";
//import FlipCard from "./flipcard";
//What needs to be done:
//There will be 3 pages for this particular minigame
//Every page will have the same style of progress, we start with information on the logistics
//Then there is the game and the user must hit a certain score or time
// so first game, they will match correctly then go to the next page
//Second game is falling lettuce and talks about yeild for typical farm
//Third page is salmon and lettuce
//for the yield game, there will be a 30 second timer that will count down and a counter
// of money and amount made as well as resources spent which can be a lower amount of time for the second game
//same thing will apply for salmon and lettuce to show it is better 

import React, { useState, useEffect, useRef, useCallback} from 'react';

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
  const spawnInterval = setInterval(() => {
    createLettuce();
  }, 1000); // spawn every second

  return () => clearInterval(spawnInterval);
}, [createLettuce]);


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
  const spawnInterval = setInterval(() => {
    createSalmon();
  }, 1000); // spawn every second

  return () => clearInterval(spawnInterval);
}, [createSalmon]);
const [position, setPosition] = useState({ x: 200});
  
const basketWidth = 50;
const basketHeight = 50;
const objectSize = 30;
const gravity = 3;
const [score, setScore] = useState(0);
const [score2, setScore2] = useState(0);

const positionRef = useRef(position);

useEffect(() => {
  positionRef.current = position;
}, [position]);

useEffect(() => {
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
}, []);

useEffect(() => {
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
}, []);


  //const [position, setPosition] = useState({ x: 400, y: 480 });
  const moveBy = 10;
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // need this to mount
    divRef.current?.focus(); 
  }, []);

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
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-24 px-8 bg-white dark:bg-black">
        <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">Mini-game 5</h1>
        <p className="mt-4 max-w-2xl text-center text-lg text-zinc-600 dark:text-zinc-400">
          Placeholder for Salmon Game!
        </p>
        <div id="counter">Lettuce Score : <span>{score}</span> Salmon Score : <span>{score2}</span></div>
        <Timer/>
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
        backgroundColor: obj.color,
      }}
    />
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
        backgroundColor: obj.color,
      }}
    />
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
      backgroundColor: 'red',
      outline: 'none',
    }}
  >
    Move Me
  </div>

  

</div>

        <nav className="mt-8 flex gap-4">
          <Link href="/" className="text-foreground">Home</Link>
          {/* <Link href="/mini-game-4" className="text-foreground">Prev</Link>
          <Link href="/mini-game-1" className="text-foreground">Next</Link> */}
        </nav>
      </main>
    </div>
  );
}
