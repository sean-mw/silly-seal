import { GAME_CONFIG } from "@/lib/minigames/feed/config";
import FishButton from "./FishButton";
import ActionButton from "./ActionButton";
import { Delete } from "lucide-react";

interface GameControlsProps {
  onAddFish: (fish: string) => void;
  onSubmitGuess: () => void;
  onRemoveFish: () => void;
  isGameOver: boolean;
  currentGuessLength: number;
  keyboardColors: Record<string, string>;
}

function GameControls({
  onAddFish,
  onSubmitGuess,
  onRemoveFish,
  isGameOver,
  currentGuessLength,
  keyboardColors,
}: GameControlsProps) {
  const canSubmit =
    currentGuessLength === GAME_CONFIG.SEQUENCE_LENGTH && !isGameOver;
  const canDelete = currentGuessLength > 0 && !isGameOver;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-2">
        {GAME_CONFIG.FISH_TYPES.map((fish) => (
          <FishButton
            key={fish}
            fish={fish}
            onClick={() => onAddFish(fish)}
            disabled={isGameOver}
            colorClass={keyboardColors[fish]}
          />
        ))}
      </div>

      <div className="flex gap-2">
        <ActionButton onClick={onSubmitGuess} disabled={!canSubmit}>
          <span className="font-bold text-sm">FEED</span>
        </ActionButton>
        <ActionButton onClick={onRemoveFish} disabled={!canDelete}>
          <Delete className="w-3/4 h-3/4" />
        </ActionButton>
      </div>
    </div>
  );
}

export default GameControls;
