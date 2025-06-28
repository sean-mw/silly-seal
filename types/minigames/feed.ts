import { GameState } from "./common";

export type FeedbackType = "correct" | "misplaced" | "wrong" | "empty";

export interface GuessWithFeedback {
  guess: string[];
  feedback: FeedbackType[];
}

export interface FeedGameState extends GameState {
  secret: string[];
  currentGuess: string[];
  guesses: GuessWithFeedback[];
  keyboardColors: Record<string, string>;
}
