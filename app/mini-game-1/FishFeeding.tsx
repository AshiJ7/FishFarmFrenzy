"use client";
import { useEffect, useRef, useState } from "react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../lib/firebase";

type Food = {
  id: number;
  name: string;
  image: string;
  tilapiaGood: boolean;
  troutGood: boolean;
  salmonGood: boolean;
};

type FishGoodKey = "tilapiaGood" | "troutGood" | "salmonGood";

export default function FishFeeding() {
  const { user } = useAuth();
  const fishImagePaths: Record<string, string> = {
    Tilapia: "/tilapia_image.png",
    Trout: "/trout_image.png",
    Salmon: "/salmon_image.png",
  };

  // hardcode good and bad foods with boolean for each fish
  const foods: Food[] = [
    {
      id: 1,
      name: "Cookies",
      image: "/cookies.png",
      tilapiaGood: false,
      troutGood: false,
      salmonGood: false
    },
    {
      id: 2,
      name: "Algae",
      image: "/water_plant.png",
      tilapiaGood: true,
      troutGood: false,
      salmonGood: false
    },
    {
      id: 3,
      name: "Cake",
      image: "/cake.png",
      tilapiaGood: false,
      troutGood: false,
      salmonGood: false
    },
    {
      id: 4,
      name: "Duckweed",
      image: "/water_plant.png",
      tilapiaGood: true,
      troutGood: false,
      salmonGood: false
    },
    {
      id: 5,
      name: "Water lettuce",
      image: "/water_plant.png",
      tilapiaGood: true,
      troutGood: false,
      salmonGood: false
    },
    {
      id: 6,
      name: "Rice bran",
      image: "/rice_bran.png",
      tilapiaGood: true,
      troutGood: false,
      salmonGood: false
    },
    {
      id: 7,
      name: "Corn meal",
      image: "/fish_meal.png",
      tilapiaGood: true,
      troutGood: false,
      salmonGood: false
    },
    {
      id: 8,
      name: "Soybean meal",
      image: "/fish_meal.png",
      tilapiaGood: true,
      troutGood: false,
      salmonGood: false
    },
    {
      id: 9,
      name: "Mayflies",
      image: "/fly.png",
      tilapiaGood: false,
      troutGood: true,
      salmonGood: true
    },
    {
      id: 10,
      name: "Stoneflies",
      image: "/fly.png",
      tilapiaGood: false,
      troutGood: true,
      salmonGood: true
    },
    {
      id: 11,
      name: "Caddisflies",
      image: "/fly.png",
      tilapiaGood: false,
      troutGood: true,
      salmonGood: true
    },
    {
      id: 12,
      name: "Crawfish",
      image: "/shrimp.png",
      tilapiaGood: false,
      troutGood: true,
      salmonGood: true
    },
    {
      id: 13, 
      name: "Worms",
      image: "/worms.png",
      tilapiaGood: false,
      troutGood: true,
      salmonGood: true
    },
    {
      id: 14,
      name: "Herring",
      image: "/herring.png",
      tilapiaGood: false,
      troutGood: true,
      salmonGood: true
    },
    {
      id: 15,
      name: "Shrimp",
      image: "/shrimp.png",
      tilapiaGood: false,
      troutGood: true,
      salmonGood: true
    },
    {
      id: 16,
      name: "Krill",
      image: "/shrimp.png",
      tilapiaGood: false,
      troutGood: true,
      salmonGood: true
    },
  ];

  const fish: string[] = ["Tilapia", "Trout", "Salmon"];

  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const [usedFoodArr, setUsedFoodArr] = useState<number[]>([]);
  const [foodNum, setFoodNum] = useState(Math.floor(Math.random() * foods.length));
  const [gameOver, setGameOver] = useState(false);
  const [fishSelected, setFishSelected] = useState(false);
  const [currentFish, setCurrentFish] = useState("");
  const [fishGood, setFishGood] = useState<FishGoodKey | null>(null);
  const [bestScore, setBestScore] = useState(0);
  const [progressStatus, setProgressStatus] = useState("");
  const hasSavedGameOver = useRef(false);
  const currentFishImage = fishImagePaths[currentFish] ?? "";

  // load in users' old progress if it exists
  useEffect(() => {
    const loadProgress = async () => {
      if (!user) return;

      const progressRef = doc(db, "users", user.uid, "progress", "miniGame1");
      const snapshot = await getDoc(progressRef);

      if (snapshot.exists()) {
        const data = snapshot.data();
        const savedBestScore = data.bestScore;
        if (typeof savedBestScore === "number") {
          setBestScore(savedBestScore);
        }
      }
    };

    loadProgress().catch(() => {
      setProgressStatus("Could not load saved progress");
    });
  }, [user]);

  const saveProgress = async (finalScore: number) => {
    if (!user) return;

    const nextBestScore = Math.max(bestScore, finalScore);
    const progressRef = doc(db, "users", user.uid, "progress", "miniGame1");

    await setDoc(
      progressRef,
      {
        bestScore: nextBestScore,
        lastScore: finalScore,
        lastFish: currentFish,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    setBestScore(nextBestScore);
    setProgressStatus("Progress saved");
  };

  // save progress when game is over 
  useEffect(() => {
    if (!gameOver || hasSavedGameOver.current) return;

    hasSavedGameOver.current = true;
    saveProgress(score).catch(() => {
      setProgressStatus("Could not save progress");
    });
  }, [gameOver, score, user]);

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

  const restartGame = () => {
    setScore(0);
    setMessage("");
    setProgressStatus("");
    setUsedFoodArr([]);
    setFoodNum(Math.floor(Math.random() * foods.length));
    setFishSelected(false);
    setGameOver(false);
    hasSavedGameOver.current = false;
    setFishSelected(false);
    setCurrentFish("");
    setFishGood(null);
  };

  // fish selection screen
  if (!fishSelected) {
    return (
      <div className="bg-[url(../public/minigame_1_background.png)] flex flex-col items-center gap-6 px-30 py-30">
        <h2 className="text-2xl font-bold"> Select Fish </h2>
        <div className="flex gap-4">
          {fish.map((fishName) => (
            <button
              key={fishName}
              name={fishName}
              className="flex h-30 w-30 flex-col items-center justify-center gap-2 border-1 border-solid border-black hover:bg-gray-200"
              onClick={handleFishSelection}
            >
              <img
                src={fishImagePaths[fishName]}
                alt={fishName}
                className="pointer-events-none h-12 w-12 select-none object-contain"
              />
              <span>{fishName}</span>
            </button>
          ))}

        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="bg-[url(../public/minigame_1_background.png)] flex flex-col items-center gap-6 px-30 py-30">
        <h2 className="text-2xl font-bold"> Game Over </h2>
        <p className="text-lg"> Final Score: {score} </p>
        <div className="flex gap-10">
          <button
          name="Start Over"
          onClick={restartGame}
          className="flex h-10 w-30 items-center justify-center border-1 border-solid border-black hover:bg-gray-200"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[url(../public/minigame_1_background.png)] flex flex-col items-center gap-6 px-30 py-30">

      <h2 className="text-xl font-bold">
        Score: {score}
      </h2>
      <p className="text-sm">Best Score: {bestScore}</p>

      {/* food blocks */}
      <div className="flex gap-4">
          <div
            key={foods[foodNum].id}
            draggable
            onDragStart={(e) => handleDraggingStart(e, foods[foodNum])}
            className="cursor-grab solid border border-black px-6 py-4 bg-white-100 hover:bg-gray-200"
          >
            <img
              src={foods[foodNum].image}
              alt={foods[foodNum].name}
              className="pointer-events-none h-12 w-12 select-none object-contain"
            />
            {foods[foodNum].name}
          </div>
      </div>

      {/* fish block */}
      <div className="flex gap-4">
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="fish flex h-30 w-30 flex-col items-center justify-center gap-1 border-1 border-solid border-black"
        >
          {currentFishImage && (
            <img
              src={currentFishImage}
              alt={currentFish}
              className="pointer-events-none h-12 w-12 select-none object-contain"
            />
          )}
          <span>{currentFish}</span>
        </div>

        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="trash flex h-30 w-30 flex-col items-center justify-center gap-1 border-1 border-solid border-black"
        >
          <img
            src="/trashcan.png"
            alt="trash can"
            className="pointer-events-none h-12 w-12 select-none object-contain"
          />
          Trash
          {/* <span className="text-[10px] leading-none">Trash</span> */}
        </div>
      </div>

      {/* message for good or bad food */}
      <p className="h-6"> {message} </p>
      <p className="h-6 text-sm">{progressStatus}</p>
    </div>
  );
}
