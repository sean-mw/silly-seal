"use client";

import CellGrid from "@/components/minigames/clean/CellGrid";
import MiniGame from "@/components/minigames/MiniGame";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { markRewardApplied, resetGame } from "@/store/cleanGameSlice";

function CleanGame() {
  const gameState = useAppSelector((state) => state.cleanGame);
  const dispatch = useAppDispatch();

  return (
    <MiniGame
      config={{
        name: "Clean the Seal",
        stat: "cleanliness",
        description: "Clean the seal enclosure while avoiding rocks!",
        allowRestart: true,
      }}
      gameState={gameState}
      onReset={() => dispatch(resetGame())}
      onReward={() => dispatch(markRewardApplied())}
    >
      <div className="flex flex-col h-full items-center justify-center gap-4">
        <CellGrid gameState={gameState} />
      </div>
    </MiniGame>
  );
}

export default CleanGame;
