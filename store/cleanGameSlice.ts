import { GAME_CONFIG } from "@/lib/minigames/clean/config";
import { CleanGameEngine } from "@/lib/minigames/clean/engine";
import { CleanGameState } from "@/types/minigames/clean";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const getInitialState = (): CleanGameState => {
  return {
    isGameOver: false,
    createdAt: Date.now(),
    grid: CleanGameEngine.initializeGrid(),
    reward: 0,
    rewardApplied: false,
  };
};

const cleanGameSlice = createSlice({
  name: "cleanGame",
  initialState: getInitialState(),
  reducers: {
    resetGame: getInitialState,
    revealCell: (state, action: PayloadAction<{ x: number; y: number }>) => {
      if (state.isGameOver) return;
      const { x, y } = action.payload;
      if (state.grid[y][x].hasRock) {
        state.isGameOver = true;
        return;
      }
      CleanGameEngine.revealEmptyCells(state.grid, x, y);
      if (CleanGameEngine.isCleared(state.grid)) {
        state.isGameOver = true;
        state.reward = GAME_CONFIG.STAT_REWARD;
      }
    },
    flagCell: (state, action: PayloadAction<{ x: number; y: number }>) => {
      if (state.isGameOver) return;
      const { x, y } = action.payload;
      const cell = state.grid[y][x];
      if (cell.revealed) return;
      cell.flagged = !cell.flagged;
    },
    markRewardApplied: (state) => {
      state.rewardApplied = true;
    },
  },
});

export const { resetGame, revealCell, flagCell, markRewardApplied } =
  cleanGameSlice.actions;
export default cleanGameSlice.reducer;
