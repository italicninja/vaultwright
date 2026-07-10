// Colour palettes for each map style. `floor` is open space, `wall` is solid
// rock, `grid` is the grid overlay, `ink` is used for doors/stairs/labels.
import type { MapStyle } from "../dungeon/types";

export interface Palette {
  floor: string;
  wall: string;
  grid: string;
  ink: string;
  shadow: string; // subtle inner-edge shading around open areas
}

export const PALETTES: Record<MapStyle, Palette> = {
  Standard: {
    floor: "#ffffff",
    wall: "#0d0d0d",
    grid: "#cccccc",
    ink: "#1a1a1a",
    shadow: "rgba(0,0,0,0.10)",
  },
  Classic: {
    floor: "#f4f1e8",
    wall: "#111111",
    grid: "#b9b2a0",
    ink: "#111111",
    shadow: "rgba(0,0,0,0.12)",
  },
  Crosshatch: {
    floor: "#fbfbf7",
    wall: "#161616",
    grid: "#9a9a9a",
    ink: "#161616",
    shadow: "rgba(0,0,0,0.16)",
  },
  GraphPaper: {
    floor: "#ffffff",
    wall: "#20407a",
    grid: "#a9c3ec",
    ink: "#20407a",
    shadow: "rgba(32,64,122,0.10)",
  },
  Parchment: {
    floor: "#efe2c0",
    wall: "#5a4630",
    grid: "#c9b48a",
    ink: "#4a3620",
    shadow: "rgba(90,70,48,0.14)",
  },
  Marble: {
    floor: "#f2f2f5",
    wall: "#3a3a42",
    grid: "#c2c2cc",
    ink: "#2c2c33",
    shadow: "rgba(58,58,66,0.12)",
  },
  Sandstone: {
    floor: "#e9d3a8",
    wall: "#7a5a34",
    grid: "#cbaf82",
    ink: "#5c4225",
    shadow: "rgba(122,90,52,0.14)",
  },
  Slate: {
    floor: "#cfd6dc",
    wall: "#2b3138",
    grid: "#98a4ae",
    ink: "#222831",
    shadow: "rgba(43,49,56,0.16)",
  },
  Aquatic: {
    floor: "#d7f0f2",
    wall: "#123c46",
    grid: "#8fc6cc",
    ink: "#0d2e36",
    shadow: "rgba(18,60,70,0.14)",
  },
  Infernal: {
    floor: "#f3d9cf",
    wall: "#3a0f0a",
    grid: "#c98f80",
    ink: "#2a0a06",
    shadow: "rgba(58,15,10,0.16)",
  },
  Glacial: {
    floor: "#eaf6ff",
    wall: "#1f3a52",
    grid: "#a9cfe6",
    ink: "#16293b",
    shadow: "rgba(31,58,82,0.12)",
  },
  Wooden: {
    floor: "#e7cfa3",
    wall: "#4a2f16",
    grid: "#bd9a68",
    ink: "#3a2410",
    shadow: "rgba(74,47,22,0.16)",
  },
  Asylum: {
    floor: "#e4e7e0",
    wall: "#2f342c",
    grid: "#b3b8ab",
    ink: "#242821",
    shadow: "rgba(47,52,44,0.12)",
  },
  Steampunk: {
    floor: "#e9dcc0",
    wall: "#4d3b26",
    grid: "#b79a6f",
    ink: "#3a2c1c",
    shadow: "rgba(77,59,38,0.14)",
  },
  Gamma: {
    floor: "#e7f7dc",
    wall: "#22401a",
    grid: "#a7cf95",
    ink: "#182e12",
    shadow: "rgba(34,64,26,0.14)",
  },
};

export function getPalette(style: MapStyle): Palette {
  return PALETTES[style] ?? PALETTES.Standard;
}
