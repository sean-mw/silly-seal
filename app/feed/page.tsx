"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Delete, RotateCcw } from "lucide-react";

const FISH_TYPES = [
  "anchovy",
  "clownfish",
  "crab",
  "pufferfish",
  "surgeonfish",
];
const SEQUENCE_LENGTH = 4;
const MAX_ATTEMPTS = 6;

type FeedbackType = "correct" | "misplaced" | "wrong";

function getRandomSequence(): string[] {
  return Array.from(
    { length: SEQUENCE_LENGTH },
    () => FISH_TYPES[Math.floor(Math.random() * FISH_TYPES.length)]
  );
}

function getFeedback(secret: string[], guess: string[]): FeedbackType[] {
  const feedback = Array<FeedbackType>(SEQUENCE_LENGTH).fill("wrong");
  const usedHint = Array(SEQUENCE_LENGTH).fill(false);
  const usedGuess = Array(SEQUENCE_LENGTH).fill(false);

  for (let i = 0; i < SEQUENCE_LENGTH; i++) {
    if (guess[i] === secret[i]) {
      feedback[i] = "correct";
      usedHint[i] = true;
      usedGuess[i] = true;
    }
  }

  for (let i = 0; i < SEQUENCE_LENGTH; i++) {
    if (!usedGuess[i]) {
      for (let j = 0; j < SEQUENCE_LENGTH; j++) {
        if (!usedHint[j] && guess[i] === secret[j]) {
          feedback[i] = "misplaced";
          usedHint[j] = true;
          break;
        }
      }
    }
  }

  return feedback;
}

function getColorClass(feedback?: FeedbackType): string {
  return feedback === "correct"
    ? "bg-green-500"
    : feedback === "misplaced"
    ? "bg-yellow-500"
    : feedback === "wrong"
    ? "bg-gray-500"
    : "bg-white";
}

function computeKeyboardColors(
  guesses: { guess: string[]; feedback: FeedbackType[] }[]
): Record<string, string> {
  const colors: Record<string, string> = {};

  for (const { guess, feedback } of guesses) {
    for (let i = 0; i < guess.length; i++) {
      const fish = guess[i];
      const fb = feedback[i];

      if (fb === "correct") {
        colors[fish] = "bg-green-500";
      } else if (fb === "misplaced" && colors[fish] !== "bg-green-500") {
        colors[fish] = "bg-yellow-500";
      } else if (fb === "wrong" && !colors[fish]) {
        colors[fish] = "bg-gray-500";
      }
    }
  }

  return colors;
}

export default function Play() {
  const [secret, setSecret] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string[]>([]);
  const [guesses, setGuesses] = useState<
    { guess: string[]; feedback: FeedbackType[] }[]
  >([]);
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);
  const [keyboardColors, setKeyboardColors] = useState<Record<string, string>>(
    {}
  );

  useEffect(() => {
    setSecret(getRandomSequence());
  }, []);

  useEffect(() => {
    setKeyboardColors(computeKeyboardColors(guesses));
  }, [guesses]);

  const addFishToGuess = (fish: string) => {
    if (!gameOver && currentGuess.length < SEQUENCE_LENGTH) {
      setCurrentGuess((prev) => [...prev, fish]);
    }
  };

  const submitGuess = () => {
    if (currentGuess.length !== SEQUENCE_LENGTH || gameOver) return;

    const feedback = getFeedback(secret, currentGuess);
    const updatedGuesses = [...guesses, { guess: currentGuess, feedback }];

    setGuesses(updatedGuesses);
    setCurrentGuess([]);

    const didWin = feedback.every((f) => f === "correct");
    setVictory(didWin);
    setGameOver(didWin || updatedGuesses.length >= MAX_ATTEMPTS);
  };

  const resetGame = () => {
    setSecret(getRandomSequence());
    setCurrentGuess([]);
    setGuesses([]);
    setVictory(false);
    setGameOver(false);
    setKeyboardColors({});
  };

  const removeLastFish = () => {
    setCurrentGuess((prev) => prev.slice(0, -1));
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">Feed the Seal!</h1>
      <p className="text-lg">
        Guess the sequence of fish the seal wants to eat today.
      </p>

      <div className="flex flex-col gap-2">
        {Array.from({ length: MAX_ATTEMPTS }).map((_, rowIdx) => {
          const isCurrent = rowIdx === guesses.length && !gameOver;
          const guessRow = guesses[rowIdx]?.guess ?? [];
          const feedbackRow = guesses[rowIdx]?.feedback ?? [];

          return (
            <div key={rowIdx} className="flex gap-2">
              {Array.from({ length: SEQUENCE_LENGTH }).map((_, colIdx) => {
                const fish = isCurrent
                  ? currentGuess[colIdx]
                  : guessRow[colIdx];
                const feedback = isCurrent ? undefined : feedbackRow[colIdx];
                const colorClass = getColorClass(feedback);

                return (
                  <div
                    key={colIdx}
                    className={`w-16 h-16 border-3 rounded flex items-center justify-center ${colorClass}`}
                    style={{ imageRendering: "pixelated" }}
                  >
                    {fish && (
                      <Image
                        src={`/${fish}.png`}
                        alt={fish}
                        width={48}
                        height={48}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="flex gap-2">
        {FISH_TYPES.map((fish) => (
          <button
            key={fish}
            onClick={() => addFishToGuess(fish)}
            disabled={gameOver}
            className={`w-16 h-16 border-3 rounded flex items-center justify-center select-none ${
              keyboardColors[fish] ?? "bg-white"
            }`}
            style={{ imageRendering: "pixelated" }}
          >
            <Image
              src={`/${fish}.png`}
              alt={fish}
              width={48}
              height={48}
              draggable={false}
            />
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={submitGuess}
          className={
            "w-16 h-16 border-3 rounded flex items-center justify-center font-bold select-none"
          }
        >
          FEED
        </button>
        <button
          onClick={resetGame}
          className={
            "w-16 h-16 border-3 rounded flex items-center justify-center"
          }
        >
          <RotateCcw width={48} height={48} />
        </button>
        <button
          onClick={removeLastFish}
          className={
            "w-16 h-16 border-3 rounded flex items-center justify-center"
          }
        >
          <Delete width={48} height={48} />
        </button>
      </div>

      {gameOver && (
        <div className="text-lg font-semibold text-center">
          {victory ? "The seal is happy!" : "The seal is still hungry!"}
        </div>
      )}
    </div>
  );
}
