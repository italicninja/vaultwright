import { useCallback } from "react";
import type { DungeonOptions } from "./dungeon/types";
import { DEFAULT_OPTIONS, FIELDS, randomName, type OptionDef } from "./ui/options";
import { SelectField } from "./ui/SelectField";
import { Brief } from "./ui/Brief";
import { Legend } from "./ui/Legend";
import { randomSeed, useMapTool } from "./ui/useMapTool";
import { ExportControls, MapStage, NameSeedFields } from "./ui/MapControls";

// The five-room layout drives everything here, so the map controls are only
// the ones that still mean something for a single-session adventure.
const CONTROLS: (keyof DungeonOptions)[] = [
  "dungeon_size",
  "room_size",
  "door_set",
  "map_style",
  "grid",
];

// Fine and Diminutive are too small to hold five rooms with corridors between
// them (the generator floors them anyway), and Custom has no inputs here.
const TOO_SMALL = new Set(["Fine", "Diminutive", "Custom"]);
const FIVE_ROOM_FIELDS: OptionDef[] = FIELDS.filter((f) =>
  CONTROLS.includes(f.key),
).map((f) =>
  f.key === "dungeon_size"
    ? { ...f, options: f.options.filter((o) => !TOO_SMALL.has(o.value)) }
    : f,
);

const BASE: DungeonOptions = {
  ...DEFAULT_OPTIONS,
  dungeon_layout: "FiveRoom",
  dungeon_size: "Small",
  room_size: "Large",
  add_stairs: "Yes",
};

export function FiveRoomDungeon() {
  const tool = useMapTool("fiveroom", BASE);
  const { options, set, setOptions, dungeon, content } = tool;

  const newAdventure = useCallback(() => {
    setOptions((prev) => ({
      ...prev,
      seed: randomSeed(),
      name: randomName(Math.random),
    }));
  }, [setOptions]);

  const beats = dungeon.rooms.filter((r) => r.role && r.role !== "Junction");

  return (
    <div className="app">
      <aside className="sidebar">
        <header className="brand">
          <a className="back-link" href="#/">
            ← All tools
          </a>
          <h1>Five Room Dungeon</h1>
          <p className="tagline">Vaultwright</p>
        </header>

        <NameSeedFields tool={tool} nameLabel="Adventure">
          <button className="primary-btn" onClick={newAdventure}>
            New Adventure
          </button>
        </NameSeedFields>

        <div className="group">
          {FIVE_ROOM_FIELDS.map((field) => (
            <SelectField
              key={field.key}
              field={field}
              value={String(options[field.key])}
              onChange={(v) =>
                set(field.key, v as DungeonOptions[typeof field.key])
              }
            />
          ))}
        </div>

        <ExportControls tool={tool} />
        <Legend style={options.map_style} />

        <footer className="credit">
          The five-room structure comes from John Four at roleplayingtips.com;
          the eleven shapes from Matthew J. Neagley's forms of the five room
          dungeon at Gnome Stew.
        </footer>
      </aside>

      <MapStage
        tool={tool}
        meta={
          <>
            {content.adventure?.topology} · {beats.length} beats ·{" "}
            {dungeon.rooms.length} rooms · {dungeon.doors.length} doors
          </>
        }
        panel={
          <Brief
            dungeon={dungeon}
            content={content}
            name={options.name}
            selectedRoom={tool.selectedRoom}
            onSelectRoom={tool.setSelectedRoom}
          />
        }
      />
    </div>
  );
}
