"use client";

import { useState, useEffect, useMemo } from "react";

//scenario types
type Choice = {
  text: string;
  impact: number; //+ for good decisions, - for bad
  feedback: string;
};

type Scenario = {
  id: number;
  title: string;
  description: string;
  choices: Choice[];
};

//scenarios
const scenarios: Scenario[] = [
  {
    id: 1,
    title: "Pipes Bursting!",
    description: "You notice water leaking from one of the main pipes connecting your fish tank to the grow bed. The leak is getting worse!",
    choices: [
      {
        text: "Immediately shut off the water pump and repair the pipe",
        impact: 10,
        feedback: "Great decision! You prevented water loss and system damage. The fish and plants are safe."
      },
      {
        text: "Ignore it for now and check it later",
        impact: -10,
        feedback: "Bad choice! The leak got worse, flooding the area and stressing the fish. Your score decreased."
      },
      {
        text: "Try to patch it while the system is running",
        impact: 5,
        feedback: "Risky but it worked! You managed a temporary fix, but you should do a proper repair soon."
      }
    ]
  },
  {
    id: 2,
    title: "Fish Running Away!",
    description: "You left the tank cover open and some fish jumped out onto the floor!",
    choices: [
      {
        text: "Quickly and gently put them back in the water",
        impact: 10,
        feedback: "Perfect! You saved the fish quickly. Remember to keep the tank covered from now on."
      },
      {
        text: "Panic and take too long to respond",
        impact: -10,
        feedback: "You took too long! Some fish didn't make it. Always act quickly in emergencies."
      },
      {
        text: "Put them back, but forget to cover the tank",
        impact: -5,
        feedback: "You saved them this time, but without a cover, it might happen again!"
      }
    ]
  },
  {
    id: 3,
    title: "Fish Getting Sick",
    description: "Several fish are showing signs of disease. They're lethargic and have spots on their bodies.",
    choices: [
      {
        text: "Quarantine sick fish and test water quality",
        impact: 10,
        feedback: "Excellent! Quarantining prevents disease spread and testing helps identify the root cause."
      },
      {
        text: "Add random medications without testing",
        impact: -10,
        feedback: "Wrong approach! Unneeded medication can harm beneficial bacteria and healthy fish."
      },
      {
        text: "Do nothing and hope they get better",
        impact: -15,
        feedback: "Very bad decision! The disease spread to more fish. Early intervention is crucial!"
      }
    ]
  },
  {
    id: 4,
    title: "Plants Dying",
    description: "Your lettuce plants are turning yellow and wilting. The leaves look weak.",
    choices: [
      {
        text: "Check nutrient levels and pH of the water",
        impact: 10,
        feedback: "Smart thinking! You found the water was too acidic. Adjusting pH saved your plants."
      },
      {
        text: "Add more fish food to increase nutrients",
        impact: -8,
        feedback: "Bad idea! Excess food pollutes water and doesn't address the real issue."
      },
      {
        text: "Remove dying plants and plant new ones",
        impact: 3,
        feedback: "This helps temporarily, but you didn't fix the underlying problem. The new plants may die too."
      }
    ]
  },
  {
    id: 5,
    title: "Poor Water Quality",
    description: "Your water test shows high ammonia levels, which is dangerous for fish!",
    choices: [
      {
        text: "Reduce feeding and increase water flow",
        impact: 10,
        feedback: "Perfect solution! Reducing feeding lowers ammonia production while better flow helps bacteria convert it."
      },
      {
        text: "Change all the water at once",
        impact: -10,
        feedback: "Too drastic! You removed all beneficial bacteria. The system will take weeks to recover."
      },
      {
        text: "Add chemical ammonia remover",
        impact: 5,
        feedback: "This works short-term, but you should address the root cause - likely overfeeding."
      }
    ]
  },
  {
    id: 6,
    title: "Temperature Drop",
    description: "The water temperature dropped to 60°F overnight. Your fish seem sluggish.",
    choices: [
      {
        text: "Gradually warm the water with a heater",
        impact: 10,
        feedback: "Correct! Gradual warming prevents shock to the fish. They're becoming active again."
      },
      {
        text: "Add hot water directly to raise temperature quickly",
        impact: -10,
        feedback: "Temperature shock! Rapid changes stress or kill fish. Always make gradual adjustments."
      },
      {
        text: "Do nothing and wait for natural warming",
        impact: -5,
        feedback: "Fish metabolism slowed down and some got sick. Temperature regulation is important."
      }
    ]
  },
  {
    id: 7,
    title: "Algae Outbreak",
    description: "Green algae is covering your grow bed and tank walls. The water looks cloudy.",
    choices: [
      {
        text: "Reduce light exposure and clean the system",
        impact: 10,
        feedback: "Great approach! Algae needs light to grow. Reduced lighting and cleaning solved the problem."
      },
      {
        text: "Add algae-killing chemicals",
        impact: -8,
        feedback: "Chemicals killed the algae but also harmed beneficial bacteria and stressed the fish."
      },
      {
        text: "Add more fish to eat the algae",
        impact: -5,
        feedback: "Overcrowding! Too many fish creates more waste, making the algae problem worse."
      }
    ]
  },
  {
    id: 8,
    title: "Power Outage",
    description: "A storm caused a power outage. Your pumps and aerators stopped working!",
    choices: [
      {
        text: "Set up battery-powered aerators and monitor closely",
        impact: 10,
        feedback: "Excellent emergency response! Your fish have oxygen and the system is stable until power returns."
      },
      {
        text: "Panic and dump ice into the tank",
        impact: -10,
        feedback: "Temperature shock! Always stay calm and think through your actions during emergencies."
      },
      {
        text: "Manually stir the water occasionally",
        impact: 7,
        feedback: "Good effort! Manual aeration helps, but you'll need to keep this up until power is restored."
      }
    ]
  },
  {
    id: 9,
    title: "Overgrown Roots",
    description: "The plant roots have grown so long they're blocking the water flow in your system.",
    choices: [
      {
        text: "Carefully trim the excessive roots without damaging the plants",
        impact: 10,
        feedback: "Perfect! You improved water flow while keeping the plants healthy. Regular maintenance prevents this."
      },
      {
        text: "Pull out all the plants and start over",
        impact: -10,
        feedback: "Too extreme! You wasted healthy plants. Root trimming would have been enough."
      },
      {
        text: "Leave them alone and reduce water flow",
        impact: -7,
        feedback: "Poor solution! Reduced flow means less oxygen for fish. Address the root cause instead."
      }
    ]
  },
  {
    id: 10,
    title: "pH Imbalance",
    description: "Your pH test shows the water is at 5.5, which is too acidic for most fish and plants!",
    choices: [
      {
        text: "Gradually add pH buffer to raise it to 6.5-7.0",
        impact: 10,
        feedback: "Excellent! Gradual pH adjustment prevents shocking the fish. The system is balanced now."
      },
      {
        text: "Add a large amount of baking soda all at once",
        impact: -10,
        feedback: "pH shock! Rapid changes harm fish and beneficial bacteria. Always adjust pH gradually."
      },
      {
        text: "Wait and test again tomorrow",
        impact: -8,
        feedback: "Waiting made it worse! Low pH stressed the fish and slowed plant growth. Act promptly on pH issues."
      }
    ]
  },
  {
    id: 11,
    title: "Pest Invasion",
    description: "You discovered aphids on your tomato plants in the grow bed!",
    choices: [
      {
        text: "Remove affected leaves and introduce ladybugs",
        impact: 10,
        feedback: "Great biological control! Ladybugs eat aphids naturally without harming your system."
      },
      {
        text: "Spray pesticides on the plants",
        impact: -12,
        feedback: "Disaster! Pesticides killed the beneficial bacteria and poisoned the fish. Never use chemicals in aquaponics!"
      },
      {
        text: "Spray plants with diluted soapy water",
        impact: 6,
        feedback: "This works somewhat, but be careful - soap can harm fish if it gets in the water. Monitor closely."
      }
    ]
  },
  {
    id: 12,
    title: "Overfeeding Consequences",
    description: "You notice uneaten food collecting at the bottom of the tank. The water is getting cloudy.",
    choices: [
      {
        text: "Remove excess food and reduce feeding portions",
        impact: 10,
        feedback: "Smart! Removing waste and adjusting feeding prevents water quality issues. Feed only what fish can eat in 5 minutes."
      },
      {
        text: "Add more fish to eat the extra food",
        impact: -10,
        feedback: "Bad idea! Overcrowding creates more waste and stress. The problem got worse."
      },
      {
        text: "Keep feeding the same amount",
        impact: -12,
        feedback: "Terrible choice! Rotting food spiked ammonia levels. Several fish died from toxicity."
      }
    ]
  },
  {
    id: 13,
    title: "Oxygen Depletion",
    description: "Early morning check shows fish gasping at the water surface. There is low oxygen!",
    choices: [
      {
        text: "Increase aeration and check for system blockages",
        impact: 10,
        feedback: "Perfect response! You found a clogged filter reducing water flow. Fish are breathing normally now."
      },
      {
        text: "Add more plants to produce oxygen",
        impact: -6,
        feedback: "Plants consume oxygen at night! This doesn't solve the immediate crisis. You need mechanical aeration."
      },
      {
        text: "Reduce fish population immediately",
        impact: 4,
        feedback: "This helps long-term but doesn't address the urgent oxygen need. Check your aeration system first."
      }
    ]
  },
  {
    id: 14,
    title: "Filter Clogging",
    description: "Water flow has slowed significantly. The mechanical filter is completely clogged with debris.",
    choices: [
      {
        text: "Clean the filter thoroughly and resume normal operation",
        impact: 10,
        feedback: "Excellent maintenance! Regular filter cleaning is crucial. Set a weekly cleaning schedule."
      },
      {
        text: "Remove the filter completely",
        impact: -10,
        feedback: "Critical error! Without filtration, solid waste will clog the system and harm water quality."
      },
      {
        text: "Poke some holes in the debris to let water through",
        impact: -5,
        feedback: "Temporary fix that doesn't solve the problem. The partially clogged filter can't work effectively."
      }
    ]
  },
  {
    id: 15,
    title: "New Fish Introduction",
    description: "You just bought new fish to add to your tank. They're in a bag ready to be released.",
    choices: [
      {
        text: "Float the bag for 30 minutes, then gradually mix water before releasing",
        impact: 10,
        feedback: "Perfect acclimation process! Temperature and water chemistry adjustment prevents shock. The new fish are thriving."
      },
      {
        text: "Dump them directly into the tank",
        impact: -12,
        feedback: "Shock killed most of the new fish! Temperature and water chemistry differences require gradual acclimation."
      },
      {
        text: "Float the bag but don't mix any water",
        impact: 3,
        feedback: "Partial solution - you equalized temperature but not water chemistry. Some fish look stressed."
      }
    ]
  },
  {
    id: 16,
    title: "Nitrite Spike",
    description: "Your water test shows dangerous nitrite levels. The fish are stressed and some are hiding!",
    choices: [
      {
        text: "Add aquarium salt and increase aeration while monitoring closely",
        impact: 10,
        feedback: "Smart emergency response! Salt reduces nitrite toxicity while you wait for bacterial colonies to stabilize."
      },
      {
        text: "Do a complete water change immediately",
        impact: -8,
        feedback: "Too aggressive! You crashed the nitrogen cycle. The system needs time to rebuild beneficial bacteria."
      },
      {
        text: "Stop feeding for a few days",
        impact: 6,
        feedback: "This helps reduce the nitrogen load, but you need additional measures to protect the fish right now."
      }
    ]
  },
  {
    id: 17,
    title: "Plant Nutrient Deficiency",
    description: "Your plants show signs of iron deficiency. New leaves are pale yellow while veins are green.",
    choices: [
      {
        text: "Add chelated iron supplement designed for aquaponics",
        impact: 10,
        feedback: "Excellent! Fish-safe iron supplement restored the green color. Your plants are healthy again."
      },
      {
        text: "Add garden fertilizer to boost nutrients",
        impact: -12,
        feedback: "Disaster! Garden fertilizers contain chemicals toxic to fish. You've poisoned your system!"
      },
      {
        text: "Increase fish feeding to add more nutrients",
        impact: -6,
        feedback: "Overfeeding creates ammonia problems without addressing iron deficiency. Wrong approach!"
      }
    ]
  },
  {
    id: 18,
    title: "Predator Alert!",
    description: "A bird has been spotted trying to catch fish from your outdoor tank!",
    choices: [
      {
        text: "Install netting or a cover over the tank",
        impact: 10,
        feedback: "Perfect protection! The netting keeps predators out while allowing air circulation. Your fish are safe."
      },
      {
        text: "Move the fish indoors temporarily",
        impact: 4,
        feedback: "This works but is stressful for the fish and doesn't solve the long-term problem."
      },
      {
        text: "Hope the bird doesn't come back",
        impact: -10,
        feedback: "Bad choice! The bird returned and caught several fish. Always protect your investment."
      }
    ]
  },
  {
    id: 19,
    title: "Water Level Too Low",
    description: "Evaporation has lowered your water level significantly. The pump is starting to make noise!",
    choices: [
      {
        text: "Add dechlorinated water to restore proper level",
        impact: 10,
        feedback: "Perfect! You maintained system stability by using treated water. Regular top-offs prevent this issue."
      },
      {
        text: "Add tap water directly from the hose",
        impact: -8,
        feedback: "Chlorine in tap water harmed your beneficial bacteria and stressed the fish. Always dechlorinate first!"
      },
      {
        text: "Wait until it rains to refill naturally",
        impact: -7,
        feedback: "The pump ran dry and burned out! Never let water levels get too low."
      }
    ]
  },
  {
    id: 20,
    title: "Snail Explosion",
    description: "You notice hundreds of tiny snails covering your tank and grow bed. They're multiplying fast!",
    choices: [
      {
        text: "Manually remove excess snails and reduce feeding",
        impact: 8,
        feedback: "Good control method! Snails multiply when there's excess food. Some snails help clean, but too many is a problem."
      },
      {
        text: "Add snail-eating fish to control the population",
        impact: 6,
        feedback: "Biological control can work, but make sure new fish are compatible with your existing stock."
      },
      {
        text: "Use chemical snail killer",
        impact: -12,
        feedback: "Terrible decision! The chemicals killed beneficial organisms and poisoned your fish. Never use chemicals!"
      }
    ]
  },
  {
    id: 21,
    title: "Heat Wave Crisis",
    description: "Temperatures soared to 95°F! Your water temperature hit 85°F and fish are gasping.",
    choices: [
      {
        text: "Add ice bottles to slowly cool water and increase aeration",
        impact: 10,
        feedback: "Smart emergency cooling! Gradual temperature reduction with extra oxygen saved your fish."
      },
      {
        text: "Dump bags of ice directly into the tank",
        impact: -10,
        feedback: "Temperature shock! Rapid cooling stressed the fish. Always make gradual adjustments."
      },
      {
        text: "Add a fan to blow air over the water surface",
        impact: 7,
        feedback: "This helps through evaporative cooling, but severe heat waves need additional cooling methods."
      }
    ]
  },
  {
    id: 22,
    title: "Cloudy White Water",
    description: "The water has turned milky white! This is a bacterial bloom from a cycling imbalance.",
    choices: [
      {
        text: "Reduce feeding and wait for beneficial bacteria to stabilize",
        impact: 10,
        feedback: "Correct approach! Bacterial blooms clear naturally as the system rebalances. Patience is key."
      },
      {
        text: "Add chemical clarifiers to clear the water",
        impact: -8,
        feedback: "Chemicals disrupted the bacterial balance further. Let nature take its course in aquaponics!"
      },
      {
        text: "Change 50% of the water immediately",
        impact: -6,
        feedback: "Unnecessary stress on the system! Bacterial blooms are harmless and clear up on their own."
      }
    ]
  },
  {
    id: 23,
    title: "Grow Bed Flooding",
    description: "Your grow bed isn't draining properly and is staying flooded. Plant roots need air!",
    choices: [
      {
        text: "Check and clear the drain standpipe of debris",
        impact: 10,
        feedback: "Perfect diagnosis! A clogged drain was the issue. Regular maintenance prevents this problem."
      },
      {
        text: "Drill more holes in the grow bed bottom",
        impact: -8,
        feedback: "Wrong solution! You created leaks without fixing the real problem - the clogged drain."
      },
      {
        text: "Reduce water flow to the grow bed",
        impact: -5,
        feedback: "This masks the symptom without fixing the drainage issue. Your plants still can't breathe properly."
      }
    ]
  },
  {
    id: 24,
    title: "Fish Not Eating",
    description: "Your fish have stopped eating for the past two days. They seem healthy, but ignore food.",
    choices: [
      {
        text: "Test water parameters and check temperature",
        impact: 10,
        feedback: "Wise decision! You found the water was too cold. After warming it gradually, the fish started eating again."
      },
      {
        text: "Force feed them by adding more food",
        impact: -10,
        feedback: "Terrible idea! Uneaten food rotted and polluted the water, making the problem worse."
      },
      {
        text: "Switch to a different type of food",
        impact: 4,
        feedback: "Sometimes this works, but you should check water quality first to rule out environmental stress."
      }
    ]
  },
  {
    id: 25,
    title: "Beneficial Bacteria Die-Off",
    description: "Something killed your beneficial bacteria! Ammonia is spiking and the system is crashing!",
    choices: [
      {
        text: "Add bottled bacteria, reduce feeding, and monitor closely",
        impact: 10,
        feedback: "Perfect crisis management! You're restarting the nitrogen cycle while protecting the fish."
      },
      {
        text: "Remove all fish immediately",
        impact: -6,
        feedback: "Too extreme! With proper management, the fish can survive while bacteria recolonize."
      },
      {
        text: "Do nothing and hope bacteria regrow quickly",
        impact: -12,
        feedback: "Catastrophic failure! Ammonia poisoning killed most of your fish. Always take immediate action!"
      }
    ]
  },
  {
    id: 26,
    title: "Plant Transplant Shock",
    description: "New seedlings you transplanted are wilting badly. They look like they won't make it!",
    choices: [
      {
        text: "Provide shade and ensure consistent water flow for recovery",
        impact: 10,
        feedback: "Excellent care! Temporary shade and stable conditions helped the seedlings recover and thrive."
      },
      {
        text: "Pull them out and start over with new plants",
        impact: -5,
        feedback: "Too hasty! Most seedlings recover from transplant shock with proper care."
      },
      {
        text: "Add plant vitamins to help them recover",
        impact: 3,
        feedback: "Some supplements help, but proper environmental conditions are more important than additives."
      }
    ]
  },
  {
    id: 27,
    title: "Unbalanced Fish-to-Plant Ratio",
    description: "Your plants aren't growing well despite healthy fish. You might have too few fish for your plant load!",
    choices: [
      {
        text: "Gradually add more fish to increase nutrient production",
        impact: 10,
        feedback: "Smart analysis! More fish provided nutrients the plants needed. Balance is key in aquaponics."
      },
      {
        text: "Add chemical fertilizers to supplement",
        impact: -10,
        feedback: "Wrong approach! Chemicals can harm fish. The solution is more fish, not fertilizers."
      },
      {
        text: "Remove some plants to match current fish load",
        impact: 5,
        feedback: "This works, but you're reducing your harvest. Adding fish is usually better than removing plants."
      }
    ]
  },
  {
    id: 28,
    title: "Mysterious Fish Deaths",
    description: "You found three dead fish this morning with no obvious cause. What's wrong?",
    choices: [
      {
        text: "Test all water parameters and check for toxins",
        impact: 10,
        feedback: "Thorough investigation! You discovered a small ammonia spike and fixed it before losing more fish."
      },
      {
        text: "Assume they were old and do nothing",
        impact: -12,
        feedback: "Dangerous assumption! An undetected problem killed more fish over the next few days."
      },
      {
        text: "Remove the bodies and increase water changes",
        impact: 4,
        feedback: "Removing dead fish is important, but you need to find the root cause, not just treat symptoms."
      }
    ]
  },
  {
    id: 29,
    title: "Bell Siphon Failure",
    description: "Your bell siphon stopped working! The grow bed won't drain and refill properly.",
    choices: [
      {
        text: "Clean the siphon and check for proper water flow rate",
        impact: 10,
        feedback: "Great troubleshooting! Debris in the siphon was blocking it. Regular cleaning keeps it working."
      },
      {
        text: "Switch to continuous flow instead of flood and drain",
        impact: -6,
        feedback: "Major system change without fixing a simple problem! Bell siphons usually just need cleaning."
      },
      {
        text: "Manually drain and fill the bed for now",
        impact: 3,
        feedback: "This works temporarily but isn't sustainable. Fix the siphon as soon as possible."
      }
    ]
  },
  {
    id: 30,
    title: "Seasonal Light Changes",
    description: "Winter is coming and your plants are getting less natural light. Growth has slowed significantly.",
    choices: [
      {
        text: "Install grow lights to supplement natural sunlight",
        impact: 10,
        feedback: "Perfect solution! Supplemental lighting maintained healthy plant growth through winter."
      },
      {
        text: "Move the system indoors",
        impact: 6,
        feedback: "This can work for small systems, but it's a big undertaking. Grow lights are usually easier."
      },
      {
        text: "Accept slower growth and reduce plant density",
        impact: 4,
        feedback: "This works, but you're reducing your harvest. Most plants need adequate light to thrive."
      }
    ]
  }
];

