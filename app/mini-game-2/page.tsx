// "use client";

// import { useState } from "react";
// import Link from "next/link";

// type GameState = {
//   fish: number;
//   bacteria: number;
//   plants: number;
//   temperature: number;
//   ammonia: number;
//   nitrite: number;
//   nitrate: number;
//   waterQuality: number;
// };

// export default function MiniGame2() {
//   const [gameState, setGameState] = useState<GameState>({
//     fish: 10,
//     bacteria: 5,
//     plants: 5,
//     temperature: 25,
//     ammonia: 0,
//     nitrite: 0,
//     nitrate: 0,
//     waterQuality: 100,
//   });

//   const recalculate = (newState: GameState) => {
//     let ammonia = newState.fish * 0.8;

//     let efficiencyMultiplier = 1;

//     if (newState.temperature < 18) {
//       efficiencyMultiplier = 0.5;
//     } else if (
//       newState.temperature >= 24 &&
//       newState.temperature <= 26
//     ) {
//       efficiencyMultiplier = 1.3;
//     }

//     const bacteriaPower =
//       newState.bacteria * 0.6 * efficiencyMultiplier;

//     const ammoniaConverted = Math.min(ammonia, bacteriaPower);
//     ammonia -= ammoniaConverted;
//     let nitrite = ammoniaConverted;

//     const nitriteConverted = Math.min(nitrite, bacteriaPower * 0.8);
//     nitrite -= nitriteConverted;
//     let nitrate = nitriteConverted;

//     const plantUptake = Math.min(
//       nitrate,
//       newState.plants * 0.7
//     );
//     nitrate -= plantUptake;

//     let waterQuality =
//       100 -
//       ammonia * 15 -
//       nitrite * 25 -
//       nitrate * 5;

//     waterQuality = Math.max(0, Math.min(100, waterQuality));

//     setGameState({
//       ...newState,
//       ammonia,
//       nitrite,
//       nitrate,
//       waterQuality,
//     });
//   };

//   const handleChange = (
//     key: keyof GameState,
//     value: number
//   ) => {
//     const updated = {
//       ...gameState,
//       [key]: value,
//     };

//     recalculate(updated);
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
//       <main className="flex w-full max-w-3xl flex-col items-center py-12 px-8 bg-white dark:bg-black">
//         <h1 className="text-3xl font-semibold mb-6">
//           Aquaponics Nitrogen and Nutrient Cycle
//         </h1>

//         <div className="w-full space-y-6">
//           <Slider
//             label="Fish"
//             value={gameState.fish}
//             onChange={(v) => handleChange("fish", v)}
//           />

//           <Slider
//             label="Bacteria"
//             value={gameState.bacteria}
//             onChange={(v) => handleChange("bacteria", v)}
//           />

//           <Slider
//             label="Plants"
//             value={gameState.plants}
//             onChange={(v) => handleChange("plants", v)}
//           />

//           <Slider
//             label="Temperature (°C)"
//             value={gameState.temperature}
//             onChange={(v) => handleChange("temperature", v)}
//             min={10}
//             max={35}
//           />
//         </div>

//         {/* Stats */}
//         <div className="mt-8 text-center space-y-2">
//           <p>Ammonia: {gameState.ammonia.toFixed(2)}</p>
//           <p>Nitrite: {gameState.nitrite.toFixed(2)}</p>
//           <p>Nitrate: {gameState.nitrate.toFixed(2)}</p>
//           <p className="font-bold">
//             Water Quality: {gameState.waterQuality.toFixed(1)}
//           </p>
//         </div>

//         {/* Visual Tank */}
//         <div
//           className="mt-8 w-full h-56 border-2 rounded-lg relative overflow-hidden transition-colors duration-300"
//           style={{
//             backgroundColor:
//               gameState.waterQuality > 70
//                 ? "#60a5fa"
//                 : gameState.waterQuality > 40
//                 ? "#facc15"
//                 : "#ef4444",
//           }}
//         >
//           {/* Fish Rendering */}
//           {Array.from({ length: gameState.fish }).map((_, i) => (
//             <img
//               key={i}
//               src="/fish.png"
//               alt="fish"
//               className="absolute w-8 h-8"
//               style={{
//                 left: `${(i * 37) % 90}%`,
//                 top: `${(i * 53) % 70}%`,
//               }}
//             />
//           ))}

