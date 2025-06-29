"use client";

import { useCallback, useEffect } from "react";
import { useSeal } from "@/hooks/useSeal";
import { GameState } from "@/types/minigames/common";
import usePersistedState from "./usePersistedState";

export function useMiniGame<T extends GameState>(initialState: T) {
  const [gameState, setGameState] = usePersistedState<T>(
    `${initialState.rewardStat}-minigame`,
    initialState
  );
  const { sealState, setSealState } = useSeal();

  const endGame = useCallback(
    (rewardValue: number) => {
      setGameState((prevGameState) => ({
        ...prevGameState,
        isGameOver: true,
        rewardValue,
        lastPlayedAt: Date.now(),
      }));
      setSealState({
        ...sealState,
        [gameState.rewardStat]: sealState[gameState.rewardStat] + rewardValue,
      });
    },
    [gameState.rewardStat, sealState, setGameState, setSealState]
  );

  const resetGame = useCallback(
    (newInitialState: T) => {
      setGameState(newInitialState);
    },
    [setGameState]
  );

  useEffect(() => {
    if (!gameState.isGameOver) return;

    const lastPlayed = gameState.lastPlayedAt ?? 0;
    const lastPlayedDate = new Date(lastPlayed);
    const nowDate = new Date();

    const playedToday =
      lastPlayedDate.getFullYear() === nowDate.getFullYear() &&
      lastPlayedDate.getMonth() === nowDate.getMonth() &&
      lastPlayedDate.getDate() === nowDate.getDate();

    if (!playedToday) {
      resetGame(initialState);
    }
  }, [gameState.lastPlayedAt, gameState.isGameOver, initialState, resetGame]);

  return {
    gameState,
    setGameState,
    endGame,
    resetGame,
  };
}
