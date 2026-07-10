// Works out where each door leads. A door either sits directly against another
// room (adjacency) or opens into a corridor "pocket". If that pocket touches
// exactly one other room, the door leads there; if it opens into the wider maze
// (several rooms), there is no single destination.

import { CORRIDOR, ENTRANCE, ROOM, roomIdOf } from "./flags";
import type { Dungeon, Dir } from "./types";

const DI: Record<Dir, number> = { north: -1, south: 1, west: 0, east: 0 };
const DJ: Record<Dir, number> = { north: 0, south: 0, west: -1, east: 1 };

export function computeConnectivity(dungeon: Dungeon): void {
  const { cell, n_rows, n_cols } = dungeon;
  const isCorridor = (r: number, c: number) =>
    !!(cell[r]?.[c] & (CORRIDOR | ENTRANCE)) && !(cell[r]?.[c] & ROOM);

  // Flood-fill corridor/entrance cells into connected components.
  const comp: number[][] = Array.from({ length: n_rows + 1 }, () =>
    new Array<number>(n_cols + 1).fill(-1),
  );
  let nextComp = 0;
  for (let r = 0; r <= n_rows; r++) {
    for (let c = 0; c <= n_cols; c++) {
      if (!isCorridor(r, c) || comp[r][c] !== -1) continue;
      const id = nextComp++;
      const stack: [number, number][] = [[r, c]];
      comp[r][c] = id;
      while (stack.length) {
        const [cr, cc] = stack.pop()!;
        for (const d of ["north", "south", "west", "east"] as Dir[]) {
          const nr = cr + DI[d];
          const nc = cc + DJ[d];
          if (isCorridor(nr, nc) && comp[nr][nc] === -1) {
            comp[nr][nc] = id;
            stack.push([nr, nc]);
          }
        }
      }
    }
  }

  // For each corridor component, collect the rooms whose doors open into it.
  const compRooms = new Map<number, Set<number>>();
  const doorComp = new Map<(typeof dungeon.doors)[number], number>();
  for (const door of dungeon.doors) {
    const outR = door.row + DI[door.dir];
    const outC = door.col + DJ[door.dir];
    const outCell = cell[outR]?.[outC] ?? 0;

    if (outCell & ROOM) {
      door.destId = roomIdOf(outCell); // directly against another room
      continue;
    }
    const cid = comp[outR]?.[outC] ?? -1;
    if (cid < 0) continue;
    doorComp.set(door, cid);
    if (!compRooms.has(cid)) compRooms.set(cid, new Set());
    compRooms.get(cid)!.add(door.roomId);
  }

  // Resolve corridor-pocket doors: unique other room → destination.
  for (const [door, cid] of doorComp) {
    const rooms = compRooms.get(cid)!;
    const others = [...rooms].filter((id) => id !== door.roomId);
    door.destId = others.length === 1 ? others[0] : undefined;
  }
}
