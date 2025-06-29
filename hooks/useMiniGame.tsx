"use client";

import { useCallback, useEffect } from "react";
import { useSeal } from "@/hooks/useSeal";
import { GameReward, GameState } from "@/types/minigames/common";
import usePersistedState from "./usePersistedState";

export function useMiniGame<T extends GameState>(initialState: T) {
  const [gameState, setGameState] = usePersistedState<T>(
    `${initialState.rewardStat}-minigame`,
    initialState
  );
  const { sealState, setSealState } = useSeal();

  const endGame = useCallback(
    (reward: GameReward) => {
      setGameState((prevGameState) => ({
        ...prevGameState,
        isGameOver: true,
        reward: {
          ...reward,
          prevValue: sealState[reward.stat],
        },
        lastPlayedAt: Date.now(),
      }));
      setSealState({
        ...sealState,
        [reward.stat]: sealState[reward.stat] + reward.value,
      });
    },
    [sealState, setGameState, setSealState]
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
