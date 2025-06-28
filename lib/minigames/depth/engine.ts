import { Species } from "@/types/minigames/depth";

export class DepthGameEngine {
  static getRandomIndex(max: number, excludeIndex?: number): number {
    let idx = Math.floor(Math.random() * max);
    while (idx === excludeIndex) {
      idx = Math.floor(Math.random() * max);
    }
    return idx;
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
