"use client";

import { CleanGameEngine } from "@/lib/minigames/clean/engine";
import { CleanGameState } from "@/types/minigames/clean";
import CellGrid from "@/components/minigames/clean/CellGrid";
import { MiniGame } from "@/components/minigames/MiniGame";
import { useMiniGame } from "@/hooks/useMiniGame";

const generateInitialGameState = async (): Promise<CleanGameState> => {
  return {
    isGameOver: false,
    createdAt: Date.now(),
    grid: CleanGameEngine.initializeGrid(),
  };
};

function CleanGame() {
  const { gameState, setGameState, endGame, resetGame } =
    useMiniGame<CleanGameState>("clean", generateInitialGameState);

  // TODO: better loading animation
  if (!gameState) return <>Loading...</>;

  return (
    <MiniGame
      config={{
        name: "Clean the Seal",
        description: "Clean the seal enclosure while avoiding rocks!",
        allowRestart: true,
      }}
      gameState={gameState}
      onRestart={resetGame}
    >
      <div className="flex flex-col h-full items-center justify-center gap-4">
        <CellGrid
          gameState={gameState}
          updateGameState={setGameState}
          endGame={endGame}
        />
      </div>
    </MiniGame>
  );
}

export default CleanGame;
