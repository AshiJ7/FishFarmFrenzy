"use client";

import { useState } from "react";

const games = [
  {
    id: 1,
    emoji: "🐟",
    title: "Feeding Frenzy",
    color: "#4A8E9E",
    bg: "#e8f4f7",
    objectives: [
      "Identify that different fish species have different dietary needs",
      "Distinguish between herbivorous fish (Tilapia) and carnivorous fish (Trout, Salmon)",
      "Recognize that feeding fish the wrong food harms their health and the system",
      "Connect fish diet to the broader aquaponics nutrient cycle",
    ],
    vocabulary: [
      { word: "Herbivore", def: "An animal that eats only plants. Tilapia are herbivores! They love algae, duckweed, and plant-based foods." },
      { word: "Carnivore", def: "An animal that eats other animals. Trout and salmon are carnivores  they eat insects, worms, and small fish." },
      { word: "Aquaponics", def: "A farming system that combines raising fish (aquaculture) and growing plants (hydroponics) together in one cycle." },
      { word: "Nutrient", def: "A substance that living things need to grow and stay healthy. Fish waste provides nutrients that plants need." },
    ],
    whyItWorks: `In aquaponics, fish health is the foundation of the entire system. When fish eat the right food, they stay healthy, grow properly, and produce the right amount of waste. That waste becomes fertilizer for the plants. 

If fish eat the wrong food, several problems cascade: poor digestion leads to excess waste or toxic byproducts, fish become stressed and sick, their waste quality changes, and the beneficial bacteria that convert waste to plant food can't do their job properly.

Tilapia thrive on plant-based foods because in the wild they graze on algae in shallow, warm water. Trout and salmon live in fast, cold streams and evolved to hunt insects and smaller fish. Their digestive systems require high-protein animal-based diets.

The key takeaway: matching diet to species mirrors nature, and nature's design is what makes aquaponics work.`,
    teacherTips: [
      "Ask students: 'Would you eat the same food as a tiger? Why not?' Connect this to fish having different evolved needs.",
      "Have students sort food cards into 'plant-based' and 'animal-based' before playing.",
      "After the game, discuss what happens to the fish tank water if fish are fed incorrectly.",
    ],
  },
  {
    id: 2,
    emoji: "🔁",
    title: "Cycle Explorer",
    color: "#6B8E4E",
    bg: "#eef5e8",
    objectives: [
      "Describe the nitrogen cycle in an aquaponics system (fish -> ammonia -> nitrite -> nitrate -> plants)",
      "Explain why ammonia and nitrite are toxic to fish and plants",
      "Identify what happens when the system becomes unbalanced",
      "Propose solutions to restore balance in an unhealthy system",
    ],
    vocabulary: [
      { word: "Nitrogen Cycle", def: "The process by which nitrogen moves through the ecosystem. In aquaponics: fish make ammonia -> bacteria convert it -> plants absorb it." },
      { word: "Ammonia (NH₃)", def: "A toxic chemical made from fish waste. High ammonia levels poison fish. Bacteria convert it to nitrite." },
      { word: "Nitrite (NO₂⁻)", def: "Still toxic to fish, but less so than ammonia. Beneficial bacteria convert nitrite to nitrate." },
      { word: "Nitrate (NO₃⁻)", def: "A relatively safe form of nitrogen that plants absorb as fertilizer. Plants clean it from the water." },
      { word: "Nitrification", def: "The biological process where bacteria convert toxic ammonia -> nitrite -> nitrate." },
      { word: "Beneficial Bacteria", def: "Microscopic organisms that live on surfaces in the tank. They perform nitrification, which is essential to the whole system." },
    ],
    whyItWorks: `The nitrogen cycle is the invisible engine of aquaponics. It's entirely biological, so no chemicals are needed.

When fish eat and produce waste, that waste breaks down into ammonia (NH₃), which is highly toxic. Left alone, ammonia would kill the fish within days, but billions of beneficial bacteria (primarily Nitrosomonas and Nitrobacter species) colonize every surface in the system, including tank walls, pipes, grow media. They convert ammonia to nitrite, then nitrite to nitrate.

Nitrate is the sweet spot because it is mildly safe for fish at reasonable concentrations, and it's exactly what plants crave as fertilizer. As plants absorb nitrate through their roots, they simultaneously clean the water. That cleaned water returns to the fish tank, and the cycle begins again.

Balance is crucial: too many fish = too much ammonia = overwhelmed bacteria = toxic water. Too few plants = nitrate builds up = stressed fish. Temperature also matters. Cold water slows bacterial activity, letting toxins accumulate.

This is why the game shows what "out of balance" looks like. Students can see that every element (fish, bacteria, plants, temperature) must work together.`,
    teacherTips: [
      "Draw the cycle on the board as a circular diagram before playing: Fish -> Waste -> Ammonia -> Bacteria -> Nitrite -> Bacteria -> Nitrate -> Plants -> Clean Water -> Fish.",
      "Use the 'sandbox mode' concept: ask 'what do you predict will happen if we add 10 more fish?'",
      "Connect to chemistry: ammonia smells bad (like a dirty fish tank!) Students may have experienced this.",
      "Discuss: why do new aquariums need weeks to 'cycle' before adding fish? (Bacteria colonies need to establish.)",
    ],
  },
  {
    id: 3,
    emoji: "🦸",
    title: "Save Your Fish Farm",
    color: "#E49678",
    bg: "#fdf0ea",
    objectives: [
      "Apply problem-solving skills to real aquaponics management scenarios",
      "Understand that hasty or chemical-based solutions often cause more harm than good",
      "Recognize early warning signs of system problems (cloudy water, sick fish, wilting plants)",
      "Practice evidence-based decision making (observe, diagnose, and respond)",
    ],
    vocabulary: [
      { word: "pH", def: "A measure of how acidic or basic water is, on a scale of 0-14. Aquaponics systems work best at pH 6.8-7.2." },
      { word: "Ammonia Spike", def: "A sudden dangerous rise in ammonia levels, often caused by overfeeding, dead fish, or bacterial die-off." },
      { word: "Quarantine", def: "Separating sick fish from healthy ones to stop disease spreading through the tank." },
      { word: "Biological Filter", def: "The colony of beneficial bacteria in your system. Destroying it (with chemicals or full water changes) crashes the whole nitrogen cycle." },
      { word: "Acclimation", def: "Gradually introducing fish to new water conditions so they aren't shocked by sudden changes in temperature or chemistry." },
      { word: "Nitrite Spike", def: "Dangerous rise in nitrite, often during a 'new tank cycle' or after bacterial die-off. Can be temporarily managed with aquarium salt." },
    ],
    whyItWorks: `Real aquaponics farmers face emergencies regularly. The game's 30 scenarios mirror actual challenges: pipe leaks, fish jumping out, temperature swings, disease outbreaks, algae blooms, power failures.

The design philosophy behind aquaponics management is to work with biology, not against it. Chemical solutions (pesticides, fertilizers, random medications) almost always hurt the beneficial bacteria that run the nitrogen cycle. A full water change feels like a solution but wipes out the bacterial colonies that took weeks to establish.

The correct responses share a pattern to diagnose first, act proportionally, and make gradual changes. This mirrors scientific thinking with observe, hypothesize, test, and evaluate.

The game teaches "systems thinking": every action has ripple effects. Overfeed -> more ammonia -> stressed fish -> disease. Add chemicals -> kill bacteria -> ammonia spike -> more disease. Students learn to trace cause and effect through the whole system.

The scoring rewards measured, informed decisions and penalizes panic or overreaction, modeling how real stewardship works.`,
    teacherTips: [
      "Before playing, ask: 'When you feel sick, do doctors immediately give you the strongest medicine? Why not?' Connect to diagnosis before treatment.",
      "After each scenario, pause and ask: 'Why did that choice cause that outcome? What would happen next in the real system?'",
      "Use the scenarios as writing prompts: 'You're the farm manager. Write a 3-sentence incident report.'",
      "Discuss: what does this game teach us about making decisions with incomplete information?",
    ],
  },
  {
    id: 4,
    emoji: "🦠",
    title: "Bacteria Battle",
    color: "#7B68EE",
    bg: "#f0eeff",
    objectives: [
      "Name the two key bacteria in aquaponics nitrification: Nitrosomonas and Nitrobacter",
      "Explain what each bacterium eats and what it produces",
      "Understand that beneficial bacteria are invisible helpers living on every surface",
      "Connect bacterial activity to plant growth through the nitrogen cycle",
    ],
    vocabulary: [
      { word: "Nitrosomonas", def: "Bacteria that convert ammonia (NH₃) into nitrite (NO₂⁻). They are the first step in nitrification." },
      { word: "Nitrobacter", def: "Bacteria that convert nitrite (NO₂⁻) into nitrate (NO₃⁻). They complete the nitrification process." },
      { word: "Nitrification", def: "The two-step biological conversion: ammonia → nitrite (by Nitrosomonas) → nitrate (by Nitrobacter)." },
      { word: "Biofilm", def: "A thin layer of bacteria that coats tank walls, pipes, and grow media. This is where nitrification happens." },
      { word: "Colonization", def: "When bacteria populations establish themselves in a new tank. New aquaponics systems must 'cycle' for 4-6 weeks to build colonies." },
      { word: "Substrate", def: "The material (gravel, clay pebbles, etc.) that fills the grow bed. It provides surface area for bacteria to live on." },
    ],
    whyItWorks: `Bacteria are the unsung heroes of aquaponics. Without them, the fish would die within days from ammonia poisoning.

Nitrosomonas bacteria are aerobic (need oxygen) and specialize in one reaction: NH₃ + O₂ -> NO₂⁻. They're slow-growing (they double every 8-12 hours vs. E. coli's 20 minutes) and are the rate-limiting step — you can't rush the nitrogen cycle.

Nitrobacter bacteria then take NO₂⁻ and convert it to NO₃⁻. This second step completes nitrification and produces the plant-safe form of nitrogen.

Both bacteria are obligate chemolithotrophs and they get all their energy from these inorganic chemical reactions, not from organic food. They live in biofilms on every surface in the system; this is why grow media with high surface area (clay pebbles, lava rock) is essential.

The game mechanic, switching between the two bacteria to eat different molecules, visualizes this two-step process and makes the invisible visible. Students see that neither bacterium alone can complete the cycle.`,
    teacherTips: [
      "Show a photo of biofilm (the brownish-green coating on aquarium glass) That's where the bacteria live!",
      "Ask: 'If you cleaned the tank with bleach and killed all bacteria, what would happen to the fish?' Trace the cascade.",
      "Connect to gut bacteria: 'Your intestines have beneficial bacteria too. What happens when you take antibiotics?'",
      "Discuss: why do aquaponics farmers never use antibiotics in their systems unless absolutely necessary?",
    ],
  },
  {
    id: 5,
    emoji: "✅",
    title: "Perfect Pairs",
    color: "#5BAD92",
    bg: "#e8f7f2",
    objectives: [
      "Match common aquaponics fish species with compatible plant partners",
      "Explain why some fish-plant combinations work better than others",
      "Understand that water temperature, pH, and nutrient output all affect compatibility",
      "Recognize aquaponics as a designed system that requires thoughtful pairing",
    ],
    vocabulary: [
      { word: "Tilapia", def: "A warm-water fish (optimal 25-30°C) native to Africa. Produces lots of nutrient-rich waste, ideal for leafy greens like lettuce and basil." },
      { word: "Trout", def: "A cold-water fish (optimal 12-18°C) that produces waste high in nitrogen, supporting leafy greens like spinach and arugula." },
      { word: "Catfish", def: "A hardy, warm-water bottom feeder. Tolerates a wide pH range, compatible with fruiting plants like tomatoes and cucumbers." },
      { word: "Koi", def: "Ornamental fish that produce nutrient-rich waste, often paired with aquatic plants like watercress and mint." },
      { word: "Compatibility", def: "How well two organisms thrive together in the same system, considering temperature, pH, and nutrient needs." },
      { word: "Water Temperature", def: "Critical in aquaponics, warm-water fish and cold-water fish need different temperatures, and plants must match." },
    ],
    whyItWorks: `In a real aquaponics system, fish and plant selection must be coordinated. This isn't just preference, it's physics and biology.

Temperature is the biggest constraint. Tilapia thrive at 25-30°C; lettuce, basil, and other leafy greens also prefer warmer conditions. Trout need cold water (below 18°C), and cold water slows bacterial activity, which reduces nutrient output, making slower-growing plants like spinach and arugula a better match.

Nutrient output matters too. Different fish produce waste with different nitrogen loads and ratios. High-output fish (tilapia, catfish) can support hungry fruiting plants like tomatoes; lower-output fish suit leafy greens that need less nitrogen.

pH tolerance: most aquaponics systems run at pH 6.8-7.2, which is a compromise between fish comfort (prefer 7.0+) and plant nutrient availability (drops above 7.5). Some fish like catfish tolerate a wider range, giving more plant flexibility.

The pairing game builds intuition for this design thinking: it's not just "fish + plants = aquaponics." It requires matching biological needs across multiple dimensions.`,
    teacherTips: [
      "Bring in a thermometer and ask: 'Would you rather swim in cold mountain water or a warm lake?' Connect to fish species preferences.",
      "Map the pairings on a poster: draw lines connecting fish to compatible plants, with temperature labels.",
      "Challenge: 'Could you design a system with tilapia AND trout? What problems would you face?'",
      "Discuss food systems: 'Why might a local restaurant want to use an aquaponics farm nearby?'",
    ],
  },
];

