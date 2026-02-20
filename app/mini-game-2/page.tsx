"use client";

import { useState } from "react";
import Link from "next/link";

type GameState = {
  fish: number;
  bacteria: number;
  plants: number;
  temperature: number;
  ammonia: number;
  nitrite: number;
  nitrate: number;
  waterQuality: number;
};

export default function MiniGame2() {
  const [gameState, setGameState] = useState<GameState>({
    fish: 10,
    bacteria: 5,
    plants: 5,
    temperature: 25,
    ammonia: 0,
    nitrite: 0,
    nitrate: 0,
    waterQuality: 100,
  });

  const recalculate = (newState: GameState) => {
    let ammonia = newState.fish * 0.8;

    let efficiencyMultiplier = 1;

    if (newState.temperature < 18) {
      efficiencyMultiplier = 0.5;
    } else if (
      newState.temperature >= 24 &&
      newState.temperature <= 26
    ) {
      efficiencyMultiplier = 1.3;
    }

    const bacteriaPower =
      newState.bacteria * 0.6 * efficiencyMultiplier;

    const ammoniaConverted = Math.min(ammonia, bacteriaPower);
    ammonia -= ammoniaConverted;
    let nitrite = ammoniaConverted;

    const nitriteConverted = Math.min(nitrite, bacteriaPower * 0.8);
    nitrite -= nitriteConverted;
    let nitrate = nitriteConverted;

    const plantUptake = Math.min(
      nitrate,
      newState.plants * 0.7
    );
    nitrate -= plantUptake;

    let waterQuality =
      100 -
      ammonia * 15 -
      nitrite * 25 -
      nitrate * 5;

    waterQuality = Math.max(0, Math.min(100, waterQuality));

    setGameState({
      ...newState,
      ammonia,
      nitrite,
      nitrate,
      waterQuality,
    });
  };

  const handleChange = (
    key: keyof GameState,
    value: number
  ) => {
    const updated = {
      ...gameState,
      [key]: value,
    };

    recalculate(updated);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col items-center py-12 px-8 bg-white dark:bg-black">
        <h1 className="text-3xl font-semibold mb-6">
          Aquaponics Nitrogen and Nutrient Cycle
        </h1>

        <div className="w-full space-y-6">
          <Slider
            label="Fish"
            value={gameState.fish}
            onChange={(v) => handleChange("fish", v)}
          />

          <Slider
            label="Bacteria"
            value={gameState.bacteria}
            onChange={(v) => handleChange("bacteria", v)}
          />

          <Slider
            label="Plants"
            value={gameState.plants}
            onChange={(v) => handleChange("plants", v)}
          />

          <Slider
            label="Temperature (°C)"
            value={gameState.temperature}
            onChange={(v) => handleChange("temperature", v)}
            min={10}
            max={35}
          />
        </div>

        {/* Stats */}
        <div className="mt-8 text-center space-y-2">
          <p>Ammonia: {gameState.ammonia.toFixed(2)}</p>
          <p>Nitrite: {gameState.nitrite.toFixed(2)}</p>
          <p>Nitrate: {gameState.nitrate.toFixed(2)}</p>
          <p className="font-bold">
            Water Quality: {gameState.waterQuality.toFixed(1)}
          </p>
        </div>

        {/* Visual Tank */}
        <div
          className="mt-8 w-full h-56 border-2 rounded-lg relative overflow-hidden transition-colors duration-300"
          style={{
            backgroundColor:
              gameState.waterQuality > 70
                ? "#60a5fa"
                : gameState.waterQuality > 40
                ? "#facc15"
                : "#ef4444",
          }}
        >
          {/* Fish Rendering */}
          {Array.from({ length: gameState.fish }).map((_, i) => (
            <img
              key={i}
              src="/fish.png"
              alt="fish"
              className="absolute w-8 h-8"
              style={{
                left: `${(i * 37) % 90}%`,
                top: `${(i * 53) % 70}%`,
              }}
            />
          ))}

          {/* Plants Rendering */}
            {Array.from({ length: gameState.plants }).map((_, i) => (
              <span
                key={`plant-${i}`}
                className="absolute text-2xl"
                style={{
                  left: `${(i * 15) % 95}%`,
                  bottom: "5%",
                }}
              >
                🌿
              </span>
            ))}
        </div>

        {/* System Status */}
        <p className="font-bold mt-4 text-center text-lg">
          {gameState.waterQuality > 70
            ? "🌿 System Stable"
            : gameState.waterQuality > 40
            ? "⚠️ System Under Stress"
            : "💀 System Collapsing"}
        </p>

        <nav className="mt-8 flex gap-4">
          <Link href="/">Home</Link>
          <Link href="/mini-game-1">Prev</Link>
          <Link href="/mini-game-3">Next</Link>
        </nav>
      </main>
    </div>
  );
}

function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 20,
}: {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div>
      <label className="block font-medium">
        {label}: {value}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) =>
          onChange(Number(e.target.value))
        }
        className="w-full"
      />
    </div>
  );
}