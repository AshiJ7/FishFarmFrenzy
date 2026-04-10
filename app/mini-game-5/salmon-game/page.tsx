"use client";
import Link from "next/link";
import grassImg from "./grass.jpg"


import React, { useState, useEffect, useRef, useCallback} from 'react';
import { randomInt } from "crypto";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useAuth } from "../../../context/AuthContext"; 

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
  const [showCompletion, setShowCompletion] = useState(false);
  //setting game objects before so everything is fresh
  const [showInfo, setShowInfo] = useState<boolean>(true);
  const { user } = useAuth();
  const startGame = () => {
    setScore(0);
    setScore2(0);
    setObjects([]);
    setObjects2([]);
    setTimeLeft(30);
    setGameOver(false);
    setIsPlaying(true);
    setShowCompletion(false);
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
        const alreadyCompleted = data?.tilapiaGame ?? false;

        if (!alreadyCompleted) {
          updateDoc(ref, {
            gamesCompleted: increment(1),
            tilapiaGame: true,  
          });
        }
      });
    }
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
    <div className="flex min-h-screen items-center justify-center dark:bg-black">
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
            <h2 className="text-xl font-bold mb-3 text-gray-800">What is aquaponics?</h2>
            <h4 className="text-medium mb-3 text-gray-800">Aquaponics (say it with us: AH-kwuh-PON-iks) is a special way of farming that grows plants and fish at the same time!
Here's the big secret: fish and plants are best friends in aquaponics.
So how does it work?</h4>
            <ul className="space-y-2 text-sm text-gray-700 mb-6">
              <li className="flex gap-2"><span></span><span><strong>Step 1</strong> — Fish eat and make waste 🐟
Fish like tilapia live in a big tank of water. Just like you, fish eat food and then make waste (yes, that means fish poop! 💩). That waste goes into the water.</span></li>
              <li className="flex gap-2"><span></span><span><strong>Step 2</strong> — Tiny helpers clean the water 🦠
Super tiny living things called bacteria (so small you can't even see them!) eat the fish waste and turn it into plant food called nutrients.</span></li>
              <li className="flex gap-2"><span></span><span><strong>Step 3</strong> — Plants drink up the nutrients 🥬
The nutrient-filled water flows to where the plants are growing. Tomatos and other plants drink up those nutrients and grow big and healthy!</span></li>
              <li className="flex gap-2"><span></span><span><strong>Step 4</strong> — Plants clean the water 💧
As the plants soak up the nutrients, they clean the water — and then that clean water goes back to the fish tank!
Then the whole cycle starts all over again! 🔄</span></li>
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
      <main className="card">
        <h1 className="text-3xl font-semibold text-[var(--color-text-secondary)] dark:text-zinc-50">Aquaponics Adventure</h1>
        <h2>How to play</h2>
        <p>After you press the start button, you will use your left and right arrow keys to move your basket to collect tomatos and tilapia.
          You have 30 seconds to catch as much as you can before time runs out! After you can click the retry button to start again.
        </p>
        <br></br>
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
                <img src="../otter.png" alt="otter" className="w-full h-full object-contain" />
              </span>
          </button>
        </div>
        <div className="text-xl font-bold text-[var(--color-text-primary)]" id="counter">Tomatos Caught : <span>{score}</span> Tilapia Caught : <span>{score2}</span></div>
        <div className="text-xl font-bold text-[var(--color-text-primary)]" id="counter">Money Earned : <span>{(score * 3) + (score2 * 5)}</span></div>
        <div style={{ marginBottom: "10px" }}>
  {!isPlaying && !gameOver && (
    <button className="btn btn-green" onClick={startGame}>Start Game</button>
  )}

  {isPlaying && <div>Time Left: {timeLeft}</div>}

  
  {gameOver && (
    <div>
      <p>Game Over!</p>
      <button className="btn btn-green" onClick={startGame}>Retry</button>
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
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        fontSize:'20pt',
        }}
        >
          <img src="../tomato.png" alt="tomato" className="object-contain" />
      </div>
  ))}

  {objects2.map(obj => (
    <div
      key={obj.id}
      style={{
        position: 'absolute',
        top: `${obj.y}px`,
        left: `${obj.x}px`,
        width: '70px',
        height: '70px',
        borderRadius: '50%',
        fontSize:'20pt',
        }}
        >
          <img src="../tilapia.png" alt="tilapia" className="object-contain" />
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

  {showCompletion && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-8 text-center">
      <div className="mb-3 flex justify-center">
        <img
          src="/trophy.png"
          alt="trophy"
          className="w-18 h-18 object-contain"
        /></div>
      <h2 className="text-xl font-bold mb-2 text-gray-800">Great job catching tomatoes and tilapia!</h2>
      <p className="text-medium text-gray-500 italic" id="counter">You ended up catching <span>{score}</span> tomatoes and <span>{score2}</span> tilapia!</p>
      <p className="text-medium text-gray-500 mb-3 italic" id="counter">In total you earned  $<span>{(score * 3) + (score2 * 5)}</span>!!!</p>
      <p className="text-medium text-gray-500 mb-3 italic">
        Great job! Want to play again and earn more? Or return home for a new game?
      </p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={startGame}
          className="btn btn-mint"
        >
          <span className="flex items-center gap-2 justify-center">
            <img
              src="/reverse.png"   
              alt="restart"
              className="w-5 h-5 object-contain"
            />
            Play Again
          </span>
        </button>
        
          <a href="/"
          className="btn btn-green"
        >
          Home 
        </a>
      </div>
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