export default function TeacherSupport() {
  const [open, setOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"objectives" | "vocab" | "why" | "tips">("objectives");

  const game = selectedGame !== null ? games[selectedGame] : null;

  return (
    <>
      {/* Floating Teacher Button */}
      <div className="fixed bottom-5 left-5 z-50 group flex flex-col items-end gap-1">
        <span
          className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold px-3 py-1 rounded-full shadow pointer-events-none whitespace-nowrap"
        >
        </span>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-3 py-3 rounded-2xl shadow-xl font-bold text-sm transition-all hover:scale-105 active:scale-95"
          style={{
            background: "linear-gradient(135deg, #4A8E9E, #6B8E4E)",
            color: "#fff",
            border: "2px solid rgba(255,255,255,0.3)",
            fontFamily: "var(--font-nunito), sans-serif",
            boxShadow: "0 4px 20px rgba(74,142,158,0.45)",
          }}
          aria-label="Teacher Support"
        >
          <span style={{ fontSize: "0.9rem" }}>📚</span>
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-stretch"
          style={{ background: "rgba(10,20,15,0.7)", backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) { setOpen(false); setSelectedGame(null); } }}
        >
          {/* Panel */}
          <div
            className="relative flex flex-col w-full max-w-5xl mx-auto my-6 rounded-3xl overflow-hidden"
            style={{
              background: "#f8fdf9",
              border: "2.5px solid #c8e6c9",
              boxShadow: "0 24px 80px rgba(0,0,0,0.3)",
              fontFamily: "var(--font-nunito), sans-serif",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-8 py-5"
              style={{ background: "linear-gradient(135deg, #2d5a3d 0%, #1a3a4a 100%)", color: "#fff" }}
            >
              <div className="flex items-center gap-3">
                {game && (
                  <button
                    onClick={() => { setSelectedGame(null); setActiveTab("objectives"); }}
                    className="flex items-center gap-1 text-sm opacity-70 hover:opacity-100 transition-opacity mr-2"
                  >
                    ← All Games
                  </button>
                )}
                <span style={{ fontSize: "1.8rem" }}>📚</span>
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight">
                    {game ? game.title : "Teacher Support Center"}
                  </h2>
                  <p className="text-xs opacity-70 mt-0.5">
                    {game ? "Learning materials for this activity" : "Fish Farm Frenzy - Educator Resources"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setOpen(false); setSelectedGame(null); }}
                className="w-9 h-9 rounded-full flex items-center justify-center text-xl hover:bg-white/20 transition-colors"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              {!game ? (
                // Game selector
                <div className="p-8">
                  <p
                    className="text-sm mb-6 leading-relaxed rounded-2xl px-5 py-4"
                    style={{ background: "#e8f5e9", color: "#2d5a3d", border: "1.5px solid #a5d6a7" }}
                  >
                    <strong>Welcome, Educator!</strong> Select a game below to view its learning objectives, key vocabulary with definitions, a deep explanation of the aquaponics science behind it, and classroom discussion tips.
                  </p>

                  <div className="grid grid-cols-1 gap-4 flex items-center">
                    {games.map((g, i) => (
                      <button
                        key={g.id}
                        onClick={() => { setSelectedGame(i); setActiveTab("objectives"); }}
                        className="flex items-center gap-4 p-5 rounded-2xl text-left transition-all hover:scale-[1.01] hover:shadow-lg"
                        style={{
                          background: g.bg,
                          border: `2px solid ${g.color}33`,
                          boxShadow: `0 2px 12px ${g.color}22`,
                        }}
                      >
                        <span style={{ fontSize: "2rem" }}>{g.emoji}</span>
                        <div className="flex-1">
                          <div className="flex items-baseline gap-2">
                            <span
                              className="flex items-center text-xs font-bold px-2 py-0.5 rounded-full"
                              style={{ background: g.color, color: "#fff" }}
                            >
                              Game {g.id}
                            </span>
                            <h3 className="flex items-center font-extrabold text-lg" style={{ color: "#1a1a1a" }}>{g.title}</h3>
                          </div>
                          <p className="flex items-center text-xs mt-1 opacity-60">{g.objectives.length} learning objectives · {g.vocabulary.length} vocabulary terms</p>
                        </div>
                        <span style={{ color: g.color, fontSize: "1.4rem" }}>→</span>
                      </button>
                    ))}
                  </div>

                  {/* Overview section */}
                  <div
                    className="mt-8 rounded-2xl p-6"
                    style={{ background: "#fff", border: "1.5px solid #e0e0e0" }}
                  >
                    <h3 className="font-extrabold text-lg mb-3" style={{ color: "#2d5a3d" }}>🌊 About Fish Farm Frenzy</h3>
                    <p className="text-sm leading-relaxed mb-3" style={{ color: "#444" }}>
                      Fish Farm Frenzy is a 5-game educational suite designed to teach students about aquaponics - a sustainable farming method that combines fish cultivation with plant growing in a closed-loop system.
                    </p>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: "#444" }}>
                      <strong>Core message students should retain:</strong> In aquaponics, fish, bacteria, and plants are completely interdependent. Fish produce waste = bacteria transform waste into plant food = plants clean the water = clean water returns to fish. Nothing is wasted.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { icon: "🎯", label: "Target Age", val: "Grades 4-8 (Ages 9-14)" },
                        { icon: "⏱️", label: "Per Game", val: "10-20 minutes" },
                        { icon: "📖", label: "Subjects", val: "Science, Ecology, Systems" },
                        { icon: "🔬", label: "Key Concept", val: "Closed-loop sustainability" },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center gap-2 text-sm" style={{ color: "#333" }}>
                          <span>{item.icon}</span>
                          <span><strong>{item.label}:</strong> {item.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                // Game detail view
                <div className="flex flex-col">
                  {/* Game header */}
                  <div
                    className="px-8 py-5 flex items-center gap-4"
                    style={{ background: game.bg, borderBottom: `2px solid ${game.color}33` }}
                  >
                    <span style={{ fontSize: "2.4rem" }}>{game.emoji}</span>
                    <div>
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ background: game.color, color: "#fff" }}
                      >
                        Game {game.id}
                      </span>
                      <h3 className="text-2xl font-extrabold mt-1" style={{ color: "#1a1a1a" }}>{game.title}</h3>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div
                    className="flex gap-1 px-8 py-3"
                    style={{ background: "#fff", borderBottom: "1.5px solid #e8e8e8" }}
                  >
                    {(["objectives", "vocab", "why", "tips"] as const).map((tab) => {
                      const labels = { objectives: "🎯 Learning Goals", vocab: "📖 Vocabulary", why: "🔬 Why It Works", tips: "💡 Teacher Tips" };
                      return (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
                          style={{
                            background: activeTab === tab ? game.color : "transparent",
                            color: activeTab === tab ? "#fff" : "#666",
                            border: activeTab === tab ? "none" : "1.5px solid #e0e0e0",
                          }}
                        >
                          {labels[tab]}
                        </button>
                      );
                    })}
                  </div>

                  {/* Tab content */}
                  <div className="p-8">
                    {activeTab === "objectives" && (
                      <div>
                        <p className="text-sm mb-5 font-semibold" style={{ color: "#666" }}>
                          After playing <strong>{game.title}</strong>, students should be able to:
                        </p>
                        <div className="space-y-3">
                          {game.objectives.map((obj, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-3 p-4 rounded-xl"
                              style={{ background: game.bg, border: `1.5px solid ${game.color}33` }}
                            >
                              <span
                                className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-extrabold"
                                style={{ background: game.color, color: "#fff" }}
                              >
                                {i + 1}
                              </span>
                              <p className="text-sm leading-relaxed" style={{ color: "#2a2a2a" }}>{obj}</p>
                            </div>
                          ))}
                        </div>
                        <div
                          className="mt-6 p-4 rounded-xl text-sm"
                          style={{ background: "#fff9e6", border: "1.5px solid #ffe082", color: "#5a4200" }}
                        >
                          <strong>📋 One Week Later Test:</strong> Ask students to draw and label the aquaponics cycle from memory, explain one thing that could go wrong and why, and name which fish they would choose and what they would feed it.
                        </div>
                      </div>
                    )}

                    {activeTab === "vocab" && (
                      <div>
                        <p className="text-sm mb-5 font-semibold" style={{ color: "#666" }}>
                          Key terms for <strong>{game.title}</strong>:
                        </p>
                        <div className="space-y-3">
                          {game.vocabulary.map((v, i) => (
                            <div
                              key={i}
                              className="p-4 rounded-xl"
                              style={{ background: "#fff", border: `1.5px solid ${game.color}44` }}
                            >
                              <div
                                className="inline-block text-sm font-extrabold px-3 py-1 rounded-lg mb-2"
                                style={{ background: game.color, color: "#fff" }}
                              >
                                {v.word}
                              </div>
                              <p className="text-sm leading-relaxed" style={{ color: "#333" }}>{v.def}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === "why" && (
                      <div>
                        <p className="text-sm mb-4 font-semibold" style={{ color: "#666" }}>
                          The science behind <strong>{game.title}</strong>:
                        </p>
                        <div
                          className="p-6 rounded-2xl"
                          style={{ background: "#fff", border: `1.5px solid ${game.color}44`, lineHeight: "1.8" }}
                        >
                          {game.whyItWorks.split("\n\n").map((para, i) => (
                            <p
                              key={i}
                              className="text-sm mb-4 last:mb-0"
                              style={{ color: "#2a2a2a" }}
                            >
                              {para}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === "tips" && (
                      <div>
                        <p className="text-sm mb-5 font-semibold" style={{ color: "#666" }}>
                          Classroom discussion starters and extension ideas for <strong>{game.title}</strong>:
                        </p>
                        <div className="space-y-4">
                          {game.teacherTips.map((tip, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-3 p-4 rounded-xl"
                              style={{ background: "#fff", border: "1.5px solid #e0e0e0" }}
                            >
                              <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>
                                {["💬", "📝", "🔍", "🤔"][i % 4]}
                              </span>
                              <p className="text-sm leading-relaxed" style={{ color: "#2a2a2a" }}>{tip}</p>
                            </div>
                          ))}
                        </div>

                        <div
                          className="mt-6 p-5 rounded-2xl text-sm"
                          style={{ background: "#e8f5e9", border: "1.5px solid #a5d6a7", color: "#1b5e20" }}
                        >
                          <strong>🌱 Real-World Extension:</strong> Consider connecting your class with a local aquaponics farm or starting a small desktop system in the classroom. Even a simple 10-gallon tank with goldfish and a plant tray makes the cycle visible and tangible.
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}