//           {/* Plants Rendering */}
//             {Array.from({ length: gameState.plants }).map((_, i) => (
//               <span
//                 key={`plant-${i}`}
//                 className="absolute text-2xl"
//                 style={{
//                   left: `${(i * 15) % 95}%`,
//                   bottom: "5%",
//                 }}
//               >
//                 🌿
//               </span>
//             ))}
//         </div>

//         {/* System Status */}
//         <p className="font-bold mt-4 text-center text-lg">
//           {gameState.waterQuality > 70
//             ? "🌿 System Stable"
//             : gameState.waterQuality > 40
//             ? "⚠️ System Under Stress"
//             : "💀 System Collapsing"}
//         </p>

//         <nav className="mt-8 flex gap-4">
//           <Link href="/">Home</Link>
//           <Link href="/mini-game-1">Prev</Link>
//           <Link href="/mini-game-3">Next</Link>
//         </nav>
//       </main>
//     </div>
//   );
// }

// function Slider({
//   label,
//   value,
//   onChange,
//   min = 0,
//   max = 20,
// }: {
//   label: string;
//   value: number;
//   onChange: (val: number) => void;
//   min?: number;
//   max?: number;
// }) {
//   return (
//     <div>
//       <label className="block font-medium">
//         {label}: {value}
//       </label>
//       <input
//         type="range"
//         min={min}
//         max={max}
//         value={value}
//         onChange={(e) =>
//           onChange(Number(e.target.value))
//         }
//         className="w-full"
//       />
//     </div>
//   );
// }

"use client";

import { noDeprecation } from "process";
import { useState } from "react";

type Scenario =
  | "balanced"
  | "tooManyFish"
  | "tooFewPlants"
  | "coldTemp"
  | "noBacteria";

type QuizOption = {
  text: string;
  correct: boolean;
};

