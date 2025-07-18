"use client";

import { useCallback, useEffect } from "react";
import { GameReward, GameState } from "@/types/minigames/common";
import usePersistedState from "./usePersistedState";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { applyReward } from "@/store/sealSlice";

export function useMiniGame<T extends GameState>(
  name: string,
  generateInitialGameState: () => Promise<T>
) {
  const [gameState, setGameState, isGameStateLoaded] = usePersistedState<
    T | undefined
  >(`${name}-minigame`, undefined);
  const sealState = useAppSelector((state) => state.seal);
  const dispatch = useAppDispatch();

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
      dispatch(applyReward(reward));
    },
    [dispatch, gameState, sealState, setGameState]
  );

  const resetGame = useCallback(async () => {
    const newInitialGameState = await generateInitialGameState();
    setGameState(newInitialGameState);
  }, [generateInitialGameState, setGameState]);

  useEffect(() => {
    if (gameState === undefined) return;

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
