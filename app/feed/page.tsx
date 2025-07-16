"use client";

import { MiniGame } from "@/components/minigames/MiniGame";
import { useMiniGame } from "@/hooks/useMiniGame";
import { GuessWithFeedback, FeedGameState } from "@/types/minigames/feed";
import { FeedGameEngine } from "@/lib/minigames/feed/engine";
import { GAME_CONFIG } from "@/lib/minigames/feed/config";
import GameGrid from "@/components/minigames/feed/GameGrid";
import GameControls from "@/components/minigames/feed/GameControls";

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
      keyboardColors: FeedGameEngine.computeKeyboardColors(updatedGuesses),
    }));

    const isGameWon = FeedGameEngine.isGameWon(feedback);
    const isGameOver = FeedGameEngine.isGameOver(updatedGuesses, isGameWon);
    if (isGameOver) {
      endGame({
        stat: "hunger",
        value: GAME_CONFIG.STAT_REWARD,
      });
    }
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
