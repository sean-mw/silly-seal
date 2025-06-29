"use client";

import React, { ReactNode } from "react";
import Button from "@/components/Button";
import StatusBar from "@/components/StatusBar";
import { GameState, MiniGameConfig } from "@/types/minigames/common";
import { useCountdownToMidnight } from "@/hooks/useMidnightCountdown";

interface MiniGameProps {
  config: MiniGameConfig;
  gameState: GameState;
  onRestart: () => void;
  children: ReactNode;
}

function formatCountdown(ms: number) {
  const totalSeconds = Math.max(Math.floor(ms / 1000), 0);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
}

export function MiniGame({
  config,
  gameState,
  onRestart,
  children,
}: MiniGameProps) {
  const countdown = useCountdownToMidnight();

  const prevValue = gameState.reward?.prevValue ?? 0;
  const newValue = prevValue + (gameState.reward?.value ?? 0);

  return (
    <div className="flex flex-col w-full h-full items-center justify-center gap-4">
      {!gameState.isGameOver && children}
      {gameState.isGameOver && countdown && (
        <div className="flex flex-col gap-4 text-center items-center w-full max-w-md">
          <div className="text-lg font-semibold">Game Over!</div>
          {gameState.isGameOver &&
            gameState.reward &&
            typeof gameState.reward.prevValue === "number" && (
              <div className="w-full">
                <StatusBar
                  title={`+${gameState.reward.value} ${gameState.reward.stat}`}
                  percent={Math.min(newValue / 100, 1)}
                  onClick={() => {}}
                  prevPercent={prevValue / 100}
                />
              </div>
            )}
          <div className="text-sm">You can play again in:</div>
          <div className="text-xl font-mono">{formatCountdown(countdown)}</div>
          {config.allowRestart !== false && (
            <Button onClick={onRestart}>Restart</Button>
          )}
        </div>
      )}
    </div>
  );
}
