export interface GameState {
  isGameOver: boolean;
  lastPlayedAt?: number;
  [key: string]: unknown;
}

export interface MiniGameConfig {
  name: string;
  description: string;
  allowRestart: boolean;
}
