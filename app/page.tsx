import Link from "next/link";

const games = [
  {
    n: 1,
    emoji: (
    <div className="flex items-center gap-1">
      <img src="/happy_fish.png" alt="fish" style={{ width: "42px", height: "42px", objectFit: "contain" }} />
      <img src="/worms.png" alt="worms" style={{ width: "34px", height: "34px", objectFit: "contain" }} />
      <img src="/happy_plant.png" alt="plant" style={{ width: "42px", height: "42px", objectFit: "contain" }} />
    </div>
  ),
    title: "Feeding Frenzy",
    desc: "Decide if each food is good or bad for the selected fish!",
    cycleLabel: "Fish & Feeding",
    cycleStep: "Fish eat and produce waste, releasing ammonia into the water. The aquaponics cycle starts with the fish.",
    accent: "#4A8E9E",
    glow: "rgba(74,142,158,0.35)",
  },
  {
    n: 2,
    emoji: (
    <div className="flex items-center gap-1">
      <img src="/bacteria.png" alt="bacteria" style={{ width: "42px", height: "42px", objectFit: "contain" }} />
      <img src="/reverse.png" alt="reverse" style={{ width: "34px", height: "34px", objectFit: "contain" }} />
      <img src="/water_plant.png" alt="plant" style={{ width: "42px", height: "42px", objectFit: "contain" }} />
    </div>
  ),
    title: "Cycle Explorer",
    desc: "Learn about the nitrogen cycle and keep the aquaponics system balanced!",
    cycleLabel: "Nitrogen Cycle",
    cycleStep: "Ammonia travels through the system and drives the full nitrogen cycle.",
    accent: "#6B8E4E",
    glow: "rgba(107,142,78,0.35)",
  },
  {
    n: 3,
    emoji: (
    <div className="flex items-center gap-1">
      <img src="/superhero.png" alt="superhero" style={{ width: "62px", height: "62px", objectFit: "contain" }} />
      <img src="/trout.png" alt="fish" style={{ width: "62px", height: "62px", objectFit: "contain" }} />
    </div>
  ),
    title: "Save Your Fish Farm",
    desc: "Make the right decisions to keep your aquaponics farm healthy!",
    cycleLabel: "System Balance",
    cycleStep: "Apply everything you learned to keep the whole system in balance",
    accent: "#E49678",
    glow: "rgba(228,150,120,0.35)",
  },
  {
    n: 4,
    emoji: (
    <div className="flex items-center gap-1">
      <img src="/boxing_glove.png" alt="glove" style={{ width: "42px", height: "42px", objectFit: "contain" }} />
      <img src="/bacteria.png" alt="bacteria" style={{ width: "34px", height: "34px", objectFit: "contain" }} />
    </div>
  ),
    title: "Bacteria Battle",
    desc: "Feed the bacteria nutrients while staying away from toxic waste!",
    cycleLabel: "Nitrification",
    cycleStep: "The bacteria convert toxic ammonia into nitrate, which is the key to clean water.",
    accent: "#A8C8E8",
    glow: "rgba(168,200,232,0.4)",
  },
  {
    n: 5,
    emoji: (
    <div className="flex items-center gap-1">
      <img src="/fish.png" alt="fish" style={{ width: "42px", height: "42px", objectFit: "contain" }} />
      <img src="/check.png" alt="check" style={{ width: "54px", height: "54px", objectFit: "contain" }} />
      <img src="/happy_plant.png" alt="plant" style={{ width: "32px", height: "32px", objectFit: "contain" }} />
    </div>
  ),
    title: "Perfect Pairs",
    desc: "Match each fish with the best plant to grow with it in the aquaponics system!",
    cycleLabel: "Plant & Fish Harmony",
    cycleStep: "See how aquaponics farms generate more output compared to traditional farming.",
    accent: "#B8D8A8",
    glow: "rgba(184,216,168,0.4)",
  },
];

// Pentagon positions for desktop layout
const CYCLE_POSITIONS = [
  { top: "2%",  left: "50%",  transform: "translateX(-50%)" },
  { top: "28%", left: "82%",  transform: "translateX(-50%)" },
  { top: "65%", left: "70%",  transform: "translateX(-50%)" },
  { top: "67%", left: "35%",  transform: "translateX(-50%)" },
  { top: "28%", left: "18%",  transform: "translateX(-50%)" },
];

