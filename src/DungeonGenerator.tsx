import { useCallback } from "react";
import type { DungeonOptions } from "./dungeon/types";
import { DEFAULT_OPTIONS, FIELDS } from "./ui/options";
import { SelectField } from "./ui/SelectField";
import { Legend } from "./ui/Legend";
import { Codex } from "./ui/Codex";
import { randomSeed, useMapTool } from "./ui/useMapTool";
import { ExportControls, MapStage, NameSeedFields } from "./ui/MapControls";

// The structural options "Random Dungeon" rerolls; size and style stay put.
const RANDOMIZE: (keyof DungeonOptions)[] = [
  "dungeon_layout",
  "room_layout",
  "room_size",
  "door_set",
  "corridor_layout",
  "remove_deadends",
  "add_stairs",
];

export function DungeonGenerator() {
  const tool = useMapTool("dungeon", DEFAULT_OPTIONS);
  const { options, set, setOptions, dungeon, content } = tool;

  const randomDungeon = useCallback(() => {
    setOptions((prev) => {
      const next: DungeonOptions = { ...prev, seed: randomSeed() };
      for (const field of FIELDS) {
        if (!RANDOMIZE.includes(field.key)) continue;
        const choices = field.options.filter((o) => o.value !== "Custom");
        (next[field.key] as string) =
          choices[Math.floor(Math.random() * choices.length)].value;
      }
      return next;
    });
  }, [setOptions]);

  return (
    <div className="app">
      <aside className="sidebar">
        <header className="brand">
          <a className="back-link" href="#/">
            ← All tools
          </a>
          <h1>Dungeon Generator</h1>
          <p className="tagline">Vaultwright</p>
        </header>

        <NameSeedFields tool={tool} nameLabel="Dungeon">
          <button className="primary-btn" onClick={randomDungeon}>
            Random Dungeon
          </button>
        </NameSeedFields>

        <div className="group">
          {FIELDS.map((field) => (
            <SelectField
              key={field.key}
              field={field}
              value={String(options[field.key])}
              onChange={(v) =>
                set(field.key, v as DungeonOptions[typeof field.key])
              }
            />
          ))}

          {options.dungeon_size === "Custom" && (
            <div className="field custom-size">
              <span>Custom (cols × rows)</span>
              <div className="name-row">
                <input
                  type="number"
                  value={options.map_cols}
                  min={7}
                  max={201}
                  onChange={(e) => set("map_cols", Number(e.target.value))}
                />
                <input
                  type="number"
                  value={options.map_rows}
                  min={7}
                  max={201}
                  onChange={(e) => set("map_rows", Number(e.target.value))}
                />
              </div>
            </div>
          )}
        </div>

        <ExportControls tool={tool} />
        <Legend style={options.map_style} />

        <footer className="credit">
          A from-scratch, client-side remake of donjon's classic 5e dungeon
          generator. Same seed → same dungeon, and the address bar links to
          this one.
        </footer>
      </aside>

      <MapStage
        tool={tool}
        meta={
          <>
            {dungeon.rooms.length} rooms · {dungeon.doors.length} doors ·{" "}
            {dungeon.stairs.length} stairs
          </>
        }
        panel={
          <Codex
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
