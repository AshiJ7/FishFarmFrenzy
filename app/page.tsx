import Image from "next/image";
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
export default function Home() {
	const bubbleBackground = useMemo(() => <BubbleBackground />, []);
	
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {bubbleBackground}
      <main
        className="relative z-10 flex flex-col items-center justify-center py-16 px-8 rounded-3xl shadow-md text-center"
        style={{
          backgroundColor: "rgba(255,255,255,0.88)",
          border: "2px solid var(--color-border-light)",
        }}
      >
        <div className="text-6xl mb-4">🐟🌿🦦</div>
        <h1
          className="text-5xl font-extrabold mb-4"
          style={{
            backgroundImage: "linear-gradient(to right, var(--teal-medium), var(--olive-green))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Fish Farm Frenzy
        </h1>
        <p className="text-lg max-w-md" style={{ color: "var(--color-text-secondary)" }}>
          Welcome! Learn how aquaponics works by playing through 5 mini-games. Select one to begin.
        </p>
      </main>
    </div>
  );
}
