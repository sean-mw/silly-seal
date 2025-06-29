"use client";

import React, { ReactNode } from "react";
import Button from "@/components/Button";
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

  return (
    <div className="flex flex-col w-full h-full items-center justify-center gap-4">
      {!gameState.isGameOver && children}
      {gameState.isGameOver && countdown && (
        <div className="flex flex-col gap-2 text-center items-center">
          <div className="text-lg font-semibold">Game Over!</div>
          <div>
            You earned{" "}
            <span className="font-bold">
              {gameState.rewardValue} {gameState.rewardStat}
            </span>
          </div>
          <div>You can play again in:</div>
          <div className="text-xl font-mono">{formatCountdown(countdown)}</div>
          {config.allowRestart !== false && (
            <Button onClick={onRestart}>Restart</Button>
          )}
        </div>
      )}
    </div>
  );
}
