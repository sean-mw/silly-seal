import { GAME_CONFIG } from "@/lib/minigames/clean/config";
import { CleanGameEngine } from "@/lib/minigames/clean/engine";
import { CleanGameState } from "@/types/minigames/clean";
import { GameFeedback } from "@/types/minigames/common";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const getInitialState = (): CleanGameState => {
  return {
    isGameOver: false,
    createdAt: Date.now(),
    grid: CleanGameEngine.initializeGrid(),
    reward: 0,
    rewardApplied: false,
    lives: GAME_CONFIG.LIVES,
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
      CleanGameEngine.revealEmptyCells(state.grid, x, y);
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
    endGame: (state, action: PayloadAction<GameFeedback>) => {
      if (action.payload === "pending") return;
      state.isGameOver = true;
      state.reward = action.payload === "correct" ? GAME_CONFIG.STAT_REWARD : 0;
    },
    hitRock: (state, action: PayloadAction<{ x: number; y: number }>) => {
      const { x, y } = action.payload;
      state.grid[y][x].revealed = true;

      if (state.lives === 0) return;
      state.lives -= 1;
    },
    revealAllCells: (state) => {
      CleanGameEngine.revealAllCells(state.grid);
    },
  },
});

export const {
  resetGame,
  revealCell,
  flagCell,
  markRewardApplied,
  endGame,
  hitRock,
  revealAllCells,
} = cleanGameSlice.actions;
export default cleanGameSlice.reducer;
