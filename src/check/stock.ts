// The written descriptions must agree with the map.

import { generate } from "../dungeon/generate";
import { stockDungeon } from "../content/stock";
import { DEFAULT_OPTIONS, FIELDS } from "../ui/options";
import type { DoorSet, DungeonLayout } from "../dungeon/types";
import { choices, fail } from "./util";

export function checkStock(): string {
  const field = (k: string) => FIELDS.find((f) => f.key === k)!.options;
  const doorSets = choices<DoorSet>(field("door_set"));
  const layouts = [...choices<DungeonLayout>(field("dungeon_layout")), "FiveRoom" as const];
  let doors = 0;
  for (const door_set of doorSets) {
    for (let seed = 1; seed <= 40; seed++) {
      const dungeon_layout = layouts[seed % layouts.length];
      const d = generate({ ...DEFAULT_OPTIONS, seed, door_set, dungeon_layout });
      const content = stockDungeon(d);
      const again = stockDungeon(d);
      if (JSON.stringify([...again.rooms]) !== JSON.stringify([...content.rooms])) {
        fail(`seed ${seed}: stocking is not deterministic`);
      }
      for (const room of d.rooms) {
        const entries = content.rooms.get(room.id)!.entries;
        if (d.rooms.length > 1 && !entries.length) {
          fail(`seed ${seed} room ${room.id}: no way in listed`);
        }
        for (const entry of entries) {
          doors++;
          const saysLocked = /\bLocked\b/.test(entry.title);
          if (saysLocked !== (entry.doorType === "lock")) {
            fail(`seed ${seed} room ${room.id}: ${entry.doorType} door described as "${entry.title}"`);
          }
        }
      }
    }
  }
  return `${doors} door entries match their map glyphs, every room has a way in`;
}
