import { FeedbackType, GuessWithFeedback } from "@/types/minigames/feed";
import { FEEDBACK_COLORS, GAME_CONFIG } from "./config";

export class FeedGameEngine {
  static generateRandomSequence(): string[] {
    return Array.from(
      { length: GAME_CONFIG.SEQUENCE_LENGTH },
      () =>
        GAME_CONFIG.FISH_TYPES[
          Math.floor(Math.random() * GAME_CONFIG.FISH_TYPES.length)
        ]
    );
  }

  static calculateFeedback(secret: string[], guess: string[]): FeedbackType[] {
    const feedback = Array<FeedbackType>(GAME_CONFIG.SEQUENCE_LENGTH).fill(
      "wrong"
    );
    const usedSecret = Array(GAME_CONFIG.SEQUENCE_LENGTH).fill(false);
    const usedGuess = Array(GAME_CONFIG.SEQUENCE_LENGTH).fill(false);

    for (let i = 0; i < GAME_CONFIG.SEQUENCE_LENGTH; i++) {
      if (guess[i] === secret[i]) {
        feedback[i] = "correct";
        usedSecret[i] = true;
        usedGuess[i] = true;
      }
    }

    for (let i = 0; i < GAME_CONFIG.SEQUENCE_LENGTH; i++) {
      if (!usedGuess[i]) {
        for (let j = 0; j < GAME_CONFIG.SEQUENCE_LENGTH; j++) {
          if (!usedSecret[j] && guess[i] === secret[j]) {
            feedback[i] = "misplaced";
            usedSecret[j] = true;
            break;
          }
        }
      }
    }

    return feedback;
  }

  static computeKeyboardColors(
    guesses: GuessWithFeedback[]
  ): Record<string, string> {
    const colors: Record<string, string> = {};

    for (const { guess, feedback } of guesses) {
      for (let i = 0; i < guess.length; i++) {
        const fish = guess[i];
        const currentFeedback = feedback[i];
        const currentColor = FEEDBACK_COLORS[currentFeedback];

        if (currentFeedback === "correct") {
          colors[fish] = currentColor;
        } else if (
          currentFeedback === "misplaced" &&
          colors[fish] !== FEEDBACK_COLORS.correct
        ) {
          colors[fish] = currentColor;
        } else if (currentFeedback === "wrong" && !colors[fish]) {
          colors[fish] = currentColor;
        }
      }
    }

    return colors;
  }

  static isGameWon(feedback: FeedbackType[]): boolean {
    return feedback.every((f) => f === "correct");
  }

  static isGameOver(guesses: GuessWithFeedback[], won: boolean): boolean {
    return won || guesses.length >= GAME_CONFIG.MAX_ATTEMPTS;
  }

  static calculateScore(guesses: GuessWithFeedback[], didWin: boolean): number {
    if (!didWin) return 0;
    return GAME_CONFIG.MAX_ATTEMPTS - guesses.length;
  }
}
