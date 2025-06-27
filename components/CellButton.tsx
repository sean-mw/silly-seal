import { Cell } from "@/lib/minesweeper";
import Image from "next/image";
import { useRef } from "react";

const CELL_SIZE = "w-[min(10vw,10vh,64px)] h-[min(10vw,10vh,64px)]";

function CellButton({
  cell,
  onLeftClick,
  onRightClick,
  gameOver,
}: {
  cell: Cell;
  onLeftClick: () => void;
  onRightClick: (e: React.MouseEvent | React.TouchEvent) => void;
  gameOver: boolean;
}) {
  const background = cell.revealed ? `url('/clean.png')` : `url('/dirty.png')`;
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const longPressed = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    longPressed.current = false;
    longPressTimer.current = setTimeout(() => {
      longPressed.current = true;
      onRightClick(e);
    }, 500);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    if (!longPressed.current) {
      onLeftClick();
    }
  };

  return (
    <button
      className={`${CELL_SIZE} bg-cover relative select-none touch-none`}
      style={{ backgroundImage: background, imageRendering: "pixelated" }}
      onClick={onLeftClick}
      onContextMenu={onRightClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {cell.revealed && !cell.hasRock && cell.adjacentRocks > 0 && (
        <span className="text-lg font-bold text-black">
          {cell.adjacentRocks}
        </span>
      )}
      {cell.flagged && !gameOver && !cell.revealed && (
        <Image
          src="/flag.png"
          alt="Flag"
          width={16}
          height={16}
          className="w-full h-full"
          draggable={false}
        />
      )}
      {gameOver && cell.hasRock && (
        <Image
          src="/rock.png"
          alt="Rock"
          width={16}
          height={16}
          className="w-full h-full"
          draggable={false}
        />
      )}
    </button>
  );
}

export default CellButton;
