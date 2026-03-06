"use client";
import Link from "next/link";
//What needs to be done:
//There will be 3 pages for this particular minigame
//Every page will have the same style of progress, we start with information on the logistics
//Then there is the game and the user must hit a certain score or time
// so first game, they will match correctly then go to the next page
//Second game is falling lettuce and talks about yeild for typical farm
//Third page is salmon and lettuce
//for the yield game, there will be a 30 second timer that will count down and a counter
// of money and amount made as well as resources spent which can be a lower amount of time for the second game
//same thing will apply for salmon and lettuce to show it is better 

import React, { useState, useEffect, useRef, useCallback} from 'react';
import FishCropMatch from "./fishmatch";


export default function MiniGame5() {



  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--peach-soft)] font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-24 px-8 bg-[var(--peach-soft)] dark:bg-black">
        <div className="max-w-2xl mx-auto">
  
  <h1 className="text-3xl font-semibold text-center text-[var(--color-text-secondary)] dark:text-zinc-50">
    Fish & Crop Match
  </h1>

  
  <h2 className="text-left mt-4 text-xl">
    Did you know that some plants and fish grow better together?
  </h2>
  <br></br>

  <p className="text-left">
    In special farms called aquaponics farms, fish and plants help each other grow! It works by having fish live in water and produce waste.
    That waste turns into nutrients which plants needs to grow big and healthy. As plants clean the water, the fish get fresh, clean water again! It’s a team effort!
  </p>

  <br></br>

  <ul className="mt-3 text-gray-800 space-y-1">
  <li>🐟 <strong>Tilapia</strong> loves to help lettuce and basil grow!</li>
  <li>🐠 <strong>Trout</strong> likes spinach and arugula!</li>
  <li>🐟 <strong>Catfish</strong> helps tomatoes and cucumbers!</li>
  <li>🐠 <strong>Koi</strong> is friends with watercress and mint!</li>
</ul>

  <h2 className="text-left mt-6 font-semibold">
    How to play the game:
  </h2>
  <p className="text-left">
    Below are cards with different crops and different fish. Using what you just learned,
    click on the plant cards and slide to the fish it grows best with. After you have correctly matched each pair and gotten a score of 3,
    continue to the next game.
  </p>

</div>

        <FishCropMatch/>

        <nav className="mt-8 flex gap-4">
          <Link href="/" className="text-foreground">Home</Link>
          {/* <Link href="/mini-game-4" className="text-foreground">Prev</Link>
          <Link href="/mini-game-1" className="text-foreground">Next</Link> */}
          <Link href="/mini-game-5/lettuce-game" className="text-foreground">Next Game</Link>
        </nav>
      </main>
    </div>
  );
}