const SCENARIOS_PER_GAME = 15;

//fisher-yates shuffle to change the order of the + and - cards for each scenario
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

//shuffle for random scenarios
function getRandomScenarios(count: number): Scenario[] {
  const shuffled = shuffleArray(scenarios);
  return shuffled.slice(0, count);
}

//making it cute with icons and such
const FishIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <ellipse cx="10" cy="12" rx="6" ry="4" fill="var(--periwinkle)" />
    <polygon points="16,12 21,9 21,15" fill="var(--teal-medium)" />
    <circle cx="8.5" cy="11" r="0.8" fill="var(--color-text-primary)" />
  </svg>
);

const LeafIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path
      d="M4 14C4 8 10 4 20 4C20 14 14 20 8 20C5 20 4 17 4 14Z"
      fill="var(--mint-light)"
    />
  </svg>
);

const BubbleIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <circle cx="8" cy="10" r="3" fill="var(--periwinkle)" />
    <circle cx="16" cy="14" r="2" fill="var(--periwinkle)" />
  </svg>
);

const StarIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="var(--success-yellow)" className={className}>
    <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
  </svg>
);

//otter icon for mascot
const OtterMascot = ({ message }: { message: string }) => (
  <div className="flex items-start gap-4 bg-white p-4 rounded-2xl shadow-md mb-6">
    <div className="text-5xl">🦦</div>
    <div className="bg-[var(--mint-light)] p-3 rounded-xl text-gray-700 text-sm">
      {message}
    </div>
  </div>
);

