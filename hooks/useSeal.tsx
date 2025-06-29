"use client";

import { clamp } from "@/lib/utils";
import { createContext, useContext, useEffect, ReactNode } from "react";
import usePersistedState from "./usePersistedState";

export type SealState = {
  hunger: number;
  happiness: number;
  cleanliness: number;
  lastUpdate: number;
};

export const MAX_STAT_VALUE = 100;
const INITIAL_STAT_VALUE = MAX_STAT_VALUE / 2;
const DAILY_DECAY = MAX_STAT_VALUE / 3;
const STORAGE_KEY = "sealState";

const defaultState: SealState = {
  hunger: INITIAL_STAT_VALUE,
  happiness: INITIAL_STAT_VALUE,
  cleanliness: INITIAL_STAT_VALUE,
  lastUpdate: Date.now(),
};

function calculateDecay(state: SealState): SealState {
  const now = Date.now();
  const daysPassed = (now - state.lastUpdate) / (1000 * 60 * 60 * 24);

  if (daysPassed < 0.01) return state;

  return {
    ...state,
    hunger: Math.max(0, state.hunger - DAILY_DECAY * daysPassed),
    happiness: Math.max(0, state.happiness - DAILY_DECAY * daysPassed),
    cleanliness: Math.max(0, state.cleanliness - DAILY_DECAY * daysPassed),
    lastUpdate: now,
  };
}

type SealContextType = {
  sealState: SealState;
  setSealState: (state: SealState) => void;
};

const SealContext = createContext<SealContextType | null>(null);

export function SealProvider({ children }: { children: ReactNode }) {
  const [sealState, setSealState] = usePersistedState<SealState>(
    STORAGE_KEY,
    defaultState
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    setSealState((currentState) => calculateDecay(currentState));

    const interval = setInterval(() => {
      setSealState((currentState) => calculateDecay(currentState));
    }, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, [setSealState]);

  const setSealStateClamped = (state: SealState) => {
    const clampedState: SealState = {
      ...calculateDecay(state),
      hunger: clamp(state.hunger, 0, MAX_STAT_VALUE),
      happiness: clamp(state.happiness, 0, MAX_STAT_VALUE),
      cleanliness: clamp(state.cleanliness, 0, MAX_STAT_VALUE),
      lastUpdate: Date.now(),
    };
    setSealState(clampedState);
  };

  return (
    <SealContext.Provider
      value={{ sealState, setSealState: setSealStateClamped }}
    >
      {children}
    </SealContext.Provider>
  );
}

export function useSeal(): SealContextType {
  const context = useContext(SealContext);
  if (!context) {
    throw new Error("useSeal must be used within a SealProvider");
  }
  return context;
}
