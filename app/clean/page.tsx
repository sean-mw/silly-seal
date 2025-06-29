"use client";

import { useEffect } from "react";
import { CleanGameEngine } from "@/lib/minigames/clean/engine";
import { CleanGameState } from "@/types/minigames/clean";
import CellGrid from "@/components/minigames/clean/CellGrid";
import { MiniGame } from "@/components/minigames/MiniGame";
import { useMiniGame } from "@/hooks/useMiniGame";

const INITIAL_STATE: CleanGameState = {
  isGameOver: false,
  grid: [],
};

function CleanGame() {
  const { gameState, setGameState, endGame, resetGame } = useMiniGame(
    INITIAL_STATE,
    "hygiene"
  );

  useEffect(() => {
    setGameState((prev) => ({
      ...prev,
      grid: CleanGameEngine.initializeGrid(),
    }));
  }, [setGameState]);

  const handleRestart = () => {
    resetGame({
      ...INITIAL_STATE,
      grid: CleanGameEngine.initializeGrid(),
    });
  };

  return (
    <MiniGame
      config={{
        name: "Clean the Seal",
        description: "Clean the seal enclosure while avoiding rocks!",
        allowRestart: true,
      }}
      gameState={gameState}
      onRestart={handleRestart}
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
