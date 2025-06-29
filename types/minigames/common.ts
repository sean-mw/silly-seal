import { SealState } from "@/hooks/useSeal";

export interface GameState {
  isGameOver: boolean;
  rewardStat: keyof SealState;
  rewardValue?: number;
  lastPlayedAt?: number;
  [key: string]: unknown;
}

export interface MiniGameConfig {
  name: string;
  description: string;
  allowRestart: boolean;
}
