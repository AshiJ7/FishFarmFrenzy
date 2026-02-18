"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function MiniGame2() {
  const [fish, setFish] = useState(10);
  const [bacteria, setBacteria] = useState(8);
  const [plants, setPlants] = useState(6);

  const [ammonia, setAmmonia] = useState(2);
  const [nitrite, setNitrite] = useState(1);
  const [nitrate, setNitrate] = useState(3);
  const [waterQuality, setWaterQuality] = useState(80);
  const [score, setScore] = useState(0);

  // Simulation loop runs every second
  useEffect(() => {
    const interval = setInterval(() => {
      updateSimulation();
    }, 1000);

    return () => clearInterval(interval);
  });

  const updateSimulation = () => {
    let newAmmonia = ammonia + fish * 0.1;

    let ammoniaConversion = Math.min(newAmmonia, bacteria * 0.08);
    newAmmonia -= ammoniaConversion;

    let newNitrite = nitrite + ammoniaConversion;
    let nitriteConversion = Math.min(newNitrite, bacteria * 0.06);
    newNitrite -= nitriteConversion;

    let newNitrate = nitrate + nitriteConversion;
    let plantUptake = Math.min(newNitrate, plants * 0.05);
    newNitrate -= plantUptake;

    let newWaterQuality =
      waterQuality + plantUptake * 0.5 - newAmmonia * 0.2;

    newWaterQuality = Math.max(0, Math.min(100, newWaterQuality));

    if (newWaterQuality >= 60 && newWaterQuality <= 90) {
      setScore((prev) => prev + 1);
    }

    setAmmonia(newAmmonia);
    setNitrite(newNitrite);
    setNitrate(newNitrate);
    setWaterQuality(newWaterQuality);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col items-center py-12 px-8 bg-white dark:bg-black">
        <h1 className="text-3xl font-semibold mb-6">Nitrogen Cycle Game</h1>

        {/* Sliders */}
        <div className="w-full space-y-4">
          <Slider label="Fish" value={fish} setValue={setFish} />
          <Slider label="Bacteria" value={bacteria} setValue={setBacteria} />
          <Slider label="Plants" value={plants} setValue={setPlants} />
        </div>

        {/* Stats */}
        <div className="mt-8 text-center space-y-2">
          <p>Ammonia: {ammonia.toFixed(2)}</p>
          <p>Nitrite: {nitrite.toFixed(2)}</p>
          <p>Nitrate: {nitrate.toFixed(2)}</p>
          <p>Water Quality: {waterQuality.toFixed(1)}</p>
          <p className="font-bold text-lg">Score: {score}</p>
        </div>

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
  setValue,
}: {
  label: string;
  value: number;
  setValue: (val: number) => void;
}) {
  return (
    <div>
      <label className="block font-medium">{label}: {value}</label>
      <input
        type="range"
        min="0"
        max="20"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
}
