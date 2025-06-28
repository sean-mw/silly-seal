import { Cell } from "@/types/minigames/clean";
import { GAME_CONFIG } from "./config";

export class CleanGameEngine {
  static createEmptyGrid(): Cell[][] {
    return Array.from({ length: GAME_CONFIG.GRID_SIZE }, () =>
      Array.from({ length: GAME_CONFIG.GRID_SIZE }, () => ({
        hasRock: false,
        revealed: false,
        flagged: false,
        adjacentRocks: 0,
      }))
    );
  }

  static placeRocks(grid: Cell[][]): void {
    let count = 0;
    while (count < GAME_CONFIG.ROCK_COUNT) {
      const x = Math.floor(Math.random() * GAME_CONFIG.GRID_SIZE);
      const y = Math.floor(Math.random() * GAME_CONFIG.GRID_SIZE);
      if (!grid[y][x].hasRock) {
        grid[y][x].hasRock = true;
        count++;
      }
    }
  }

  static calculateAdjacents(grid: Cell[][]): void {
    for (let y = 0; y < GAME_CONFIG.GRID_SIZE; y++) {
      for (let x = 0; x < GAME_CONFIG.GRID_SIZE; x++) {
        if (grid[y][x].hasRock) continue;
        let count = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const ny = y + dy;
            const nx = x + dx;
            if (
              ny >= 0 &&
              ny < GAME_CONFIG.GRID_SIZE &&
              nx >= 0 &&
              nx < GAME_CONFIG.GRID_SIZE &&
              grid[ny][nx].hasRock
            ) {
              count++;
            }
          }
        }
        grid[y][x].adjacentRocks = count;
      }
    }
  }

  static initializeGrid(): Cell[][] {
    const grid = CleanGameEngine.createEmptyGrid();
    CleanGameEngine.placeRocks(grid);
    CleanGameEngine.calculateAdjacents(grid);
    return grid;
  }

  static revealEmptyCells(grid: Cell[][], x: number, y: number): void {
    const stack = [[x, y]];
    while (stack.length > 0) {
      const [cx, cy] = stack.pop()!;
      const cell = grid[cy][cx];
      if (cell.revealed || cell.hasRock || cell.flagged) continue;
      cell.revealed = true;
      if (cell.adjacentRocks === 0) {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = cx + dx;
            const ny = cy + dy;
            if (
              (dx === 0 && dy === 0) ||
              nx < 0 ||
              ny < 0 ||
              nx >= GAME_CONFIG.GRID_SIZE ||
              ny >= GAME_CONFIG.GRID_SIZE
            ) {
              continue;
            }
            stack.push([nx, ny]);
          }
        }
      }
    }
  }

  static isCleared(grid: Cell[][]): boolean {
    return grid.every((row) =>
      row.every(
        (cell) =>
          (cell.hasRock && !cell.revealed) || (!cell.hasRock && cell.revealed)
      )
    );
  }
}
