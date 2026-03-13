"use client";
import Link from "next/link";
import grassImg from './grass.jpg';


import React, { useState, useEffect, useRef, useCallback} from 'react';

interface LettuceData {
  id: number;
  x: number;
  y: number;
  color: string; 
}

export default function LettuceGame() {

  
  const [objects, setObjects] = useState<LettuceData[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  //everything to track player movement
    const [isPlaying, setIsPlaying] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);
    //setting game objects before so everything is fresh
    const startGame = () => {
      setScore(0);
      setObjects([]);
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
  }, 1000); // spawn every second

  return () => clearInterval(spawnInterval);
}, [createLettuce, isPlaying]);
const [position, setPosition] = useState({ x: 200});
  
const basketWidth = 50;
const basketHeight = 50;
const objectSize = 30;
const gravity = 3;
const [score, setScore] = useState(0);

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


  //const [position, setPosition] = useState({ x: 400, y: 480 });
  const moveBy = 10;
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // need this to mount
    if (!isPlaying) return;
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
    <div className="flex min-h-screen items-center justify-center dark:bg-black">
      <main className="card">
        <h1 className="text-3xl font-semibold text-[var(--color-text-secondary)] dark:text-zinc-50">Lettuce Catcher</h1>
        <p className="mt-4 max-w-2xl text-center text-lg text-zinc-600 dark:text-zinc-400">
          What is a regular farm?
Have you ever seen a big field full of green plants growing in the dirt? That's a regular farm! Farmers work really hard to grow vegetables like lettuce for us to eat.
On a regular farm, farmers need a lot of things to grow food:

🌧️ Water — They spray water on the plants every single day
🌱 Soil — The dirt holds the plants and gives them food
☀️ Sunlight — Plants use sunlight to grow big and strong
🧪 Fertilizer — Special plant food added to the dirt

But here's something to think about... regular farms only grow ONE thing at a time. A lettuce farm grows lettuce. A fish farm grows fish. They are always separate!
Regular farms also use a LOT of water. In fact, it can take up to 250 cups of water just to grow one head of lettuce! Most of that water gets used up or soaks into the ground and is gone. 
        </p>
        <br></br>
        <h2>How to play</h2>
        <p>After you press the start button, you will use your left and right arrow keys to move your basket to collect as much lettuce from the farm as you can.
          You have 30 seconds to catch as much as you can before time runs out! After you can click the retry button to start again.
        </p>
        <br></br>
        {!isPlaying && !gameOver && (
    <button className="btn btn-green" onClick={startGame}>Start Game</button>
  )}
        <div className="text-xl font-bold text-[var(--color-text-primary)]" id="counter">Lettuce Score : <span>{score}</span></div>
        {gameOver && (
    <div>
      <p>Game Over!</p>
      <button className="btn btn-green" onClick={startGame}>Retry</button>
    </div>

  )}

  {isPlaying && <div>Time Left: {timeLeft}</div>}

  {!gameOver && (
  <div
    className="falling-objects-container"
    ref={containerRef}
    style={{
      position: 'relative',
      width: '500px',
      height: '400px',
      overflow: 'hidden',
      border: '1px solid #ccc',
      backgroundImage: `url(${grassImg.src})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
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

    <div
      ref={divRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      style={{
        position: 'absolute',
        bottom: '0px',
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
          <Link href="/mini-game-5/salmon-game" className="text-foreground">Next Game</Link>
        </nav>
      </main>
    </div>
  );
}