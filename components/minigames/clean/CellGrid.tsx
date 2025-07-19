"use client";

import { useState, useEffect, useCallback } from "react";
import { useAppDispatch } from "@/lib/hooks";
import { revealCell, flagCell, endGame } from "@/store/cleanGameSlice";
import GuessFeedback from "../../ResultFeedback";
import CellButton from "./CellButton";
import { GAME_CONFIG } from "@/lib/minigames/clean/config";
import { CleanGameState } from "@/types/minigames/clean";
import { CleanGameEngine } from "@/lib/minigames/clean/engine";
import { GameFeedback } from "@/types/minigames/common";

interface CellGridProps {
  gameState: CleanGameState;
}

function CellGrid({ gameState }: CellGridProps) {
  const dispatch = useAppDispatch();
  const [showRocks, setShowRocks] = useState(false);
  const [gameResult, setGameResult] = useState<GameFeedback>("pending");
  const [shakeAnimation, setShakeAnimation] = useState(false);

  const triggerEndGame = useCallback(
    (result: GameFeedback) => {
      setGameResult(result);
      if (result === "incorrect") {
        setShakeAnimation(true);
        setShowRocks(true);
      }
      setTimeout(() => {
        dispatch(endGame("correct"));
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

  const handleRightClick = (
    e: React.MouseEvent | React.TouchEvent,
    x: number,
    y: number
  ) => {
    e.preventDefault();
    dispatch(flagCell({ x, y }));
  };

  return (
    <>
      <GuessFeedback result={gameResult} />
      <div
        className={`grid border-3 rounded ${shakeAnimation && "animate-shake"}`}
        style={{
          gridTemplateColumns: `repeat(${GAME_CONFIG.GRID_SIZE}, min(10vw, 10vh, 64px))`,
          gridTemplateRows: `repeat(${GAME_CONFIG.GRID_SIZE}, min(10vw, 10vh, 64px))`,
        }}
      >
        {gameState.grid.map((row, y) =>
          row.map((cell, x) => (
            <CellButton
              key={`${x}-${y}`}
              cell={cell}
              showRock={showRocks}
              onLeftClick={() => handleLeftClick(x, y)}
              onRightClick={(e) => handleRightClick(e, x, y)}
            />
          ))
        )}
      </div>
    </>
  );
}

export default CellGrid;
