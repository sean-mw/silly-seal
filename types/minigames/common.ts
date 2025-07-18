import { SealStat } from "@/store/sealSlice";

export interface GameState {
  isGameOver: boolean;
  createdAt: number;
  reward: number;
  rewardApplied: boolean;
}

export interface MiniGameConfig {
  name: string;
  stat: SealStat;
  description: string;
  allowRestart: boolean;
}
