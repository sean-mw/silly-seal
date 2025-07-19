import { GameState } from "./common";

export interface Species {
  scientific_name: string;
  common_name: string;
  average_depth: number;
  occurrence_count: number;
  image_urls: string[];
}

export interface DepthGameState extends GameState {
  score: number;
  lives: number;
  speciesList?: Species[];
  prevIdx?: number;
  curIdx?: number;
  nextIdx?: number;
}
