// Self-check: every five-room dungeon must actually contain its five beats,
// and every beat must be reachable on foot from the entrance.
// Run: npx esbuild src/dungeon/fiveroom.check.ts --bundle --format=esm
//        --platform=node --outfile=check.mjs && node check.mjs

import { generate } from "./generate";
import { DOORSPACE, OPENSPACE, ROOM, roomIdOf } from "./flags";
import { DEFAULT_OPTIONS } from "../ui/options";
import type { Dungeon } from "./types";

function reachableRooms(dungeon: Dungeon, startId: number): Set<number> {
  const start = dungeon.rooms.find((r) => r.id === startId)!;
  const open = (r: number, c: number) =>
    !!(dungeon.cell[r]?.[c] & (OPENSPACE | DOORSPACE));
  const seen = new Set<string>();
  const rooms = new Set<number>();
  const stack: [number, number][] = [[start.north, start.west]];
  seen.add(`${start.north},${start.west}`);
  while (stack.length) {
    const [r, c] = stack.pop()!;
    const cell = dungeon.cell[r][c];
    if (cell & ROOM) rooms.add(roomIdOf(cell));
    for (const [dr, dc] of [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]) {
      const nr = r + dr;
      const nc = c + dc;
      const key = `${nr},${nc}`;
      if (seen.has(key) || !open(nr, nc)) continue;
      seen.add(key);
      stack.push([nr, nc]);
    }
  }
  return rooms;
}

const sizes = ["Tiny", "Small", "Medium", "Large", "Huge"] as const;
const roomSizes = ["Small", "Medium", "Large", "Huge", "Colossal"] as const;
const shapes = new Set<string>();
let checked = 0;

for (let seed = 1; seed <= 300; seed++) {
  const dungeon = generate({
    ...DEFAULT_OPTIONS,
    seed,
    dungeon_layout: "FiveRoom",
    dungeon_size: sizes[seed % sizes.length],
    room_size: roomSizes[seed % roomSizes.length],
  });
  shapes.add(dungeon.topology!);

  const beats = dungeon.rooms.filter((r) => r.role && r.role !== "Junction");
  const roles = beats.map((r) => r.role);
  if (beats.length !== 5 || new Set(roles).size !== 5) {
    throw new Error(
      `seed ${seed} (${dungeon.topology}): beats are ${roles.join(", ") || "missing"}`,
    );
  }

  const entrance = dungeon.rooms.find((r) => r.role === "Entrance")!;
  const reached = reachableRooms(dungeon, entrance.id);
  for (const room of beats) {
    if (!reached.has(room.id)) {
      throw new Error(
        `seed ${seed} (${dungeon.topology}, ${dungeon.options.dungeon_size}): ` +
          `${room.role} room #${room.id} unreachable from the entrance`,
      );
    }
  }
  checked++;
}

console.log(`ok: ${checked} five-room dungeons, ${shapes.size} topologies used`);
