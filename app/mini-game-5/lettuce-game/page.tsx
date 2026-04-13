"use client";
import Link from "next/link";
import grassImg from './grass.jpg';


import React, { useState, useEffect, useRef, useCallback} from 'react';
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useAuth } from "../../../context/AuthContext"; 


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
    const [showInfo, setShowInfo] = useState<boolean>(true);
    const [showCompletion, setShowCompletion] = useState(false);
    const { user } = useAuth();

    //setting game objects before so everything is fresh
    const startGame = () => {
      setScore(0);
      setObjects([]);
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
        const alreadyCompleted = data?.tomatoCompleted ?? false;

        if (!alreadyCompleted) {
          updateDoc(ref, {
            gamesCompleted: increment(1),
            tomatoCompleted: true,  // mark this specific game as done
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
            <h2 className="text-xl font-bold mb-3 text-gray-800">What is a regular farm?</h2>
            <h4 className="text-medium mb-3 text-gray-800">Have you ever seen a big field full of green plants growing in the dirt? That's a traditional farm!
On a regular farm, farmers need a lot of things to grow food:</h4>
            <ul className="space-y-2 text-sm text-gray-700 mb-6">
              <li className="flex gap-2"><span><img src="/spinach.png" alt="water" style={{ width: "24px", height: "24px", objectFit: "contain" }} /></span><span><strong>Water</strong> — They spray water on the plants every single day</span></li>
              <li className="flex gap-2"><span><img src="/rice_bran.png" alt="dirt" style={{ width: "24px", height: "24px", objectFit: "contain" }} /></span><span><strong>Soil</strong> — The dirt holds the plants and gives them food</span></li>
              <li className="flex gap-2"><span><img src="/happy_plant.png" alt="sunlight" style={{ width: "24px", height: "24px", objectFit: "contain" }} /></span><span><strong>Sunlight</strong> — Plants use sunlight to grow big and strong</span></li>
              <li className="flex gap-2"><span><img src="/water_plant.png" alt="fertilizer" style={{ width: "24px", height: "24px", objectFit: "contain" }} /></span><span><strong>Fertilizer</strong> — Special plant food added to the dirt</span></li>
            </ul>
            <h4 className="text-small mb-1 text-gray-800">But here's something to think about... regular farms only grow ONE thing at a time. A tomato farm only grows tomatoes. Regular farms also use a LOT of water. In fact, it can take up to 96 cups of water just to grow one tomato plant! Most of that water gets used up or soaks into the ground and is gone. </h4>
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
        <h1 className="text-4xl font-extrabold text-center"
      style={{
        backgroundImage: "linear-gradient(to right, var(--teal-medium), var(--olive-green))",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}>Tomato Catcher</h1>
        <h2 className="text-xl font-bold mb-3 text-gray-800">How to play the game:</h2>

            <p className="text-sm text-gray-500 mb-6 italic">
              After you press the start button, you will use your left and right arrow keys to move your basket to collect as much lettuce from the farm as you can.
          You have 30 seconds to catch as much as you can before time runs out! After you can click the retry button to start again.
            </p>
            <p>If you need some help during the game, press the Otter bottom in the bottom right!</p>
        <p className="mt-4 max-w-2xl text-center text-lg text-zinc-600 dark:text-zinc-400">
          Press Start to begin!
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
        {!isPlaying && !gameOver && (
    <button className="btn btn-green" onClick={startGame}>Start Game</button>
  )}
        <div className="text-xl font-bold text-[var(--color-text-primary)]" id="counter">Tomato Score : <span>{score}</span></div>
        <div className="text-xl font-bold text-[var(--color-text-primary)]" id="counter">Money Earned : <span>{(score * 3)}</span></div>
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
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          fontSize:'20pt',
          
        }}
        >
          <img src="../tomato.png" alt="tomato" className="object-contain" />
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
      <p className="text-medium text-gray-500 italic" id="counter">You ended up catching <span>{score}</span> tomatoes!</p>
      <p className="text-medium text-gray-500 mb-3 italic" id="counter">In total you earned  $<span>{(score * 3)}</span>!!!</p>
      <p className="text-medium text-gray-500 mb-3 italic">
        Great job! Want to play again and earn more? Or go to the next game for a new challenge?
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
        
          <a href="/mini-game-5/salmon-game"
          className="btn btn-green"
        >
         <span className="flex items-center gap-2 justify-center">
              Next Game
              <img
                src="/happy_fish.png"
                alt="fish"
                className="w-5 h-5 object-contain"
              />
            </span>
        </a>
      </div>
    </div>
  </div>
)}






        <nav className="mt-8 flex gap-4">
          <Link href="/" className="text-foreground">Home</Link>
          {/* <Link href="/mini-game-4" className="text-foreground">Prev</Link>
          <Link href="/mini-game-1" className="text-foreground">Next</Link> */}
          {/* <Link href="/mini-game-5/salmon-game" className="text-foreground">Next Game</Link> */}
        </nav>
      </main>
    </div>
  );
}