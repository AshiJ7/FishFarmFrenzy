import {
  calculateNitriteScore,
  calculateGaugeFill,
  checkGameOver,
  calculateOxygenSpeedMult,
  depleteOxygen,
  replenishOxygen,
  calculateNextSpawnInterval,
  calculatePlantGrowth,
  getGameOverMessage,
  AMMONIA_DANGER_THRESHOLD,
  NITRITE_DANGER_THRESHOLD,
  MIN_SPAWN_INTERVAL,
  BASE_SPAWN_INTERVAL,
  OXYGEN_DEPLETION_RATE,
  OXYGEN_PER_BUBBLE,
  LOW_OXYGEN_THRESHOLD,
  GROWTH_MAX,
} from "../lib/bacteriaGame";

// ── Nitrite scoring ────────────────────────────────────────────────────────

describe("calculateNitriteScore", () => {
  test("non-combo awards 15 points and resets streak", () => {
    const { scoreDelta, newStreak } = calculateNitriteScore(3, false);
    expect(scoreDelta).toBe(15);
    expect(newStreak).toBe(0);
  });

  test("first combo (streak 0 → 1) awards 15 + 20 = 35 points", () => {
    const { scoreDelta, newStreak } = calculateNitriteScore(0, true);
    expect(scoreDelta).toBe(35);
    expect(newStreak).toBe(1);
  });

  test("second combo (streak 1 → 2) awards 15 + 40 = 55 points", () => {
    const { scoreDelta, newStreak } = calculateNitriteScore(1, true);
    expect(scoreDelta).toBe(55);
    expect(newStreak).toBe(2);
  });

  test("combo streak keeps incrementing each consecutive combo", () => {
    let streak = 0;
    let totalScore = 0;
    for (let i = 0; i < 5; i++) {
      const { scoreDelta, newStreak } = calculateNitriteScore(streak, true);
      totalScore += scoreDelta;
      streak = newStreak;
    }
    // streaks 1..5: 15+20, 15+40, 15+60, 15+80, 15+100 = 35+55+75+95+115 = 375
    expect(streak).toBe(5);
    expect(totalScore).toBe(375);
  });

  test("non-combo after a streak resets streak to 0", () => {
    const { newStreak } = calculateNitriteScore(4, false);
    expect(newStreak).toBe(0);
  });
});

// ── Danger gauge fill ──────────────────────────────────────────────────────

describe("calculateGaugeFill", () => {
  test("empty tank returns 0", () => {
    expect(calculateGaugeFill(0, AMMONIA_DANGER_THRESHOLD)).toBe(0);
  });

  test("exactly at threshold returns 1", () => {
    expect(calculateGaugeFill(AMMONIA_DANGER_THRESHOLD, AMMONIA_DANGER_THRESHOLD)).toBe(1);
  });

  test("above threshold is clamped to 1", () => {
    expect(calculateGaugeFill(10, AMMONIA_DANGER_THRESHOLD)).toBe(1);
  });

  test("half threshold returns 0.5", () => {
    expect(calculateGaugeFill(4, NITRITE_DANGER_THRESHOLD)).toBe(0.5);
  });

  test("single ammonia out of 6 is ~16.7 %", () => {
    expect(calculateGaugeFill(1, AMMONIA_DANGER_THRESHOLD)).toBeCloseTo(1 / 6);
  });
});

// ── Game-over detection ────────────────────────────────────────────────────

describe("checkGameOver", () => {
  test("returns null when both counts are safe", () => {
    expect(checkGameOver(0, 0)).toBeNull();
    expect(checkGameOver(5, 7)).toBeNull();
  });

  test("returns 'ammonia' when ammonia hits the threshold", () => {
    expect(checkGameOver(AMMONIA_DANGER_THRESHOLD, 0)).toBe("ammonia");
  });

  test("returns 'ammonia' for ammonia above threshold", () => {
    expect(checkGameOver(10, 2)).toBe("ammonia");
  });

  test("returns 'nitrite' when nitrite hits the threshold", () => {
    expect(checkGameOver(0, NITRITE_DANGER_THRESHOLD)).toBe("nitrite");
  });

  test("ammonia takes priority when both thresholds are exceeded", () => {
    expect(checkGameOver(AMMONIA_DANGER_THRESHOLD, NITRITE_DANGER_THRESHOLD)).toBe("ammonia");
  });

  test("one below threshold does not trigger game over", () => {
    expect(checkGameOver(AMMONIA_DANGER_THRESHOLD - 1, NITRITE_DANGER_THRESHOLD - 1)).toBeNull();
  });
});

// ── Oxygen speed multiplier ────────────────────────────────────────────────

