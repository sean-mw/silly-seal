import React, { ReactNode } from "react";
import Button from "@/components/Button";
import { GameState, MiniGameConfig } from "@/types/minigames/common";

interface MiniGameProps<T extends GameState> {
  config: MiniGameConfig;
  gameState: T;
  onRestart: () => void;
  children: ReactNode;
}

export function MiniGame<T extends GameState>({
  config,
  gameState,
  onRestart,
  children,
}: MiniGameProps<T>) {
  const message = gameState.isVictory
    ? `${config.name} completed!`
    : `Game over!`;

  return (
    <div className="flex flex-col w-full h-full items-center justify-center gap-4">
      {!gameState.isGameOver && children}
      {gameState.isGameOver && (
        <div className="flex flex-col gap-2 text-center items-center">
          <div className="text-lg font-semibold">{message}</div>
          <div className="text-md">Score: {gameState.score}</div>
          {config.allowRestart !== false && (
            <Button onClick={onRestart}>Restart</Button>
          )}
        </div>
      )}
    </div>
  );
}
