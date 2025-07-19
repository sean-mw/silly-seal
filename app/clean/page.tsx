"use client";

import CellGrid from "@/components/minigames/clean/CellGrid";
import MiniGame from "@/components/minigames/MiniGame";
import GuessFeedback from "@/components/ResultFeedback";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { CleanGameEngine } from "@/lib/minigames/clean/engine";
import {
  endGame,
  flagCell,
  markRewardApplied,
  resetGame,
  revealCell,
} from "@/store/cleanGameSlice";
import { GameFeedback } from "@/types/minigames/common";
import { useCallback, useEffect, useState } from "react";

function CleanGame() {
  const dispatch = useAppDispatch();
  const gameState = useAppSelector((state) => state.cleanGame);
  const [gameResult, setGameResult] = useState<GameFeedback>("pending");
  const [showRocks, setShowRocks] = useState(false);
  const [showShakeAnimation, setShowShakeAnimation] = useState(false);

  const triggerEndGame = useCallback(
    (result: GameFeedback) => {
      setGameResult(result);
      if (result === "incorrect") {
        setShowRocks(true);
        setShowShakeAnimation(true);
      }
      setTimeout(() => {
        setGameResult("pending");
        setShowRocks(false);
        setShowShakeAnimation(false);
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
    if (gameState.grid[y][x].hasRock) {
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
        allowRestart: true,
      }}
      gameState={gameState}
      onReset={() => dispatch(resetGame())}
      onReward={() => dispatch(markRewardApplied())}
    >
      <div className="flex flex-col h-full items-center justify-center gap-4">
        <GuessFeedback result={gameResult} />
        <CellGrid
          grid={gameState.grid}
          showShakeAnimation={showShakeAnimation}
          showRocks={showRocks}
          handleLeftClick={handleLeftClick}
          handleRightClick={handleRightClick}
        />
      </div>
    </MiniGame>
  );
}

export default CleanGame;
