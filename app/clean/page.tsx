"use client";

import { useEffect, useState } from "react";
import Button from "@/components/Button";
import {
  Cell,
  GRID_SIZE,
  initializeGrid,
  revealEmptyCells,
} from "@/lib/minesweeper";
import CellButton from "@/components/CellButton";

export default function Clean() {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);

  useEffect(() => {
    setGrid(initializeGrid());
    setGameOver(false);
    setVictory(false);
  }, []);

  const handleLeftClick = (x: number, y: number) => {
    if (gameOver || victory) return;
    const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));
    const cell = newGrid[y][x];
    if (cell.revealed || cell.flagged) return;
    if (cell.hasRock) {
      setGameOver(true);
    } else {
      revealEmptyCells(newGrid, x, y);
    }
    setGrid(newGrid);
    checkVictory(newGrid);
  };

  const handleRightClick = (e: React.MouseEvent, x: number, y: number) => {
    e.preventDefault();
    if (gameOver || victory) return;
    const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));
    const cell = newGrid[y][x];
    if (cell.revealed) return;
    cell.flagged = !cell.flagged;
    setGrid(newGrid);
  };

  const checkVictory = (grid: Cell[][]) => {
    const cleared = grid.every((row) =>
      row.every(
        (cell) =>
          (cell.hasRock && !cell.revealed) || (!cell.hasRock && cell.revealed)
      )
    );
    if (cleared) {
      setVictory(true);
    }
  };

  const resetGame = () => {
    setGrid(initializeGrid());
    setGameOver(false);
    setVictory(false);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">Clean the Seal Enclosure.</h1>
      <p className="text-lg">
        Left-click to clean water tiles. Right-click to flag tiles with
        suspected rocks. Don&apos;t click on the rocks or you&apos;ll break the
        cleaning machine!
      </p>
      <div
        className="grid border-3 rounded"
        style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 2rem)` }}
      >
        {grid.map((row, y) =>
          row.map((cell, x) => (
            <CellButton
              key={`${x}-${y}`}
              cell={cell}
              gameOver={gameOver}
              onLeftClick={() => handleLeftClick(x, y)}
              onRightClick={(e) => handleRightClick(e, x, y)}
            />
          ))
        )}
      </div>
      {(gameOver || victory) && (
        <div className="text-lg font-semibold text-center">
          {victory
            ? "✅ Cleanup complete!"
            : "❌ You broke the cleaning machine!"}
        </div>
      )}
      <Button onClick={resetGame}>Restart</Button>
    </div>
  );
}
