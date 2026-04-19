export type FishName = "Tilapia" | "Trout" | "Salmon";

export type FishGoodKey = "tilapiaGood" | "troutGood" | "salmonGood";

export type DropTarget = "fish" | "trash";

export type IncorrectReason = "fedBadFood" | "trashedGoodFood";

export type FeedbackType = "correct" | "incorrect";

export type FoodForEvaluation = {
  name: string;
  tilapiaGood: boolean;
  troutGood: boolean;
  salmonGood: boolean;
  isMeat: boolean;
  isPlantBased: boolean;
  isCakeOrCookeies: boolean;
};

export type DropEvaluation = {
  correct: boolean;
  score: number;
  message: string;
  feedbackType: FeedbackType;
  incorrectReason: IncorrectReason | null;
};

export function fishToGoodKey(fishName: FishName): FishGoodKey {
  return `${fishName.toLowerCase()}Good` as FishGoodKey;
}

export function evaluateFoodDrop(
  food: FoodForEvaluation,
  fishName: FishName,
  target: DropTarget
): DropEvaluation {
  const fishGoodKey = fishToGoodKey(fishName);
  const isGoodForFish = food[fishGoodKey];

  if (target === "fish") {
    if (isGoodForFish) {
      return {
        correct: true,
        score: 1,
        message: "Correct food",
        feedbackType: "correct",
        incorrectReason: null,
      };
    }

    return {
      correct: false,
      score: 0,
      message: "Incorrect food",
      feedbackType: "incorrect",
      incorrectReason: "fedBadFood",
    };
  }

  if (!isGoodForFish) {
    return {
      correct: true,
      score: 1,
      message: "Correct - Bad food in trash",
      feedbackType: "correct",
      incorrectReason: null,
    };
  }

  return {
    correct: false,
    score: 0,
    message: "Incorrect - good food in trash",
    feedbackType: "incorrect",
    incorrectReason: "trashedGoodFood",
  };
}

export function getReviewDescription(
  food: FoodForEvaluation,
  fishName: FishName,
  reason: IncorrectReason
): string {
  const fishLabel = fishName.toLowerCase();
  const foodLabel = food.name;
  const lowerFood = foodLabel.toLowerCase();
  const usesAre = lowerFood !== "cookies" && lowerFood.endsWith("s");
  const linkingVerb = usesAre ? "are" : "is";
  const isTroutOrSalmon = fishName === "Trout" || fishName === "Salmon";

  if (food.isCakeOrCookeies) {
    return "Fish cannot eat human sweets!!!";
  }

  if (fishName === "Tilapia") {
    if (reason === "fedBadFood" && food.isMeat) {
      return `${foodLabel} ${linkingVerb} meat-based, so it should have gone in the trash because ${fishLabel} should be fed plant-based food.`;
    }

    if (reason === "trashedGoodFood" && food.isPlantBased) {
      return `${foodLabel} ${linkingVerb} plant-based, so it should have been fed because ${fishLabel} should be fed plant-based food.`;
    }
  }

  if (isTroutOrSalmon) {
    if (reason === "fedBadFood" && food.isPlantBased) {
      return `${foodLabel} ${linkingVerb} plant-based, so it should have gone in the trash because ${fishLabel} should be fed meat-based food.`;
    }

    if (reason === "trashedGoodFood" && food.isMeat) {
      return `${foodLabel} ${linkingVerb} meat-based, so it should have been fed because ${fishLabel} should be fed meat-based food.`;
    }
  }

  if (reason === "fedBadFood") {
    return `${foodLabel} was not a good match for ${fishLabel} and should have gone in the trash.`;
  }

  return `${foodLabel} was a valid food for ${fishLabel} and should have been fed.`;
}
