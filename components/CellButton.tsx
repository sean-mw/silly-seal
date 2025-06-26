import { Cell } from "@/lib/minesweeper";
import Image from "next/image";

function CellButton({
  cell,
  onLeftClick,
  onRightClick,
  gameOver,
}: {
  cell: Cell;
  onLeftClick: () => void;
  onRightClick: (e: React.MouseEvent) => void;
  gameOver: boolean;
}) {
  const background = cell.revealed ? `url('/clean.png')` : `url('/dirty.png')`;

  return (
    <button
      className="w-8 h-8 bg-cover relative select-none"
      style={{ backgroundImage: background, imageRendering: "pixelated" }}
      onClick={onLeftClick}
      onContextMenu={onRightClick}
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
          width={8}
          height={8}
          className="w-full h-full"
          draggable={false}
        />
      )}
      {gameOver && cell.hasRock && (
        <Image
          src="/rock.png"
          alt="Rock"
          width={8}
          height={8}
          className="w-full h-full"
          draggable={false}
        />
      )}
    </button>
  );
}

export default CellButton;
