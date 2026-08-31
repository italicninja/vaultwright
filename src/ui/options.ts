// Select-option lists, mirroring the original generator's controls.
import type { DungeonOptions } from "../dungeon/types";

export interface OptionDef {
  key: keyof DungeonOptions;
  label: string;
  options: { value: string; text?: string }[];
}

const plain = (values: string[]) => values.map((v) => ({ value: v }));

export const FIELDS: OptionDef[] = [
  {
    key: "dungeon_size",
    label: "Dungeon Size",
    options: plain([
      "Fine",
      "Diminutive",
      "Tiny",
      "Small",
      "Medium",
      "Large",
      "Huge",
      "Gargantuan",
      "Colossal",
      "Custom",
    ]),
  },
  {
    key: "dungeon_layout",
    label: "Dungeon Layout",
    options: [
      ...plain([
        "Square",
        "Rectangle",
        "Box",
        "Cross",
        "Dagger",
        "Saltire",
        "Keep",
        "Hexagon",
        "Round",
        "Nexus",
      ]),
      { value: "Cavernous" },
    ],
  },
  {
    key: "peripheral_egress",
    label: "Peripheral Egress",
    options: [
      { value: "", text: "No" },
      { value: "Yes", text: "Yes" },
      { value: "Many", text: "Many" },
      { value: "Tiling", text: "Tiling" },
    ],
  },
  {
    key: "room_layout",
    label: "Room Layout",
    options: plain(["Sparse", "Scattered", "Dense", "Symmetric"]),
  },
  {
    key: "room_size",
    label: "Room Size",
    options: plain([
      "Small",
      "Medium",
      "Large",
      "Huge",
      "Gargantuan",
      "Colossal",
    ]),
  },
  {
    key: "room_polymorph",
    label: "Room Polymorph",
    options: [
      { value: "", text: "No" },
      { value: "Yes", text: "Yes" },
      { value: "Many", text: "Many" },
    ],
  },
  {
    key: "door_set",
    label: "Doors",
    options: plain(["None", "Basic", "Secure", "Standard", "Deathtrap"]),
  },
  {
    key: "corridor_layout",
    label: "Corridors",
    options: plain(["Labyrinth", "Errant", "Straight"]),
  },
  {
    key: "remove_deadends",
    label: "Remove Deadends",
    options: [
      { value: "", text: "None" },
      { value: "Some", text: "Some" },
      { value: "All", text: "All" },
    ],
  },
  {
    key: "add_stairs",
    label: "Add Stairs",
    options: [
      { value: "", text: "No" },
      { value: "Yes", text: "Yes" },
      { value: "Many", text: "Many" },
    ],
  },
  {
    key: "map_style",
    label: "Map Style",
    options: plain([
      "Standard",
      "Classic",
      "Crosshatch",
      "GraphPaper",
      "Parchment",
      "Marble",
      "Sandstone",
      "Slate",
      "Aquatic",
      "Infernal",
      "Glacial",
      "Wooden",
      "Asylum",
      "Steampunk",
      "Gamma",
    ]),
  },
  {
    key: "grid",
    label: "Grid",
    options: [
      { value: "None", text: "None" },
      { value: "Square", text: "Square" },
      { value: "Hex", text: "Hex" },
      { value: "VertHex", text: "Vertical Hex" },
    ],
  },
];

export const DEFAULT_OPTIONS: DungeonOptions = {
  name: "",
  seed: 0,
  dungeon_size: "Medium",
  map_cols: 51,
  map_rows: 65,
  dungeon_layout: "Rectangle",
  peripheral_egress: "",
  room_layout: "Scattered",
  room_size: "Medium",
  room_polymorph: "Yes",
  door_set: "Standard",
  corridor_layout: "Errant",
  remove_deadends: "Some",
  add_stairs: "Yes",
  map_style: "Standard",
  grid: "Square",
};

// - - - client-side random dungeon-name generator - - -

const NAME_ADJ = [
  "Forsaken", "Sunken", "Shattered", "Whispering", "Bloodstained", "Forgotten",
  "Cursed", "Hollow", "Weeping", "Gloomy", "Silent", "Crimson", "Ebon",
  "Frozen", "Shadowed", "Ruined", "Ancient", "Twisted", "Fallen", "Grim",
];
const NAME_NOUN = [
  "Crypt", "Warren", "Catacombs", "Halls", "Vault", "Labyrinth", "Sanctum",
  "Dungeon", "Delve", "Barrow", "Undercroft", "Keep", "Tomb", "Pit",
  "Grotto", "Reliquary", "Mausoleum", "Oubliette", "Caverns", "Hollows",
];
const NAME_OF = [
  "the Mad Lich", "the Serpent King", "Ash and Ruin", "Endless Night",
  "the Broken Crown", "the Weeping Saint", "the Devourer", "Lost Souls",
  "the Iron Warden", "the Nameless One", "Withered Roots", "the Drowned God",
];

export function randomName(rng: () => number): string {
  const pick = <T>(a: T[]) => a[Math.floor(rng() * a.length)];
  const noun = pick(NAME_NOUN);
  if (rng() < 0.5) {
    return `The ${pick(NAME_ADJ)} ${noun}`;
  }
  return `The ${noun} of ${pick(NAME_OF)}`;
}
