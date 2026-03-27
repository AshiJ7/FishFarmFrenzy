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
  | "noBacteria";

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

export default function MiniGame2() {
  const [scenario, setScenario] = useState<Scenario>("balanced");
  const [locked, setLocked] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>("");
  const [showInfo, setShowInfo] = useState<boolean>(true);
  const [showCycle, setShowCycle] = useState<boolean>(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const scenarios = {
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
      message: "Too many fish means more toxic waste in the water, and this produces excess ammonia. The fish and the plants become sick.",
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
      message: "Without enough plants, nitrate builds up in the water. This can stress the fish.",
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
      message: "Cold temperatures slow down nitrifying bacteria. Waste from the fish begins to build up, and not enough nitrate is created.",
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
      message: "Without bacteria, ammonia and nitrite (from fish waste) don't convert to nitrate, and the excess waste harms the fish and plants.",
      quiz: [
        { text: "Add more fish", correct: false },
        { text: "Remove plants", correct: false },
        { text: "Add beneficial bacteria", correct: true },
      ],
    },
  };

  const data = scenarios[scenario];
  const isUnhealthy = scenario !== "balanced";

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

  const bubbleBackground = useMemo(() => <BubbleBackground />, []);

  const scenarioButtons = [
    { key: "tooManyFish",  label: "Too Many Fish",    activeClass: "bg-red-700 border-red-900 ring-2 ring-red-300",          baseClass: "bg-red-500 hover:bg-red-600 border-transparent" },
    { key: "tooFewPlants", label: "Too Few Plants",   activeClass: "bg-yellow-600 border-yellow-800 ring-2 ring-yellow-300", baseClass: "bg-yellow-500 hover:bg-yellow-600 border-transparent" },
    { key: "coldTemp",     label: "Cold Temperature", activeClass: "bg-blue-700 border-blue-900 ring-2 ring-blue-300",       baseClass: "bg-blue-500 hover:bg-blue-600 border-transparent" },
    { key: "noBacteria",   label: "No Bacteria",      activeClass: "bg-purple-700 border-purple-900 ring-2 ring-purple-300", baseClass: "bg-purple-500 hover:bg-purple-600 border-transparent" },
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
      `}</style>

      {/* OTTER INFO MODAL */}
      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">
                <img src="/otter.png" alt="otter" className="w-full h-full object-contain" />
              </span>
              <div className="bg-blue-50 border border-blue-200 rounded-2xl rounded-tl-none px-4 py-2 text-sm text-blue-800 font-medium">
                Welcome! I'm Otto the Otter. Together, let's learn about the nitrogen cycle in an aquaponics system!
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
              Let's Play!
            </button>
          </div>
        </div>
      )}

      {/* NITROGEN CYCLE IMAGE POPUP */}
      {showCycle && (
        <div
          className="fixed bottom-36 right-6 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 w-80"
          style={{ animation: "popIn 0.2s ease-out" }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-800 text-sm">The Nitrogen Cycle</h3>
            <button
              onClick={() => setShowCycle(false)}
              className="text-gray-400 hover:text-gray-600 text-lg leading-none font-bold"
            >
              ×
            </button>
          </div>
          <img
            src="/nitrogen-cycle.png"
            alt="Nitrogen Cycle Diagram"
            className="w-full rounded-lg object-contain"
          />
          <p className="text-xs text-gray-500 mt-2 text-center">
            Fish → Ammonia → Nitrite → Nitrate → Plants → Clean Water
          </p>
        </div>
      )}

      {/* MAIN GAME */}
      <main className="relative z-10 flex w-full min-h-screen flex-col items-center py-10 px-6 lg:px-16">

        {/* Floating buttons — bottom right stack */}
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-3">

          {/* Nitrogen cycle button */}
          <div className="group flex flex-col items-center gap-1">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs font-semibold px-3 py-1 rounded-full shadow pointer-events-none whitespace-nowrap">
              Image Of The Nitrogen Cycle
            </span>
            <button
              onClick={() => { setShowCycle((v) => !v); setShowInfo(false); }}
              className={`border-2 rounded-full w-20 h-20 shadow-lg transition-all flex items-center justify-center text-3xl
                ${showCycle
                  ? "bg-green-200 border-green-400 scale-110"
                  : "bg-green-100 hover:bg-green-200 border-green-300"
                }`}
            >
              <img src="/happy_plant.png" alt="otter" className="w-full h-full object-contain" />
            </button>
          </div>


          {/* Otter button */}
          <div className="group flex flex-col items-center gap-1">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs font-semibold px-3 py-1 rounded-full shadow pointer-events-none">
              Learn More About The Game
            </span>
            <button
              onClick={() => { setShowInfo(true); setShowCycle(false); }}
              className="bg-blue-100 hover:bg-blue-200 border-2 border-blue-300 rounded-full w-20 h-20 shadow-lg transition-colors flex items-center justify-center overflow-hidden p-1"
            >
              <img src="/otter.png" alt="otter" className="w-full h-full object-contain" />
            </button>
          </div>
        </div>

        {/* Page header */}
        <div className="w-full max-w-4xl mb-6 text-center">
          <h1
            className="text-3xl font-extrabold mb-1"
            style={{
              backgroundImage: "linear-gradient(to right, var(--teal-medium), var(--olive-green))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Nitrogen Cycle Explorer
          </h1>
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

            {/* Water bubbles */}
            {WATER_BUBBLES.map((b, i) => (
              <div
                key={i}
                className="absolute rounded-full pointer-events-none"
                style={{
                  left: `${b.left}%`,
                  bottom: "72px",
                  width: "6px",
                  height: "6px",
                  backgroundColor: "rgba(255,255,255,0.6)",
                  border: "1px solid rgba(255,255,255,0.8)",
                  animation: `riseUp ${b.duration}s ease-in infinite`,
                  animationDelay: `${b.delay}s`,
                  zIndex: 2,
                }}
              />
            ))}

            {/* Per-fish swim keyframes */}
            <style>{
              Array.from({ length: data.fish }).map((_, i) => {
                const lane = FISH_LANES[i % FISH_LANES.length];
                const dur = isUnhealthy ? lane.duration * 3 : lane.duration;
                if (lane.startDir === 1) {
                  return `
                    @keyframes fish-swim-${i} {
                      0%   { left: 2%;  transform: scaleX(1); }
                      49%  { left: 85%; transform: scaleX(1); }
                      51%  { left: 85%; transform: scaleX(-1); }
                      100% { left: 2%;  transform: scaleX(-1); }
                    }
                  `;
                } else {
                  return `
                    @keyframes fish-swim-${i} {
                      0%   { left: 85%; transform: scaleX(-1); }
                      49%  { left: 2%;  transform: scaleX(-1); }
                      51%  { left: 2%;  transform: scaleX(1); }
                      100% { left: 85%; transform: scaleX(1); }
                    }
                  `;
                }
              }).join("")
            }</style>

            {/* Fish */}
            {Array.from({ length: data.fish }).map((_, i) => {
              const lane = FISH_LANES[i % FISH_LANES.length];
              const dur = isUnhealthy ? lane.duration * 3 : lane.duration;
              const offset = -(dur * (i / data.fish));
              return (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    top: `${lane.laneY}%`,
                    width: "48px",
                    height: "48px",
                    filter: isUnhealthy ? "saturate(0.4) brightness(0.8)" : "none",
                    transition: "filter 0.6s",
                    zIndex: 3,
                    animation: `fish-swim-${i} ${dur}s linear infinite`,
                    animationDelay: `${offset}s`,
                  }}
                >
                  <img
                    src={isUnhealthy ? "/sad_fish.png" : "/happy_fish.png"}
                    alt="fish"
                    style={{ width: "48px", height: "48px", objectFit: "contain", display: "block" }}
                  />
                </div>
              );
            })}

            {/* Sandy bottom with plants */}
            <div
              className="absolute bottom-0 left-0 right-0"
              style={{
                height: "72px",
                background: "linear-gradient(to top, #b5865a 0%, #d4a96a 60%, #e8c98a 100%)",
                zIndex: 4,
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
              <div
                key={i}
                className="absolute"
                style={{
                  left: `${(i + 0.8) * (88 / (data.plants + 1))}%`,
                  bottom: "10px",
                  zIndex: 5,
                  display: "inline-block",
                  animation: `${i % 2 === 0 ? "sway" : "swayAlt"} ${
                    2.5 + (i % 3) * 0.5
                  }s ease-in-out infinite`,
                  animationDelay: `${(i * 0.4) % 2}s`,
                }}
              >
                <img
                  src={isUnhealthy ? "/sad_plant.png" : "/happy_plant.png"}
                  alt="plant"
                  style={{
                    width: "48px",
                    height: "48px",
                    objectFit: "contain",
                    filter: isUnhealthy
                      ? "saturate(0.5) brightness(0.85)"
                      : "none",
                    transition: "filter 0.6s",
                  }}
                />
              </div>
            ))}
            </div>
          </div>

          {/* Info + stats row */}
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
            <div
              className="flex-1 rounded-xl px-5 py-3 flex items-center gap-3 border shadow-sm"
              style={{ backgroundColor: `${data.waterColor}66`, borderColor: `${data.waterColor}88` }}
            >
              <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: data.waterColor }} />
              <p className="text-base md:text-lg font-medium text-gray-800 leading-relaxed">{data.message}</p>
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


// things to do: 
// - make otter speech bubble larger
// - fix the size and text in pop up 
// - add more scenarios but make it harder to guess the correct answer
// - when you level up the scenarios will get harder and more complex, more factors to consider (like light, pH, etc) 
// - add more feedback to the quiz answers, like why the correct answer is correct and why wrong is wrong 
// - second wrong guess will say try one more time 
// - add sound effects for correct and incorrect answers
// - when game is finished, pop up to go to next game? 
// - for each quiz option, whether that makes it slightly better or worse, and explain the reasoning behind it in the feedback
// game additions: 
// - "sandbox mode" freely adjust num of fish, plants, etc and see real time effects with no right or wrong answers 
// - "quiz mode" similar idea to game 3, bunch of scenarios with mcq and have to identify whats wrong/how to fix. points based on speed and accuracy 
// - "challenge mode" where you have to keep the system balanced for a certain amount of time while random events happen (fish getting sick, or a plant dying) and you have to react to them
