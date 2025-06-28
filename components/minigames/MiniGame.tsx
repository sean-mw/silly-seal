import React, { ReactNode } from "react";
import Button from "@/components/Button";
import { GameState, MiniGameConfig } from "@/types/minigames/common";

interface MiniGameProps {
  config: MiniGameConfig;
  gameState: GameState;
  onRestart: () => void;
  children: ReactNode;
}

export function MiniGame({
  config,
  gameState,
  onRestart,
  children,
}: MiniGameProps) {
  return (
    <div className="flex flex-col w-full h-full items-center justify-center gap-4">
      {!gameState.isGameOver && children}
      {gameState.isGameOver && (
        <div className="flex flex-col gap-2 text-center items-center">
          <div className="text-lg font-semibold">Game Over!</div>
          {config.allowRestart !== false && (
            <Button onClick={onRestart}>Restart</Button>
          )}
        </div>
      )}
    </div>
  );
}
