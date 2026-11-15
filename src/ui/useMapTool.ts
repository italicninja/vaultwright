// State and behaviour shared by every map tool: options (mirrored into the URL
// so a dungeon can be shared by link), generation, stocking, the canvas, room
// selection and PNG export.

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { generate } from "../dungeon/generate";
import { stockDungeon } from "../content/stock";
import type { DungeonOptions } from "../dungeon/types";
import { renderDungeon, measure, hitRoom } from "../render/draw";
import { FIELDS, randomName } from "./options";

export const MAX_SEED = 2147483647;
export const randomSeed = () => Math.floor(Math.random() * MAX_SEED);

const NUMERIC: (keyof DungeonOptions)[] = ["seed", "map_cols", "map_rows"];

/** Reads options for `slug` out of a `#/slug?key=value` hash. */
export function optionsFromHash(
  hash: string,
  slug: string,
  base: DungeonOptions,
): Partial<DungeonOptions> | null {
  const m = hash.match(/^#\/?([^?]*)\?(.*)$/);
  if (!m || m[1] !== slug) return null;
  const params = new URLSearchParams(m[2]);
  const out: Partial<DungeonOptions> = {};
  for (const [key, raw] of params) {
    const k = key as keyof DungeonOptions;
    if (!(k in base)) continue;
    if (NUMERIC.includes(k)) {
      const n = Number(raw);
      if (Number.isFinite(n) && n >= 0) (out[k] as number) = Math.floor(n);
    } else if (k === "name") {
      out.name = raw;
    } else {
      // Only accept a value the matching control actually offers.
      const field = FIELDS.find((f) => f.key === k);
      if (field?.options.some((o) => o.value === raw)) {
        (out[k] as string) = raw;
      }
    }
  }
  return out;
}

/** Seed and name always, plus every option that differs from `base`. */
export function hashFor(
  slug: string,
  options: DungeonOptions,
  base: DungeonOptions,
): string {
  const params = new URLSearchParams();
  params.set("seed", String(options.seed));
  if (options.name) params.set("name", options.name);
  for (const key of Object.keys(base) as (keyof DungeonOptions)[]) {
    if (key === "seed" || key === "name") continue;
    if (options[key] !== base[key]) params.set(key, String(options[key]));
  }
  return `#/${slug}?${params}`;
}

export function useMapTool(slug: string, base: DungeonOptions) {
  const [options, setOptions] = useState<DungeonOptions>(() => ({
    ...base,
    seed: randomSeed(),
    name: randomName(Math.random),
    ...optionsFromHash(location.hash, slug, base),
  }));
  const [cellSize, setCellSize] = useState(20);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const dungeon = useMemo(() => generate(options), [options]);
  const content = useMemo(() => stockDungeon(dungeon), [dungeon]);

  // A fresh dungeon clears the selection.
  useEffect(() => setSelectedRoom(null), [dungeon]);

  // Keep the address bar pointing at this exact dungeon. replaceState does not
  // fire hashchange, so this never loops back into the listener below.
  useEffect(() => {
    const next = hashFor(slug, options, base);
    if (location.hash !== next) history.replaceState(null, "", next);
  }, [slug, options, base]);

  // A pasted or edited link on the same tool loads that dungeon.
  useEffect(() => {
    const onHash = () => {
      const parsed = optionsFromHash(location.hash, slug, base);
      if (parsed) setOptions((prev) => ({ ...base, name: prev.name, ...parsed }));
    };
    addEventListener("hashchange", onHash);
    return () => removeEventListener("hashchange", onHash);
  }, [slug, base]);

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
    (e: MouseEvent<HTMLCanvasElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
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

  const downloadPng = useCallback(() => {
    // Render at a crisp fixed cell size to an offscreen canvas.
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
      // Revoking synchronously can cancel the download in some browsers.
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
    }, "image/png");
  }, [dungeon, options.grid, options.name, options.seed, content]);

  return {
    options,
    setOptions,
    set,
    dungeon,
    content,
    cellSize,
    setCellSize,
    selectedRoom,
    setSelectedRoom,
    canvasRef,
    onCanvasClick,
    downloadPng,
    dims: measure(dungeon, cellSize),
  };
}

export type MapTool = ReturnType<typeof useMapTool>;
