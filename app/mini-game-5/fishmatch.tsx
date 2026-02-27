//using Teji's fish feeding as a basis
"use client";
import { useState } from "react";

type Crop = {
  id: number;
  name: string;
  fishMatch: number;
};

type Fish ={
    id: number;
    name: string;
}

export default function FishCropMatch() {
  
  const crops: Crop[] = [
    { id: 1, name: "Lettuce", fishMatch: 1 },
    { id: 2, name: "Spinach", fishMatch: 2 },
    { id: 3, name: "Kale", fishMatch: 3 },
  ];

  const fish: Fish[] = [
    { id: 1, name: "Tilapia" },
    { id: 2, name: "Catfish" },
    { id: 3, name: "Trout" },
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

      <h2 className="text-xl font-bold">
        Score: {score}
      </h2>

      {/* food blocks */}
      <div className="flex gap-4">
        {crops.map(crop => (
          <div
            key={crop.id}
            draggable={!matchedCrops.includes(crop.id)}
            onDragStart={(e) => handleDraggingStart(e, crop)}
            className="cursor-grab solid border border-black px-6 py-4 bg-white-100 hover:bg-gray-200"
          >
            {crop.name}
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
            className="flex h-32 w-32 items-center justify-center border border-black"
          >
            {f.name}
          </div>
        ))}
      </div>

      {/* message for good or bad food */}
      <p className="h-6">{message}</p>
    </div>
  );
}
