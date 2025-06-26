"use client";

import Button from "@/components/Button";
import { useState, useEffect } from "react";

type Species = {
  scientific_name: string;
  common_name: string;
  average_depth: number;
  occurrence_count: number;
};

function getRandomIndex(max: number, excludeIndex?: number): number {
  let idx = Math.floor(Math.random() * max);
  while (idx === excludeIndex) {
    idx = Math.floor(Math.random() * max);
  }
  return idx;
}

export default function Play() {
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [currentIdx, setCurrentIdx] = useState<number | null>(null);
  const [nextIdx, setNextIdx] = useState<number | null>(null);
  const [showNextDepth, setShowNextDepth] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/species");
        const data: Species[] = await res.json();

        if (data.length < 2) {
          console.error(
            "Not enough species to play the game. Got only:",
            data.length
          );
          return;
        }

        setSpeciesList(data);

        const first = getRandomIndex(data.length);
        const second = getRandomIndex(data.length, first);
        setCurrentIdx(first);
        setNextIdx(second);
      } catch (e) {
        console.error("Failed to load species from DB", e);
      }
    };

    fetchData();
  }, []);

  const handleGuess = (guess: "higher" | "lower") => {
    if (currentIdx === null || nextIdx === null || speciesList.length < 2)
      return;

    const currentDepth = speciesList[currentIdx].average_depth;
    const nextDepth = speciesList[nextIdx].average_depth;

    const correct =
      (guess === "higher" && nextDepth < currentDepth) ||
      (guess === "lower" && nextDepth > currentDepth);

    setShowNextDepth(true);

    setTimeout(() => {
      if (correct) {
        setScore((s) => s + 1);
        setCurrentIdx(nextIdx);
        const newNextIdx = getRandomIndex(speciesList.length, nextIdx);
        setNextIdx(newNextIdx);
        setShowNextDepth(false);
      } else {
        setGameOver(true);
      }
    }, 1500);
  };

  const handleRestart = () => {
    if (speciesList.length < 2) return;
    const first = getRandomIndex(speciesList.length);
    const second = getRandomIndex(speciesList.length, first);
    setCurrentIdx(first);
    setNextIdx(second);
    setScore(0);
    setGameOver(false);
    setShowNextDepth(false);
  };

  if (speciesList.length === 0 || currentIdx === null || nextIdx === null) {
    return <div className="text-center pt-8">Loading game...</div>;
  }

  const SpeciesCard = ({
    idx,
    showDepth,
  }: {
    idx: number;
    showDepth?: boolean;
  }) => {
    const species = speciesList[idx];
    return (
      <div className="py-4 border-3 rounded w-full h-full">
        <div className="text-lg font-bold">{species.common_name}</div>
        <div className="text-gray-700 text-sm">({species.scientific_name})</div>
        {showDepth !== false ? (
          <div className="pt-2 w-full">
            <div>Lives at ~{species.average_depth}m*</div>
            <div className="text-gray-700 text-sm">
              *Calculated from {species.occurrence_count} observations
            </div>
          </div>
        ) : (
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
    <div className="flex flex-col w-full h-full gap-4 text-center items-center">
      <h1 className="text-2xl font-bold">Which species lives deeper?</h1>

      {!gameOver ? (
        <>
          <SpeciesCard idx={currentIdx} />
          <SpeciesCard idx={nextIdx} showDepth={showNextDepth} />
          <p className="text-lg pt-2">Score: {score}</p>
        </>
      ) : (
        <div className="space-y-4">
          <p className="text-xl font-semibold">Game Over!</p>
          <p className="text-lg">Final Score: {score}</p>
          <Button className="w-24" onClick={handleRestart}>
            Restart
          </Button>
        </div>
      )}
    </div>
  );
}
