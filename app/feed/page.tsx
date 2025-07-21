"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  addFish,
  removeFish,
  submitGuess,
  updateKeyboardColors,
  endGame,
  resetGame,
  markRewardApplied,
} from "@/store/feedGameSlice";
import { FeedGameEngine } from "@/lib/minigames/feed/engine";
import MiniGame from "@/components/MiniGame";
import GameGrid from "@/components/minigames/feed/GameGrid";
import GameControls from "@/components/minigames/feed/GameControls";
import { GAME_CONFIG } from "@/lib/minigames/feed/config";
import FeedModal from "@/components/minigames/feed/FeedModal";

function FeedGame() {
  const dispatch = useAppDispatch();
  const gameState = useAppSelector((state) => state.feedGame);
  const [animatingRow, setAnimatingRow] = useState<number | undefined>();
  const [revealIndex, setRevealIndex] = useState(0);
  const [animateFinalRow, setAnimateFinalRow] = useState(false);

  useEffect(() => {
    if (
      animatingRow === undefined ||
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
      !gameState.guesses.length ||
      animatingRow === undefined ||
      revealIndex < GAME_CONFIG.SEQUENCE_LENGTH
    ) {
      return;
    }
    dispatch(updateKeyboardColors());
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
    setTimeout(() => dispatch(endGame()), 1000);
  }, [animatingRow, dispatch, gameState.guesses, revealIndex]);

  if (!gameState) return <>Loading...</>;

  const handleAddFish = (fish: string) => {
    dispatch(addFish(fish));
  };

  const handleRemoveFish = () => {
    dispatch(removeFish());
  };

  const handleSubmitGuess = () => {
    dispatch(submitGuess());
    setAnimatingRow(gameState.guesses.length);
    setRevealIndex(0);
  };

  return (
    <MiniGame
      config={{
        name: "Feed Mini-Game",
        description: "Feed the seal by guessing the correct sequence of fish!",
        stat: "hunger",
      }}
      gameState={gameState}
      onReset={() => dispatch(resetGame())}
      onReward={() => dispatch(markRewardApplied())}
      Modal={FeedModal}
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
        onRemoveFish={handleRemoveFish}
        isGameOver={gameState.isGameOver}
        currentGuessLength={gameState.currentGuess.length}
        keyboardColors={gameState.keyboardColors}
      />
    </MiniGame>
  );
}

export default FeedGame;
