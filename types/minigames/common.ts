export interface GameState {
  isGameOver: boolean;
  isVictory: boolean;
  score: number;
  [key: string]: unknown;
}

export interface StatReward {
  hunger?: number;
  happiness?: number;
  hygiene?: number;
}

export interface GameResult {
  score: number;
  statRewards: StatReward;
}

export interface MiniGameConfig {
  name: string;
  description: string;
  allowRestart: boolean;
}
