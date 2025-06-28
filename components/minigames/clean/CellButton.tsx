import { GAME_CONFIG } from "@/lib/minigames/clean/config";
import { Cell } from "@/types/minigames/clean";
import Image from "next/image";
import { useRef } from "react";

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
  const touchHandled = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchHandled.current = true;
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
    setTimeout(() => {
      touchHandled.current = false;
    }, 100);
  };

  const handleClick = () => {
    if (!touchHandled.current) {
      onLeftClick();
    }
  };

  return (
    <button
      className={`${GAME_CONFIG.CELL_SIZE} bg-cover relative select-none touch-none`}
      style={{ backgroundImage: background, imageRendering: "pixelated" }}
      onClick={handleClick}
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
          className="w-full h-full pointer-events-none"
          draggable={false}
        />
      )}
      {gameOver && cell.hasRock && (
        <Image
          src="/rock.png"
          alt="Rock"
          width={16}
          height={16}
          className="w-full h-full pointer-events-none"
          draggable={false}
        />
      )}
    </button>
  );
}

export default CellButton;
