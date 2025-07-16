"use client";

import { useCallback, useEffect, useState } from "react";

function loadState<T>(key: string): T | undefined {
  if (typeof window === "undefined") return;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : undefined;
  } catch (error) {
    console.error(
      `Failed to parse state from localStorage for key "${key}":`,
      error
    );
    return;
  }
}

function saveState<T>(key: string, state: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch (error) {
    console.error(
      `Failed to save state to localStorage for key "${key}":`,
      error
    );
  }
}

type SetStateAction<T> = T | ((prev: T) => T);

function usePersistedState<T>(
  key: string,
  initialState: T
): [T, (updater: SetStateAction<T>) => void, boolean] {
  const [state, setState] = useState<T>(initialState);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    const stored = loadState<T>(key);
    if (stored !== undefined) {
      setState(stored);
    }
    setIsLoaded(true);
  }, [key]);

  const setPersistedState = useCallback(
    (updater: SetStateAction<T>) => {
      setState((prev) => {
        const newState =
          typeof updater === "function"
            ? (updater as (prev: T) => T)(prev)
            : updater;
        saveState(key, newState);
        return newState;
      });
    },
    [key]
  );

  return [state, setPersistedState, isLoaded];
}

export default usePersistedState;
