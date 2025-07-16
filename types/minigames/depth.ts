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
  speciesList: Species[];
  showNextDepth: boolean;
  currentIdx?: number;
  nextIdx?: number;
}
