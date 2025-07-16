import React from "react";
import SpeciesCard from "./SpeciesCard";
import { DepthGameState } from "@/types/minigames/depth";

interface GameContentProps {
  gameState: DepthGameState;
  showNextDepth: boolean;
  onGuess: (guess: "higher" | "lower") => void;
}

export default function GameContent({
  gameState,
  showNextDepth,
  onGuess,
}: GameContentProps) {
  if (
    !gameState ||
    !gameState.speciesList.length ||
    gameState.currentIdx == undefined ||
    gameState.nextIdx == undefined
  ) {
    // TODO: better loading animation
    return <div className="text-center pt-8">Loading game...</div>;
  }

  const currentSpecies = gameState.speciesList[gameState.currentIdx];
  const nextSpecies = gameState.speciesList[gameState.nextIdx];

  return (
    <div className="flex flex-col w-full h-full gap-2 text-center items-center justify-center">
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
