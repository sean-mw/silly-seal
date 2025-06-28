import React from "react";
import SpeciesCard from "./SpeciesCard";
import { DepthGameState } from "@/types/minigames/depth";

interface GameContentProps {
  gameState: DepthGameState;
  onGuess: (guess: "higher" | "lower") => void;
}

export default function GameContent({ gameState, onGuess }: GameContentProps) {
  if (gameState.isLoading || !gameState.speciesList.length) {
    return <div className="text-center pt-8">Loading game...</div>;
  }

  if (gameState.currentIdx === undefined || gameState.nextIdx === undefined) {
    return <div className="text-center pt-8">Setting up game...</div>;
  }

  const currentSpecies = gameState.speciesList[gameState.currentIdx];
  const nextSpecies = gameState.speciesList[gameState.nextIdx];

  return (
    <div className="flex flex-col w-full h-full gap-2 text-center items-center justify-center">
      <SpeciesCard species={currentSpecies} showDepth />
      <SpeciesCard
        species={nextSpecies}
        showDepth={gameState.showNextDepth}
        onGuess={onGuess}
        disabled={gameState.showNextDepth || gameState.isGameOver}
      />
    </div>
  );
}
