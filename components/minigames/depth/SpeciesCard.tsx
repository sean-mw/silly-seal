import React from "react";
import Button from "@/components/Button";
import { Species } from "@/types/minigames/depth";
import { ArrowDown, ArrowUp } from "lucide-react";

interface SpeciesCardProps {
  species: Species;
  showDepth?: boolean;
  onGuess?: (guess: "higher" | "lower") => void;
  disabled?: boolean;
}

export default function SpeciesCard({
  species,
  showDepth = false,
  onGuess,
  disabled = false,
}: SpeciesCardProps) {
  return (
    <div
      className="relative w-full h-full max-h-100 rounded overflow-hidden bg-cover bg-center border-3 border-black"
      style={{ backgroundImage: `url(${species.image_urls[0]})` }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 h-full flex flex-col justify-between p-4 text-white">
        <div className="text-center">
          <div className="text-xl font-bold">{species.common_name}</div>
          <div className="text-sm">({species.scientific_name})</div>
        </div>

        {showDepth ? (
          <div className="text-center bg-black/60 rounded p-2">
            <div className="font-semibold">
              Lives at ~{species.average_depth}m
            </div>
            <div className="text-xs">
              Calculated from {species.occurrence_count} occurrences
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button
              className="flex-1 bg-white/80 text-black hover:bg-white/100"
              onClick={() => onGuess?.("higher")}
              disabled={disabled}
            >
              <span className="flex flex-row gap-2">
                <ArrowUp />
                Shallower
              </span>
            </Button>
            <Button
              className="flex-1 bg-black/80 text-white hover:bg-black/100"
              onClick={() => onGuess?.("lower")}
              disabled={disabled}
            >
              <span className="flex flex-row gap-2">
                <ArrowDown />
                Deeper
              </span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
