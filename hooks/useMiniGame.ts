import { useState, useCallback } from "react";
import { SealState, useSeal } from "@/hooks/useSeal";
import { GameState } from "@/types/minigames/common";

export function useMiniGame<T extends GameState>(
  initialState: T,
  relatedStat: keyof SealState
) {
  const [gameState, setGameState] = useState<T>(initialState);
  const { seal, setSeal } = useSeal();

  const updateGameState = useCallback((updater: (prev: T) => T) => {
    setGameState(updater);
  }, []);

  const endGame = useCallback(
    (statReward: number) => {
      setGameState((prev) => ({
        ...prev,
        isGameOver: true,
        lastPlayedAt: Date.now(),
      }));

      setSeal({
        ...seal,
        [relatedStat]: seal[relatedStat] + statReward,
      });
    },
    [relatedStat, seal, setSeal]
  );

  const resetGame = useCallback((newInitialState: T) => {
    setGameState(newInitialState);
  }, []);

  return {
    gameState,
    updateGameState,
    endGame,
    resetGame,
  };
}
