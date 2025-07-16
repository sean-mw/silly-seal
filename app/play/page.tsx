"use client";

import { MiniGame } from "@/components/minigames/MiniGame";
import { useMiniGame } from "@/hooks/useMiniGame";
import { DepthGameState } from "@/types/minigames/depth";
import { DepthGameEngine } from "@/lib/minigames/depth/engine";
import { GAME_CONFIG } from "@/lib/minigames/depth/config";
import GameContent from "@/components/minigames/depth/GameContent";
import { GameReward } from "@/types/minigames/common";

const generateInitialGameState = async (): Promise<DepthGameState> => {
  const speciesList = await DepthGameEngine.loadSpecies();
  const currentIdx = DepthGameEngine.getRandomIndex(speciesList.length);
  const nextIdx = DepthGameEngine.getRandomIndex(
    speciesList.length,
    currentIdx
  );
  return {
    isGameOver: false,
    score: 0,
    showNextDepth: false,
    speciesList,
    currentIdx,
    nextIdx,
  };
};

function DepthGame() {
  const { gameState, setGameState, endGame, resetGame } =
    useMiniGame<DepthGameState>("depth", generateInitialGameState);

  // TODO: better loading animation
  if (!gameState) return <>Loading...</>;

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

    setGameState((prev) => ({
      ...prev!,
      showNextDepth: true,
    }));

    setTimeout(() => {
      let reward: GameReward | undefined;
      setGameState((prev) => {
        if (!prev) return prev;

        if (isCorrect) {
          const newNextIdx = DepthGameEngine.getRandomIndex(
            prev.speciesList.length,
            prev.nextIdx
          );
          return {
            ...prev,
            score: prev.score + 1,
            currentIdx: prev.nextIdx,
            nextIdx: newNextIdx,
            showNextDepth: false,
          };
        } else {
          reward = {
            stat: "happiness",
            value: GAME_CONFIG.SCORE_MULTIPLIER * prev.score,
          };
          return { ...prev, isGameOver: true };
        }
      });
      if (reward) endGame(reward);
    }, GAME_CONFIG.REVEAL_DELAY);
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
      onRestart={resetGame}
    >
      <GameContent gameState={gameState} onGuess={handleGuess} />
    </MiniGame>
  );
}

export default DepthGame;