function GameCardInner({ n, emoji, title, desc, cycleLabel, cycleStep, accent, glow }: typeof games[0]) {
  return (
    <>
      {/* Accent stripe */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "4px",
        background: `linear-gradient(to right, ${accent}, ${accent}88)`,
        borderRadius: "24px 24px 0 0",
      }} />
      {/* Number badge */}
      <div style={{
        position: "absolute", top: "10px", right: "12px",
        width: "24px", height: "24px", borderRadius: "50%",
        background: `linear-gradient(135deg, ${accent}, ${accent}aa)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "0.7rem", fontWeight: 800, color: "white",
        boxShadow: `0 2px 8px ${glow}`,
        fontFamily: "var(--font-nunito), sans-serif",
      }}>{n}</div>
      {/* Cycle label */}
      <span className="cycle-label" style={{ backgroundColor: accent }}>{cycleLabel}</span>
      {/* Emoji */}
      <div className="emoji-bounce" style={{
        fontSize: "2rem", marginBottom: "10px",
        filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.12))", lineHeight: 1,
      }}>{emoji}</div>
      {/* Title */}
      <h2 style={{
        fontFamily: "var(--font-nunito), sans-serif", fontWeight: 800,
        fontSize: "1rem", color: "var(--color-text-primary)",
        textAlign: "center", marginBottom: "8px", lineHeight: 1.25,
      }}>{title}</h2>
      {/* Divider */}
      <div style={{
        width: "32px", height: "2px", borderRadius: "2px",
        background: `linear-gradient(to right, ${accent}, ${accent}55)`,
        marginBottom: "8px", flexShrink: 0,
      }} />
      {/* Description */}
      <p style={{
        fontFamily: "var(--font-nunito), sans-serif",
        fontSize: "0.75rem", color: "var(--color-text-secondary)",
        textAlign: "center", lineHeight: 1.5, fontWeight: 500,
      }}>{desc}</p>
      {/* Play button */}
      <div style={{
        marginTop: "14px", padding: "6px 18px", borderRadius: "50px",
        background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
        color: "white", fontSize: "0.75rem", fontWeight: 700,
        fontFamily: "var(--font-nunito), sans-serif",
        letterSpacing: "0.04em", boxShadow: `0 3px 10px ${glow}`,
      }}>
        Play Now ›
      </div>
      {/* Cycle step */}
      <div style={{
        marginTop: "12px", paddingTop: "10px",
        borderTop: `1px solid ${accent}44`,
        fontSize: "0.7rem", fontFamily: "var(--font-nunito), sans-serif",
        fontWeight: 600, color: "rgba(44,36,22,0.6)",
        textAlign: "center", lineHeight: 1.4,
      }}>{cycleStep}</div>
    </>
  );
}

export default function Home() {
  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{ background: "linear-gradient(145deg, #CFFCFF 0%, #AAEFDF 45%, #63C132 100%)" }}
    >
      {/* Bubble background */}
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
          0%, 100% { transform: translateY(0px) translateX(-50%); }
          50%       { transform: translateY(-6px) translateX(-50%); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .game-card {
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease, filter 0.3s ease;
        }
        .game-card:hover {
          filter: brightness(1.05);
          z-index: 20 !important;
        }
        .emoji-bounce { display: inline-block; transition: transform 0.3s ease; }
        .game-card:hover .emoji-bounce { animation: emojiBounce 0.5s ease; }
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
        .cycle-label {
          font-family: var(--font-nunito), sans-serif;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 4px 12px;
          border-radius: 50px;
          display: inline-block;
          margin-bottom: 10px;
          color: white;
        }
        .mobile-game-card:active {
          transform: scale(0.98);
        }
      `}</style>

      {/* Shared header */}
      <header className="relative z-10 pt-8 pb-4 text-center px-4">
        <div className="inline-flex items-center gap-2 md:gap-3 mb-3 flex-wrap justify-center">
          <img src="/happy_fish.png" alt="happyfish" style={{ width: "clamp(48px,10vw,84px)", height: "clamp(48px,10vw,84px)", objectFit: "contain" }} />
          <h1
            className="shine-text font-extrabold"
            style={{ fontSize: "clamp(1.6rem, 5vw, 3.5rem)", letterSpacing: "-0.02em", fontFamily: "var(--font-nunito), sans-serif" }}
          >
            Fish Farm Frenzy
          </h1>
          <img src="/water_plant.png" alt="waterplant" style={{ width: "clamp(36px,8vw,54px)", height: "clamp(36px,8vw,54px)", objectFit: "contain" }} />
        </div>
        <p
          className="mx-auto max-w-xl text-center"
          style={{ color: "rgba(44,36,22,0.75)", fontSize: "clamp(0.85rem,2.5vw,1.05rem)", fontFamily: "var(--font-nunito), sans-serif", fontWeight: 600 }}
        >
          Dive into 5 mini-games and discover the wonders of aquaponics!
        </p>
        <div className="mx-auto mt-3 rounded-full" style={{ width: "80px", height: "3px", background: "linear-gradient(to right, var(--teal-medium), var(--olive-green))" }} />
      </header>

      {/* ── Desktop pentagon layout (hidden on mobile) ── */}
      <main className="relative z-10 w-full hidden md:block" style={{ height: "860px", maxWidth: "1000px", margin: "0 auto" }}>
        {/* Dashed cycle ring */}
        <div
          className="absolute"
          style={{
            top: "50%", left: "50%",
            width: "580px", height: "580px",
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            border: "2px dashed rgba(255,255,255,0.45)",
            pointerEvents: "none",
          }}
        />
        {/* Center label */}
        <div
          className="absolute text-center"
          style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", pointerEvents: "none" }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "6px" }}></div>
          <div style={{
            fontFamily: "var(--font-nunito), sans-serif", fontWeight: 800,
            fontSize: "2.8rem", color: "rgba(44,36,22,0.7)",
            letterSpacing: "0.04em", lineHeight: 1.3,
          }}>
            Aquaponics<br />Cycle
          </div>
        </div>
        {/* Arrow indicators */}
        {[0, 72, 144, 216, 288].map((deg, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              top: "50%", left: "50%",
              width: "580px", height: "0",
              transformOrigin: "0 0",
              transform: `rotate(${deg + 36}deg)`,
              pointerEvents: "none",
            }}
          >
            <div style={{
              position: "absolute", right: "-12px", top: "-8px",
              width: 0, height: 0,
              borderTop: "7px solid transparent",
              borderBottom: "7px solid transparent",
              borderLeft: "10px solid rgba(255,255,255,0.5)",
            }} />
          </div>
        ))}
        {/* Pentagon game cards */}
        {games.map((game, idx) => (
          <Link
            key={game.n}
            href={`/mini-game-${game.n}`}
            className="game-card"
            style={{
              position: "absolute",
              ...CYCLE_POSITIONS[idx],
              width: "260px",
              borderRadius: "24px",
              background: "rgba(255,255,255,0.65)",
              backdropFilter: "blur(18px)",
              border: "2px solid rgba(255,255,255,0.75)",
              boxShadow: `0 8px 32px ${game.glow}, 0 2px 8px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.8)`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              padding: "24px 20px 22px",
              textDecoration: "none",
              animation: `cardFloat ${4.5 + idx * 0.3}s ease-in-out infinite`,
              animationDelay: `${idx * 0.4}s`,
              zIndex: 10,
              overflow: "hidden",
            }}
          >
            <GameCardInner {...game} />
          </Link>
        ))}
      </main>

      {/* ── Mobile card grid (hidden on desktop) ── */}
      <main className="relative z-10 block md:hidden px-4 pb-8">
        <div
          style={{
            fontFamily: "var(--font-nunito), sans-serif",
            fontWeight: 800,
            fontSize: "1.1rem",
            color: "rgba(44,36,22,0.55)",
            letterSpacing: "0.06em",
            textAlign: "center",
            marginBottom: "16px",
            textTransform: "uppercase",
          }}
        >
          Aquaponics Cycle
        </div>
        <div className="flex flex-col gap-4">
          {games.map((game) => (
            <Link
              key={game.n}
              href={`/mini-game-${game.n}`}
              className="mobile-game-card game-card"
              style={{
                position: "relative",
                borderRadius: "20px",
                background: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(18px)",
                border: "2px solid rgba(255,255,255,0.75)",
                boxShadow: `0 6px 24px ${game.glow}, 0 2px 8px rgba(0,0,0,0.06)`,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "16px",
                padding: "16px",
                textDecoration: "none",
                overflow: "hidden",
              }}
            >
              {/* Accent stripe on left */}
              <div style={{
                position: "absolute", top: 0, left: 0, bottom: 0, width: "4px",
                background: `linear-gradient(to bottom, ${game.accent}, ${game.accent}88)`,
                borderRadius: "20px 0 0 20px",
              }} />
              {/* Number badge */}
              <div style={{
                flexShrink: 0,
                width: "28px", height: "28px", borderRadius: "50%",
                background: `linear-gradient(135deg, ${game.accent}, ${game.accent}aa)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.8rem", fontWeight: 800, color: "white",
                boxShadow: `0 2px 8px ${game.glow}`,
                fontFamily: "var(--font-nunito), sans-serif",
                marginLeft: "8px",
              }}>{game.n}</div>
              {/* Emoji */}
              <div className="emoji-bounce" style={{ flexShrink: 0, lineHeight: 1 }}>
                {game.emoji}
              </div>
              {/* Text */}
              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <span className="cycle-label" style={{ backgroundColor: game.accent, marginBottom: "4px" }}>
                  {game.cycleLabel}
                </span>
                <h2 style={{
                  fontFamily: "var(--font-nunito), sans-serif", fontWeight: 800,
                  fontSize: "0.95rem", color: "var(--color-text-primary)",
                  marginBottom: "4px", lineHeight: 1.25,
                }}>{game.title}</h2>
                <p style={{
                  fontFamily: "var(--font-nunito), sans-serif",
                  fontSize: "0.72rem", color: "var(--color-text-secondary)",
                  lineHeight: 1.4, fontWeight: 500,
                }}>{game.desc}</p>
              </div>
              {/* Arrow */}
              <div style={{
                flexShrink: 0, padding: "6px 12px", borderRadius: "50px",
                background: `linear-gradient(135deg, ${game.accent}, ${game.accent}cc)`,
                color: "white", fontSize: "0.8rem", fontWeight: 700,
                fontFamily: "var(--font-nunito), sans-serif",
              }}>›</div>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 pt-6 pb-12 text-center">
        <p style={{ color: "black", fontSize: "0.8rem", fontFamily: "var(--font-nunito), sans-serif" }}>
          🌊 Explore the world of aquaponics where fish and plants grow together!
        </p>
      </footer>
    </div>
  );
}