describe("calculateOxygenSpeedMult", () => {
  test("full oxygen returns 1 (normal speed)", () => {
    expect(calculateOxygenSpeedMult(100)).toBe(1);
  });

  test("exactly at low-oxygen threshold returns 1", () => {
    expect(calculateOxygenSpeedMult(LOW_OXYGEN_THRESHOLD)).toBe(1);
  });

  test("just below low-oxygen threshold returns the slow multiplier", () => {
    expect(calculateOxygenSpeedMult(LOW_OXYGEN_THRESHOLD - 1)).toBe(0.25);
  });

  test("oxygen at 1 still returns the slow multiplier", () => {
    expect(calculateOxygenSpeedMult(1)).toBe(0.25);
  });

  test("zero oxygen returns 0 (fully paralysed)", () => {
    expect(calculateOxygenSpeedMult(0)).toBe(0);
  });

  test("negative oxygen also returns 0", () => {
    expect(calculateOxygenSpeedMult(-5)).toBe(0);
  });
});

// ── Oxygen depletion ───────────────────────────────────────────────────────

describe("depleteOxygen", () => {
  test("oxygen decreases by the correct amount per second", () => {
    const result = depleteOxygen(100, 1);
    expect(result).toBeCloseTo(100 - OXYGEN_DEPLETION_RATE);
  });

  test("does not drop below 0", () => {
    expect(depleteOxygen(0, 1)).toBe(0);
    expect(depleteOxygen(1, 100)).toBe(0);
  });

  test("zero dt causes no change", () => {
    expect(depleteOxygen(80, 0)).toBe(80);
  });

  test("oxygen reaches zero in ~35 seconds from full", () => {
    // After 35 s the tank should be at or near 0
    const result = depleteOxygen(100, 35);
    expect(result).toBeCloseTo(0, 0);
  });
});

// ── Oxygen replenishment ───────────────────────────────────────────────────

describe("replenishOxygen", () => {
  test("adds OXYGEN_PER_BUBBLE when there is room", () => {
    expect(replenishOxygen(50)).toBe(50 + OXYGEN_PER_BUBBLE);
  });

  test("does not exceed 100", () => {
    expect(replenishOxygen(100)).toBe(100);
    expect(replenishOxygen(95)).toBe(100);
  });

  test("works from 0", () => {
    expect(replenishOxygen(0)).toBe(OXYGEN_PER_BUBBLE);
  });
});

// ── Spawn interval acceleration ────────────────────────────────────────────

describe("calculateNextSpawnInterval", () => {
  test("decrements by SPAWN_ACCELERATION from the base interval", () => {
    expect(calculateNextSpawnInterval(BASE_SPAWN_INTERVAL)).toBe(BASE_SPAWN_INTERVAL - 15);
  });

  test("never goes below MIN_SPAWN_INTERVAL", () => {
    expect(calculateNextSpawnInterval(MIN_SPAWN_INTERVAL)).toBe(MIN_SPAWN_INTERVAL);
    expect(calculateNextSpawnInterval(MIN_SPAWN_INTERVAL + 1)).toBe(MIN_SPAWN_INTERVAL);
  });

  test("interval decreases over many spawns until floor is hit", () => {
    let interval = BASE_SPAWN_INTERVAL;
    while (interval > MIN_SPAWN_INTERVAL) {
      interval = calculateNextSpawnInterval(interval);
    }
    expect(interval).toBe(MIN_SPAWN_INTERVAL);
  });
});

// ── Plant growth ───────────────────────────────────────────────────────────

describe("calculatePlantGrowth", () => {
  test("normal nitrate grows plant by 1", () => {
    expect(calculatePlantGrowth(0, false)).toBe(1);
    expect(calculatePlantGrowth(2, false)).toBe(3);
  });

  test("combo nitrate grows plant by 2", () => {
    expect(calculatePlantGrowth(0, true)).toBe(2);
    expect(calculatePlantGrowth(2, true)).toBe(4);
  });

  test("plant growth is capped at GROWTH_MAX", () => {
    expect(calculatePlantGrowth(GROWTH_MAX, false)).toBe(GROWTH_MAX);
    expect(calculatePlantGrowth(GROWTH_MAX, true)).toBe(GROWTH_MAX);
    expect(calculatePlantGrowth(GROWTH_MAX - 1, true)).toBe(GROWTH_MAX);
  });

  test("combo at one below max still caps at max", () => {
    expect(calculatePlantGrowth(GROWTH_MAX - 1, true)).toBe(GROWTH_MAX);
  });
});

// ── Game-over cause message ────────────────────────────────────────────────

describe("getGameOverMessage", () => {
  test("ammonia cause produces the correct message", () => {
    expect(getGameOverMessage("ammonia")).toContain("ammonia");
    expect(getGameOverMessage("ammonia")).toContain("NH");
  });

  test("nitrite cause produces the correct message", () => {
    expect(getGameOverMessage("nitrite")).toContain("nitrite");
    expect(getGameOverMessage("nitrite")).toContain("NO");
  });

  test("unknown cause defaults to the nitrite message", () => {
    expect(getGameOverMessage("unknown")).toContain("nitrite");
  });
});