export default function MiniGame2() {
  const [scenario, setScenario] =
    useState<Scenario>("balanced");

  // const [answered, setAnswered] =
  //   useState<boolean>(false);

  const [locked, setLocked] = useState<boolean>(false);

  const [feedback, setFeedback] =
    useState<string>("");

  const scenarios = {
    balanced: {
      fish: 6,
      plants: 6,
      waterColor: "#60a5fa",
      fishIcon: "🐟",
      plantIcon: "🌿",
      message:
        "This is a balanced aquaponics system. Fish waste becomes nitrate, plants absorb it, and water stays clean.",
      quiz: [],
    },

    tooManyFish: {
      fish: 12,
      plants: 3,
      waterColor: "#ef4444",
      fishIcon: "🐠",
      plantIcon: "🌱",
      message:
        "Too many fish produce excess ammonia. Toxic waste builds up and fish become stressed.",
      quiz: [
        { text: "Add more fish", correct: false },
        { text: "Remove some fish", correct: true },
        { text: "Remove all plants", correct: false },
      ],
    },

    tooFewPlants: {
      fish: 6,
      plants: 1,
      waterColor: "#facc15",
      fishIcon: "🐟",
      plantIcon: "🥀",
      message:
        "Without enough plants, nitrate builds up in the water.",
      quiz: [
        { text: "Add more plants", correct: true },
        { text: "Add more fish", correct: false },
        { text: "Lower temperature", correct: false },
      ],
    },

    coldTemp: {
      fish: 6,
      plants: 6,
      waterColor: "#facc15",
      fishIcon: "🐠",
      plantIcon: "🌱",
      message:
        "Cold temperatures slow down nitrifying bacteria. Waste begins to accumulate.",
      quiz: [
        { text: "Lower the temperature more", correct: false },
        { text: "Raise the temperature", correct: true },
        { text: "Remove plants", correct: false },
      ],
    },

    noBacteria: {
      fish: 6,
      plants: 6,
      waterColor: "#ef4444",
      fishIcon: "🐟",
      plantIcon: "🥀",
      message:
        "Without bacteria, ammonia and nitrite don't convert to nitrate, which harms the fish and plants.",
      quiz: [
        { text: "Add more fish", correct: false },
        { text: "Remove plants", correct: false },
        { text: "Add beneficial bacteria", correct: true },
      ],
    },
  };

  const data = scenarios[scenario];

  const selectScenario = (newScenario: Scenario) => {
  setScenario(newScenario);
  setLocked(false);
  setFeedback("");
};

  const handleAnswer = (correct: boolean) => {
  if (correct) {
    setLocked(true);
    setFeedback("✅ Correct! The system is now balanced.");

    setTimeout(() => {
      setScenario("balanced");
      setLocked(false);
      setFeedback("");
    }, 1500);
  } else {
    setFeedback("❌ Not quite. Try again!");
  }
};

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <main className="flex w-full max-w-4xl flex-col items-center py-10 px-8 bg-white">

        <h1 className="text-3xl font-bold mb-4">
          Nitrogen Cycle Explorer
        </h1>

        <p className="text-center max-w-2xl mb-6">
          fish waste produces ammonia. this begins the process of the nitrogen cycle 
the bacteria in the system are responsible for converting the ammonia to nitrite, and then to nitrate (learn more about the bacteria in the system in game 4!) 
nitrate is the final product that we’re looking for our plants 
ammonia and nitrate are toxic 
plants take nitrate as a fertilizer to grow, which removes excess nitrates from the water. this allows the process to start over again and keeps a balanced system
the water is clean and the fish are happy :) (will insert image of the cycle if possible)

        play this game to understand how to keep the system balanced, and what happens when it becomes unbalanced!
        **this text will be a otter speech bubble **
        </p>

        {/* Scenario Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => selectScenario("tooManyFish")}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Too Many Fish
          </button>

          <button
            onClick={() => selectScenario("tooFewPlants")}
            className="bg-yellow-500 text-white px-3 py-1 rounded"
          >
            Remove Plants
          </button>

          <button
            onClick={() => selectScenario("coldTemp")}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Cold Temperature
          </button>

          <button onClick={() => selectScenario("noBacteria")} className="bg-purple-500 text-white px-3 py-1 rounded">No Bacteria </button>
        </div>

        {/* Tank */}
        <div
          className="w-full h-56 border-2 rounded-lg relative overflow-hidden transition-colors duration-500"
          style={{ backgroundColor: data.waterColor }}
        >
          {Array.from({ length: data.fish }).map((_, i) => (
            <span
              key={i}
              className="absolute text-2xl"
              style={{
                left: `${(i * 15) % 90}%`,
                top: `${(i * 20) % 70}%`,
              }}
            >
              {data.fishIcon}
            </span>
          ))}

          {Array.from({ length: data.plants }).map((_, i) => (
            <span
              key={i}
              className="absolute text-2xl"
              style={{
                left: `${(i + 1) *
                  (100 / (data.plants + 1))}%`,
                bottom: "5%",
              }}
            >
              {data.plantIcon}
            </span>
          ))}
        </div>

        {/* Explanation */}
        <div className="mt-6 p-4 bg-gray-100 rounded shadow max-w-2xl text-center">
          <p>{data.message}</p>
        </div>

        {/* Quiz Section */}
        {scenario !== "balanced" && (
          <div className="mt-6 text-center">
            <h2 className="font-semibold mb-3">
              How can we fix this system?
            </h2>

            <div className="flex flex-col gap-2">
              {data.quiz.map((option, index) => (
                <button
                  key={index}
                  onClick={() =>
                    handleAnswer(option.correct)
                  }
                  disabled={locked}
                  className="border px-3 py-1 rounded hover:bg-gray-200"
                >
                  {option.text}
                </button>
              ))}
            </div>

            {feedback && (
              <p className="mt-4 font-medium">
                {feedback}
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}






// things to change: 
// - add image of the cycle as reference
// - add otter speech bubble 
// - add more scenarios but make it harder to guess the correct answer
// - when you level up the scenarios will get harder and more complex, more factors to consider (like light, pH, etc) 
// - when you click wrong answer on quiz, it doesn't allow you to select another answer 
// - pixel art to differentiate between healthy and sad fish and plants 
// - add more feedback to the quiz answers, like why the correct answer is correct and why wrong is wrong 
// -  second wrong guess will say try one more time 
// - know what scenario you are in