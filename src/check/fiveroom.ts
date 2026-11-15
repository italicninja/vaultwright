// Every five-room dungeon must contain its five beats, every beat must be
// reachable on foot from the entrance, and no room may shrink below 3 cells a
// side. Checked across every dungeon size and room size pair.

import { generate } from "../dungeon/generate";
import { DEFAULT_OPTIONS, FIELDS } from "../ui/options";
import { TOPOLOGIES } from "../dungeon/fiveroom";
import type { DungeonSize, RoomSize } from "../dungeon/types";
import { choices, fail, reachableRooms } from "./util";

export function checkFiveRoom(): string {
  const field = (k: string) => FIELDS.find((f) => f.key === k)!.options;
  const sizes = choices<DungeonSize>(field("dungeon_size"), ["Custom"]);
  const roomSizes = choices<RoomSize>(field("room_size"));
  const shapes = new Set<string>();
  let checked = 0;

  for (const dungeon_size of sizes) {
    for (const room_size of roomSizes) {
      for (let seed = 1; seed <= 30; seed++) {
        const dungeon = generate({
          ...DEFAULT_OPTIONS,
          seed,
          dungeon_layout: "FiveRoom",
          dungeon_size,
          room_size,
        });
        const where = `seed ${seed} (${dungeon.topology}, ${dungeon_size}/${room_size})`;
        shapes.add(dungeon.topology!);

        const beats = dungeon.rooms.filter(
          (r) => r.role && r.role !== "Junction",
        );
        const roles = beats.map((r) => r.role);
        if (beats.length !== 5 || new Set(roles).size !== 5) {
          fail(`${where}: beats are ${roles.join(", ") || "missing"}`);
        }

        const entrance = dungeon.rooms.find((r) => r.role === "Entrance")!;
        const reached = reachableRooms(dungeon, entrance.id);
        for (const room of dungeon.rooms) {
          if (!reached.has(room.id)) {
            fail(`${where}: ${room.role} room #${room.id} unreachable from the entrance`);
          }
          if (room.width < 3 || room.height < 3) {
            fail(`${where}: room #${room.id} is ${room.width}x${room.height} cells`);
          }
        }
        checked++;
      }
    }
  }
  if (shapes.size !== TOPOLOGIES.length) {
    fail(`only ${shapes.size} of ${TOPOLOGIES.length} topologies were used`);
  }
  return `${checked} five-room dungeons, ${shapes.size} topologies`;
}
