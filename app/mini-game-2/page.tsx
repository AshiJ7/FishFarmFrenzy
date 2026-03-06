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

export default function MiniGame2() {
  const [scenario, setScenario] = useState<Scenario>("balanced");
  const [locked, setLocked] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>("");
  const [showInfo, setShowInfo] = useState<boolean>(true);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const scenarios = {
    balanced: {
      fish: 6,
      plants: 6,
      waterColor: "#60a5fa",
      fishIcon: "🐟",
      plantIcon: "🌿",
      message: "This is a balanced aquaponics system. Fish waste becomes nitrate, plants absorb it, and water stays clean.",
      quiz: [],
    },
    tooManyFish: {
      fish: 12,
      plants: 3,
      waterColor: "#ef4444",
      fishIcon: "🐠",
      plantIcon: "🌱",
      message: "Too many fish produce excess ammonia. Toxic waste builds up and fish become stressed.",
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
      message: "Without enough plants, nitrate builds up in the water.",
      quiz: [
        { text: "Add more plants", correct: true },
        { text: "Add more fish", correct: false },
        { text: "Lower temperature", correct: false },
      ],
    },
    coldTemp: {
      fish: 6,
      plants: 6,
      waterColor: "#93c5fd",
      fishIcon: "🐠",
      plantIcon: "🌱",
      message: "Cold temperatures slow down nitrifying bacteria. Waste begins to accumulate.",
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
      message: "Without bacteria, ammonia and nitrite don't convert to nitrate, which harms the fish and plants.",
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
    setSelectedAnswer(null);
  };

  const handleAnswer = (correct: boolean, index: number) => {
    setSelectedAnswer(index);
    if (correct) {
      setLocked(true);
      setFeedback("✅ Correct! The system is now balanced.");
      setTimeout(() => {
        setScenario("balanced");
        setLocked(false);
        setFeedback("");
        setSelectedAnswer(null);
      }, 1500);
    } else {
      setFeedback("❌ Not quite. Try again!");
    }
  };

  const scenarioButtons = [
    { key: "tooManyFish",  label: "Too Many Fish",     activeClass: "bg-red-700 border-red-900 ring-2 ring-red-300",    baseClass: "bg-red-500 hover:bg-red-600 border-transparent" },
    { key: "tooFewPlants", label: "Too Few Plants",    activeClass: "bg-yellow-600 border-yellow-800 ring-2 ring-yellow-300", baseClass: "bg-yellow-500 hover:bg-yellow-600 border-transparent" },
    { key: "coldTemp",     label: "Cold Temperature",  activeClass: "bg-blue-700 border-blue-900 ring-2 ring-blue-300",  baseClass: "bg-blue-500 hover:bg-blue-600 border-transparent" },
    { key: "noBacteria",   label: "No Bacteria",       activeClass: "bg-purple-700 border-purple-900 ring-2 ring-purple-300", baseClass: "bg-purple-500 hover:bg-purple-600 border-transparent" },
  ];

  return (
    <div className="min-h-screen w-full bg-slate-100">

      {/* INFO MODAL */}
      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">🦦</span>
              <div className="bg-blue-50 border border-blue-200 rounded-2xl rounded-tl-none px-4 py-2 text-sm text-blue-800 font-medium">
                Hi! I'm Otto the Otter. Let me explain how this works!
              </div>
            </div>
            <h2 className="text-xl font-bold mb-3 text-gray-800">How the Nitrogen Cycle Works</h2>
            <ul className="space-y-2 text-sm text-gray-700 mb-6">
              <li className="flex gap-2"><span>🐟</span><span>Fish waste produces <strong>ammonia</strong> — this starts the nitrogen cycle.</span></li>
              <li className="flex gap-2"><span>🦠</span><span>Bacteria convert <strong>ammonia → nitrite → nitrate</strong>.</span></li>
              <li className="flex gap-2"><span>⚠️</span><span>Ammonia and nitrite are <strong>toxic</strong> to fish and plants.</span></li>
              <li className="flex gap-2"><span>🌿</span><span>Plants absorb <strong>nitrate</strong> as fertilizer, cleaning the water.</span></li>
              <li className="flex gap-2"><span>♻️</span><span>Clean water returns to the fish — the cycle starts again!</span></li>
            </ul>
            <p className="text-sm text-gray-500 mb-6 italic">
              Play this game to understand how to keep the system balanced, and what happens when it becomes unbalanced!
            </p>
            <button
              onClick={() => setShowInfo(false)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              Let's Play! 🎮
            </button>
          </div>
        </div>
      )}

      {/* MAIN GAME */}
      <main className="relative flex w-full min-h-screen flex-col items-center py-10 px-6 lg:px-16">

        {/* Floating otter button — bottom right */}
        <div className="fixed bottom-6 right-6 z-40 group flex flex-col items-center gap-1">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs font-semibold px-3 py-1 rounded-full shadow pointer-events-none">
            Learn More
          </span>
          <button
            onClick={() => setShowInfo(true)}
            className="bg-blue-100 hover:bg-blue-200 border-2 border-blue-300 rounded-full w-20 h-20 text-4xl shadow-lg transition-colors flex items-center justify-center"
          >
            🦦
          </button>
        </div>

        {/* Page header */}
        <div className="w-full max-w-4xl mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Nitrogen Cycle Explorer</h1>
          <p className="text-gray-500 text-sm">Select a scenario to see what happens to the aquaponics system</p>
        </div>

        {/* Scenario buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {scenarioButtons.map(({ key, label, activeClass, baseClass }) => (
            <button
              key={key}
              onClick={() => selectScenario(key as Scenario)}
              className={`px-5 py-2 rounded-md text-white font-semibold text-sm transition-all border-2 shadow-sm ${
                scenario === key ? `${activeClass} scale-105 shadow-md` : baseClass
              }`}
            >
              {label}
            </button>

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
        </div>

        {/* Tank area */}
        <div className="w-full max-w-4xl">

          {/* Status bar */}
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Aquaponics Tank</span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full transition-colors ${
              scenario === "balanced" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
            }`}>
              {scenario === "balanced" ? "✅ System Balanced" : "⚠️ System Unbalanced"}
            </span>
          </div>

          {/* Glass tank */}
          <div
            className="relative rounded-2xl overflow-hidden shadow-2xl"
            style={{
              border: "5px solid #cbd5e1",
              borderBottom: "10px solid #94a3b8",
              height: "300px",
            }}
          >
            <div className="absolute inset-0 transition-colors duration-700" style={{ backgroundColor: data.waterColor }} />
            <div className="absolute inset-0 pointer-events-none" style={{
              background: "linear-gradient(160deg, rgba(255,255,255,0.25) 0%, transparent 55%)"
            }} />

            {Array.from({ length: data.fish }).map((_, i) => (
              <span
                key={i}
                className="absolute text-3xl select-none"
                style={{
                  left: `${(i * 17 + 5) % 85}%`,
                  top: `${(i * 23 + 8) % 60}%`,
                  transform: i % 2 === 0 ? "scaleX(-1)" : "scaleX(1)",
                  filter: scenario !== "balanced" ? "saturate(0.5) brightness(0.85)" : "none",
                  transition: "filter 0.6s",
                  zIndex: 2,
                }}
              >
                {data.fishIcon}
              </span>
            ))}

            <div
              className="absolute bottom-0 left-0 right-0 flex items-end"
              style={{
                height: "72px",
                background: "linear-gradient(to top, #b5865a 0%, #d4a96a 60%, #e8c98a 100%)",
                zIndex: 3,
              }}
            >
              {[8, 22, 38, 55, 68, 80, 91].map((pos, i) => (
                <div key={i} className="absolute rounded-full" style={{
                  left: `${pos}%`, bottom: `${4 + (i % 4) * 3}px`,
                  width: `${10 + (i % 3) * 5}px`, height: `${7 + (i % 2) * 4}px`,
                  backgroundColor: i % 2 === 0 ? "#92622a" : "#7a4f20", opacity: 0.5,
                }} />
              ))}
              {Array.from({ length: data.plants }).map((_, i) => (
                <span key={i} className="absolute text-3xl select-none" style={{
                  left: `${(i + 0.8) * (88 / (data.plants + 1))}%`,
                  bottom: "10px", lineHeight: 1, zIndex: 4,
                }}>
                  {data.plantIcon}
                </span>
              ))}
            </div>
          </div>

          {/* Info + stats row */}
          <div className="flex gap-3 mt-4">
            <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-center shadow-sm min-w-[80px]">
              <div className="text-2xl mb-0.5">🐟</div>
              <div className="text-xl font-bold text-blue-600">{data.fish}</div>
              <div className="text-xs text-gray-400 font-medium">Fish</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-center shadow-sm min-w-[80px]">
              <div className="text-2xl mb-0.5">🌿</div>
              <div className="text-xl font-bold text-green-600">{data.plants}</div>
              <div className="text-xs text-gray-400 font-medium">Plants</div>
            </div>
            <div
              className="flex-1 rounded-xl px-5 py-3 flex items-center gap-3 border shadow-sm"
              style={{ backgroundColor: `${data.waterColor}22`, borderColor: `${data.waterColor}88` }}
            >
              <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: data.waterColor }} />
              <p className="text-sm text-gray-700 leading-snug">{data.message}</p>
            </div>
          </div>
        </div>

        {/* Quiz Section */}
        {scenario !== "balanced" && (
          <div className="mt-8 w-full max-w-4xl">
            <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-md p-6">
              <div className="flex items-center gap-2 mb-5">
                <span className="text-2xl">🔧</span>
                <h2 className="text-lg font-bold text-gray-800">How can we fix this system?</h2>
              </div>

              <div className="flex flex-col gap-3">
                {data.quiz.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = option.correct;
                  let btnStyle = "bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-400 hover:bg-blue-50";
                  if (isSelected && isCorrect) btnStyle = "bg-green-100 border-2 border-green-500 text-green-800";
                  else if (isSelected && !isCorrect) btnStyle = "bg-red-100 border-2 border-red-400 text-red-800";

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswer(option.correct, index)}
                      disabled={locked}
                      className={`w-full text-left px-5 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-3 ${btnStyle}`}
                    >
                      <span className="w-7 h-7 rounded-full border-2 border-current flex items-center justify-center text-sm font-bold shrink-0">
                        {String.fromCharCode(65 + index)}
                      </span>
                      {option.text}
                      {isSelected && (
                        <span className="ml-auto text-lg">{isCorrect ? "✅" : "❌"}</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {feedback && (
                <div className={`mt-5 px-4 py-3 rounded-xl text-sm font-semibold text-center ${
                  feedback.startsWith("✅") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"
                }`}>
                  {feedback}
                </div>
              )}
            </div>
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
