import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type SealStat = "hunger" | "happiness" | "cleanliness";

export type SealState = {
  [key in SealStat]: number;
} & {
  lastUpdate: number;
};

export const MAX_STAT_VALUE = 100;
const INITIAL_STAT_VALUE = MAX_STAT_VALUE / 2;
const DAILY_DECAY = MAX_STAT_VALUE / 3;

const initialState: SealState = {
  hunger: INITIAL_STAT_VALUE,
  happiness: INITIAL_STAT_VALUE,
  cleanliness: INITIAL_STAT_VALUE,
  lastUpdate: Date.now(),
};

const sealSlice = createSlice({
  name: "seal",
  initialState,
  reducers: {
    applyReward: (
      state,
      action: PayloadAction<{ stat: SealStat; value: number }>
    ) => {
      const { stat, value } = action.payload;
      state[stat] = Math.min(MAX_STAT_VALUE, state[stat] + value);
    },
    applyDecay: (state) => {
      const now = Date.now();
      const daysPassed = (now - state.lastUpdate) / (1000 * 60 * 60 * 24);
      state.hunger = Math.max(0, state.hunger - DAILY_DECAY * daysPassed);
      state.happiness = Math.max(0, state.happiness - DAILY_DECAY * daysPassed);
      state.cleanliness = Math.max(
        0,
        state.cleanliness - DAILY_DECAY * daysPassed
      );
      state.lastUpdate = now;
    },
  },
});

export const { applyReward, applyDecay } = sealSlice.actions;
export default sealSlice.reducer;
