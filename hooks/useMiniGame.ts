"use client";

import { useCallback } from "react";
import { SealState, useSeal } from "@/hooks/useSeal";
import { GameState } from "@/types/minigames/common";
import usePersistedState from "./usePersistedState";

export function useMiniGame<T extends GameState>(
  initialState: T,
  relatedStat: keyof SealState
) {
  const [gameState, setGameState] = usePersistedState<T>(
    `${relatedStat}-minigame`,
    initialState
  );
  const { sealState, setSealState } = useSeal();

  const endGame = useCallback(
    (statReward: number) => {
      setGameState((prevGameState) => ({
        ...prevGameState,
        isGameOver: true,
        lastPlayedAt: Date.now(),
      }));
      setSealState({
        ...sealState,
        [relatedStat]: sealState[relatedStat] + statReward,
      });
    },
    [relatedStat, sealState, setGameState, setSealState]
  );

  const resetGame = useCallback(
    (newInitialState: T) => {
      setGameState(newInitialState);
    },
    [setGameState]
  );

  return {
    gameState,
    setGameState,
    endGame,
    resetGame,
  };
}
