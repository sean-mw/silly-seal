import { SealState } from "@/hooks/useSeal";

export interface GameState {
  isGameOver: boolean;
  reward?: GameReward;
  createdAt: number;
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
