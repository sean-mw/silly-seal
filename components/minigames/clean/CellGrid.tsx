"use client";

import { useState, useEffect } from "react";
import { useAppDispatch } from "@/lib/hooks";
import { revealCell, flagCell } from "@/store/cleanGameSlice";
import GuessFeedback from "../../ResultFeedback";
import CellButton from "./CellButton";
import { GAME_CONFIG } from "@/lib/minigames/clean/config";
import { CleanGameState } from "@/types/minigames/clean";

interface CellGridProps {
  gameState: CleanGameState;
}

function CellGrid({ gameState }: CellGridProps) {
  const dispatch = useAppDispatch();
  const [showRocks, setShowRocks] = useState(false);
  const [gameResult, setGameResult] = useState<
    "correct" | "incorrect" | undefined
  >(undefined);
  const [shakeAnimation, setShakeAnimation] = useState(false);

  useEffect(() => {
    if (gameState.isGameOver) {
      if (gameState.reward > 0) {
        setGameResult("correct");
      } else {
        setGameResult("incorrect");
        setShakeAnimation(true);
        setShowRocks(true);
      }

      const timeout = setTimeout(() => {
        setGameResult(undefined);
        setShakeAnimation(false);
        setShowRocks(false);
      }, 1500);

      return () => clearTimeout(timeout);
    }
  }, [gameState.isGameOver, gameState.reward]);

  const handleLeftClick = (x: number, y: number) => {
    dispatch(revealCell({ x, y }));
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
