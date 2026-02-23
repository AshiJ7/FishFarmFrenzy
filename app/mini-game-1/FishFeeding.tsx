"use client";
import { useState } from "react";

type Food = {
  id: number;
  name: string;
  isGood: boolean;
};


export default function FishFeeding() {
  // hardcode good and bad foods for now
  const foods: Food[] = [
    { id: 1, name: "Cookies", isGood: false },
    { id: 2, name: "Algae", isGood: true },
    { id: 3, name: "Cake", isGood: false },
  ];

  const usedFoodArr: integer[] = [];

  function randomizeFoods() {
    let min = 0;
    let max = 2;

    // from geeksforgeeks
    let random = Math.floor(Math.random() * (max - min + 1)) + min;

    if (usedFoodArr.includes(random)) {
      randomizeFoods();
    }

    console.log("random ", random);

    usedFoodArr.push(random);

    console.log(usedFoodArr);

    return random;
  }

  let foodNum: integer = randomizeFoods();

  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");

  // store the id of dragged food in dataTransfer object
  const handleDraggingStart = (
    e: React.DragEvent<HTMLDivElement>,
    food: Food
  ) => {
    e.dataTransfer.setData("foodId", food.id.toString());
  };

  // allows dragging while still hovering and before dropping
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // handler for after dropping block on fish
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const foodId = Number(e.dataTransfer.getData("foodId"));
    const droppedFood = foods.find(f => f.id === foodId);

    if (!droppedFood) return;

    if (droppedFood.isGood) {
      setScore(score + 1);
      setMessage("Good food");
    }
    else {
      setMessage("Bad food");
    }
  };

  return (
    <div className="bg-blue-500 flex flex-col items-center gap-6 px-30 py-30">

      <h2 className="text-xl font-bold">
        Score: {score}
      </h2>

      {/* food blocks */}
      <div className="flex gap-4">
          <div
            key={foods[foodNum].id}
            draggable
            onDragStart={(e) => handleDraggingStart(e, foods[foodNum])}
            className="cursor-grab solid border border-black px-6 py-4 bg-white-100 hover:bg-gray-200"
          >
            {foods[foodNum].name}
          </div>
      </div>

      {/* food blocks
      <div className="flex gap-4">
        {foods.map(food => (
          <div
            key={food}
            draggable
            onDragStart={(e) => handleDraggingStart(e, food)}
            className="cursor-grab solid border border-black px-6 py-4 bg-white-100 hover:bg-gray-200"
          >
            {food.name}
          </div>
        ))}
      </div> */}

      {/* fish block */}
      <div className="flex gap-4">
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="flex h-30 w-30 items-center justify-center border-1 border-solid border-black"
        >
          Tilapia
        </div>

        <div
          className="flex h-30 w-30 items-center justify-center border-1 border-solid border-black"
        >
          Trash
        </div>
      </div>

      {/* message for good or bad food */}
      <p className="h-6">{message}</p>
    </div>
  );
}
