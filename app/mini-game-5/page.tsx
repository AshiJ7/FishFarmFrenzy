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
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-24 px-8 bg-white dark:bg-black">
        <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">Mini-game 5</h1>
        <p className="mt-4 max-w-2xl text-center text-lg text-zinc-600 dark:text-zinc-400">
          Here is where there will be text about how certain crops go best with certain species of fishes. 
        </p>
        <br></br>
        <h2>How to play the game:</h2>
        <p>Below are cards with different crops and different fish. Using what you just learned, 
          click on the plant cards and slide to the fish it grows best with. 
          After you have correctly matched each pair, continue to the next game.
        </p>

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
