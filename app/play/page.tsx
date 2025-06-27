"use client";

import Button from "@/components/Button";
import { useState, useEffect } from "react";

type Species = {
  scientific_name: string;
  common_name: string;
  average_depth: number;
  occurrence_count: number;
  image_urls: string[];
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
      (guess === "higher" && nextDepth <= currentDepth) ||
      (guess === "lower" && nextDepth >= currentDepth);

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
      <div
        className="relative w-full h-full max-h-100 rounded overflow-hidden bg-cover bg-center border-3 border-black"
        style={{ backgroundImage: `url(${species.image_urls[0]})` }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>

        <div className="relative z-10 h-full flex flex-col justify-between p-4 text-white">
          <div className="text-center">
            <div className="text-xl font-bold">{species.common_name}</div>
            <div className="text-sm">({species.scientific_name})</div>
          </div>

          {showDepth !== false ? (
            <div className="text-center bg-black opacity-60 rounded p-2">
              <div className="font-semibold opacity-100">
                Lives at ~{species.average_depth}m
              </div>
              <div className="text-xs opacity-100">
                Calculated from {species.occurrence_count} occurrences
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-white text-black opacity-80 hover:opacity-100"
                onClick={() => handleGuess("higher")}
              >
                Shallower
              </Button>
              <Button
                className="flex-1 bg-black text-white opacity-80 hover:opacity-100"
                onClick={() => handleGuess("lower")}
              >
                Deeper
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full h-full gap-2 text-center items-center justify-center">
      {!gameOver ? (
        <>
          <SpeciesCard idx={currentIdx} />
          <SpeciesCard idx={nextIdx} showDepth={showNextDepth} />
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
