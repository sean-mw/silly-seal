import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DepthGameState, Species } from "@/types/minigames/depth";
import { DepthGameEngine } from "@/lib/minigames/depth/engine";
import { GAME_CONFIG } from "@/lib/minigames/depth/config";

export const getInitialState = (speciesList?: Species[]): DepthGameState => {
  let currentIdx: number | undefined;
  let nextIdx: number | undefined;
  if (speciesList !== undefined) {
    currentIdx = DepthGameEngine.getRandomIndex(speciesList.length);
    nextIdx = DepthGameEngine.getRandomIndex(speciesList.length, currentIdx);
  }
  return {
    isGameOver: false,
    createdAt: Date.now(),
    reward: 0,
    rewardApplied: false,
    score: 0,
    lives: GAME_CONFIG.LIVES,
    currentIdx,
    nextIdx,
    speciesList,
  };
};

const depthGameSlice = createSlice({
  name: "depthGame",
  initialState: getInitialState(),
  reducers: {
    reinitializeWithSpeciesList(_, action: PayloadAction<Species[]>) {
      return getInitialState(action.payload);
    },
    makeGuess(state, action: PayloadAction<"higher" | "lower">) {
      if (
        state.currentIdx === undefined ||
        state.nextIdx === undefined ||
        state.speciesList === undefined ||
        state.isGameOver
      ) {
        return;
      }

      const currentDepth = state.speciesList[state.currentIdx].average_depth;
      const nextDepth = state.speciesList[state.nextIdx].average_depth;

      const isCorrect = DepthGameEngine.isGuessCorrect(
        action.payload,
        currentDepth,
        nextDepth
      );

      if (isCorrect) {
        state.score += 1;
      } else {
        state.lives -= 1;
        if (state.lives <= 0) {
          state.isGameOver = true;
          state.reward = state.score * GAME_CONFIG.SCORE_MULTIPLIER;
        }
      }

      const newNextIdx = DepthGameEngine.getRandomIndex(
        state.speciesList.length,
        state.nextIdx
      );
      state.currentIdx = state.nextIdx;
      state.nextIdx = newNextIdx;
    },
    resetGame(state) {
      return getInitialState(state.speciesList);
    },
    markRewardApplied: (state) => {
      state.rewardApplied = true;
    },
  },
});

export const {
  reinitializeWithSpeciesList,
  makeGuess,
  resetGame,
  markRewardApplied,
} = depthGameSlice.actions;
export default depthGameSlice.reducer;
