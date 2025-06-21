export type Cell = {
  hasRock: boolean;
  revealed: boolean;
  flagged: boolean;
  adjacentRocks: number;
};

export const GRID_SIZE = 8;
const ROCK_COUNT = 10;

function createEmptyGrid(): Cell[][] {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => ({
      hasRock: false,
      revealed: false,
      flagged: false,
      adjacentRocks: 0,
    }))
  );
}

function placeRocks(grid: Cell[][]): void {
  let count = 0;
  while (count < ROCK_COUNT) {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    if (!grid[y][x].hasRock) {
      grid[y][x].hasRock = true;
      count++;
    }
  }
}

function calculateAdjacents(grid: Cell[][]): void {
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (grid[y][x].hasRock) continue;
      let count = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const ny = y + dy;
          const nx = x + dx;
          if (
            ny >= 0 &&
            ny < GRID_SIZE &&
            nx >= 0 &&
            nx < GRID_SIZE &&
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

export function initializeGrid(): Cell[][] {
  const grid = createEmptyGrid();
  placeRocks(grid);
  calculateAdjacents(grid);
  return grid;
}

export function revealEmptyCells(grid: Cell[][], x: number, y: number): void {
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
            nx >= GRID_SIZE ||
            ny >= GRID_SIZE
          ) {
            continue;
          }
          stack.push([nx, ny]);
        }
      }
    }
  }
}
