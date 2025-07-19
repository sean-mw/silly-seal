import CellButton from "./CellButton";
import { GAME_CONFIG } from "@/lib/minigames/clean/config";
import { Cell } from "@/types/minigames/clean";

interface CellGridProps {
  grid: Cell[][];
  showShakeAnimation: boolean;
  showRocks: boolean;
  handleLeftClick: (x: number, y: number) => void;
  handleRightClick: (x: number, y: number) => void;
}

function CellGrid({
  grid,
  showShakeAnimation,
  showRocks,
  handleLeftClick,
  handleRightClick,
}: CellGridProps) {
  return (
    <div
      className={`grid border-3 rounded ${
        showShakeAnimation && "animate-shake"
      }`}
      style={{
        gridTemplateColumns: `repeat(${GAME_CONFIG.GRID_SIZE}, min(10vw, 10vh, 64px))`,
        gridTemplateRows: `repeat(${GAME_CONFIG.GRID_SIZE}, min(10vw, 10vh, 64px))`,
      }}
    >
      {grid.map((row, y) =>
        row.map((cell, x) => (
          <CellButton
            key={`${x}-${y}`}
            cell={cell}
            showRock={showRocks}
            onLeftClick={() => handleLeftClick(x, y)}
            onRightClick={(e) => {
              e.preventDefault();
              handleRightClick(x, y);
            }}
          />
        ))
      )}
    </div>
  );
}

export default CellGrid;
