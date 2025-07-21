import { ModalProps } from "@/components/Modal";
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
}

export type GameModalProps = Omit<ModalProps, "title" | "storageKey">;

export type GameFeedback = "correct" | "incorrect" | "pending";
