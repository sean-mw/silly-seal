"use client";
import { clamp } from "@/lib/utils";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type SealState = {
  hunger: number;
  happiness: number;
  hygiene: number;
  lastUpdate: number;
};

const STORAGE_KEY = "sealState";
export const MAX_STAT_VALUE = 100;
const INITIAL_STAT_VALUE = MAX_STAT_VALUE / 2;
const DAILY_DECAY = MAX_STAT_VALUE / 3;

const defaultState: SealState = {
  hunger: INITIAL_STAT_VALUE,
  happiness: INITIAL_STAT_VALUE,
  hygiene: INITIAL_STAT_VALUE,
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
    hygiene: Math.max(0, state.hygiene - DAILY_DECAY * daysPassed),
    lastUpdate: now,
  };
}

function loadState(): SealState {
  if (typeof window === "undefined") return defaultState;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const state = stored ? JSON.parse(stored) : defaultState;
    return calculateDecay(state);
  } catch (error) {
    console.error("Failed to parse seal state from localStorage:", error);
    return defaultState;
  }
}

function saveState(state: SealState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save seal state to localStorage:", error);
  }
}

type SealContextType = {
  seal: SealState;
  setSeal: (state: SealState) => void;
};

const SealContext = createContext<SealContextType | null>(null);

export function SealProvider({ children }: { children: ReactNode }) {
  const [seal, setSealState] = useState<SealState>(defaultState);

  useEffect(() => {
    const loadedState = loadState();
    setSealState(loadedState);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSealState((currentState) => calculateDecay(currentState));
    }, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const setSeal = (state: SealState) => {
    const clampedState = {
      ...calculateDecay(state),
      hunger: clamp(state.hunger, 0, MAX_STAT_VALUE),
      happiness: clamp(state.happiness, 0, MAX_STAT_VALUE),
      hygiene: clamp(state.hygiene, 0, MAX_STAT_VALUE),
      lastUpdate: Date.now(),
    };
    saveState(clampedState);
    setSealState(clampedState);
  };

  return (
    <SealContext.Provider value={{ seal, setSeal }}>
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
