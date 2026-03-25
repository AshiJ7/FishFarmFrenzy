import Link from "next/link";

const games = [
  {
    n: 1,
    emoji: "🐟🐛🌿",
    title: "Feeding Frenzy",
    desc: "Decide if each food is good or bad for the selected fish!",
    accent: "#4A8E9E",
    glow: "rgba(74,142,158,0.35)",
  },
  {
    n: 2,
    emoji: "🦠🔁🌿",
    title: "Cycle Explorer",
    desc: "Learn about the nitrogen cycle and keep the aquaponics system balanced!",
    accent: "#6B8E4E",
    glow: "rgba(107,142,78,0.35)",
  },
  {
    n: 3,
    emoji: "🦸🐟",
    title: "Save Your Fish Farm",
    desc: "Make the right decisions to keep your aquaponics farm healthy!",
    accent: "#E49678",
    glow: "rgba(228,150,120,0.35)",
  },
  {
    n: 4,
    emoji: "🥊🦠",
    title: "Bacteria Battle",
    desc: "Feed the bacteria nutrients while staying away from toxic waste!",
    accent: "#A8C8E8",
    glow: "rgba(168,200,232,0.4)",
  },
  {
    n: 5,
    emoji: "🐟✅🌿",
    title: "Perfect Pairs",
    desc: "Match each fish with the best plant to grow with it in the aquaponics system!",
    accent: "#B8D8A8",
    glow: "rgba(184,216,168,0.4)",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: "linear-gradient(145deg, #CFFCFF 0%, #AAEFDF 45%, #63C132 100%)" }}>

      {/* Animated bubble background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[
          { left: 8,  size: 18, dur: 9,  delay: 0   },
          { left: 16, size: 28, dur: 13, delay: 2   },
          { left: 25, size: 14, dur: 8,  delay: 1   },
          { left: 33, size: 22, dur: 11, delay: 3.5 },
          { left: 42, size: 32, dur: 14, delay: 0.5 },
          { left: 51, size: 16, dur: 9,  delay: 2.8 },
          { left: 60, size: 24, dur: 12, delay: 1.5 },
          { left: 68, size: 20, dur: 10, delay: 4   },
          { left: 76, size: 30, dur: 13, delay: 0.8 },
          { left: 84, size: 12, dur: 7,  delay: 3   },
          { left: 91, size: 26, dur: 11, delay: 1.2 },
          { left: 97, size: 18, dur: 9,  delay: 2.5 },
          { left: 4,  size: 36, dur: 16, delay: 4.5 },
          { left: 46, size: 10, dur: 6,  delay: 0.3 },
          { left: 72, size: 22, dur: 10, delay: 3.8 },
          { left: 55, size: 14, dur: 8,  delay: 5   },
          { left: 20, size: 20, dur: 12, delay: 2.2 },
          { left: 88, size: 16, dur: 9,  delay: 1.7 },
        ].map((b, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              bottom: "-60px",
              left: `${b.left}%`,
              width: `${b.size}px`,
              height: `${b.size}px`,
              background: "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.7), rgba(170,239,223,0.3))",
              border: "1px solid rgba(255,255,255,0.4)",
              animation: `homeBubble ${b.dur}s linear infinite`,
              animationDelay: `${b.delay}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes homeBubble {
          0%   { transform: translateY(0) scale(1);   opacity: 0.55; }
          80%  { opacity: 0.35; }
          100% { transform: translateY(-105vh) scale(1.2); opacity: 0; }
        }
        @keyframes cardFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-6px); }
        }
        @keyframes titleGlow {
          0%, 100% { text-shadow: 0 0 20px rgba(74,142,158,0.4), 0 0 40px rgba(107,142,78,0.2); }
          50%       { text-shadow: 0 0 30px rgba(74,142,158,0.6), 0 0 60px rgba(107,142,78,0.35); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .game-card {
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease, filter 0.3s ease;
        }
        .game-card:hover {
          transform: translateY(-10px) scale(1.04);
          filter: brightness(1.05);
        }
        .game-card:active {
          transform: translateY(-4px) scale(1.01);
        }
        .emoji-bounce {
          display: inline-block;
          transition: transform 0.3s ease;
        }
        .game-card:hover .emoji-bounce {
          animation: emojiBounce 0.5s ease;
        }
        @keyframes emojiBounce {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.3) rotate(-5deg); }
          70%  { transform: scale(0.95) rotate(3deg); }
          100% { transform: scale(1); }
        }
        .shine-text {
          background: linear-gradient(90deg, #2C2416 30%, #4A8E9E 50%, #6B8E4E 60%, #2C2416 80%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
      `}</style>

      {/* Header */}
      <header className="relative z-10 pt-10 pb-4 text-center px-4">
        <div className="inline-flex items-center gap-3 mb-3">
          <span style={{ fontSize: "2.5rem" }}>🐟</span>
          <h1
            className="shine-text font-extrabold"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.02em", fontFamily: "var(--font-nunito), sans-serif" }}
          >
            Fish Farm Frenzy
          </h1>
          <span style={{ fontSize: "2.5rem" }}>🌿</span>
        </div>
        <p
          className="mx-auto max-w-xl text-center"
          style={{
            color: "rgba(44,36,22,0.75)",
            fontSize: "1.05rem",
            fontFamily: "var(--font-nunito), sans-serif",
            fontWeight: 600,
          }}
        >
          Dive into 5 mini-games and discover the wonders of aquaponics!
        </p>
        <div
          className="mx-auto mt-3 rounded-full"
          style={{
            width: "80px",
            height: "3px",
            background: "linear-gradient(to right, var(--teal-medium), var(--olive-green))",
          }}
        />
      </header>

      {/* Game cards */}
      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-wrap justify-center gap-6 px-6 py-10 items-stretch">
        {games.map(({ n, emoji, title, desc, accent, glow }, idx) => (
          <Link
            key={n}
            href={`/mini-game-${n}`}
            className="game-card"
            style={{
              width: "clamp(220px, 28vw, 280px)",
              borderRadius: "28px",
              background: "rgba(255,255,255,0.62)",
              backdropFilter: "blur(18px)",
              border: `2px solid rgba(255,255,255,0.75)`,
              boxShadow: `0 8px 32px ${glow}, 0 2px 8px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.8)`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              padding: "32px 24px 28px",
              textDecoration: "none",
              animation: `cardFloat ${4.5 + idx * 0.3}s ease-in-out infinite`,
              animationDelay: `${idx * 0.4}s`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Accent stripe at top */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "5px",
                background: `linear-gradient(to right, ${accent}, ${accent}88)`,
                borderRadius: "28px 28px 0 0",
              }}
            />

            {/* Number badge */}
            <div
              style={{
                position: "absolute",
                top: "14px",
                right: "16px",
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${accent}, ${accent}aa)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75rem",
                fontWeight: 800,
                color: "white",
                boxShadow: `0 2px 8px ${glow}`,
                fontFamily: "var(--font-nunito), sans-serif",
              }}
            >
              {n}
            </div>

            {/* Emoji */}
            <div
              className="emoji-bounce"
              style={{
                fontSize: "2.8rem",
                marginBottom: "14px",
                marginTop: "8px",
                filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.12))",
                lineHeight: 1,
              }}
            >
              {emoji}
            </div>

            {/* Title */}
            <h2
              style={{
                fontFamily: "var(--font-nunito), sans-serif",
                fontWeight: 800,
                fontSize: "1.15rem",
                color: "var(--color-text-primary)",
                textAlign: "center",
                marginBottom: "10px",
                lineHeight: 1.25,
              }}
            >
              {title}
            </h2>

            {/* Divider */}
            <div
              style={{
                width: "40px",
                height: "2px",
                borderRadius: "2px",
                background: `linear-gradient(to right, ${accent}, ${accent}55)`,
                marginBottom: "10px",
                flexShrink: 0,
              }}
            />

            {/* Description */}
            <p
              style={{
                fontFamily: "var(--font-nunito), sans-serif",
                fontSize: "0.85rem",
                color: "var(--color-text-secondary)",
                textAlign: "center",
                lineHeight: 1.55,
                fontWeight: 500,
              }}
            >
              {desc}
            </p>

            {/* Play button hint */}
            <div
              style={{
                marginTop: "18px",
                padding: "8px 22px",
                borderRadius: "50px",
                background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
                color: "white",
                fontSize: "0.8rem",
                fontWeight: 700,
                fontFamily: "var(--font-nunito), sans-serif",
                letterSpacing: "0.04em",
                boxShadow: `0 3px 10px ${glow}`,
              }}
            >
              Play Now ›
            </div>
          </Link>
        ))}
      </main>

      {/* Footer */}
      <footer className="relative z-10 pb-8 text-center">
        <p style={{ color: "black", fontSize: "0.8rem", fontFamily: "var(--font-nunito), sans-serif" }}>
          🌊 Explore the world of aquaponics where fish and plants grow together!
        </p>
      </footer>
    </div>
  );
}