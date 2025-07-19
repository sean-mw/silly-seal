import { Species } from "@/types/minigames/depth";

export class DepthGameEngine {
  static getRandomIndex(max: number, excludeIndex?: number): number {
    if (max <= 1) return 0;
    if (excludeIndex === undefined) {
      return Math.floor(Math.random() * max);
    }
    const idx = Math.floor(Math.random() * (max - 1));
    return idx >= excludeIndex ? idx + 1 : idx;
  }

  static isGuessCorrect(
    guess: "higher" | "lower",
    currentDepth: number,
    nextDepth: number
  ): boolean {
    return (
      (guess === "higher" && nextDepth <= currentDepth) ||
      (guess === "lower" && nextDepth >= currentDepth)
    );
  }

  static async loadSpecies(): Promise<Species[]> {
    try {
      const res = await fetch("/api/species");
      const data: Species[] = await res.json();
      return data;
    } catch (error) {
      console.error("Failed to load species:", error);
      throw error;
    }
  }
}
