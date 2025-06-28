import { useState, useCallback } from "react";
import { useSeal, MAX_STAT_VALUE, SealState } from "@/hooks/useSeal";
import { GameResult, GameState } from "@/types/minigames/common";

export function useMiniGame<T extends GameState>(initialState: T) {
  const [gameState, setGameState] = useState<T>(initialState);
  const { seal, setSeal } = useSeal();

  const updateGameState = useCallback((updater: (prev: T) => T) => {
    setGameState(updater);
  }, []);

  const endGame = useCallback(
    (result: GameResult) => {
      setGameState((prev) => ({
        ...prev,
        isGameOver: true,
        score: result.score,
      }));

      const updatedSeal = { ...seal };
      Object.entries(result.statRewards).forEach(([stat, reward]) => {
        if (!(stat in seal) || !reward) return;

        const currentValue = seal[stat as keyof SealState] as number;
        updatedSeal[stat as keyof SealState] = Math.min(
          MAX_STAT_VALUE,
          currentValue + reward
        );
      });

      setSeal(updatedSeal);
    },
    [seal, setSeal]
  );

  const resetGame = useCallback((newInitialState: T) => {
    setGameState(newInitialState);
  }, []);

  return {
    gameState,
    updateGameState,
    endGame,
    resetGame,
    seal,
  };
}
