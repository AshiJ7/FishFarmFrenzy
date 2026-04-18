import { computeWaterHealth } from "../lib/computeWaterHealth";

// balanced system tests
describe("balanced system", () => {
  test("returns healthy when everything is ideal", () => {
    const result = computeWaterHealth(6, 6, 26, 80);
    expect(result.healthy).toBe(true);
    expect(result.issues).toHaveLength(0);
    expect(result.label).toBe("Balanced ✅");
  });

  test("water color is blue when healthy", () => {
    const result = computeWaterHealth(6, 6, 26, 80);
    expect(result.color).toBe("#60a5fa");
  });
});

// fish count tests
describe("fish count issues", () => {
  test("too many fish flags as unhealthy", () => {
    const result = computeWaterHealth(20, 6, 26, 80);
    expect(result.healthy).toBe(false);
    expect(result.issues).toContain("Too many fish for the plants to handle");
  });

  test("overcrowding detected above 14 fish", () => {
    const result = computeWaterHealth(15, 6, 26, 80);
    expect(result.issues).toContain("Fish count very high — overcrowding risk");
  });

  test("too few fish relative to plants is flagged", () => {
    const result = computeWaterHealth(1, 20, 26, 80);
    expect(result.issues).toContain("Too few fish — plants need more nitrate");
  });
});

// plant count tests
describe("plant count issues", () => {
  test("barely any plants is flagged", () => {
    const result = computeWaterHealth(6, 1, 26, 80);
    expect(result.issues).toContain("Barely any plants — nitrate will accumulate");
  });
});

// temperature level tests
describe("temperature issues", () => {
  test("cold water is flagged", () => {
  const result = computeWaterHealth(6, 6, 15, 80);
  expect(result.issues).toContain("Water too cold — bacteria slow down below 18°C");
  expect(result.healthy).toBe(true); 
});

  test("hot water is flagged", () => {
    const result = computeWaterHealth(6, 6, 35, 80);
    expect(result.issues).toContain("Water too hot — stresses fish above 32°C");
  });

  test("ideal temperature range passes", () => {
    const result = computeWaterHealth(6, 6, 25, 80);
    expect(result.issues).not.toContain("Water too cold — bacteria slow down below 18°C");
    expect(result.issues).not.toContain("Water too hot — stresses fish above 32°C");
  });
});

// bacteria level tests
describe("bacteria level issues", () => {
  test("very low bacteria makes system unhealthy", () => {
  const result = computeWaterHealth(6, 6, 26, 10);
  expect(result.healthy).toBe(false);
  expect(result.issues).toContain("Bacteria levels too low to process waste");
  expect(result.label).toBe("Stressed ⚠️"); 
  expect(result.color).toBe("#facc15");
});

  test("suboptimal bacteria gives a warning", () => {
    const result = computeWaterHealth(6, 6, 26, 50);
    expect(result.issues).toContain("Bacteria levels suboptimal");
  });

  test("healthy bacteria level passes", () => {
    const result = computeWaterHealth(6, 6, 26, 80);
    expect(result.issues).not.toContain("Bacteria levels too low to process waste");
  });
});

// multiple issues tests
describe("multiple issues at once", () => {
  test("cold temp AND low bacteria both flagged", () => {
    const result = computeWaterHealth(6, 6, 15, 20);
    expect(result.issues).toContain("Water too cold — bacteria slow down below 18°C");
    expect(result.issues).toContain("Bacteria levels too low to process waste");
    expect(result.healthy).toBe(false);
  });

  test("score never goes below 0", () => {
    //worst possible system
    const result = computeWaterHealth(20, 1, 5, 5);
    expect(result.color).toBe("#ef4444"); //critical
    expect(result.healthy).toBe(false);
  });
});