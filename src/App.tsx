import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { generate } from "./dungeon/generate";
import type { DungeonOptions } from "./dungeon/types";
import { renderDungeon, measure } from "./render/draw";
import {
  DEFAULT_OPTIONS,
  FIELDS,
  randomName,
  type OptionDef,
} from "./ui/options";
import { Legend } from "./ui/Legend";

const MAX_SEED = 2147483647;
const randInt = (n: number) => Math.floor(Math.random() * n);

export function App() {
  const [options, setOptions] = useState<DungeonOptions>(() => ({
    ...DEFAULT_OPTIONS,
    seed: randInt(MAX_SEED),
    name: randomName(Math.random),
  }));
  const [cellSize, setCellSize] = useState(20);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const dungeon = useMemo(() => generate(options), [options]);

  const roomCount = dungeon.rooms.filter((room) => {
    const cr = Math.round((room.north + room.south) / 2);
    const cc = Math.round((room.west + room.east) / 2);
    return !!dungeon.cell[cr]?.[cc];
  }).length;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    renderDungeon(canvas, dungeon, {
      cellSize,
      grid: options.grid,
      showLabels: true,
    });
  }, [dungeon, cellSize, options.grid]);

  const set = useCallback(
    <K extends keyof DungeonOptions>(key: K, value: DungeonOptions[K]) => {
      setOptions((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const newSeed = useCallback(() => {
    setOptions((prev) => ({ ...prev, seed: randInt(MAX_SEED) }));
  }, []);

  const rerollName = useCallback(() => {
    setOptions((prev) => ({ ...prev, name: randomName(Math.random) }));
  }, []);

  const randomDungeon = useCallback(() => {
    setOptions((prev) => {
      const next: DungeonOptions = { ...prev, seed: randInt(MAX_SEED) };
      const randomize: (keyof DungeonOptions)[] = [
        "dungeon_layout",
        "peripheral_egress",
        "room_layout",
        "room_size",
        "room_polymorph",
        "door_set",
        "corridor_layout",
        "remove_deadends",
        "add_stairs",
      ];
      for (const field of FIELDS) {
        if (!randomize.includes(field.key)) continue;
        const choices = field.options.filter((o) => o.value !== "Custom");
        (next[field.key] as string) = choices[randInt(choices.length)].value;
      }
      return next;
    });
  }, []);

  const downloadPng = useCallback(() => {
    // Render at a crisp fixed cell size to an offscreen canvas.
    const off = document.createElement("canvas");
    renderDungeon(off, dungeon, {
      cellSize: 24,
      grid: options.grid,
      showLabels: true,
    });
    off.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const safe =
        options.name.replace(/[^a-z0-9]+/gi, "_").replace(/^_+|_+$/g, "") ||
        String(options.seed);
      a.download = `${safe}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }, [dungeon, options.grid, options.name, options.seed]);

  const dims = measure(dungeon, cellSize);

  return (
    <div className="app">
      <aside className="sidebar">
        <header className="brand">
          <h1>Vaultwright</h1>
          <p className="tagline">5e Dungeon Generator</p>
        </header>

        <div className="group">
          <label className="field name-field">
            <span>Dungeon</span>
            <div className="name-row">
              <input
                type="text"
                value={options.name}
                onChange={(e) => set("name", e.target.value)}
              />
              <button
                className="icon-btn"
                title="New name"
                onClick={rerollName}
              >
                ↻
              </button>
            </div>
          </label>

          <label className="field">
            <span>Seed</span>
            <div className="name-row">
              <input
                type="number"
                value={options.seed}
                min={0}
                max={MAX_SEED}
                onChange={(e) =>
                  set("seed", Math.abs(Number(e.target.value)) || 0)
                }
              />
              <button className="icon-btn" title="New seed" onClick={newSeed}>
                ↻
              </button>
            </div>
          </label>

          <button className="primary-btn" onClick={randomDungeon}>
            🎲 Random Dungeon
          </button>
        </div>

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

        <div className="group">
          <label className="field">
            <span>Cell Size — {cellSize}px</span>
            <input
              type="range"
              min={8}
              max={40}
              value={cellSize}
              onChange={(e) => setCellSize(Number(e.target.value))}
            />
          </label>
          <button className="primary-btn" onClick={downloadPng}>
            ⬇ Download PNG
          </button>
        </div>

        <Legend style={options.map_style} />

        <footer className="credit">
          A from-scratch, client-side remake of donjon's classic 5e dungeon
          generator. Same seed → same dungeon.
        </footer>
      </aside>

      <main className="stage">
        <div className="stage-bar">
          <strong>{options.name}</strong>
          <span className="meta">
            {roomCount} rooms · {dungeon.doors.length} doors ·{" "}
            {dungeon.stairs.length} stairs · {dims.width}×{dims.height}px
          </span>
        </div>
        <div className="canvas-scroll">
          <canvas ref={canvasRef} className="map-canvas" />
        </div>
      </main>
    </div>
  );
}

function SelectField({
  field,
  value,
  onChange,
}: {
  field: OptionDef;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="field">
      <span>{field.label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {field.options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.text ?? opt.value}
          </option>
        ))}
      </select>
    </label>
  );
}
