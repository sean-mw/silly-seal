"use client";

import { useAppSelector } from "@/lib/hooks";
import Button from "./Button";
import { usePathname, useRouter } from "next/navigation";
import Lives from "./Lives";
import { GAME_CONFIG as CLEAN_GAME_CONFIG } from "@/lib/minigames/clean/config";
import { GAME_CONFIG as DEPTH_GAME_CONFIG } from "@/lib/minigames/depth/config";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { gameState, maxLives } = useAppSelector((state) => {
    switch (pathname) {
      case "/clean":
        return {
          gameState: state["cleanGame"],
          maxLives: CLEAN_GAME_CONFIG.LIVES,
        };
      case "/play":
        return {
          gameState: state["depthGame"],
          maxLives: DEPTH_GAME_CONFIG.LIVES,
        };
      case "/feed":
        return { gameState: state["feedGame"], maxLives: undefined };
      default:
        return { gameState: undefined, maxLives: undefined };
    }
  });

  const isRoot = pathname === "/";
  const hasLives = gameState && "lives" in gameState && maxLives !== undefined;

  return (
    <>
      {!isRoot && (
        <div className="flex w-full pb-4 items-center justify-between">
          <Button onClick={() => router.push("/")}>←</Button>
          {hasLives && !gameState.isGameOver && (
            <Lives remainingLives={gameState.lives} maxLives={maxLives} />
          )}
        </div>
      )}
    </>
  );
}
