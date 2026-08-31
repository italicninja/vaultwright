import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { generate } from "./dungeon/generate";
import { stockDungeon } from "./content/stock";
import type { DungeonOptions } from "./dungeon/types";
import { renderDungeon, measure, hitRoom } from "./render/draw";
import { DEFAULT_OPTIONS, FIELDS, randomName } from "./ui/options";
import { SelectField } from "./ui/SelectField";
import { Brief } from "./ui/Brief";
import { Legend } from "./ui/Legend";

const MAX_SEED = 2147483647;
const randInt = (n: number) => Math.floor(Math.random() * n);

// The five-room layout drives everything here, so the map controls are only
// the ones that still mean something for a single-session adventure.
const CONTROLS: (keyof DungeonOptions)[] = [
  "dungeon_size",
  "room_size",
  "door_set",
  "map_style",
  "grid",
];

const BASE: DungeonOptions = {
  ...DEFAULT_OPTIONS,
  dungeon_layout: "FiveRoom",
  dungeon_size: "Small",
  room_size: "Large",
  add_stairs: "Yes",
};

export function FiveRoomDungeon() {
  const [options, setOptions] = useState<DungeonOptions>(() => ({
    ...BASE,
    seed: randInt(MAX_SEED),
    name: randomName(Math.random),
  }));
  const [cellSize, setCellSize] = useState(20);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const dungeon = useMemo(() => generate(options), [options]);
  const content = useMemo(() => stockDungeon(dungeon), [dungeon]);

  useEffect(() => setSelectedRoom(null), [dungeon]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    renderDungeon(canvas, dungeon, {
      cellSize,
      grid: options.grid,
      showLabels: true,
      selectedRoom,
      features: content.corridorFeatures,
    });
  }, [dungeon, cellSize, options.grid, selectedRoom, content]);

  const set = useCallback(
    <K extends keyof DungeonOptions>(key: K, value: DungeonOptions[K]) => {
      setOptions((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const onCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const id = hitRoom(
        dungeon,
        e.clientX - rect.left,
        e.clientY - rect.top,
        cellSize,
      );
      setSelectedRoom((cur) => (id === cur ? null : id));
    },
    [dungeon, cellSize],
  );

  const newAdventure = useCallback(() => {
    setOptions((prev) => ({
      ...prev,
      seed: randInt(MAX_SEED),
      name: randomName(Math.random),
    }));
  }, []);

  const downloadPng = useCallback(() => {
    const off = document.createElement("canvas");
    renderDungeon(off, dungeon, {
      cellSize: 24,
      grid: options.grid,
      showLabels: true,
      features: content.corridorFeatures,
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
  }, [dungeon, options.grid, options.name, options.seed, content]);

  const dims = measure(dungeon, cellSize);
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

        <div className="group">
          <label className="field name-field">
            <span>Adventure</span>
            <div className="name-row">
              <input
                type="text"
                value={options.name}
                onChange={(e) => set("name", e.target.value)}
              />
              <button
                className="icon-btn"
                title="New name"
                onClick={() => set("name", randomName(Math.random))}
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
              <button
                className="icon-btn"
                title="New seed"
                onClick={() => set("seed", randInt(MAX_SEED))}
              >
                ↻
              </button>
            </div>
          </label>

          <button className="primary-btn" onClick={newAdventure}>
            New Adventure
          </button>
        </div>

        <div className="group">
          {FIELDS.filter((f) => CONTROLS.includes(f.key)).map((field) => (
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

        <div className="group">
          <label className="field">
            <span>Cell Size: {cellSize}px</span>
            <input
              type="range"
              min={8}
              max={40}
              value={cellSize}
              onChange={(e) => setCellSize(Number(e.target.value))}
            />
          </label>
          <button className="primary-btn" onClick={downloadPng}>
            Download PNG
          </button>
        </div>

        <Legend style={options.map_style} />

        <footer className="credit">
          The five-room structure comes from John Four at roleplayingtips.com;
          the eleven shapes from Matthew J. Neagley's forms of the five room
          dungeon at Gnome Stew.
        </footer>
      </aside>

      <main className="stage">
        <div className="stage-bar">
          <strong>{options.name}</strong>
          <span className="meta">
            {content.adventure?.topology} · {beats.length} beats ·{" "}
            {dungeon.rooms.length} rooms · {dungeon.doors.length} doors ·{" "}
            {dims.width}×{dims.height}px
          </span>
        </div>
        <div className="stage-body">
          <div className="canvas-scroll">
            <canvas
              ref={canvasRef}
              className="map-canvas"
              onClick={onCanvasClick}
            />
          </div>
          <Brief
            dungeon={dungeon}
            content={content}
            name={options.name}
            selectedRoom={selectedRoom}
            onSelectRoom={setSelectedRoom}
          />
        </div>
      </main>
    </div>
  );
}
