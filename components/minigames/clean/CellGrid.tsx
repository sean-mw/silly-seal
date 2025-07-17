import { GAME_CONFIG } from "@/lib/minigames/clean/config";
import { CleanGameEngine } from "@/lib/minigames/clean/engine";
import CellButton from "./CellButton";
import { Cell, CleanGameState } from "@/types/minigames/clean";
import { GameReward } from "@/types/minigames/common";
import { useEffect, useState } from "react";
import GuessFeedback from "../../ResultFeedback";

interface CellGridProps {
  gameState: CleanGameState;
  updateGameState: (
    update: (prev: CleanGameState | undefined) => CleanGameState | undefined
  ) => void;
  endGame: (reward: GameReward) => void;
}

function CellGrid({ gameState, updateGameState, endGame }: CellGridProps) {
  const [showRocks, setShowRocks] = useState(false);
  const [gameResult, setGameResult] = useState<
    "correct" | "incorrect" | undefined
  >(undefined);
  const [shakeAnimation, setShakeAnimation] = useState(false);

  useEffect(() => {
    if (!showRocks) return;
    setShakeAnimation(true);
    setTimeout(() => setShakeAnimation(false), 1000);
  }, [showRocks]);

  const checkVictory = (grid: Cell[][]) => {
    if (!CleanGameEngine.isCleared(grid)) return;
    setGameResult("correct");
    setTimeout(() => {
      endGame({
        stat: "cleanliness",
        value: GAME_CONFIG.STAT_REWARD,
      });
      setGameResult(undefined);
    }, 1500);
  };

  const handleLeftClick = (x: number, y: number) => {
    if (gameState.isGameOver || gameResult) return;
    const newGrid = gameState.grid.map((row) =>
      row.map((cell) => ({ ...cell }))
    );
    const cell = newGrid[y][x];
    if (cell.revealed || cell.flagged) return;
    if (cell.hasRock) {
      setShowRocks(true);
      setGameResult("incorrect");
      setTimeout(() => {
        endGame({
          stat: "cleanliness",
          value: 0,
        });
        setShowRocks(false);
        setGameResult(undefined);
      }, 1500);
    } else {
      CleanGameEngine.revealEmptyCells(newGrid, x, y);
    }

    updateGameState((prev) => ({ ...prev!, grid: newGrid }));
    checkVictory(newGrid);
  };

  const handleRightClick = (
    e: React.MouseEvent | React.TouchEvent,
    x: number,
    y: number
  ) => {
    e.preventDefault();
    if (gameState.isGameOver) return;
    const newGrid = gameState.grid.map((row) =>
      row.map((cell) => ({ ...cell }))
    );
    const cell = newGrid[y][x];
    if (cell.revealed) return;
    cell.flagged = !cell.flagged;
    updateGameState((prev) => ({ ...prev!, grid: newGrid }));
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