//bubble animation
const BubbleBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
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
      @keyframes gentleFloat {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-6px); }
      }
      @keyframes rotateBounce {
        0% { transform: rotate(0deg); }
        50% { transform: rotate(10deg); }
        100% { transform: rotate(0deg); }
      }
    `}</style>
  </div>
);

export default function SaveFishFarmGame() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<"playing" | "feedback" | "complete">("playing");
  const [lastFeedback, setLastFeedback] = useState("");
  const [lastImpact, setLastImpact] = useState(0);
  const [decisionsHistory, setDecisionsHistory] = useState<{ scenario: string; choice: string; impact: number }[]>([]);
  const [shuffledChoices, setShuffledChoices] = useState<Choice[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoveredNext, setHoveredNext] = useState(false);
  const [hoveredRestart, setHoveredRestart] = useState(false);
  const [hovered, setHovered] = useState(false);
  const bubbleBackground = useMemo(() => <BubbleBackground />, []);

  //initialize scenarios
  useEffect(() => {
    const randomScenarios = getRandomScenarios(SCENARIOS_PER_GAME);
    setScenarios(randomScenarios);
  }, []);

  const currentScenario = scenarios[currentScenarioIndex];

  //shuffle choices
  useEffect(() => {
    if (currentScenario) {
      setShuffledChoices(shuffleArray(currentScenario.choices));
    }
  }, [currentScenarioIndex, scenarios]);

  const handleChoice = (choice: Choice) => {
    const newScore = score + choice.impact;
    setScore(newScore);
    setLastFeedback(choice.feedback);
    setLastImpact(choice.impact);
    setGameState("feedback");
    
    //record choices to show at end
    setDecisionsHistory([
      ...decisionsHistory,
      {
        scenario: currentScenario.title,
        choice: choice.text,
        impact: choice.impact
      }
    ]);
  };

  const handleNext = () => {
    setHoveredNext(false);
    if (currentScenarioIndex < scenarios.length - 1) {
      const nextIndex = currentScenarioIndex + 1;
      setCurrentScenarioIndex(nextIndex);
      setGameState("playing");
      setLastFeedback("");
      setLastImpact(0);
    } else {
      setGameState("complete");
    }
  };

  const handleRestart = () => {
    setHoveredRestart(false);
    const randomScenarios = getRandomScenarios(SCENARIOS_PER_GAME);
    setScenarios(randomScenarios);
    setCurrentScenarioIndex(0);
    setScore(0);
    setGameState("playing");
    setLastFeedback("");
    setLastImpact(0);
    setDecisionsHistory([]);
  };

  const getScoreRating = () => {
    const maxScore = scenarios.length * 10;
    const percentage = (score / maxScore) * 100;
    
    if (percentage >= 80) return { rating: "Excellent", message: "You're an aquaponics expert!" };
    if (percentage >= 60) return { rating: "Good", message: "You understand the basics well!" };
    if (percentage >= 40) return { rating: "Fair", message: "Keep learning and improving!" };
    return { rating: "Needs Improvement", message: "Study aquaponics care more carefully." };
  };

  //show loading if needed
  if (scenarios.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6 bg-[var(--peach-soft)] rounded-lg border-2 border-[var(--color-border-light)]">
        <div className="text-center text-[var(--color-text-secondary)]">
          Loading scenarios...
        </div>
      </div>
    );
  }

  if (gameState === "complete") {
    const { rating, message } = getScoreRating();
    const maxScore = scenarios.length * 10;
    const bgColor = rating === "Excellent" ? "bg-gradient-to-b from-[var(--mint-light)] to-[var(--mint-light)]"
      : rating === "Good" ? "bg-gradient-to-b from-[var(--periwinkle)] to-[var(--periwinkle)]"
      : rating === "Fair" ? "bg-gradient-to-b from-[var(--peach-soft)] to-[var(--peach-soft)]"
      : "bg-gradient-to-b from-[var(--coral-medium)] to-[var(--coral-medium)]";
    
    return (
      <div className={`w-full max-w-2xl mx-auto p-6 rounded-3xl border-2 border-[var(--color-border-medium)] ${bgColor}`}>
        <h2 className="text-2xl font-bold text-center mb-4 text-[var(--color-text-primary)]">
          Game Complete!
        </h2>
        
        <div className="mb-6 text-center">
          <div className="text-5xl font-bold mb-2 text-[var(--color-text-primary)]">
            {score} / {maxScore}
          </div>
          <div className="text-xl font-semibold text-[var(--olive-green)]">
            {rating}
          </div>
          <div className="text-[var(--color-text-secondary)]">
            {message}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-3 text-[var(--color-text-primary)]">Your Decisions:</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {decisionsHistory.map((decision, index) => (
              <div 
                key={index} 
                className="p-3 rounded bg-white border border-[var(--color-border-light)] rounded-2xl"
              >
                <div className="font-medium text-sm text-[var(--color-text-primary)]">
                  {decision.scenario}
                </div>
                <div className="text-xs text-[var(--color-text-secondary)] mt-1">
                  {decision.choice}
                </div>
                <div className={`text-xs mt-1 font-semibold ${
                  decision.impact > 0 
                    ? 'text-[var(--olive-green)]' 
                    : 'text-[var(--coral-medium)]'
                }`}>
                  {decision.impact > 0 ? '+' : ''}{decision.impact} points
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleRestart}
          onMouseEnter={() => setHoveredRestart(true)}
          onMouseLeave={() => setHoveredRestart(false)}
          style={{
            transform: hoveredRestart ? 'scale(1.03)' : 'scale(1)',
            transition: 'all 0.2s ease',
          }}
          className="w-full py-3 px-4 bg-[var(--olive-green)] text-white font-semibold rounded-lg"
        >
          Play Again
        </button>
      </div>
    );
  }

  if (gameState === "feedback") {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FDF6EC] to-[#D6F4FF] p-20 rounded-3xl">

      {bubbleBackground}

      <div className="relative z-10 w-full max-w-xl p-8 bg-white rounded-3xl shadow-2xl text-center">

        {lastImpact > 0 ? (
          <>
            <StarIcon className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              Great Job!
            </h2>
          </>
        ) : (
          <>
            <div className="text-6xl mb-4">🐡</div>
            <h2 className="text-2xl font-bold text-red-500 mb-2">
              Oh No!
            </h2>
          </>
        )}

        <p className="text-gray-700 mb-6">{lastFeedback}</p>

        <div className="text-gray-700 mb-6">
          <div className={`text-2xl font-bold mb-1 ${lastImpact > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {lastImpact > 0 ? '+' : ''}{lastImpact} points
          </div>
          <div className="text-xl font-semibold">Total Score: {score}</div>
        </div>

        <button
          onClick={handleNext}
          onMouseEnter={() => setHoveredNext(true)}
          onMouseLeave={() => setHoveredNext(false)}
          style={{
            transform: hoveredNext ? 'scale(1.03)' : 'scale(1)',
            transition: 'all 0.2s ease',
            background: `linear-gradient(to right, var(--teal-medium), var(--success-yellow))`,
          }}
          className="w-full py-4 text-white font-bold rounded-2xl shadow-lg"
        >
          {currentScenarioIndex < scenarios.length - 1
            ? "Next Scenario"
            : "See Results"}
        </button>
      </div>
    </div>
  );
}

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FDF6EC] to-[#D6F4FF] p-20 rounded-3xl">

      {bubbleBackground}

      <div className="relative z-10 w-full max-w-2xl p-8 bg-gradient-to-b from-[#FFF9F2] to-[#E8F8F5] rounded-3xl shadow-2xl border-4 border-white">

        //header
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FishIcon />
            <span className="text-sm text-gray-600">
              Scenario {currentScenarioIndex + 1} of {scenarios.length}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-white px-4 py-1 rounded-full shadow">
            <StarIcon className="w-4 h-4" />
            <span className="font-bold text-gray-700">{score}</span>
          </div>
        </div>

        //progress
        <div className="w-full bg-white rounded-full h-3 mb-6 shadow-inner">
          <div
            className="bg-gradient-to-r from-[#76D7C4] to-[#5DADE2] h-3 rounded-full transition-all duration-500"
            style={{
              width: `${((currentScenarioIndex + 1) / scenarios.length) * 100}%`
            }}
          />
        </div>

        //otter
        <OtterMascot message="Let’s take care of your fish farm together! Choose wisely 🐟✨" />

        //card for scenario
        <div className="mb-6 bg-white p-6 rounded-2xl shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <LeafIcon />
            <h2 className="text-2xl font-bold text-gray-800">
              {currentScenario.title}
            </h2>
          </div>

          <p className="text-gray-700 leading-relaxed">
            {currentScenario.description}
          </p>
        </div>

        //choices
        <div className="space-y-4">
          <p className="font-semibold text-gray-700">What will you do?</p>

          {shuffledChoices.map((choice, index) => (
            <button
              key={index}
              onClick={() => handleChoice(choice)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                transform: hoveredIndex === index ? 'scale(1.03)' : 'scale(1)',
                borderColor: hoveredIndex === index ? '#76D7C4' : 'transparent',
                transition: 'all 0.2s ease',
              }}
              className="w-full p-4 text-left bg-white rounded-2xl shadow-md border-2"
            >
              <div className="flex items-start gap-3">
                <BubbleIcon />
                <span className="text-gray-800">{choice.text}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}