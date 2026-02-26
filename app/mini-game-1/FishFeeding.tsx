"use client";
import { useState } from "react";

type Food = {
  id: number;
  name: string;
  tilapiaGood: boolean;
  troutGood: boolean;
  salmonGood: boolean;
};

type FishGoodKey = "tilapiaGood" | "troutGood" | "salmonGood";

export default function FishFeeding() {
  // hardcode good and bad foods with boolean for each fish
  const foods: Food[] = [
    {
      id: 1,
      name: "Cookies",
      tilapiaGood: false,
      troutGood: false,
      salmonGood: false
    },
    {
      id: 2,
      name: "Algae",
      tilapiaGood: true,
      troutGood: false,
      salmonGood: false
    },
    {
      id: 3,
      name: "Cake",
      tilapiaGood: false,
      troutGood: false,
      salmonGood: false
    },
    {
      id: 4,
      name: "Duckweed",
      tilapiaGood: true,
      troutGood: false,
      salmonGood: false
    },
    {
      id: 5,
      name: "Water lettuce",
      tilapiaGood: true,
      troutGood: false,
      salmonGood: false
    },
    {
      id: 6,
      name: "Rice bran",
      tilapiaGood: true,
      troutGood: false,
      salmonGood: false
    },
    {
      id: 7,
      name: "Corn meal",
      tilapiaGood: true,
      troutGood: false,
      salmonGood: false
    },
    {
      id: 8,
      name: "Soybean meal",
      tilapiaGood: true,
      troutGood: false,
      salmonGood: false
    },
    {
      id: 9,
      name: "Mayflies",
      tilapiaGood: false,
      troutGood: true,
      salmonGood: true
    },
    {
      id: 10,
      name: "Stoneflies",
      tilapiaGood: false,
      troutGood: true,
      salmonGood: true
    },
    {
      id: 11,
      name: "Caddisflies",
      tilapiaGood: false,
      troutGood: true,
      salmonGood: true
    },
    {
      id: 12,
      name: "Crawfish",
      tilapiaGood: false,
      troutGood: true,
      salmonGood: true
    },
    {
      id: 13, 
      name: "Worms",
      tilapiaGood: false,
      troutGood: true,
      salmonGood: true
    },
    {
      id: 14,
      name: "Herring",
      tilapiaGood: false,
      troutGood: true,
      salmonGood: true
    },
    {
      id: 15,
      name: "Shrimp",
      tilapiaGood: false,
      troutGood: true,
      salmonGood: true
    },
    {
      id: 16,
      name: "Krill",
      tilapiaGood: false,
      troutGood: true,
      salmonGood: true
    },
  ];

  const fish: string[] = ["Tilapia", "Trout", "Salmon"];

  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const [usedFoodArr, setUsedFoodArr] = useState<number[]>([]);
  const [foodNum, setFoodNum] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [fishSelected, setFishSelected] = useState(false);
  const [currentFish, setCurrentFish] = useState("");
  const [fishGood, setFishGood] = useState<FishGoodKey | null>(null);

  // randomly selects next food to appear from foods not yet used after current food has been dropped
  function getNextFoodIndex(used: number[]) {
    if (used.length >= foods.length) {
      return null;
    }

    const availableIndexes = foods
      .map((_, index) => index)
      .filter((index) => !used.includes(index));

    const randomAvailableIndex = Math.floor(
      Math.random() * availableIndexes.length
    );

    return availableIndexes[randomAvailableIndex];
  }

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
    if (gameOver) return;

    e.preventDefault();

    const foodId = Number(e.dataTransfer.getData("foodId"));
    const droppedFood = foods.find(f => f.id === foodId);

    if (!droppedFood) return;


    const selectedFishGood = fishGood
       ? droppedFood[fishGood]
       : null;
        
    if (e.currentTarget.className.includes("fish")) {
      if (selectedFishGood) {
        setScore((prev) => prev + 1);
        setMessage("Good food");
      }
      else {
        setMessage("Bad food");
      }
    }
    else if (e.currentTarget.className.includes("trash")) {
      if (!selectedFishGood) {
        setScore((prev) => prev + 1);
        setMessage("Correct - Bad food in trash");
      }
      else {
        setMessage("Incorrect - good food in trash");
      }
    }

    // update used food array with food just dropped and either get new food block or end game
    setUsedFoodArr((prev) => {
      const updated = [...prev, foodNum];
      const nextFood = getNextFoodIndex(updated);

      if (nextFood === null) {
        setGameOver(true);
      }
      else {
        setFoodNum(nextFood);
      }

      return updated;
    });
  };

  const handleFishSelection = (e: React.MouseEvent<HTMLButtonElement>) => {
    const currFish = e.currentTarget.name;
    const fishKey = `${currFish.toLowerCase()}Good` as FishGoodKey;

    setCurrentFish(currFish);
    setFishSelected(true);
    setFishGood(fishKey);
  };


  // fish selection screen
  if (!fishSelected) {
    return (
      <div className="bg-blue-500 flex flex-col items-center gap-6 px-30 py-30">
        <h2 className="text-2xl font-bold"> Select Fish </h2>
        <div className="flex gap-4">
          {fish.map((fishName) => (
            <button
              key={fishName}
              name={fishName}
              className="flex h-30 w-30 items-center justify-center border-1 border-solid border-black hover:bg-gray-200"
              onClick={handleFishSelection}
            >
              {fishName}
            </button>
          ))}

        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="bg-blue-500 flex flex-col items-center gap-6 px-30 py-30">
        <h2 className="text-2xl font-bold"> Game Over </h2>
        <p className="text-lg"> Final Score: {score} </p>
      </div>
    );
  }

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

      {/* fish block */}
      <div className="flex gap-4">
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="flex h-30 w-30 items-center justify-center border-1 border-solid border-black fish"
        >
          {currentFish}
        </div>

        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="flex h-30 w-30 items-center justify-center border-1 border-solid border-black trash"
        >
          Trash
        </div>
      </div>

      {/* message for good or bad food */}
      <p className="h-6"> {message} </p>
    </div>
  );
}
