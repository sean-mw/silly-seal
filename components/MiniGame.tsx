"use client";

import { FC, ReactNode, useEffect, useRef, useState } from "react";
import Button from "@/components/Button";
import StatusBar from "@/components/StatusBar";
import {
  GameModalProps,
  GameState,
  MiniGameConfig,
} from "@/types/minigames/common";
import { useCountdownToMidnight } from "@/hooks/useMidnightCountdown";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { applyReward } from "@/store/sealSlice";
import { useDailyReset } from "@/hooks/useDailyReset";

interface MiniGameProps {
  config: MiniGameConfig;
  gameState: GameState;
  Modal: FC<GameModalProps>;
  onReward: () => void;
  onReset: () => void;
  children: ReactNode;
}

function formatCountdown(ms: number) {
  const totalSeconds = Math.max(Math.floor(ms / 1000), 0);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
}

function MiniGame({
  config,
  gameState,
  Modal,
  onReward,
  onReset,
  children,
}: MiniGameProps) {
  const countdown = useCountdownToMidnight();
  useDailyReset(gameState.createdAt, onReset);
  const sealState = useAppSelector((state) => state.seal);
  const dispatch = useAppDispatch();
  const prevStatValueRef = useRef<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(true);

  useEffect(() => {
    if (!gameState.isGameOver || gameState.rewardApplied) return;
    prevStatValueRef.current = sealState[config.stat];
    dispatch(applyReward({ stat: config.stat, value: gameState.reward }));
    onReward();
  }, [
    config.stat,
    dispatch,
    gameState.isGameOver,
    gameState.reward,
    gameState.rewardApplied,
    onReward,
    sealState,
  ]);

  return (
    <div className="flex flex-col w-full h-full items-center justify-center gap-4">
      {!gameState.isGameOver && (
        <>
          <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
          {children}
        </>
      )}
      {gameState.isGameOver && countdown && (
        <div className="flex flex-col gap-4 text-center items-center w-full">
          <div className="text-lg font-semibold">Game Over!</div>
          {gameState.isGameOver && (
            <div className="w-full">
              <StatusBar
                title={`+${gameState.reward} ${config.stat}`}
                percent={Math.min(sealState[config.stat] / 100, 1)}
                prevPercent={
                  prevStatValueRef.current !== null
                    ? prevStatValueRef.current / 100
                    : undefined
                }
              />
            </div>
          )}
          <div className="text-sm">You can play again in:</div>
          <div className="text-xl font-mono">{formatCountdown(countdown)}</div>
          {config.allowRestart !== false && (
            <Button onClick={onReset}>Restart</Button>
          )}
        </div>
      )}
    </div>
  );
}

export default MiniGame;
