//using Teji's fish feeding as a basis
"use client";
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext"; 

type Crop = {
  id: number;
  name: string;
  fishMatch: number;
  image: string;
};

type Fish ={
    id: number;
    name: string;
    image: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Confetto = { id: number; x: number; color: string; delay: number; size: number };
 
function Confetti() {
  const pieces: Confetto[] = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: ["#FF6B6B","#FFD93D","#6BCB77","#4D96FF","#FF922B","#CC5DE8"][i % 6],
    delay: Math.random() * 0.6,
    size: 8 + Math.random() * 10,
  }));
 
  return (
    <div className="confetti-container" aria-hidden>
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetto"
          style={{
            left: `${p.x}%`,
            backgroundColor: p.color,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
      <style>{`
        .confetti-container {
          position: fixed; inset: 0; pointer-events: none; z-index: 100; overflow: hidden;
        }
        .confetto {
          position: absolute; top: -20px; border-radius: 3px;
          animation: confetti-fall 1.4s ease-in forwards;
        }
        @keyframes confetti-fall {
          0%   { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg) scale(0.5); opacity: 0; }
        }
          .wrong-shake {
            animation: card-shake 0.4s ease;
            border-color: #ef5350 !important;
          }
          @keyframes card-shake {
            0%, 100% { transform: translateX(0); }
            20%       { transform: translateX(-8px) rotate(-3deg); }
            40%       { transform: translateX(8px) rotate(3deg); }
            60%       { transform: translateX(-5px); }
            80%       { transform: translateX(5px); }
          }
      `}</style>
    </div>
  );
}

export default function FishCropMatch() {
  
  const crops: Crop[] = [
    { id: 1, name: "Tomato", fishMatch: 1, image: "./tomato.png"},
    { id: 2, name: "Spinach", fishMatch: 3, image: "./spinach.png"},
    { id: 3, name: "Cucumber", fishMatch: 2, image: "./cucumber.png"},
    { id: 4, name: "Watercress", fishMatch: 4, image: "./watercress.png"},
  ];

  const fish: Fish[] = [
    { id: 1, name: "Tilapia", image: "./tilapia.png" },
    { id: 2, name: "Catfish", image: "./catfish.png"},
    { id: 3, name: "Trout", image: "./trout.png"},
    { id: 4, name: "Koi", image: "./koi.png"},
  ];

  

  const [score, setScore] = useState(0);
  const [matchedCrops, setMatchedCrops] = useState<number[]>([]);
  const [message, setMessage] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [wrongFish, setWrongFish] = useState<number | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);
  const { user } = useAuth();

useEffect(() => {
  if (score === 4) {
    setShowCompletion(true);
    if (user) {
      const ref = doc(db, "users", user.uid);
      getDoc(ref).then((snap) => {
        const data = snap.data();
        const alreadyCompleted = data?.fishCropCompleted ?? false;

        if (!alreadyCompleted) {
          updateDoc(ref, {
            gamesCompleted: increment(1),
            fishCropCompleted: true,  // mark this specific game as done
          });
        }
      });
    }
  }
}, [score, user]);

  // store the id of dragged food in dataTransfer object
  const handleDraggingStart = (
    e: React.DragEvent<HTMLDivElement>,
    crop: Crop
  ) => {
    e.dataTransfer.setData("cropId", crop.id.toString());
  };

  // allows dragging while still hovering and before dropping
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // handler for after dropping block on fish
  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    fishId: number
  ) => {
    e.preventDefault();

    const cropId = Number(e.dataTransfer.getData("cropId"));
    const crop = crops.find(c => c.id === cropId);

    if (!crop) return;

    // Prevent re-scoring same crop
    if (matchedCrops.includes(cropId)) return;

    if (crop.fishMatch === fishId) {
      setScore(prev => prev + 1);
      setMatchedCrops(prev => [...prev, cropId]);
      setMessage("Correct match!");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1400);
    } else {
      setMessage("Try again!");
      setWrongFish(fishId);
      setTimeout(() => setWrongFish(null), 600);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {showConfetti && <Confetti />}

      <style>{`
      .wrong-shake {
        animation: card-shake 0.4s ease;
        border-color: #ef5350 !important;
      }
      @keyframes card-shake {
        0%, 100% { transform: translateX(0); }
        20%       { transform: translateX(-8px) rotate(-3deg); }
        40%       { transform: translateX(8px) rotate(3deg); }
        60%       { transform: translateX(-5px); }
        80%       { transform: translateX(5px); }
      }
    `}</style>

      <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
        Score: {score}
      </h2>

      {/* food blocks */}
      <div className="flex gap-4">
        {crops.map(crop => (
          <div
            key={crop.id}
            draggable={!matchedCrops.includes(crop.id)}
            onDragStart={(e) => handleDraggingStart(e, crop)}
            className={`stat-card plants ${matchedCrops.includes(crop.id) ? "opacity-40 grayscale cursor-default" : ""}`}
          >
            <img src={crop.image} alt={crop.name} className="w-16 h-16 object-contain" />
            <span>{crop.name}</span>
          </div>
        ))}
      </div>

      {/* All the fish */}
      <div className="flex gap-6">
        {fish.map(f => (
          <div
            key={f.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, f.id)}
            className={`stat-card water ${wrongFish === f.id ? "wrong-shake" : ""}`}
          >
            <img src={f.image} alt={f.name} className="w-16 h-16 object-contain" />
            <span>{f.name}</span>
          </div>
        ))}
        
      </div>

      

      {/* message for good or bad pair*/}
      <p className="h-6">{message}</p>
      {showCompletion && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-8 text-center">
      <div className="text-5xl mb-3">🏆</div>
      <h2 className="text-xl font-bold mb-2 text-gray-800">You matched them all!</h2>
      <p className="text-sm text-gray-500 mb-6 italic">
        Great job! You really know your fish and crops!
      </p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => { setScore(0); setMatchedCrops([]); setShowCompletion(false); }}
          className="btn btn-mint"
        >
          🔄 Play Again
        </button>
        
          <a href="/mini-game-5/lettuce-game"
          className="btn btn-green"
        >
          Next Game 🐟
        </a>
      </div>
    </div>
  </div>
)}
    </div>
    
  );
  
}
