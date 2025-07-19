import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DepthGameState, Species } from "@/types/minigames/depth";
import { DepthGameEngine } from "@/lib/minigames/depth/engine";
import { GAME_CONFIG } from "@/lib/minigames/depth/config";

export const getInitialState = (speciesList?: Species[]): DepthGameState => {
  let prevIdx: number | undefined;
  let curIdx: number | undefined;
  let nextIdx: number | undefined;
  if (speciesList !== undefined) {
    prevIdx = DepthGameEngine.getRandomIndex(speciesList.length);
    curIdx = DepthGameEngine.getRandomIndex(speciesList.length, prevIdx);
    nextIdx = DepthGameEngine.getRandomIndex(speciesList.length, curIdx);
  }
  return {
    isGameOver: false,
    createdAt: Date.now(),
    reward: 0,
    rewardApplied: false,
    score: 0,
    lives: GAME_CONFIG.LIVES,
    prevIdx,
    curIdx,
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
        state.prevIdx === undefined ||
        state.curIdx === undefined ||
        state.nextIdx === undefined ||
        state.speciesList === undefined ||
        state.isGameOver
      ) {
        return;
      }

      const prevDepth = state.speciesList[state.prevIdx].average_depth;
      const curDepth = state.speciesList[state.curIdx].average_depth;

      const isCorrect = DepthGameEngine.isGuessCorrect(
        action.payload,
        prevDepth,
        curDepth
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

      state.prevIdx = state.curIdx;
      state.curIdx = state.nextIdx;
      state.nextIdx = DepthGameEngine.getRandomIndex(
        state.speciesList.length,
        state.nextIdx
      );
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
