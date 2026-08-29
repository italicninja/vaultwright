// Public option types and the generated-dungeon data model.

export type DungeonSize =
  | "Fine"
  | "Diminutive"
  | "Tiny"
  | "Small"
  | "Medium"
  | "Large"
  | "Huge"
  | "Gargantuan"
  | "Colossal"
  | "Custom";

export type DungeonLayout =
  | "Square"
  | "Rectangle"
  | "Box"
  | "Cross"
  | "Dagger"
  | "Saltire"
  | "Keep"
  | "Hexagon"
  | "Round"
  | "Nexus"
  | "FiveRoom"
  | "Cavernous";

export type RoomLayout = "Sparse" | "Scattered" | "Dense" | "Symmetric";

export type RoomSize =
  | "Small"
  | "Medium"
  | "Large"
  | "Huge"
  | "Gargantuan"
  | "Colossal";

export type Polymorph = "" | "Yes" | "Many";
export type PeripheralEgress = "" | "Yes" | "Many" | "Tiling";
export type DoorSet = "None" | "Basic" | "Secure" | "Standard" | "Deathtrap";
export type CorridorLayout = "Labyrinth" | "Errant" | "Straight";
export type RemoveDeadends = "" | "Some" | "All";
export type AddStairs = "" | "Yes" | "Many";

export type MapStyle =
  | "Standard"
  | "Classic"
  | "Crosshatch"
  | "GraphPaper"
  | "Parchment"
  | "Marble"
  | "Sandstone"
  | "Slate"
  | "Aquatic"
  | "Infernal"
  | "Glacial"
  | "Wooden"
  | "Asylum"
  | "Steampunk"
  | "Gamma";

export type GridStyle = "None" | "Square" | "Hex" | "VertHex";

export interface DungeonOptions {
  name: string;
  seed: number;
  dungeon_size: DungeonSize;
  map_cols: number;
  map_rows: number;
  dungeon_layout: DungeonLayout;
  peripheral_egress: PeripheralEgress;
  room_layout: RoomLayout;
  room_size: RoomSize;
  room_polymorph: Polymorph;
  door_set: DoorSet;
  corridor_layout: CorridorLayout;
  remove_deadends: RemoveDeadends;
  add_stairs: AddStairs;
  map_style: MapStyle;
  grid: GridStyle;
}

export interface Room {
  id: number;
  role?: RoomRole; // five-room dungeons only: the story beat this room carries
  row: number; // top cell (grid coords)
  col: number; // left cell (grid coords)
  north: number;
  south: number;
  west: number;
  east: number;
  height: number; // in cells
  width: number; // in cells
  area: number;
  doors: Door[];
}

export type DoorType =
  | "arch"
  | "open"
  | "lock"
  | "trap"
  | "secret"
  | "portc";

export type Dir = "north" | "south" | "west" | "east";

export type RoomRole =
  | "Entrance"
  | "Puzzle"
  | "Setback"
  | "Climax"
  | "Resolution"
  | "Junction";

export interface Door {
  row: number;
  col: number;
  type: DoorType;
  roomId: number; // the room this door belongs to
  dir: Dir; // direction from that room, outward through the door
  outId?: number; // connected room id, if directly adjacent
  destId?: number; // room reached through the corridor beyond, if unambiguous
  key: string; // short label glyph
  desc: string; // human-readable description
}

export interface Stair {
  row: number;
  col: number;
  next_row: number;
  next_col: number;
  key: "up" | "down";
}

export interface Dungeon {
  options: DungeonOptions;
  seed: number;
  n_rows: number; // grid rows (0..n_rows inclusive)
  n_cols: number;
  cell: Int32Array[]; // [row][col]
  rooms: Room[];
  doors: Door[];
  stairs: Stair[];
  topology?: string; // five-room dungeons only: the shape the rooms were laid out in
}
