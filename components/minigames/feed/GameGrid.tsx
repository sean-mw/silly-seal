import { FeedbackType, GuessWithFeedback } from "@/types/minigames/feed";
import GameCell from "./GameCell";
import { GAME_CONFIG } from "@/lib/minigames/feed/config";

interface GameGridProps {
  guesses: GuessWithFeedback[];
  currentGuess: string[];
  isGameOver: boolean;
  animatingRow: number | undefined;
  revealIndex: number;
  animateFinalRow: boolean;
}

function GameGrid({
  guesses,
  currentGuess,
  isGameOver,
  animatingRow,
  revealIndex,
  animateFinalRow,
}: GameGridProps) {
  return (
    <div className="flex flex-col gap-1">
      {Array.from({ length: GAME_CONFIG.MAX_ATTEMPTS }).map((_, rowIdx) => {
        const isCurrent = rowIdx === guesses.length && !isGameOver;
        const guessRow = guesses[rowIdx]?.guess ?? [];
        const feedbackRow = guesses[rowIdx]?.feedback ?? [];
        const isFinalRow = rowIdx == guesses.length - 1;

        return (
          <div
            key={rowIdx}
            className={`flex gap-1 ${
              isFinalRow && animateFinalRow && "animate-bounce"
            }`}
          >
            {Array.from({ length: GAME_CONFIG.SEQUENCE_LENGTH }).map(
              (_, colIdx) => {
                const fish = isCurrent
                  ? currentGuess[colIdx]
                  : guessRow[colIdx];
                let feedback: FeedbackType | undefined;
                if (!isCurrent) {
                  if (animatingRow === rowIdx) {
                    feedback =
                      colIdx <= revealIndex ? feedbackRow[colIdx] : undefined;
                  } else {
                    feedback = feedbackRow[colIdx];
                  }
                }

                return (
                  <GameCell
                    key={colIdx}
                    fish={fish}
                    feedback={feedback}
                    animate={animatingRow === rowIdx && colIdx === revealIndex}
                  />
                );
              }
            )}
          </div>
        );
      })}
    </div>
  );
}

export default GameGrid;
