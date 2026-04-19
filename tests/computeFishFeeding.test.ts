import {
  evaluateFoodDrop,
  fishToGoodKey,
  getReviewDescription,
  type FoodForEvaluation,
} from "../lib/computeFishFeeding";

const algae: FoodForEvaluation = {
  name: "Algae",
  tilapiaGood: true,
  troutGood: false,
  salmonGood: false,
  isMeat: false,
  isPlantBased: true,
  isCakeOrCookeies: false,
};

const shrimp: FoodForEvaluation = {
  name: "Shrimp",
  tilapiaGood: false,
  troutGood: true,
  salmonGood: true,
  isMeat: true,
  isPlantBased: false,
  isCakeOrCookeies: false,
};

const cookies: FoodForEvaluation = {
  name: "Cookies",
  tilapiaGood: false,
  troutGood: false,
  salmonGood: false,
  isMeat: false,
  isPlantBased: false,
  isCakeOrCookeies: true,
};

describe("fishToGoodKey", () => {
  test("maps fish names to the right property key", () => {
    expect(fishToGoodKey("Tilapia")).toBe("tilapiaGood");
    expect(fishToGoodKey("Trout")).toBe("troutGood");
    expect(fishToGoodKey("Salmon")).toBe("salmonGood");
  });
});

describe("evaluateFoodDrop", () => {
  test("score increases when correct food is fed to fish", () => {
    const result = evaluateFoodDrop(algae, "Tilapia", "fish");

    expect(result.correct).toBe(true);
    expect(result.score).toBe(1);
    expect(result.message).toBe("Correct food");
    expect(result.incorrectReason).toBeNull();
  });

  test("flags incorrect food when bad food is fed", () => {
    const result = evaluateFoodDrop(shrimp, "Tilapia", "fish");

    expect(result.correct).toBe(false);
    expect(result.score).toBe(0);
    expect(result.message).toBe("Incorrect food");
    expect(result.incorrectReason).toBe("fedBadFood");
  });

  test("score increases when bad food goes to trash", () => {
    const result = evaluateFoodDrop(shrimp, "Tilapia", "trash");

    expect(result.correct).toBe(true);
    expect(result.score).toBe(1);
    expect(result.message).toBe("Correct - Bad food in trash");
  });

  test("flags incorrect when good food goes to trash", () => {
    const result = evaluateFoodDrop(algae, "Tilapia", "trash");

    expect(result.correct).toBe(false);
    expect(result.score).toBe(0);
    expect(result.message).toBe("Incorrect - good food in trash");
    expect(result.incorrectReason).toBe("trashedGoodFood");
  });
});

describe("getReviewDescription", () => {
  test("sweets are bad message if cake or cookies are fed", () => {
    const message = getReviewDescription(cookies, "Trout", "fedBadFood");
    expect(message).toBe("Fish cannot eat human sweets!!!");
  });

  test("explains error if plants are fed to trout", () => {
    const message = getReviewDescription(algae, "Trout", "fedBadFood");
    expect(message).toContain("plant-based");
    expect(message).toContain("trout");
  });

  test("explains error if meat is in trash for salmon", () => {
    const message = getReviewDescription(shrimp, "Salmon", "trashedGoodFood");
    expect(message).toContain("meat-based");
    expect(message).toContain("salmon");
  });
});
