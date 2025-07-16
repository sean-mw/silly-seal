import { SealState } from "@/hooks/useSeal";

export interface GameState {
  isGameOver: boolean;
  reward?: GameReward;
  lastPlayedAt?: number;
}

export interface GameReward {
  stat: keyof SealState;
  value: number;
  prevValue?: number;
}

export interface MiniGameConfig {
  name: string;
  description: string;
  allowRestart: boolean;
}
