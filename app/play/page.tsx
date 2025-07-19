"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  makeGuess,
  resetGame,
  reinitializeWithSpeciesList,
  markRewardApplied,
} from "@/store/depthGameSlice";
import { DepthGameEngine } from "@/lib/minigames/depth/engine";
import GameContent from "@/components/minigames/depth/GameContent";
import { GAME_CONFIG } from "@/lib/minigames/depth/config";
import MiniGame from "@/components/minigames/MiniGame";
import { GameFeedback } from "@/types/minigames/common";

function DepthGame() {
  const dispatch = useAppDispatch();
  const gameState = useAppSelector((state) => state.depthGame);
  const [guessResult, setGuessResult] = useState<GameFeedback>("pending");

  useEffect(() => {
    if (gameState.isGameOver || gameState.speciesList !== undefined) return;
    (async () => {
      const speciesList = await DepthGameEngine.loadSpecies();
      dispatch(reinitializeWithSpeciesList(speciesList));
    })();
  }, [dispatch, gameState.isGameOver, gameState.speciesList]);

  const handleGuess = (guess: "higher" | "lower") => {
    if (
      gameState.currentIdx === undefined ||
      gameState.nextIdx === undefined ||
      gameState.speciesList === undefined ||
      gameState.isGameOver ||
      guessResult !== "pending"
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

    setGuessResult(isCorrect ? "correct" : "incorrect");

    setTimeout(() => {
      dispatch(makeGuess(guess));
      setGuessResult("pending");
    }, GAME_CONFIG.REVEAL_DELAY);
  };

  return (
    <MiniGame
      config={{
        name: "Depth Guesser",
        description:
          "Guess whether the next species lives at a shallower or deeper depth!",
        allowRestart: true,
        stat: "happiness",
      }}
      gameState={gameState}
      onReset={() => dispatch(resetGame())}
      onReward={() => dispatch(markRewardApplied())}
    >
      <GameContent
        gameState={gameState}
        guessResult={guessResult}
        onGuess={handleGuess}
      />
    </MiniGame>
  );
}

export default DepthGame;
