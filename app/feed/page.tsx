"use client";

import { MiniGame } from "@/components/minigames/MiniGame";
import { useMiniGame } from "@/hooks/useMiniGame";
import { GuessWithFeedback, FeedGameState } from "@/types/minigames/feed";
import { FeedGameEngine } from "@/lib/minigames/feed/engine";
import { GAME_CONFIG } from "@/lib/minigames/feed/config";
import GameGrid from "@/components/minigames/feed/GameGrid";
import GameControls from "@/components/minigames/feed/GameControls";
import { useEffect, useState } from "react";

const generateInitialGameState = async (): Promise<FeedGameState> => {
  return {
    isGameOver: false,
    createdAt: Date.now(),
    secret: FeedGameEngine.generateRandomSequence(),
    currentGuess: [],
    guesses: [],
    keyboardColors: {},
  };
};

function FeedGame() {
  const { gameState, setGameState, endGame, resetGame } =
    useMiniGame<FeedGameState>("feed", generateInitialGameState);
  const [animatingRow, setAnimatingRow] = useState<number | undefined>();
  const [revealIndex, setRevealIndex] = useState(0);
  const [animateFinalRow, setAnimateFinalRow] = useState(false);

  useEffect(() => {
    if (
      animatingRow == undefined ||
      revealIndex >= GAME_CONFIG.SEQUENCE_LENGTH
    ) {
      return;
    }
    setTimeout(() => {
      setRevealIndex((i) => i + 1);
    }, 500);
  }, [animatingRow, revealIndex]);

  useEffect(() => {
    if (
      gameState === undefined ||
      gameState.guesses.length === 0 ||
      animatingRow === undefined ||
      revealIndex < GAME_CONFIG.SEQUENCE_LENGTH
    ) {
      return;
    }

    setGameState((prev) => ({
      ...prev!,
      keyboardColors: FeedGameEngine.computeKeyboardColors(gameState.guesses),
    }));
    setAnimatingRow(undefined);
    setRevealIndex(0);

    const feedback = gameState.guesses.at(-1)!.feedback;
    const isGameWon = FeedGameEngine.isGameWon(feedback);
    const isGameOver = FeedGameEngine.isGameOver(gameState.guesses, isGameWon);

    if (!isGameOver) return;
    if (isGameWon) {
      setTimeout(() => {
        setAnimateFinalRow(true);
        setTimeout(() => setAnimateFinalRow(false), 500);
      }, 300);
    }

    setTimeout(
      () =>
        endGame({
          stat: "hunger",
          value: GAME_CONFIG.STAT_REWARD,
        }),
      1000
    );
  }, [animatingRow, endGame, gameState, revealIndex, setGameState]);

  // TODO: better loading animation
  if (!gameState) return <>Loading...</>;

  const handleAddFish = (fish: string) => {
    if (
      !gameState.isGameOver &&
      gameState.currentGuess.length < GAME_CONFIG.SEQUENCE_LENGTH
    ) {
      setGameState((prev) => ({
        ...prev!,
        currentGuess: [...prev!.currentGuess, fish],
      }));
    }
  };

  const handleRemoveLastFish = () => {
    setGameState((prev) => ({
      ...prev!,
      currentGuess: prev!.currentGuess.slice(0, -1),
    }));
  };

  const handleSubmitGuess = () => {
    if (
      gameState.currentGuess.length !== GAME_CONFIG.SEQUENCE_LENGTH ||
      gameState.isGameOver
    ) {
      return;
    }

    const feedback = FeedGameEngine.calculateFeedback(
      gameState.secret,
      gameState.currentGuess
    );
    const newGuess: GuessWithFeedback = {
      guess: gameState.currentGuess,
      feedback,
    };
    const updatedGuesses = [...gameState.guesses, newGuess];

    setGameState((prev) => ({
      ...prev!,
      guesses: updatedGuesses,
      currentGuess: [],
    }));

    setAnimatingRow(updatedGuesses.length - 1);
    setRevealIndex(0);
  };

  return (
    <MiniGame
      config={{
        name: "Feed Mini-Game",
        description: "Feed the seal by guessing the correct sequence of fish!",
        allowRestart: true,
      }}
      gameState={gameState}
      onRestart={resetGame}
    >
      <GameGrid
        guesses={gameState.guesses}
        currentGuess={gameState.currentGuess}
        isGameOver={gameState.isGameOver}
        animatingRow={animatingRow}
        revealIndex={revealIndex}
        animateFinalRow={animateFinalRow}
      />
      <GameControls
        onAddFish={handleAddFish}
        onSubmitGuess={handleSubmitGuess}
        onRemoveLastFish={handleRemoveLastFish}
        isGameOver={gameState.isGameOver}
        currentGuessLength={gameState.currentGuess.length}
        keyboardColors={gameState.keyboardColors}
      />
    </MiniGame>
  );
}

export default FeedGame;
