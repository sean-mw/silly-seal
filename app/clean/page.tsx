"use client";

import CellGrid from "@/components/minigames/clean/CellGrid";
import CleanModal from "@/components/minigames/clean/CleanModal";
import MiniGame from "@/components/MiniGame";
import GuessFeedback from "@/components/ResultFeedback";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { CleanGameEngine } from "@/lib/minigames/clean/engine";
import {
  endGame,
  flagCell,
  markRewardApplied,
  resetGame,
  revealCell,
  hitRock,
  revealAllCells,
} from "@/store/cleanGameSlice";
import { GameFeedback } from "@/types/minigames/common";
import { useCallback, useEffect, useState } from "react";

function CleanGame() {
  const dispatch = useAppDispatch();
  const gameState = useAppSelector((state) => state.cleanGame);
  const [gameResult, setGameResult] = useState<GameFeedback>("pending");
  const [showShakeAnimation, setShowShakeAnimation] = useState(false);

  const triggerShake = useCallback(() => {
    setShowShakeAnimation(true);
    setTimeout(() => {
      setShowShakeAnimation(false);
    }, 500);
  }, []);

  const triggerEndGame = useCallback(
    (result: GameFeedback) => {
      setGameResult(result);
      dispatch(revealAllCells());
      setTimeout(() => {
        setGameResult("pending");
        dispatch(endGame(result));
      }, 1500);
    },
    [dispatch]
  );

  useEffect(() => {
    if (gameState.isGameOver || gameResult !== "pending") return;
    if (CleanGameEngine.isCleared(gameState.grid)) {
      triggerEndGame("correct");
    }
  }, [gameResult, gameState.grid, gameState.isGameOver, triggerEndGame]);

  const handleLeftClick = (x: number, y: number) => {
    const cell = gameState.grid[y][x];
    if (cell.hasRock && !cell.flagged && !cell.revealed) {
      triggerShake();
      dispatch(hitRock({ x, y }));
      if (gameState.lives > 1) return;
      triggerEndGame("incorrect");
    } else {
      dispatch(revealCell({ x, y }));
    }
  };

  const handleRightClick = (x: number, y: number) => {
    dispatch(flagCell({ x, y }));
  };

  return (
    <MiniGame
      config={{
        name: "Clean the Seal",
        stat: "cleanliness",
        description: "Clean the seal enclosure while avoiding rocks!",
      }}
      gameState={gameState}
      onReset={() => dispatch(resetGame())}
      onReward={() => dispatch(markRewardApplied())}
      Modal={CleanModal}
    >
      <div className="flex flex-col h-full items-center justify-center gap-4">
        <GuessFeedback result={gameResult} />
        <CellGrid
          grid={gameState.grid}
          showShakeAnimation={showShakeAnimation}
          handleLeftClick={handleLeftClick}
          handleRightClick={handleRightClick}
        />
      </div>
    </MiniGame>
  );
}

export default CleanGame;
