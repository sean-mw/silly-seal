import React from "react";
import SpeciesCard from "./SpeciesCard";
import { DepthGameState } from "@/types/minigames/depth";
import GuessFeedback from "../../ResultFeedback";

interface GameContentProps {
  gameState: DepthGameState;
  guessResult: "correct" | "incorrect" | undefined;
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
    gameState.currentIdx == undefined ||
    gameState.nextIdx == undefined
  ) {
    // TODO: better loading animation
    return <div className="text-center pt-8">Loading game...</div>;
  }

  const currentSpecies = gameState.speciesList[gameState.currentIdx];
  const nextSpecies = gameState.speciesList[gameState.nextIdx];
  const showNextDepth = guessResult !== undefined;

  return (
    <div className="flex flex-col w-full h-full gap-2 text-center items-center justify-center">
      <GuessFeedback result={guessResult} />
      <SpeciesCard species={currentSpecies} showDepth />
      <SpeciesCard
        species={nextSpecies}
        showDepth={showNextDepth}
        onGuess={onGuess}
        disabled={showNextDepth || gameState.isGameOver}
      />
    </div>
  );
}
