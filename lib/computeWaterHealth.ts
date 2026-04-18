export function computeWaterHealth(
  fish: number,
  plants: number,
  temp: number,
  bacteria: number
): {
  color: string;
  label: string;
  healthy: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  let score = 100;

  const ratio = fish / Math.max(plants, 1);
  if (ratio > 2.5) { issues.push("Too many fish for the plants to handle"); score -= 30; }
  else if (ratio < 0.5) { issues.push("Too few fish — plants need more nitrate"); score -= 10; }

  if (temp < 18) { issues.push("Water too cold — bacteria slow down below 18°C"); score -= 25; }
  else if (temp > 32) { issues.push("Water too hot — stresses fish above 32°C"); score -= 20; }

  if (bacteria < 30) { issues.push("Bacteria levels too low to process waste"); score -= 35; }
  else if (bacteria < 60) { issues.push("Bacteria levels suboptimal"); score -= 15; }

  if (fish > 14) { issues.push("Fish count very high — overcrowding risk"); score -= 15; }
  if (plants < 2) { issues.push("Barely any plants — nitrate will accumulate"); score -= 20; }

  score = Math.max(0, score);
  const healthy = score >= 70;
  const color = score >= 70 ? "#60a5fa" : score >= 40 ? "#facc15" : "#ef4444";
  const label = score >= 70 ? "Balanced ✅" : score >= 40 ? "Stressed ⚠️" : "Critical 🔴";
  return { color, label, healthy, issues };
}
