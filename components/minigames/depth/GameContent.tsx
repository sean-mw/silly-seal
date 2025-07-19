import React from "react";
import SpeciesCard from "./SpeciesCard";
import { DepthGameState } from "@/types/minigames/depth";
import GuessFeedback from "../../ResultFeedback";
import { GameFeedback } from "@/types/minigames/common";

interface GameContentProps {
  gameState: DepthGameState;
  guessResult: GameFeedback;
  onGuess: (guess: "higher" | "lower") => void;
}

export default function GameContent({
  gameState,
  guessResult,
  onGuess,
}: GameContentProps) {
  if (
    !gameState ||
    !gameState.speciesList ||
    gameState.prevIdx == undefined ||
    gameState.curIdx == undefined
  ) {
    // TODO: better loading animation
    return <div className="text-center pt-8">Loading game...</div>;
  }

  const prevSpecies = gameState.speciesList[gameState.prevIdx];
  const curSpecies = gameState.speciesList[gameState.curIdx];
  const showNextDepth = guessResult !== "pending";

  return (
    <div className="flex flex-col w-full h-full gap-2 text-center items-center justify-center">
      <GuessFeedback result={guessResult} />
      <SpeciesCard species={prevSpecies} showDepth />
      <SpeciesCard
        species={curSpecies}
        showDepth={showNextDepth}
        onGuess={onGuess}
        disabled={showNextDepth || gameState.isGameOver}
      />
    </div>
  );
}
