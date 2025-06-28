import { GAME_CONFIG } from "@/lib/minigames/clean/config";
import { CleanGameEngine } from "@/lib/minigames/clean/engine";
import CellButton from "./CellButton";
import { Cell, CleanGameState } from "@/types/minigames/clean";
import { GameResult } from "@/types/minigames/common";

interface CellGridProps {
  gameState: CleanGameState;
  updateGameState: (update: (prev: CleanGameState) => CleanGameState) => void;
  endGame: (result: GameResult) => void;
}

function CellGrid({ gameState, updateGameState, endGame }: CellGridProps) {
  const checkVictory = (grid: Cell[][]) => {
    if (!CleanGameEngine.isCleared(grid)) return;
    endGame({
      statRewards: { hygiene: GAME_CONFIG.WIN_SCORE },
      score: GAME_CONFIG.WIN_SCORE,
    });
  };

  const handleLeftClick = (x: number, y: number) => {
    if (gameState.isGameOver || gameState.isVictory) return;
    const newGrid = gameState.grid.map((row) =>
      row.map((cell) => ({ ...cell }))
    );
    const cell = newGrid[y][x];
    if (cell.revealed || cell.flagged) return;
    if (cell.hasRock) {
      endGame({
        statRewards: { hygiene: gameState.score },
        score: gameState.score,
      });
    } else {
      CleanGameEngine.revealEmptyCells(newGrid, x, y);
    }

    updateGameState((prev) => ({ ...prev, grid: newGrid }));
    checkVictory(newGrid);
  };

  const handleRightClick = (
    e: React.MouseEvent | React.TouchEvent,
    x: number,
    y: number
  ) => {
    e.preventDefault();
    if (gameState.isGameOver || gameState.isVictory) return;
    const newGrid = gameState.grid.map((row) =>
      row.map((cell) => ({ ...cell }))
    );
    const cell = newGrid[y][x];
    if (cell.revealed) return;
    cell.flagged = !cell.flagged;
    updateGameState((prev) => ({ ...prev, grid: newGrid }));
  };

  return (
    <div
      className="grid border-3 rounded"
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
            gameOver={gameState.isGameOver}
            onLeftClick={() => handleLeftClick(x, y)}
            onRightClick={(e) => handleRightClick(e, x, y)}
          />
        ))
      )}
    </div>
  );
}

export default CellGrid;
