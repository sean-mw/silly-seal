"use client";

import { useCallback, useEffect } from "react";
import { useSeal } from "@/hooks/useSeal";
import { GameReward, GameState } from "@/types/minigames/common";
import usePersistedState from "./usePersistedState";

export function useMiniGame<T extends GameState>(
  name: string,
  generateInitialGameState: () => Promise<T>
) {
  const [gameState, setGameState, isGameStateLoaded] = usePersistedState<
    T | undefined
  >(`${name}-minigame`, undefined);
  const { sealState, setSealState } = useSeal();

  const initializeGameState = useCallback(async () => {
    const state = await generateInitialGameState();
    setGameState(state);
  }, [generateInitialGameState, setGameState]);

  useEffect(() => {
    if (isGameStateLoaded && gameState === undefined) {
      initializeGameState();
    }
  }, [gameState, initializeGameState, isGameStateLoaded]);

  const endGame = useCallback(
    (reward: GameReward) => {
      if (gameState === undefined) return;
      setGameState({
        ...gameState,
        isGameOver: true,
        reward: {
          ...reward,
          prevValue: sealState[reward.stat],
        },
      });
      setSealState({
        ...sealState,
        [reward.stat]: sealState[reward.stat] + reward.value,
      });
    },
    [gameState, sealState, setGameState, setSealState]
  );

  const resetGame = useCallback(async () => {
    const newInitialGameState = await generateInitialGameState();
    setGameState(newInitialGameState);
  }, [generateInitialGameState, setGameState]);

  useEffect(() => {
    if (gameState === undefined || !gameState.isGameOver) return;

    const createdAt = gameState.createdAt ?? 0;
    const createdAtDate = new Date(createdAt);
    const nowDate = new Date();

    const createdToday =
      createdAtDate.getFullYear() === nowDate.getFullYear() &&
      createdAtDate.getMonth() === nowDate.getMonth() &&
      createdAtDate.getDate() === nowDate.getDate();

    if (!createdToday) {
      resetGame();
    }
  }, [gameState, resetGame]);

  return {
    gameState,
    setGameState,
    endGame,
    resetGame,
  };
}
