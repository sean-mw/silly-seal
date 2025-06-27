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
import { MAX_STAT_VALUE, useSeal } from "@/hooks/useSeal";

export default function Clean() {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);
  const { seal, setSeal } = useSeal();

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

  const handleRightClick = (
    e: React.MouseEvent | React.TouchEvent,
    x: number,
    y: number
  ) => {
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
      setSeal({
        ...seal,
        hygiene: seal.hygiene + MAX_STAT_VALUE / 3,
      });
    }
  };

  const resetGame = () => {
    setGrid(initializeGrid());
    setGameOver(false);
    setVictory(false);
  };

  return (
    <div className="flex flex-col h-full items-center justify-center gap-4">
      <div
        className="grid border-3 rounded"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, min(10vw, 10vh, 64px))`,
          gridTemplateRows: `repeat(${GRID_SIZE}, min(10vw, 10vh, 64px))`,
        }}
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
          {victory ? "Cleanup complete!" : "You broke the cleaning machine!"}
        </div>
      )}
      <Button onClick={resetGame}>Restart</Button>
    </div>
  );
}
