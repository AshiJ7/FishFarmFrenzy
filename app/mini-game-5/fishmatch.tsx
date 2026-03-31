//using Teji's fish feeding as a basis
"use client";
import { useState } from "react";

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
    } else {
      setMessage("Try again!");
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">

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
            className="stat-card plants"
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
            className="stat-card water"
          >
            <img src={f.image} alt={f.name} className="w-16 h-16 object-contain" />
            <span>{f.name}</span>
          </div>
        ))}
      </div>

      {/* message for good or bad pair*/}
      <p className="h-6">{message}</p>
    </div>
  );
}
