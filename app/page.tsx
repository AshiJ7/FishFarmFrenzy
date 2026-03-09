import Link from "next/link";
import { useMemo } from "react";

//bubble animation
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

//bubble animation
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
export default function Home() {
	const bubbleBackground = useMemo(() => <BubbleBackground />, []);
	
  return (
    <div className="relative min-h-screen px-4 py-8">
      {bubbleBackground}

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-4 sm:gap-6 md:flex-row md:flex-wrap md:justify-center">

      {/*Game 1*/}
      <Link
        href="/mini-game-1"
        className="group relative z-10 m-5 flex h-60 w-60 cursor-pointer flex-col items-center justify-center rounded-full text-white"
        style={{
          backgroundColor: "var(--periwinkle)",
          border: "2px solid var(--color-border-light)",
        }}
      >
        <div className="mb-2 inline-flex flex-row whitespace-nowrap text-5xl">🐟🐛🌿</div>
        <h1
          className="mb-2 text-center text-2xl font-extrabold"
          style={{
            backgroundImage: "linear-gradient(to right, var(--teal-medium), var(--olive-green))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Feeding Frenzy
        </h1>
        <p
          className="px-4 text-center text-xs opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Decide if each food is good or bad for the selected fish!
        </p>
      </Link>

      {/*Game 2*/}
      <Link
        href="/mini-game-2"
        className="group relative z-10 m-5 flex h-60 w-60 cursor-pointer flex-col items-center justify-center rounded-full text-white"
        style={{
          backgroundColor: "var(--periwinkle)",
          border: "2px solid var(--color-border-light)",
        }}
      >
        <div className="mb-2 inline-flex flex-row whitespace-nowrap text-5xl"> 🦠🔁🌿</div>
        <h1
          className="mb-2 text-center text-2xl font-extrabold"
          style={{
            backgroundImage: "linear-gradient(to right, var(--teal-medium), var(--olive-green))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Cycle Explorer
        </h1>
        <p
          className="px-4 text-center text-xs opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Learn about the nitrogen cycle and keep the aquaponics system balanced!
        </p>
      </Link>

      {/*Game 3*/}
      <Link
        href="/mini-game-3"
        className="group relative z-10 m-5 flex h-60 w-60 cursor-pointer flex-col items-center justify-center rounded-full text-white"
        style={{
          backgroundColor: "var(--periwinkle)",
          border: "2px solid var(--color-border-light)",
        }}
      >
        <div className="mb-2 inline-flex flex-row whitespace-nowrap text-5xl"> 🦸🐟 </div>
        <h1
          className="mb-2 text-center text-2xl font-extrabold"
          style={{
            backgroundImage: "linear-gradient(to right, var(--teal-medium), var(--olive-green))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Save Your Fish Farm
        </h1>
        <p
          className="px-4 text-center text-xs opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Make the right decisions to keep your aquaponics farm healthy!
        </p>
      </Link>
      
      {/*Game 4*/}
      <Link
        href="/mini-game-4"
        className="group relative z-10 m-5 flex h-60 w-60 cursor-pointer flex-col items-center justify-center rounded-full text-white"
        style={{
          backgroundColor: "var(--periwinkle)",
          border: "2px solid var(--color-border-light)",
        }}
      >
        <div className="mb-2 inline-flex flex-row whitespace-nowrap text-5xl"> 🥊🦠 </div>
        <h1
          className="mb-2 text-center text-2xl font-extrabold"
          style={{
            backgroundImage: "linear-gradient(to right, var(--teal-medium), var(--olive-green))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Bacteria Battle
        </h1>
        <p
          className="px-4 text-center text-xs opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Feed the bacteria nutrients while staying away from toxic waste!
        </p>
      </Link>

      {/*Game 5*/}
      <Link
        href="/mini-game-5"
        className="group relative z-10 m-5 flex h-60 w-60 cursor-pointer flex-col items-center justify-center rounded-full text-white"
        style={{
          backgroundColor: "var(--periwinkle)",
          border: "2px solid var(--color-border-light)",
        }}
      >
        <div className="mb-2 inline-flex flex-row whitespace-nowrap text-5xl">🐟✅🌿</div>
        <h1
          className="mb-2 text-center text-2xl font-extrabold"
          style={{
            backgroundImage: "linear-gradient(to right, var(--teal-medium), var(--olive-green))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Perfect Pairs
        </h1>
        <p
          className="px-4 text-center text-xs opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Match each fish with the best plant to grow with it in the aquaponics system!
          After you finish, learn about traditional vs. aquaponics farms through the lettuce catching game.
        </p>
      </Link>
      </div>
    </div>
  );
}

