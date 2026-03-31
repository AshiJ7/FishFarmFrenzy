//have to implement scoring system 

"use client";

import { useState, useMemo } from "react";

const BubbleBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    {[...Array(18)].map((_, i) => {
      const size = 12 + Math.random() * 24;
      return (
        <div
          key={i}
          className="absolute rounded-full opacity-40"
          style={{
            bottom: "-60px",
            left: `${Math.random() * 100}%`,
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: "var(--periwinkle)",
            animation: `floatUp ${8 + Math.random() * 8}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      );
    })}
    <style>{`
      @keyframes floatUp {
        0% { transform: translateY(0) scale(1); opacity: 0.4; }
        100% { transform: translateY(-120vh) scale(1.3); opacity: 0; }
      }
    `}</style>
  </div>
);

type Scenario =
  | "balanced"
  | "tooManyFish"
  | "tooFewPlants"
  | "coldTemp"
  | "noBacteria"
  | "overfeeding"
  | "poorCirculation"
  | "highPH";

  //line for fish to swim across in the tank 
const FISH_LANES = [
  { laneY: 8,  duration: 8,  delay: 0,   startDir:  1 },
  { laneY: 22, duration: 11, delay: 2.5, startDir: -1 },
  { laneY: 36, duration: 9,  delay: 1,   startDir:  1 },
  { laneY: 50, duration: 13, delay: 4,   startDir: -1 },
  { laneY: 15, duration: 10, delay: 3,   startDir:  1 },
  { laneY: 42, duration: 12, delay: 0.5, startDir: -1 },
  { laneY: 28, duration: 7,  delay: 1.8, startDir:  1 },
  { laneY: 55, duration: 14, delay: 3.5, startDir: -1 },
  { laneY: 10, duration: 9,  delay: 5,   startDir:  1 },
  { laneY: 45, duration: 11, delay: 2,   startDir: -1 },
  { laneY: 32, duration: 8,  delay: 0.8, startDir:  1 },
  { laneY: 20, duration: 13, delay: 4.2, startDir: -1 },
];

const WATER_BUBBLES = [
  { left: 10, delay: 0,   duration: 4   },
  { left: 25, delay: 1.5, duration: 5   },
  { left: 42, delay: 0.8, duration: 3.5 },
  { left: 58, delay: 2.2, duration: 4.5 },
  { left: 73, delay: 0.3, duration: 5   },
  { left: 88, delay: 1.8, duration: 3.8 },
  { left: 18, delay: 3,   duration: 4.2 },
  { left: 65, delay: 2.7, duration: 3.2 },
];


type QuizOption = {
  text: string;
  correct: boolean;
  feedback: string;
};

type ScenarioData = {
  fish: number;
  plants: number;
  waterColor: string;
  message: string;
  quiz: QuizOption[];
};

//define all the scenarios with their quiz options 
const scenarios: Record<Scenario, ScenarioData> = {
  balanced: {
    fish: 6,
    plants: 6,
    waterColor: "#60a5fa",
    message: "This is a balanced aquaponics system. Fish waste converts to nitrate, plants absorb it as fertilizer, and the water stays clean.",
    quiz: [],
  },
  tooManyFish: {
    fish: 12,
    plants: 3,
    waterColor: "#ef4444",
    message: "Too many fish produce more waste than the system can handle, causing toxic ammonia to build up.",
    quiz: [
      {
        text: "Add more fish",
        correct: false,
        feedback: "❌ Adding more fish would make things much worse as more fish means even more ammonia. This would overwhelm the bacteria and plants further.",
      },
      {
        text: "Remove some fish",
        correct: true,
        feedback: "✅ Correct! Fewer fish means less waste produced, giving bacteria time to catch up and plants enough nitrate without being overwhelmed.",
      },
      {
        text: "Remove all plants",
        correct: false,
        feedback: "❌ Plants are what absorb nitrate and clean the water. Removing them would leave nitrate with nowhere to go, making the problem worse.",
      },
    ],
  },
  tooFewPlants: {
    fish: 6,
    plants: 1,
    waterColor: "#facc15",
    message: "Without enough plants, nitrate from fish waste builds up in the water with nowhere to go.",
    quiz: [
      {
        text: "Add more plants",
        correct: true,
        feedback: "✅ Correct! More plants means more nitrate gets absorbed. Plants are the final step in the nitrogen cycle since they clean the water for the fish.",
      },
      {
        text: "Add more fish",
        correct: false,
        feedback: "❌ More fish would create even more nitrate. With only one plant already struggling to absorb it, adding fish makes the imbalance worse.",
      },
      {
        text: "Lower temperature",
        correct: false,
        feedback: "❌ Lowering temperature would actually slow down the bacteria that convert ammonia, creating a new problem on top of the existing one.",
      },
    ],
  },
  coldTemp: {
    fish: 6,
    plants: 6,
    waterColor: "#93c5fd",
    message: "Cold temperatures slow down the nitrifying bacteria, so ammonia isn't being converted fast enough, even if there are enough fish and plants.",
    quiz: [
      {
        text: "Lower the temperature more",
        correct: false,
        feedback: "❌ That would make the bacteria even slower. Nitrifying bacteria are most active between 25–30°C, so going colder shuts them down further.",
      },
      {
        text: "Raise the temperature",
        correct: true,
        feedback: "✅ Correct! Warmer water speeds up bacterial metabolism, so ammonia gets converted to nitrate faster, restoring the cycle.",
      },
      {
        text: "Remove plants",
        correct: false,
        feedback: "❌ The plants aren't the problem here. The bacteria are sluggish from the cold. Removing plants would eliminate the system's ability to absorb nitrate once the bacteria recover.",
      },
    ],
  },
  noBacteria: {
    fish: 6,
    plants: 6,
    waterColor: "#ef4444",
    message: "Without nitrifying bacteria, ammonia from fish waste can't convert to nitrate. Even with healthy plants and enough fish, the cycle is broken.",
    quiz: [
      {
        text: "Add more fish",
        correct: false,
        feedback: "❌ More fish means more ammonia with no bacteria to process it. The water would become toxic even faster.",
      },
      {
        text: "Remove plants",
        correct: false,
        feedback: "❌ Plants need nitrate to grow, which bacteria produce. Without bacteria, there's no nitrate anyway, and removing plants removes the system's only cleanup mechanism.",
      },
      {
        text: "Add beneficial bacteria",
        correct: true,
        feedback: "✅ Correct! Nitrifying bacteria are the bridge between fish waste and plant food. Without them, the whole cycle collapses; adding them restarts it.",
      },
    ],
  },
  overfeeding: {
    fish: 6,
    plants: 6,
    waterColor: "#b45309",
    message: "The fish are being overfed. Uneaten food sinks, rots, and releases extra ammonia. Even though the fish and plant counts look balanced, this creates a problem.",
    quiz: [
      {
        text: "Add more plants to absorb the extra nutrients",
        correct: false,
        feedback: "❌ More plants help with nitrate, but the real problem is rotting food producing ammonia faster than bacteria can process. The source of the excess needs to be addressed first.",
      },
      {
        text: "Reduce feeding amount and frequency",
        correct: true,
        feedback: "✅ Correct! Overfeeding is one of the most common aquaponics mistakes. Less food means less uneaten waste, less ammonia, and a healthier cycle - even without changing fish or plant counts.",
      },
      {
        text: "Add more bacteria",
        correct: false,
        feedback: "❌ While more bacteria could temporarily help, it doesn't fix the root cause. If overfeeding continues, bacteria will always be overwhelmed. Fixing the input is the right move.",
      },
    ],
  },
  poorCirculation: {
    fish: 6,
    plants: 6,
    waterColor: "#6b7280",
    message: "The water pump is underperforming. Water isn't circulating properly, so ammonia is pooling near the fish and bacteria aren't getting enough oxygen to work.",
    quiz: [
      {
        text: "Add more fish to produce more ammonia for the bacteria",
        correct: false,
        feedback: "❌ The bacteria aren't struggling because of too little ammonia. They're struggling because of low oxygen from poor flow. More fish just adds more stress to an already oxygen-depleted system.",
      },
      {
        text: "Fix or upgrade the pump to restore water flow",
        correct: true,
        feedback: "✅ Correct! Good circulation is essential since it oxygenates the water, delivers ammonia to bacteria evenly, and moves nitrate to plant roots. A working pump is the foundation of the whole system.",
      },
      {
        text: "Remove some plants to reduce oxygen demand",
        correct: false,
        feedback: "❌ Plants actually help oxygenate water through photosynthesis. Removing them would reduce oxygen further. The pump is the real issue.",
      },
    ],
  },
  highPH: {
    fish: 6,
    plants: 6,
    waterColor: "#7c3aed",
    message: "The water pH has risen above 8.0. At high pH, ammonia becomes more toxic, bacteria slow down, and plants can't absorb nutrients as efficiently, even if counts look fine.",
    quiz: [
      {
        text: "Add more plants as they'll absorb the excess nutrients",
        correct: false,
        feedback: "❌ At high pH, plants actually struggle to absorb nutrients even if they're present. The pH itself needs to be fixed before more plants would help.",
      },
      {
        text: "Lower the pH using a pH buffer or dilution with fresh water",
        correct: true,
        feedback: "✅ Correct! Aquaponics systems work best between pH 6.8–7.2. Lowering pH makes ammonia less toxic, helps bacteria thrive, and unlocks nutrients for plants to absorb.",
      },
      {
        text: "Remove fish to reduce ammonia production",
        correct: false,
        feedback: "❌ While less ammonia is less dangerous, it doesn't fix the underlying chemistry. At high pH, even small amounts of ammonia are more toxic and the pH needs to come down regardless.",
      },
    ],
  },
};

const SCENARIO_ORDER: Scenario[] = [
  "tooManyFish",
  "tooFewPlants",
  "coldTemp",
  "noBacteria",
  "overfeeding",
  "poorCirculation",
  "highPH",
];

//function for sandbox mode to determine the overall state of the system based on the four parameters 
function computeWaterHealth(fish: number, plants: number, temp: number, bacteria: number): {
  color: string; label: string; healthy: boolean; issues: string[];
} {
  const issues: string[] = [];
  let score = 100;

  //deducts points from score based on the ratios and counts, and determines system condition 
  const ratio = fish / Math.max(plants, 1);
  if (ratio > 2.5) { issues.push("Too many fish for the plants to handle"); score -= 30; }
  else if (ratio < 0.5) { issues.push("Too few fish: the plants need more nitrate to survive"); score -= 10; }

  if (temp < 18) { issues.push("Water too cold: bacteria slow down below 18°C"); score -= 25; }
  else if (temp > 32) { issues.push("Water too hot: this stresses fish above 32°C"); score -= 20; }

  if (bacteria < 30) { issues.push("Bacteria levels too low to process waste"); score -= 35; }
  else if (bacteria < 60) { issues.push("Bacteria levels suboptimal"); score -= 15; }

  if (fish > 14) { issues.push("Fish count very high: overcrowding risk"); score -= 15; }
  if (plants < 2) { issues.push("Barely any plants: nitrate will accumulate"); score -= 20; }

  score = Math.max(0, score);
  const healthy = score >= 70;
  const color = score >= 70 ? "#60a5fa" : score >= 40 ? "#facc15" : "#ef4444";
  const label = score >= 70 ? "Balanced" : score >= 40 ? "Stressed" : "Critical";
  return { color, label, healthy, issues };
}

type Tab = "learn" | "sandbox";

export default function MiniGame2() {
  const [activeTab, setActiveTab] = useState<Tab>("learn");
  const [showInfo, setShowInfo] = useState<boolean>(true);
  const [showCycle, setShowCycle] = useState<boolean>(false);

  //states for learn mode
  const [scenario, setScenario] = useState<Scenario>("balanced");
  const [locked, setLocked] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>("");
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [wrongGuesses, setWrongGuesses] = useState<number>(0);
  const [completedScenarios, setCompletedScenarios] = useState<Set<Scenario>>(new Set());
  const [showFinish, setShowFinish] = useState<boolean>(false);

  //states for sandbox mode
  const [sbFish, setSbFish] = useState(6);
  const [sbPlants, setSbPlants] = useState(6);
  const [sbTemp, setSbTemp] = useState(26);
  const [sbBacteria, setSbBacteria] = useState(80);

  const data = scenarios[scenario];
  const isUnhealthy = scenario !== "balanced";
  const sbHealth = computeWaterHealth(sbFish, sbPlants, sbTemp, sbBacteria);

  const bubbleBackground = useMemo(() => <BubbleBackground />, []);

  const selectScenario = (newScenario: Scenario) => {
    setScenario(newScenario);
    setLocked(false);
    setFeedback("");
    setSelectedAnswer(null);
    setWrongGuesses(0);
  };

  //check the selection of quiz answers 
  const handleAnswer = (option: QuizOption, index: number) => {
    if (locked) return;
    setSelectedAnswer(index);
    if (option.correct) {
      setLocked(true);
      setFeedback(option.feedback);
      const newCompleted = new Set(completedScenarios);
      newCompleted.add(scenario);
      setCompletedScenarios(newCompleted);
      const allDone = SCENARIO_ORDER.every((s) => newCompleted.has(s));
      setTimeout(() => {
        setScenario("balanced");
        setLocked(false);
        setFeedback("");
        setSelectedAnswer(null);
        setWrongGuesses(0);
        if (allDone) setShowFinish(true);
      }, 2200);
    } else {
      const newWrong = wrongGuesses + 1;
      setWrongGuesses(newWrong);
      setFeedback(option.feedback + (newWrong === 1 ? "\n\n💡 One more try!" : ""));
    }
  };

  const basicScenarios = [
    { key: "tooManyFish",  label: "Too Many Fish",    activeClass: "bg-red-700 border-red-900 ring-2 ring-red-300",          baseClass: "bg-red-500 hover:bg-red-600 border-transparent" },
    { key: "tooFewPlants", label: "Too Few Plants",   activeClass: "bg-yellow-600 border-yellow-800 ring-2 ring-yellow-300", baseClass: "bg-yellow-500 hover:bg-yellow-600 border-transparent" },
    { key: "coldTemp",     label: "Cold Temperature", activeClass: "bg-blue-700 border-blue-900 ring-2 ring-blue-300",       baseClass: "bg-blue-500 hover:bg-blue-600 border-transparent" },
    { key: "noBacteria",   label: "No Bacteria",      activeClass: "bg-purple-700 border-purple-900 ring-2 ring-purple-300", baseClass: "bg-purple-500 hover:bg-purple-600 border-transparent" },
  ];

  const hardScenarios = [
    { key: "overfeeding",     label: "Overfeeding",      activeClass: "bg-amber-800 border-amber-900 ring-2 ring-amber-400",    baseClass: "bg-amber-700 hover:bg-amber-800 border-transparent" },
    { key: "poorCirculation", label: "Poor Circulation", activeClass: "bg-gray-700 border-gray-900 ring-2 ring-gray-400",      baseClass: "bg-gray-600 hover:bg-gray-700 border-transparent" },
    { key: "highPH",          label: "High pH",          activeClass: "bg-violet-800 border-violet-900 ring-2 ring-violet-400", baseClass: "bg-violet-600 hover:bg-violet-700 border-transparent" },
  ];


  return (
    <div className="min-h-screen w-full">
      {bubbleBackground}

      <style>{`
        @keyframes sway {
          0%, 100% { transform-origin: bottom center; transform: rotate(-4deg); }
          50%       { transform-origin: bottom center; transform: rotate(4deg); }
        }
        @keyframes swayAlt {
          0%, 100% { transform-origin: bottom center; transform: rotate(3deg); }
          50%       { transform-origin: bottom center; transform: rotate(-5deg); }
        }
        @keyframes riseUp {
          0%   { transform: translateY(0) scale(1); opacity: 0.7; }
          80%  { opacity: 0.5; }
          100% { transform: translateY(-220px) scale(0.6); opacity: 0; }
        }
        @keyframes popIn {
          0%   { opacity: 0; transform: scale(0.92) translateY(8px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes bounceIn {
          0%   { opacity: 0; transform: scale(0.7); }
          60%  { transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* pop up screen */}
      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="shrink-0 w-20 h-20 rounded-full overflow-hidden border-2 border-blue-200 bg-blue-50 flex items-center justify-center">
                <img src="/otter.png" alt="otter" className="w-full h-full object-contain" />
              </div>
              <div className="flex-1 bg-blue-50 border border-blue-200 rounded-2xl rounded-tl-none px-5 py-4 text-sm text-blue-800 font-medium leading-relaxed">
                Welcome! I'm Otto the Otter. Together, let's learn about the nitrogen cycle in an aquaponics system, and how to keep the system balanced!
              </div>
            </div>
            <h2 className="text-xl font-bold mb-4 text-gray-800">How the Nitrogen Cycle Works</h2>
            <ul className="space-y-3 text-sm text-gray-700 mb-6">
              <li className="flex gap-3 items-start"><span className="text-xl shrink-0">🐟</span><span>Fish produce waste that releases <strong>ammonia</strong> into the water. This kicks off the nitrogen cycle.</span></li>
              <li className="flex gap-3 items-start"><span className="text-xl shrink-0">🦠</span><span>Nitrifying bacteria convert that ammonia: first to <strong>nitrite</strong>, then to <strong>nitrate</strong>.</span></li>
              <li className="flex gap-3 items-start"><span className="text-xl shrink-0">⚠️</span><span>Ammonia and nitrite are <strong>toxic</strong> to both fish and plants. Thus, they must be converted quickly.</span></li>
              <li className="flex gap-3 items-start"><span className="text-xl shrink-0">🌿</span><span>Plants absorb <strong>nitrate</strong> as fertilizer to grow, cleaning the water in the process.</span></li>
              <li className="flex gap-3 items-start"><span className="text-xl shrink-0">♻️</span><span>The clean water returns to the fish tank, and the cycle begins again!</span></li>
            </ul>
            <p className="text-sm text-gray-500 mb-6 italic border-l-4 border-blue-200 pl-3">
              Select a scenario below to see what happens when something goes wrong. Then answer the quiz to fix it!
            </p>
            <button
              onClick={() => setShowInfo(false)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-colors text-base"
            >
              Let's Play!
            </button>
          </div>
        </div>
      )}

      {/* after game pop up screen */}
      {showFinish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center" style={{ animation: "bounceIn 0.5s ease-out" }}>
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-extrabold text-gray-800 mb-2">You Did It!</h2>
            <p className="text-gray-500 mb-6">
              You've solved all {SCENARIO_ORDER.length} scenarios and mastered the nitrogen cycle. Your aquaponics system is thriving!
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => { setShowFinish(false); setCompletedScenarios(new Set()); setScenario("balanced"); }}
                className="w-full border-2 border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Play Again
              </button>
              <a href="/mini-game-3" className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2.5 rounded-xl transition-colors block">
                Next Game →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* nitrogen cycle image pop up on side */}
      {showCycle && (
        <div className="fixed bottom-52 right-6 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 w-80" style={{ animation: "popIn 0.2s ease-out" }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-800 text-sm">The Nitrogen Cycle</h3>
            <button onClick={() => setShowCycle(false)} className="text-gray-400 hover:text-gray-600 text-lg leading-none font-bold">×</button>
          </div>
          <img src="/nitrogen-cycle.png" alt="Nitrogen Cycle Diagram" className="w-full rounded-lg object-contain" />
          <p className="text-xs text-gray-500 mt-2 text-center">Fish → Ammonia → Nitrite → Nitrate → Plants → Clean Water</p>
        </div>
      )}

      {/* render main game */}
      <main className="relative z-10 flex w-full min-h-screen flex-col items-center py-10 px-6 lg:px-16">

        {/* floating buttons on side  */}
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-3">
          <div className="group flex flex-col items-center gap-1">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs font-semibold px-3 py-1 rounded-full shadow pointer-events-none whitespace-nowrap">
              Nitrogen Cycle Diagram
            </span>
            <button
              onClick={() => { setShowCycle((v) => !v); setShowInfo(false); }}
              className={`border-2 rounded-full w-20 h-20 shadow-lg transition-all flex items-center justify-center overflow-hidden p-1
                ${showCycle ? "bg-green-200 border-green-400 scale-110" : "bg-green-100 hover:bg-green-200 border-green-300"}`}
            >
              <img src="/happy_plant.png" alt="nitrogen cycle" className="w-full h-full object-contain" />
            </button>
          </div>
          <div className="group flex flex-col items-center gap-1">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs font-semibold px-3 py-1 rounded-full shadow pointer-events-none">
              Learn More About The Nitrogen Cycle
            </span>
            <button
              onClick={() => { setShowInfo(true); setShowCycle(false); }}
              className="bg-blue-100 hover:bg-blue-200 border-2 border-blue-300 rounded-full w-20 h-20 shadow-lg transition-colors flex items-center justify-center overflow-hidden p-1"
            >
              <img src="/otter.png" alt="otter" className="w-full h-full object-contain" />
            </button>
          </div>
        </div>

        {/* header */}
        <div className="w-full max-w-4xl mb-4 text-center">
          {/* <h1 className="text-5xl font-extrabold mb-1 text-gray-800"> */}
            <h1
            className="text-5xl font-extrabold mb-1"
            style={{
              backgroundImage: "linear-gradient(to right, #1e40af, #166534)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Nitrogen Cycle Explorer
          </h1>
        </div>

        {/* tabs for the two modes */}
        <div className="flex rounded-xl overflow-hidden border-2 border-gray-200 mb-3 w-full max-w-xs shadow-sm">
          {([ ["learn", "Learn Mode"], ["sandbox", "Sandbox Mode"] ] as [Tab, string][]).map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                activeTab === tab ? "bg-teal-500 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* info about the mode */}
        <p className="text-xl text-gray-600 font-medium mb-6 text-center">
          {activeTab === "learn"
            ? "Select a scenario to see what happens to the aquaponics system"
            : "Adjust the sliders and watch the aquaponics system respond in real time"}
        </p>

        {/* learn tab  */}
        {activeTab === "learn" && (
          <>
            {/* progress bar */}
            <div className="flex gap-2 mb-6">
              {SCENARIO_ORDER.map((s) => (
                <div key={s} title={s} className={`w-3 h-3 rounded-full transition-colors border ${
                  completedScenarios.has(s) ? "bg-green-400 border-green-500"
                  : scenario === s ? "bg-blue-400 border-blue-500"
                  : "bg-gray-200 border-gray-300"
                }`} />
              ))}
            </div>

            {/* basic scenario buttons */}
            <div className="w-full max-w-4xl mb-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2 text-center">Basic Scenarios</p>
              <div className="flex flex-wrap justify-center gap-3">
                {basicScenarios.map(({ key, label, activeClass, baseClass }) => (
                  <button key={key} onClick={() => selectScenario(key as Scenario)}
                    className={`px-5 py-2 rounded-md text-white font-semibold text-sm transition-all border-2 shadow-sm relative ${
                      scenario === key ? `${activeClass} scale-105 shadow-md` : baseClass
                    }`}>
                    {label}
                    {completedScenarios.has(key as Scenario) && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-green-400 rounded-full text-white text-[9px] flex items-center justify-center">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* advanced scenario buttons */}
            <div className="w-full max-w-4xl mb-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2 text-center mt-3">Advanced Scenarios</p>
              <div className="flex flex-wrap justify-center gap-3">
                {hardScenarios.map(({ key, label, activeClass, baseClass }) => (
                  <button key={key} onClick={() => selectScenario(key as Scenario)}
                    className={`px-5 py-2 rounded-md text-white font-semibold text-sm transition-all border-2 shadow-sm relative ${
                      scenario === key ? `${activeClass} scale-105 shadow-md` : baseClass
                    }`}>
                    {label}
                    {completedScenarios.has(key as Scenario) && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-green-400 rounded-full text-white text-[9px] flex items-center justify-center">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* fish tank animation */}
            <div className="w-full max-w-4xl">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Aquaponics Tank</span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full transition-colors ${
                  scenario === "balanced" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                }`}>
                  {scenario === "balanced" ? "✅ System Balanced" : "⚠️ System Unbalanced"}
                </span>
              </div>

              <div className="relative rounded-2xl overflow-hidden shadow-2xl"
                style={{ border: "5px solid #cbd5e1", borderBottom: "10px solid #94a3b8", height: "300px" }}>
                <div className="absolute inset-0 transition-colors duration-700" style={{ backgroundColor: data.waterColor }} />
                <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(160deg, rgba(255,255,255,0.25) 0%, transparent 55%)" }} />

                {WATER_BUBBLES.map((b, i) => (
                  <div key={i} className="absolute rounded-full pointer-events-none" style={{
                    left: `${b.left}%`, bottom: "72px", width: "6px", height: "6px",
                    backgroundColor: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.8)",
                    animation: `riseUp ${b.duration}s ease-in infinite`, animationDelay: `${b.delay}s`, zIndex: 2,
                  }} />
                ))}

                <style>{Array.from({ length: data.fish }).map((_, i) => {
                  const lane = FISH_LANES[i % FISH_LANES.length];
                  const dur = isUnhealthy ? lane.duration * 3 : lane.duration;
                  return lane.startDir === 1
                    ? `@keyframes fish-swim-${i}{0%{left:2%;transform:scaleX(1)}49%{left:85%;transform:scaleX(1)}51%{left:85%;transform:scaleX(-1)}100%{left:2%;transform:scaleX(-1)}}`
                    : `@keyframes fish-swim-${i}{0%{left:85%;transform:scaleX(-1)}49%{left:2%;transform:scaleX(-1)}51%{left:2%;transform:scaleX(1)}100%{left:85%;transform:scaleX(1)}}`;
                }).join("")}</style>

                {Array.from({ length: data.fish }).map((_, i) => {
                  const lane = FISH_LANES[i % FISH_LANES.length];
                  const dur = isUnhealthy ? lane.duration * 3 : lane.duration;
                  const offset = -(dur * (i / data.fish));
                  return (
                    <div key={i} className="absolute" style={{
                      top: `${lane.laneY}%`, width: "48px", height: "48px",
                      filter: isUnhealthy ? "saturate(0.4) brightness(0.8)" : "none",
                      transition: "filter 0.6s", zIndex: 3,
                      animation: `fish-swim-${i} ${dur}s linear infinite`,
                      animationDelay: `${offset}s`,
                    }}>
                      <img src={isUnhealthy ? "/sad_fish.png" : "/happy_fish.png"} alt="fish"
                        style={{ width: "48px", height: "48px", objectFit: "contain", display: "block" }} />
                    </div>
                  );
                })}

                <div className="absolute bottom-0 left-0 right-0" style={{
                  height: "72px", background: "linear-gradient(to top, #b5865a 0%, #d4a96a 60%, #e8c98a 100%)", zIndex: 4,
                }}>
                  {[8, 22, 38, 55, 68, 80, 91].map((pos, i) => (
                    <div key={i} className="absolute rounded-full" style={{
                      left: `${pos}%`, bottom: `${4 + (i % 4) * 3}px`,
                      width: `${10 + (i % 3) * 5}px`, height: `${7 + (i % 2) * 4}px`,
                      backgroundColor: i % 2 === 0 ? "#92622a" : "#7a4f20", opacity: 0.5,
                    }} />
                  ))}
                  {Array.from({ length: data.plants }).map((_, i) => (
                    <div key={i} className="absolute" style={{
                      left: `${(i + 0.8) * (88 / (data.plants + 1))}%`, bottom: "10px", zIndex: 5,
                      display: "inline-block",
                      animation: `${i % 2 === 0 ? "sway" : "swayAlt"} ${2.5 + (i % 3) * 0.5}s ease-in-out infinite`,
                      animationDelay: `${(i * 0.4) % 2}s`,
                    }}>
                      <img src={isUnhealthy ? "/sad_plant.png" : "/happy_plant.png"} alt="plant"
                        style={{ width: "48px", height: "48px", objectFit: "contain",
                          filter: isUnhealthy ? "saturate(0.5) brightness(0.85)" : "none", transition: "filter 0.6s" }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* info row below the tank */}
              <div className="flex gap-3 mt-4">
                <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-center shadow-sm min-w-[80px]">
                  <div className="mb-0.5 flex justify-center">
                    <img src={isUnhealthy ? "/sad_fish.png" : "/happy_fish.png"} alt="fish" style={{ width: "32px", height: "32px", objectFit: "contain" }} />
                  </div>
                  <div className="text-xl font-bold text-blue-600">{data.fish}</div>
                  <div className="text-xs text-gray-400 font-medium">Fish</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-center shadow-sm min-w-[80px]">
                  <div className="mb-0.5 flex justify-center">
                    <img src={isUnhealthy ? "/sad_plant.png" : "/happy_plant.png"} alt="plant" style={{ width: "32px", height: "32px", objectFit: "contain" }} />
                  </div>
                  <div className="text-xl font-bold text-green-600">{data.plants}</div>
                  <div className="text-xs text-gray-400 font-medium">Plants</div>
                </div>
                <div className="flex-1 rounded-xl px-5 py-3 flex items-center gap-3 border shadow-sm"
                  style={{ backgroundColor: `${data.waterColor}66`, borderColor: `${data.waterColor}88` }}>
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: data.waterColor }} />
                  <p className="text-base font-medium text-gray-800 leading-relaxed">{data.message}</p>
                </div>
              </div>
            </div>

            {/* quiz section */}
            {scenario !== "balanced" && (
              <div className="mt-8 w-full max-w-4xl">
                <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-md p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <span className="text-2xl">🔧</span>
                    <h2 className="text-lg font-bold text-gray-800">How can we fix this system?</h2>
                    {wrongGuesses === 1 && !locked && (
                      <span className="ml-auto text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                        💡 One more try!
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    {data.quiz.map((option, index) => {
                      const isSelected = selectedAnswer === index;
                      const isCorrect = option.correct;
                      let btnStyle = "bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-400 hover:bg-blue-50";
                      if (isSelected && isCorrect) btnStyle = "bg-green-100 border-2 border-green-500 text-green-800";
                      else if (isSelected && !isCorrect) btnStyle = "bg-red-100 border-2 border-red-400 text-red-800";
                      return (
                        <button key={index} onClick={() => handleAnswer(option, index)} disabled={locked}
                          className={`w-full text-left px-5 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-3 ${btnStyle}`}>
                          <span className="w-7 h-7 rounded-full border-2 border-current flex items-center justify-center text-sm font-bold shrink-0">
                            {String.fromCharCode(65 + index)}
                          </span>
                          {option.text}
                          {isSelected && <span className="ml-auto text-lg">{isCorrect ? "✅" : "❌"}</span>}
                        </button>
                      );
                    })}
                  </div>
                  {feedback && (
                    <div className={`mt-5 px-4 py-3 rounded-xl text-sm font-medium leading-relaxed whitespace-pre-line ${
                      feedback.startsWith("✅") ? "bg-green-50 border border-green-200 text-green-800" : "bg-red-50 border border-red-200 text-red-700"
                    }`}>
                      {feedback}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* sandbox tab */}
        {activeTab === "sandbox" && (
          <div className="w-full max-w-4xl flex flex-col gap-6">
            <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-1">Sandbox Mode</h2>
              <p className="text-sm text-gray-500 mb-5">Freely adjust the system and see what happens. There are no right or wrong answers.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                {[
                  { label: "🐟 Fish",              value: sbFish,     min: 1,  max: 20,  setter: setSbFish,     color: "text-blue-600"   },
                  { label: "🌿 Plants",             value: sbPlants,   min: 1,  max: 20,  setter: setSbPlants,   color: "text-green-600"  },
                  { label: "🌡️ Temperature (°C)",   value: sbTemp,     min: 10, max: 38,  setter: setSbTemp,     color: "text-orange-500" },
                  { label: "🦠 Bacteria Level (%)", value: sbBacteria, min: 0,  max: 100, setter: setSbBacteria, color: "text-purple-600" },
                ].map(({ label, value, min, max, setter, color }) => (
                  <div key={label}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-semibold text-gray-700">{label}</span>
                      <span className={`text-sm font-bold ${color}`}>
                        {value}{label.includes("°C") ? "°C" : label.includes("%") ? "%" : ""}
                      </span>
                    </div>
                    <input type="range" min={min} max={max} value={value}
                      onChange={e => setter(Number(e.target.value))}
                      className="w-full accent-teal-500" />
                    <div className="flex justify-between text-xs text-gray-400 mt-0.5"><span>{min}</span><span>{max}</span></div>
                  </div>
                ))}
              </div>

              <div className={`rounded-xl px-4 py-3 mb-4 border font-semibold text-center text-sm`}
                style={{ backgroundColor: `${sbHealth.color}22`, borderColor: `${sbHealth.color}66`, color: sbHealth.healthy ? "#166534" : "#991b1b" }}>
                System Status: {sbHealth.label}
              </div>

              {sbHealth.issues.length > 0 ? (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                  <p className="text-xs font-semibold text-amber-700 mb-2 uppercase tracking-wide">Issues detected:</p>
                  <ul className="space-y-1">
                    {sbHealth.issues.map((issue, i) => (
                      <li key={i} className="text-sm text-amber-800 flex gap-2"><span>⚠️</span>{issue}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-800">
                  Everything looks great! Your system is in balance.
                </div>
              )}
            </div>

            {/* fish tank */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl"
              style={{ border: "5px solid #cbd5e1", borderBottom: "10px solid #94a3b8", height: "280px" }}>
              <div className="absolute inset-0 transition-colors duration-700" style={{ backgroundColor: sbHealth.color }} />
              <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(160deg, rgba(255,255,255,0.25) 0%, transparent 55%)" }} />

              {WATER_BUBBLES.map((b, i) => (
                <div key={i} className="absolute rounded-full pointer-events-none" style={{
                  left: `${b.left}%`, bottom: "72px", width: "6px", height: "6px",
                  backgroundColor: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.8)",
                  animation: `riseUp ${b.duration}s ease-in infinite`, animationDelay: `${b.delay}s`, zIndex: 2,
                }} />
              ))}

              <style>{Array.from({ length: sbFish }).map((_, i) => {
                const lane = FISH_LANES[i % FISH_LANES.length];
                const dur = !sbHealth.healthy ? lane.duration * 3 : lane.duration;
                return lane.startDir === 1
                  ? `@keyframes sb-fish-${i}{0%{left:2%;transform:scaleX(1)}49%{left:85%;transform:scaleX(1)}51%{left:85%;transform:scaleX(-1)}100%{left:2%;transform:scaleX(-1)}}`
                  : `@keyframes sb-fish-${i}{0%{left:85%;transform:scaleX(-1)}49%{left:2%;transform:scaleX(-1)}51%{left:2%;transform:scaleX(1)}100%{left:85%;transform:scaleX(1)}}`;
              }).join("")}</style>

              {Array.from({ length: sbFish }).map((_, i) => {
                const lane = FISH_LANES[i % FISH_LANES.length];
                const dur = !sbHealth.healthy ? lane.duration * 3 : lane.duration;
                const offset = -(dur * (i / sbFish));
                return (
                  <div key={i} className="absolute" style={{
                    top: `${lane.laneY}%`, width: "48px", height: "48px",
                    filter: !sbHealth.healthy ? "saturate(0.4) brightness(0.8)" : "none",
                    transition: "filter 0.6s", zIndex: 3,
                    animation: `sb-fish-${i} ${dur}s linear infinite`,
                    animationDelay: `${offset}s`,
                  }}>
                    <img src={!sbHealth.healthy ? "/sad_fish.png" : "/happy_fish.png"} alt="fish"
                      style={{ width: "48px", height: "48px", objectFit: "contain", display: "block" }} />
                  </div>
                );
              })}

              <div className="absolute bottom-0 left-0 right-0" style={{
                height: "72px", background: "linear-gradient(to top, #b5865a 0%, #d4a96a 60%, #e8c98a 100%)", zIndex: 4,
              }}>
                {[8, 22, 38, 55, 68, 80, 91].map((pos, i) => (
                  <div key={i} className="absolute rounded-full" style={{
                    left: `${pos}%`, bottom: `${4 + (i % 4) * 3}px`,
                    width: `${10 + (i % 3) * 5}px`, height: `${7 + (i % 2) * 4}px`,
                    backgroundColor: i % 2 === 0 ? "#92622a" : "#7a4f20", opacity: 0.5,
                  }} />
                ))}
                {Array.from({ length: sbPlants }).map((_, i) => (
                  <div key={i} className="absolute" style={{
                    left: `${(i + 0.8) * (88 / (sbPlants + 1))}%`, bottom: "10px", zIndex: 5,
                    display: "inline-block",
                    animation: `${i % 2 === 0 ? "sway" : "swayAlt"} ${2.5 + (i % 3) * 0.5}s ease-in-out infinite`,
                    animationDelay: `${(i * 0.4) % 2}s`,
                  }}>
                    <img src={!sbHealth.healthy ? "/sad_plant.png" : "/happy_plant.png"} alt="plant"
                      style={{ width: "48px", height: "48px", objectFit: "contain",
                        filter: !sbHealth.healthy ? "saturate(0.5) brightness(0.85)" : "none", transition: "filter 0.6s" }} />
                  </div>
                ))}
              </div>
            </div>

            {/* info cards about system */}
            <div className="flex gap-3">
              <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-center shadow-sm flex-1">
                <div className="text-xs text-gray-400 mb-1">Fish : Plant Ratio</div>
                <div className={`text-xl font-bold ${sbFish / sbPlants > 2.5 ? "text-red-500" : "text-green-600"}`}>{(sbFish / sbPlants).toFixed(1)}:1</div>
                <div className="text-xs text-gray-400">ideal ≤ 2:1</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-center shadow-sm flex-1">
                <div className="text-xs text-gray-400 mb-1">Temperature</div>
                <div className={`text-xl font-bold ${sbTemp < 18 || sbTemp > 32 ? "text-red-500" : "text-green-600"}`}>{sbTemp}°C</div>
                <div className="text-xs text-gray-400">ideal 20–30°C</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-center shadow-sm flex-1">
                <div className="text-xs text-gray-400 mb-1">Bacteria</div>
                <div className={`text-xl font-bold ${sbBacteria < 40 ? "text-red-500" : sbBacteria < 70 ? "text-yellow-500" : "text-green-600"}`}>{sbBacteria}%</div>
                <div className="text-xs text-gray-400">ideal ≥ 70%</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}