"use client";

import Button from "@/components/Button";
import { useState, useEffect } from "react";

type Creature = {
  scientific_name: string;
  average_depth: number;
};

function getRandomIndex(max: number, excludeIndex?: number) {
  let idx: number;
  idx = Math.floor(Math.random() * max);
  if (excludeIndex === undefined) return idx;
  while (idx === excludeIndex) {
    idx = Math.floor(Math.random() * max);
  }
  return idx;
}

export default function Play() {
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [currentIdx, setCurrentIdx] = useState<number | null>(null);
  const [nextIdx, setNextIdx] = useState<number | null>(null);
  const [showNextDepth, setShowNextDepth] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        fetch("/api/creatures")
          .then((res) => res.json())
          .then((data) => {
            setCreatures(data);
            if (data.length < 2) {
              console.error(
                "Not enough creatures to play the game. Got only:",
                data.length
              );
              return;
            }
            const first = getRandomIndex(data.length);
            const second = getRandomIndex(data.length, first);
            setCurrentIdx(first);
            setNextIdx(second);
          });
      } catch (e) {
        console.error("Failed to load creatures from DB", e);
      }
    };
    fetchData();
  }, []);

  const handleGuess = (guess: "higher" | "lower") => {
    if (currentIdx === null || nextIdx === null || creatures.length < 2) return;

    const currentDepth = creatures[currentIdx].average_depth;
    const nextDepth = creatures[nextIdx].average_depth;

    const correct =
      guess === "higher" ? nextDepth < currentDepth : nextDepth > currentDepth;

    setShowNextDepth(true);

    setTimeout(() => {
      if (correct) {
        setScore((s) => s + 1);
        setCurrentIdx(nextIdx);

        const newNextIdx = getRandomIndex(creatures.length, nextIdx);
        setNextIdx(newNextIdx);

        setShowNextDepth(false);
      } else {
        setGameOver(true);
      }
    }, 1000);
  };

  const handleRestart = () => {
    if (creatures.length < 2) return;
    const first = getRandomIndex(creatures.length);
    const second = getRandomIndex(creatures.length, first);
    setCurrentIdx(first);
    setNextIdx(second);
    setScore(0);
    setGameOver(false);
    setShowNextDepth(false);
  };

  if (creatures.length === 0) {
    return <div>Loading creatures...</div>;
  }

  if (currentIdx === null || nextIdx === null) {
    return <div>Preparing game...</div>;
  }

  const CreatureCard = (props: { idx: number; showDepth?: boolean }) => {
    const creature = creatures[props.idx];
    return (
      <div className="p-4 border-3 rounded">
        <div className="text-lg font-semibold">{creature.scientific_name}</div>
        {props.showDepth !== false && (
          <div className="">Lives at ~{creature.average_depth}m</div>
        )}
        {props.showDepth === false && (
          <div className="flex justify-center gap-4 pt-2">
            <Button
              className="w-24 bg-blue-300 text-black"
              onClick={() => handleGuess("higher")}
            >
              Shallower
            </Button>
            <Button
              className="w-24 bg-blue-900"
              onClick={() => handleGuess("lower")}
            >
              Deeper
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full h-full gap-4 text-center">
      <h1 className="text-2xl font-bold">Which creature lives deeper?</h1>
      {!gameOver ? (
        <>
          <CreatureCard idx={currentIdx} />
          <CreatureCard idx={nextIdx} showDepth={showNextDepth} />
          <p className="text-lg pt-2">Score: {score}</p>
        </>
      ) : (
        <div className="space-y-4">
          <p className="text-xl font-semibold">Game Over!</p>
          <p className="text-lg">Final Score: {score}</p>
          <Button className={"w-24"} onClick={handleRestart}>
            Restart
          </Button>
        </div>
      )}
    </div>
  );
}
