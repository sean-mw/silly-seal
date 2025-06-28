import { GameState } from "./common";

export type Cell = {
  hasRock: boolean;
  revealed: boolean;
  flagged: boolean;
  adjacentRocks: number;
};

export interface CleanGameState extends GameState {
  isGameOver: boolean;
  isVictory: boolean;
  score: number;
  grid: Cell[][];
}
