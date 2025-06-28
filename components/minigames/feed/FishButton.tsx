import { FEEDBACK_COLORS, GAME_CONFIG } from "@/lib/minigames/feed/config";
import Image from "next/image";

interface FishButtonProps {
  fish: string;
  onClick: () => void;
  disabled?: boolean;
  colorClass?: string;
}

function FishButton({
  fish,
  onClick,
  disabled,
  colorClass = FEEDBACK_COLORS.empty,
}: FishButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${GAME_CONFIG.CELL_SIZE} ${GAME_CONFIG.BUTTON_STYLE} select-none ${colorClass}`}
      style={{ imageRendering: "pixelated" }}
    >
      <Image
        src={`/${fish}.png`}
        alt={fish}
        width={48}
        height={48}
        draggable={false}
        className="w-3/4 h-3/4"
      />
    </button>
  );
}

export default FishButton;
