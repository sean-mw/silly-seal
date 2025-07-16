import { GAME_CONFIG } from "@/lib/minigames/clean/config";
import { CleanGameEngine } from "@/lib/minigames/clean/engine";
import CellButton from "./CellButton";
import { Cell, CleanGameState } from "@/types/minigames/clean";
import { GameReward } from "@/types/minigames/common";

interface CellGridProps {
  gameState: CleanGameState;
  updateGameState: (
    update: (prev: CleanGameState | undefined) => CleanGameState | undefined
  ) => void;
  endGame: (reward: GameReward) => void;
}

function CellGrid({ gameState, updateGameState, endGame }: CellGridProps) {
  const checkVictory = (grid: Cell[][]) => {
    if (!CleanGameEngine.isCleared(grid)) return;
    endGame({
      stat: "cleanliness",
      value: GAME_CONFIG.STAT_REWARD,
    });
  };

  const handleLeftClick = (x: number, y: number) => {
    if (gameState.isGameOver) return;
    const newGrid = gameState.grid.map((row) =>
      row.map((cell) => ({ ...cell }))
    );
    const cell = newGrid[y][x];
    if (cell.revealed || cell.flagged) return;
    if (cell.hasRock) {
      endGame({
        stat: "cleanliness",
        value: 0,
      });
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
