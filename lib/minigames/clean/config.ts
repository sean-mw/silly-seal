import { MAX_STAT_VALUE } from "@/store/sealSlice";

export const GAME_CONFIG = {
  GRID_SIZE: 8,
  ROCK_COUNT: 10,
  CELL_SIZE: "w-[min(10vw,10vh,64px)] h-[min(10vw,10vh,64px)]",
  STAT_REWARD: MAX_STAT_VALUE / 2,
};
