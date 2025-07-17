import { FEEDBACK_COLORS, GAME_CONFIG } from "@/lib/minigames/feed/config";
import { FeedbackType } from "@/types/minigames/feed";
import Image from "next/image";

interface GameCellProps {
  fish?: string;
  feedback?: FeedbackType;
  size?: string;
  animate: boolean;
}

function GameCell({
  fish,
  feedback,
  size = GAME_CONFIG.CELL_SIZE,
  animate,
}: GameCellProps) {
  const colorClass = feedback
    ? FEEDBACK_COLORS[feedback]
    : FEEDBACK_COLORS.empty;

  return (
    <div
      className={`
        ${size} 
        ${GAME_CONFIG.BUTTON_STYLE}
        ${colorClass}
        ${animate ? "animate-bounce" : ""}
      `}
      style={{ imageRendering: "pixelated" }}
    >
      {fish && (
        <Image
          src={`/${fish}.png`}
          alt={fish}
          width={48}
          height={48}
          className="w-3/4 h-3/4"
        />
      )}
    </div>
  );
}

export default GameCell;
