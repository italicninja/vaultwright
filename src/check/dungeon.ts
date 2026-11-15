// Structural invariants of the main generator, across every layout, room
// layout, size and dead-end setting.

import { generate } from "../dungeon/generate";
import { buildMask, MASKS } from "../dungeon/masks";
import { CORRIDOR, DOORSPACE, ROOM } from "../dungeon/flags";
import { DEFAULT_OPTIONS, FIELDS } from "../ui/options";
import type {
  DungeonLayout,
  DungeonOptions,
  DungeonSize,
  RemoveDeadends,
  RoomLayout,
  RoomSize,
} from "../dungeon/types";
import { choices, fail, islands, reachableRooms } from "./util";

const field = (k: string) => FIELDS.find((f) => f.key === k)!.options;

export function checkMasks(): string {
  // Corridors cannot cross a corner, so a mask must be one edge-connected piece.
  const dims = [
    [20, 20],
    [64, 50],
    [130, 104],
  ];
  for (const layout of [...Object.keys(MASKS), "Round"]) {
    for (const [rows, cols] of dims) {
      const n = islands(buildMask(layout, rows, cols)!);
      if (n !== 1) fail(`${layout} mask at ${cols}x${rows} has ${n} islands`);
    }
  }
  return `${Object.keys(MASKS).length + 1} layout masks connected`;
}

export function checkDungeons(): string {
  const layouts = choices<DungeonLayout>(field("dungeon_layout"));
  const roomLayouts = choices<RoomLayout>(field("room_layout"));
  const sizes: DungeonSize[] = ["Tiny", "Medium", "Colossal"];
  const roomSizes = choices<RoomSize>(field("room_size"));
  const deadends = choices<RemoveDeadends>(field("remove_deadends"));
  let checked = 0;

  for (const dungeon_layout of layouts) {
    for (const room_layout of roomLayouts) {
      for (const dungeon_size of sizes) {
        for (let seed = 1; seed <= 8; seed++) {
          const options: DungeonOptions = {
            ...DEFAULT_OPTIONS,
            seed,
            dungeon_layout,
            room_layout,
            dungeon_size,
            room_size: roomSizes[seed % roomSizes.length],
            remove_deadends: deadends[seed % deadends.length],
            add_stairs: seed % 2 ? "Yes" : "Many",
          };
          const where = `seed ${seed} ${dungeon_layout}/${room_layout}/${dungeon_size}/${options.room_size}/dead=${options.remove_deadends || "none"}`;
          const d = generate(options);

          const again = generate(options);
          if (again.cell.some((row, r) => row.some((v, c) => v !== d.cell[r][c]))) {
            fail(`${where}: same options produced a different map`);
          }

          if (d.rooms.length > 1) {
            const reached = reachableRooms(d, d.rooms[0].id);
            const lost = d.rooms.filter((r) => !reached.has(r.id));
            if (lost.length) {
              fail(`${where}: rooms ${lost.map((r) => r.id).join(", ")} cut off from room 1`);
            }
          }

          const doorCells = new Set(d.doors.map((x) => `${x.row},${x.col}`));
          d.cell.forEach((row, r) =>
            row.forEach((v, c) => {
              if (v & ROOM && v & CORRIDOR) fail(`${where}: cell ${r},${c} is room and corridor`);
              if (v & DOORSPACE && !doorCells.has(`${r},${c}`)) {
                fail(`${where}: door glyph at ${r},${c} missing from the door list`);
              }
            }),
          );

          if (d.stairs.length < 2) fail(`${where}: ${d.stairs.length} stairs placed`);
          checked++;
        }
      }
    }
  }
  return `${checked} dungeons connected, deterministic, stairs placed`;
}
