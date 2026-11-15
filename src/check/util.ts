// Helpers shared by the self-checks in this folder.

import { DOORSPACE, OPENSPACE, ROOM, roomIdOf } from "../dungeon/flags";
import type { Dungeon } from "../dungeon/types";

const STEPS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
] as const;

/** Rooms reachable on foot (floor and doors) from room `startId`. */
export function reachableRooms(dungeon: Dungeon, startId: number): Set<number> {
  const start = dungeon.rooms.find((r) => r.id === startId)!;
  const open = (r: number, c: number) =>
    !!(dungeon.cell[r]?.[c] & (OPENSPACE | DOORSPACE));
  const seen = new Set<string>([`${start.north},${start.west}`]);
  const rooms = new Set<number>();
  const stack: [number, number][] = [[start.north, start.west]];
  while (stack.length) {
    const [r, c] = stack.pop()!;
    const cell = dungeon.cell[r][c];
    if (cell & ROOM) rooms.add(roomIdOf(cell));
    for (const [dr, dc] of STEPS) {
      const key = `${r + dr},${c + dc}`;
      if (seen.has(key) || !open(r + dr, c + dc)) continue;
      seen.add(key);
      stack.push([r + dr, c + dc]);
    }
  }
  return rooms;
}

/** Number of 4-connected open regions in a boolean grid. */
export function islands(grid: boolean[][]): number {
  const seen = grid.map((row) => row.map(() => false));
  let n = 0;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (!grid[r][c] || seen[r][c]) continue;
      n++;
      const stack = [[r, c]];
      seen[r][c] = true;
      while (stack.length) {
        const [a, b] = stack.pop()!;
        for (const [dr, dc] of STEPS) {
          if (grid[a + dr]?.[b + dc] && !seen[a + dr][b + dc]) {
            seen[a + dr][b + dc] = true;
            stack.push([a + dr, b + dc]);
          }
        }
      }
    }
  }
  return n;
}

export function fail(message: string): never {
  throw new Error(message);
}

/** Every value a select control offers, minus any excluded ones. */
export function choices<T extends string>(
  values: { value: string }[],
  exclude: string[] = [],
): T[] {
  return values.map((o) => o.value).filter((v) => !exclude.includes(v)) as T[];
}
