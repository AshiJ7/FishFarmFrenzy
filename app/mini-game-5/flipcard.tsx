"use client";

import { useState } from "react";

export default function FlipCard({
  front,
  back,
}: {
  front: React.ReactNode;
  back: React.ReactNode;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="w-64 h-40 cursor-pointer [perspective:1000px]"
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* FRONT */}
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-blue-500 text-white [backface-visibility:hidden]">
          {front}
        </div>

        {/* BACK */}
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-green-500 text-white rotate-y-180 [backface-visibility:hidden]">
          {back}
        </div>
      </div>
    </div>
  );
}
