import { GuessWithFeedback } from "@/types/minigames/feed";
import GameCell from "./GameCell";
import { GAME_CONFIG } from "@/lib/minigames/feed/config";

interface GameGridProps {
  guesses: GuessWithFeedback[];
  currentGuess: string[];
  isGameOver: boolean;
}

function GameGrid({ guesses, currentGuess, isGameOver }: GameGridProps) {
  return (
    <div className="flex flex-col gap-1">
      {Array.from({ length: GAME_CONFIG.MAX_ATTEMPTS }).map((_, rowIdx) => {
        const isCurrent = rowIdx === guesses.length && !isGameOver;
        const guessRow = guesses[rowIdx]?.guess ?? [];
        const feedbackRow = guesses[rowIdx]?.feedback ?? [];

        return (
          <div key={rowIdx} className="flex gap-1">
            {Array.from({ length: GAME_CONFIG.SEQUENCE_LENGTH }).map(
              (_, colIdx) => {
                const fish = isCurrent
                  ? currentGuess[colIdx]
                  : guessRow[colIdx];
                const feedback = isCurrent ? undefined : feedbackRow[colIdx];

                return (
                  <GameCell key={colIdx} fish={fish} feedback={feedback} />
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
