import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FeedGameState, GuessWithFeedback } from "@/types/minigames/feed";
import { FeedGameEngine } from "@/lib/minigames/feed/engine";
import { GAME_CONFIG } from "@/lib/minigames/feed/config";

const getInitialState = (): FeedGameState => ({
  isGameOver: false,
  createdAt: Date.now(),
  reward: 0,
  rewardApplied: false,
  secret: FeedGameEngine.generateRandomSequence(),
  currentGuess: [],
  guesses: [],
  keyboardColors: {},
});

const feedGameSlice = createSlice({
  name: "feedGame",
  initialState: getInitialState(),
  reducers: {
    resetGame: () => {
      return getInitialState();
    },
    addFish: (state, action: PayloadAction<string>) => {
      if (
        !state.isGameOver &&
        state.currentGuess.length < GAME_CONFIG.SEQUENCE_LENGTH
      ) {
        state.currentGuess.push(action.payload);
      }
    },
    removeFish: (state) => {
      state.currentGuess.pop();
    },
    submitGuess: (state) => {
      if (
        state.currentGuess.length !== GAME_CONFIG.SEQUENCE_LENGTH ||
        state.isGameOver ||
        state.guesses.length === GAME_CONFIG.MAX_ATTEMPTS
      ) {
        return;
      }
      const feedback = FeedGameEngine.calculateFeedback(
        state.secret,
        state.currentGuess
      );
      const newGuess: GuessWithFeedback = {
        guess: state.currentGuess,
        feedback,
      };
      state.guesses.push(newGuess);
      state.currentGuess = [];
      const isGameWon = FeedGameEngine.isGameWon(feedback);
      if (isGameWon) state.reward = GAME_CONFIG.STAT_REWARD;
    },
    updateKeyboardColors: (state) => {
      state.keyboardColors = FeedGameEngine.computeKeyboardColors(
        state.guesses
      );
    },
    endGame: (state) => {
      state.isGameOver = true;
    },
    markRewardApplied: (state) => {
      state.rewardApplied = true;
    },
  },
});

export const {
  resetGame,
  addFish,
  removeFish,
  submitGuess,
  updateKeyboardColors,
  endGame,
  markRewardApplied,
} = feedGameSlice.actions;
export default feedGameSlice.reducer;
