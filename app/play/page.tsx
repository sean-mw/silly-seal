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
import MiniGame from "@/components/MiniGame";
import { GameFeedback } from "@/types/minigames/common";
import { usePreloadImages } from "@/hooks/usePreloadImages";
import DepthModal from "@/components/minigames/depth/DepthModal";

function DepthGame() {
  const dispatch = useAppDispatch();
  const gameState = useAppSelector((state) => state.depthGame);
  const [guessResult, setGuessResult] = useState<GameFeedback>("pending");
  const { prevIdx, curIdx, nextIdx, speciesList } = gameState;

  usePreloadImages(
    [prevIdx, curIdx, nextIdx]
      .filter((i) => i !== undefined)
      .map((i) => speciesList?.[i]?.image_urls[0])
  );

  useEffect(() => {
    if (gameState.isGameOver || gameState.speciesList !== undefined) return;
    (async () => {
      const speciesList = await DepthGameEngine.loadSpecies();
      dispatch(reinitializeWithSpeciesList(speciesList));
    })();
  }, [dispatch, gameState.isGameOver, gameState.speciesList]);

  const handleGuess = (guess: "higher" | "lower") => {
    if (
      gameState.prevIdx === undefined ||
      gameState.curIdx === undefined ||
      gameState.speciesList === undefined ||
      gameState.isGameOver ||
      guessResult !== "pending"
    ) {
      return;
    }

    const prevDepth = gameState.speciesList[gameState.prevIdx].average_depth;
    const curDepth = gameState.speciesList[gameState.curIdx].average_depth;

    const isCorrect = DepthGameEngine.isGuessCorrect(
      guess,
      prevDepth,
      curDepth
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
        stat: "happiness",
      }}
      gameState={gameState}
      onReset={() => dispatch(resetGame())}
      onReward={() => dispatch(markRewardApplied())}
      Modal={DepthModal}
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
