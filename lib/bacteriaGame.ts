// Pure game-logic helpers for the Bacteria Battle mini-game (mini-game-4).
// Extracted so they can be unit-tested independently of Phaser.

export const AMMONIA_DANGER_THRESHOLD = 6;
export const NITRITE_DANGER_THRESHOLD = 8;
export const BASE_SPAWN_INTERVAL = 3000;
export const MIN_SPAWN_INTERVAL = 800;
export const SPAWN_ACCELERATION = 15;
export const COMBO_WINDOW = 5000;
export const OXYGEN_DEPLETION_RATE = 100 / 35;
export const OXYGEN_PER_BUBBLE = 12;
export const LOW_OXYGEN_THRESHOLD = 25;
export const LOW_OXYGEN_SPEED_MULT = 0.25;
export const BASE_SPEED = 220;
export const GROWTH_MAX = 5;

/**
 * Compute the score delta and updated combo streak when Nitrobacter eats a nitrite.
 * Combo nitrites (eaten within COMBO_WINDOW) award 15 + 20 * streak bonus points.
 * Non-combo nitrites award 15 points and reset the streak to 0.
 */
export function calculateNitriteScore(
  comboStreak: number,
  isCombo: boolean
): { scoreDelta: number; newStreak: number } {
  if (!isCombo) {
    return { scoreDelta: 15, newStreak: 0 };
  }
  const newStreak = comboStreak + 1;
  const bonus = 20 * newStreak;
  return { scoreDelta: 15 + bonus, newStreak };
}

/**
 * Return the 0–1 fill fraction for a danger gauge, clamped to [0, 1].
 */
export function calculateGaugeFill(count: number, threshold: number): number {
  return Math.min(count / threshold, 1);
}

/**
 * Return the game-over cause, or null if neither threshold is reached.
 * Ammonia is checked first.
 */
export function checkGameOver(
  ammoniaCount: number,
  nitriteCount: number
): "ammonia" | "nitrite" | null {
  if (ammoniaCount >= AMMONIA_DANGER_THRESHOLD) return "ammonia";
  if (nitriteCount >= NITRITE_DANGER_THRESHOLD) return "nitrite";
  return null;
}

/**
 * Return the speed multiplier based on current oxygen level.
 * 0 oxygen → 0 (paralysed), low oxygen → 0.25 (sluggish), normal → 1.
 */
export function calculateOxygenSpeedMult(oxygen: number): number {
  if (oxygen <= 0) return 0;
  if (oxygen < LOW_OXYGEN_THRESHOLD) return LOW_OXYGEN_SPEED_MULT;
  return 1;
}

/**
 * Deplete oxygen by one simulation tick (dt in seconds), floored at 0.
 */
export function depleteOxygen(oxygen: number, dt: number): number {
  return Math.max(0, oxygen - OXYGEN_DEPLETION_RATE * dt);
}

/**
 * Add one bubble's worth of oxygen, capped at 100.
 */
export function replenishOxygen(oxygen: number): number {
  return Math.min(100, oxygen + OXYGEN_PER_BUBBLE);
}

/**
 * Compute the next ammonia spawn interval after one spawn fires.
 */
export function calculateNextSpawnInterval(currentInterval: number): number {
  return Math.max(MIN_SPAWN_INTERVAL, currentInterval - SPAWN_ACCELERATION);
}

/**
 * Return the new plant growth value after a nitrate is absorbed.
 * Combo nitrates grow the plant by 2; normal by 1. Capped at GROWTH_MAX.
 */
export function calculatePlantGrowth(
  currentGrowth: number,
  isCombo: boolean
): number {
  return Math.min(GROWTH_MAX, currentGrowth + (isCombo ? 2 : 1));
}

/**
 * Return the cause-of-death message shown on the game-over screen.
 */
export function getGameOverMessage(cause: string): string {
  if (cause === "ammonia") {
    return "Fish died from ammonia (NH\u2083) poisoning!";
  }
  return "Fish died from nitrite (NO\u2082\u207B) poisoning!";
}
