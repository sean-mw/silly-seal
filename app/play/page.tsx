"use client";

import React, { useEffect } from "react";
import { MiniGame } from "@/components/minigames/MiniGame";
import { useMiniGame } from "@/hooks/useMiniGame";
import { DepthGameState } from "@/types/minigames/depth";
import { DepthGameEngine } from "@/lib/minigames/depth/engine";
import { GAME_CONFIG } from "@/lib/minigames/depth/config";
import GameContent from "@/components/minigames/depth/GameContent";

const INITIAL_STATE: DepthGameState = {
  isGameOver: false,
  score: 0,
  speciesList: [],
  showNextDepth: false,
  isLoading: true,
};

function DepthGame() {
  const { gameState, updateGameState, endGame, resetGame } = useMiniGame(
    INITIAL_STATE,
    "happiness"
  );

  useEffect(() => {
    const initializeGame = async () => {
      try {
        const species = await DepthGameEngine.loadSpecies();
        const firstIdx = DepthGameEngine.getRandomIndex(species.length);
        const secondIdx = DepthGameEngine.getRandomIndex(
          species.length,
          firstIdx
        );

        updateGameState((prev) => ({
          ...prev,
          speciesList: species,
          currentIdx: firstIdx,
          nextIdx: secondIdx,
          isLoading: false,
        }));
      } catch (error) {
        console.error("Failed to initialize game:", error);
        updateGameState((prev) => ({
          ...prev,
          isLoading: false,
        }));
      }
    };

    initializeGame();
  }, [updateGameState]);

  const handleGuess = (guess: "higher" | "lower") => {
    if (
      gameState.currentIdx === undefined ||
      gameState.nextIdx === undefined ||
      gameState.isGameOver ||
      gameState.showNextDepth
    ) {
      return;
    }

    const currentDepth =
      gameState.speciesList[gameState.currentIdx].average_depth;
    const nextDepth = gameState.speciesList[gameState.nextIdx].average_depth;

    const isCorrect = DepthGameEngine.isGuessCorrect(
      guess,
      currentDepth,
      nextDepth
    );

    updateGameState((prev) => ({
      ...prev,
      showNextDepth: true,
    }));

    setTimeout(() => {
      if (isCorrect) {
        const newNextIdx = DepthGameEngine.getRandomIndex(
          gameState.speciesList.length,
          gameState.nextIdx
        );

        updateGameState((prev) => ({
          ...prev,
          score: prev.score + 1,
          currentIdx: gameState.nextIdx,
          nextIdx: newNextIdx,
          showNextDepth: false,
        }));
      } else {
        updateGameState((prev) => ({
          ...prev,
          isGameOver: true,
        }));

        endGame(GAME_CONFIG.SCORE_MULTIPLIER * gameState.score);
      }
    }, GAME_CONFIG.REVEAL_DELAY);
  };

  const handleRestart = async () => {
    const firstIdx = DepthGameEngine.getRandomIndex(
      gameState.speciesList.length
    );
    const secondIdx = DepthGameEngine.getRandomIndex(
      gameState.speciesList.length,
      firstIdx
    );

    resetGame({
      ...INITIAL_STATE,
      speciesList: gameState.speciesList,
      currentIdx: firstIdx,
      nextIdx: secondIdx,
      isLoading: false,
    });
  };

  return (
    <MiniGame
      config={{
        name: "Depth Guesser",
        description:
          "Guess whether the next species lives at a shallower or deeper depth!",
        allowRestart: true,
      }}
      gameState={gameState}
      onRestart={handleRestart}
    >
      <GameContent gameState={gameState} onGuess={handleGuess} />
    </MiniGame>
  );
}

export default DepthGame;
