// Client-side dungeon generator, a faithful port of the algorithm behind
// donjon's classic generator (rooms → doors → corridor maze → stairs →
// dead-end removal), extended with a cellular-automata mode for Cavernous.

import { RNG } from "./rng";
import {
  NOTHING,
  BLOCKED,
  ROOM,
  CORRIDOR,
  PERIMETER,
  ENTRANCE,
  ARCH,
  DOOR,
  LOCKED,
  TRAPPED,
  SECRET,
  PORTC,
  STAIR_DN,
  STAIR_UP,
  STAIRS,
  OPENSPACE,
  DOORSPACE,
  BLOCK_CORR,
  BLOCK_DOOR,
  ROOM_ID_SHIFT,
  roomIdOf,
} from "./flags";
import { buildMask } from "./masks";
import { TOPOLOGIES, roleFor } from "./fiveroom";
import { computeConnectivity } from "./connectivity";
import type {
  Dungeon,
  DungeonOptions,
  Door,
  DoorType,
  Room,
  RoomRole,
  Stair,
} from "./types";

type Dir = "north" | "south" | "west" | "east";
const DIRS: Dir[] = ["north", "south", "west", "east"];
const DI: Record<Dir, number> = { north: -1, south: 1, west: 0, east: 0 };
const DJ: Record<Dir, number> = { north: 0, south: 0, west: -1, east: 1 };

// Size name → odd (cols, rows) footprint. Medium matches the original default.
const SIZE_TABLE: Record<string, { cols: number; rows: number }> = {
  Fine: { cols: 21, rows: 21 },
  Diminutive: { cols: 21, rows: 31 },
  Tiny: { cols: 31, rows: 33 },
  Small: { cols: 41, rows: 51 },
  Medium: { cols: 51, rows: 65 },
  Large: { cols: 51, rows: 81 },
  Huge: { cols: 65, rows: 81 },
  Gargantuan: { cols: 81, rows: 105 },
  Colossal: { cols: 105, rows: 131 },
};

// Room size → base cell-unit size and random radix (in room units).
const ROOM_SIZE: Record<string, { size: number; radix: number }> = {
  Small: { size: 2, radix: 1 },
  Medium: { size: 2, radix: 2 },
  Large: { size: 2, radix: 3 },
  Huge: { size: 3, radix: 2 },
  Gargantuan: { size: 3, radix: 3 },
  Colossal: { size: 3, radix: 4 },
};

// Straight-corridor bias (percent chance to keep the previous heading).
const CORRIDOR_STRAIGHT: Record<string, number> = {
  Labyrinth: 0,
  Errant: 50,
  Straight: 90,
};

// Dead-end removal percentage.
const DEADEND_PCT: Record<string, number> = { "": 0, Some: 50, All: 100 };

// Door-type weight tables per door set.
const DOOR_WEIGHTS: Record<string, Record<DoorType, number>> = {
  None: { arch: 100, open: 0, lock: 0, trap: 0, secret: 0, portc: 0 },
  Basic: { arch: 40, open: 60, lock: 0, trap: 0, secret: 0, portc: 0 },
  Secure: { arch: 10, open: 30, lock: 35, trap: 0, secret: 5, portc: 20 },
  Standard: { arch: 15, open: 45, lock: 15, trap: 10, secret: 8, portc: 7 },
  Deathtrap: { arch: 5, open: 20, lock: 15, trap: 30, secret: 25, portc: 5 },
};

const DOOR_META: Record<DoorType, { flag: number; key: string; desc: string }> =
  {
    arch: { flag: ARCH, key: "arch", desc: "Archway" },
    open: { flag: DOOR, key: "open", desc: "Unlocked Door" },
    lock: { flag: LOCKED, key: "lock", desc: "Locked Door" },
    trap: { flag: TRAPPED, key: "trap", desc: "Trapped Door" },
    secret: { flag: SECRET, key: "secret", desc: "Secret Door" },
    portc: { flag: PORTC, key: "portc", desc: "Portcullis" },
  };

export function generate(options: DungeonOptions): Dungeon {
  return new Generator(options).build();
}

class Generator {
  opt: DungeonOptions;
  rng: RNG;
  n_i = 0; // room-unit rows
  n_j = 0; // room-unit cols
  n_rows = 0; // grid rows (max index)
  n_cols = 0; // grid cols (max index)
  max_row = 0;
  max_col = 0;
  cell: Int32Array[] = [];
  rooms: Room[] = [];
  n_rooms = 0;
  doors: Door[] = [];
  stairs: Stair[] = [];
  connected = new Set<string>();
  topology?: string;

  constructor(options: DungeonOptions) {
    this.opt = options;
    this.rng = new RNG(options.seed);
  }

  build(): Dungeon {
    this.setDimensions();
    this.initCells();

    if (this.opt.dungeon_layout === "Cavernous") {
      this.generateCavern();
    } else if (this.opt.dungeon_layout === "FiveRoom") {
      this.buildFiveRoom();
    } else {
      this.emplaceRooms();
      this.openRooms();
      this.corridors();
    }

    if (this.opt.add_stairs) this.emplaceStairs();
    this.cleanDungeon();

    const dungeon: Dungeon = {
      options: this.opt,
      seed: this.opt.seed,
      n_rows: this.n_rows,
      n_cols: this.n_cols,
      cell: this.cell,
      rooms: this.rooms,
      doors: this.doors,
      stairs: this.stairs,
      topology: this.topology,
    };
    computeConnectivity(dungeon);
    return dungeon;
  }

  // - - - dimensions & grid init - - -

  private setDimensions() {
    let cols: number, rows: number;
    if (this.opt.dungeon_size === "Custom") {
      cols = clamp(this.opt.map_cols || 51, 7, 201);
      rows = clamp(this.opt.map_rows || 65, 7, 201);
    } else {
      const s = SIZE_TABLE[this.opt.dungeon_size] ?? SIZE_TABLE.Medium;
      cols = s.cols;
      rows = s.rows;
    }
    this.n_i = Math.floor(rows / 2);
    this.n_j = Math.floor(cols / 2);
    this.n_rows = this.n_i * 2;
    this.n_cols = this.n_j * 2;
    this.max_row = this.n_rows;
    this.max_col = this.n_cols;
  }

  private initCells() {
    this.cell = [];
    for (let r = 0; r <= this.n_rows; r++) {
      this.cell.push(new Int32Array(this.n_cols + 1));
    }
    // Apply the layout mask (0 → BLOCKED).
    const mask = buildMask(
      this.opt.dungeon_layout,
      this.n_rows,
      this.n_cols,
    );
    if (mask) {
      for (let r = 0; r <= this.n_rows; r++) {
        for (let c = 0; c <= this.n_cols; c++) {
          if (!mask[r][c]) this.cell[r][c] = BLOCKED;
        }
      }
    }
  }

  // - - - rooms - - -

  private emplaceRooms() {
    if (this.opt.dungeon_layout === "Nexus") {
      this.emplaceNexus();
      return;
    }
    const layout = this.opt.room_layout;
    if (layout === "Dense") {
      this.packRooms();
    } else {
      this.scatterRooms();
      if (layout === "Symmetric") this.mirrorRooms();
    }
  }

  // A large central chamber, then a sparse scatter of outer rooms. The central
  // room's size earns it many door openings, so the corridor maze branches out
  // of it into sprawling labyrinthine arms.
  private emplaceNexus() {
    const h = Math.max(3, Math.round(this.n_i / 3));
    const w = Math.max(3, Math.round(this.n_j / 3));
    const ci = Math.floor((this.n_i - h) / 2);
    const cj = Math.floor((this.n_j - w) / 2);
    this.emplaceRoom({ i: ci, j: cj, height: h, width: w });
    this.scatterRooms(0.14);
  }

  private scatterRooms(densityOverride?: number) {
    const base = ROOM_SIZE[this.opt.room_size] ?? ROOM_SIZE.Medium;
    const avgUnits = base.size + base.radix / 2;
    const roomCells = 2 * avgUnits - 1;
    const density =
      densityOverride ??
      (this.opt.room_layout === "Sparse" ? 0.16 : 0.32);
    const area = this.n_rows * this.n_cols;
    // Room footprint includes a one-cell spacing ring on each side; capacity is
    // the rough max rooms that fit, scaled by density (with a small buffer for
    // placements that fail on collision).
    const footprint = (roomCells + 2) * (roomCells + 2);
    const capacity = area / footprint;
    const attempts = Math.max(1, Math.round(capacity * density * 1.3));
    for (let i = 0; i < attempts; i++) this.emplaceRoom();
  }

  private packRooms() {
    for (let i = 0; i < this.n_i; i++) {
      const r = i * 2 + 1;
      for (let j = 0; j < this.n_j; j++) {
        const c = j * 2 + 1;
        if (this.cell[r][c] & ROOM) continue;
        if ((i === 0 || j === 0) && this.rng.int(2)) continue;
        this.emplaceRoom({ i, j });
      }
    }
  }

  private mirrorRooms() {
    // Reflect placed rooms across the vertical centre for a symmetric feel.
    const existing = [...this.rooms];
    for (const room of existing) {
      const width = (room.east - room.west) / 2 + 1;
      const mj = this.n_j - (room.west - 1) / 2 - width;
      const mi = (room.north - 1) / 2;
      if (mj < 0) continue;
      this.emplaceRoom({
        i: mi,
        j: mj,
        height: (room.south - room.north) / 2 + 1,
        width,
      });
    }
  }

  private emplaceRoom(proto: Partial<RoomProto> = {}) {
    if (this.n_rooms >= 999) return;
    const p = this.setRoom(proto);

    const r1 = p.i * 2 + 1;
    const c1 = p.j * 2 + 1;
    const r2 = (p.i + p.height) * 2 - 1;
    const c2 = (p.j + p.width) * 2 - 1;
    if (r1 < 1 || r2 > this.max_row - 1) return;
    if (c1 < 1 || c2 > this.max_col - 1) return;

    // Collision check: bail on BLOCKED or overlap with an existing room.
    for (let r = r1; r <= r2; r++) {
      for (let c = c1; c <= c2; c++) {
        if (this.cell[r][c] & (BLOCKED | ROOM)) return;
      }
    }

    const roomId = ++this.n_rooms;
    for (let r = r1; r <= r2; r++) {
      for (let c = c1; c <= c2; c++) {
        this.cell[r][c] &= ~PERIMETER;
        this.cell[r][c] |= ROOM | (roomId << ROOM_ID_SHIFT);
      }
    }
    // Perimeter ring.
    for (let r = r1 - 1; r <= r2 + 1; r++) {
      this.markPerimeter(r, c1 - 1);
      this.markPerimeter(r, c2 + 1);
    }
    for (let c = c1 - 1; c <= c2 + 1; c++) {
      this.markPerimeter(r1 - 1, c);
      this.markPerimeter(r2 + 1, c);
    }

    this.rooms.push({
      id: roomId,
      row: r1,
      col: c1,
      north: r1,
      south: r2,
      west: c1,
      east: c2,
      height: r2 - r1 + 1,
      width: c2 - c1 + 1,
      area: (r2 - r1 + 1) * (c2 - c1 + 1),
      doors: [],
    });
  }

  private markPerimeter(r: number, c: number) {
    if (r < 0 || r > this.n_rows || c < 0 || c > this.n_cols) return;
    if (this.cell[r][c] & (ROOM | ENTRANCE)) return;
    this.cell[r][c] |= PERIMETER;
  }

  private setRoom(proto: Partial<RoomProto>): RoomProto {
    const base = ROOM_SIZE[this.opt.room_size] ?? ROOM_SIZE.Medium;
    let height = proto.height;
    let width = proto.width;

    if (height === undefined) {
      if (proto.i !== undefined) {
        const a = Math.max(0, this.n_i - base.size - proto.i);
        const r = a < base.radix ? a : base.radix;
        height = this.rng.int(r + 1) + base.size;
      } else {
        height = this.rng.int(base.radix + 1) + base.size;
      }
    }
    if (width === undefined) {
      if (proto.j !== undefined) {
        const a = Math.max(0, this.n_j - base.size - proto.j);
        const r = a < base.radix ? a : base.radix;
        width = this.rng.int(r + 1) + base.size;
      } else {
        width = this.rng.int(base.radix + 1) + base.size;
      }
    }
    let i = proto.i;
    let j = proto.j;
    if (i === undefined) i = this.rng.int(Math.max(1, this.n_i - height));
    if (j === undefined) j = this.rng.int(Math.max(1, this.n_j - width));

    return { i, j, height, width };
  }

  // - - - doors / room openings - - -

  private openRooms() {
    for (const room of this.rooms) this.openRoom(room);
  }

  private openRoom(room: Room) {
    const sills = this.doorSills(room);
    if (!sills.length) return;
    const nOpens = this.allocOpens(room);

    let placed = 0;
    while (placed < nOpens && sills.length) {
      const sill = sills.splice(this.rng.int(sills.length), 1)[0];
      const doorCell = this.cell[sill.door_r][sill.door_c];
      if (doorCell & DOORSPACE) continue;

      if (sill.out_id !== undefined) {
        const key = [room.id, sill.out_id].sort((a, b) => a - b).join(",");
        if (this.connected.has(key)) continue;
        this.connected.add(key);
      }

      this.placeDoor(room, sill);
      placed++;
    }
  }

  // Carves the entrance passage out of the room wall and hangs a door in it.
  private placeDoor(room: Room, sill: Sill): Door {
    for (let x = 0; x < 3; x++) {
      const r = sill.sill_r + DI[sill.dir] * x;
      const c = sill.sill_c + DJ[sill.dir] * x;
      this.cell[r][c] &= ~PERIMETER;
      this.cell[r][c] |= ENTRANCE;
    }

    const type = this.doorType();
    const meta = DOOR_META[type];
    this.cell[sill.door_r][sill.door_c] &= ~ESPACE_CLEAR;
    this.cell[sill.door_r][sill.door_c] |= meta.flag;

    const door: Door = {
      row: sill.door_r,
      col: sill.door_c,
      type,
      roomId: room.id,
      dir: sill.dir,
      outId: sill.out_id,
      key: meta.key,
      desc: meta.desc,
    };
    room.doors.push(door);
    this.doors.push(door);
    return door;
  }

  private allocOpens(room: Room): number {
    const roomH = (room.south - room.north) / 2 + 1;
    const roomW = (room.east - room.west) / 2 + 1;
    const flumph = Math.floor(Math.sqrt(roomW * roomH));
    return flumph + this.rng.int(flumph + 1);
  }

  private doorSills(room: Room): Sill[] {
    const list: Sill[] = [];
    if (room.north >= 3) {
      for (let c = room.west; c <= room.east; c += 2) {
        const s = this.checkSill(room, room.north, c, "north");
        if (s) list.push(s);
      }
    }
    if (room.south <= this.max_row - 3) {
      for (let c = room.west; c <= room.east; c += 2) {
        const s = this.checkSill(room, room.south, c, "south");
        if (s) list.push(s);
      }
    }
    if (room.west >= 3) {
      for (let r = room.north; r <= room.south; r += 2) {
        const s = this.checkSill(room, r, room.west, "west");
        if (s) list.push(s);
      }
    }
    if (room.east <= this.max_col - 3) {
      for (let r = room.north; r <= room.south; r += 2) {
        const s = this.checkSill(room, r, room.east, "east");
        if (s) list.push(s);
      }
    }
    return this.rng.shuffle(list);
  }

  private checkSill(
    room: Room,
    sill_r: number,
    sill_c: number,
    dir: Dir,
  ): Sill | null {
    const door_r = sill_r + DI[dir];
    const door_c = sill_c + DJ[dir];
    const doorCell = this.cell[door_r]?.[door_c];
    if (doorCell === undefined) return null;
    if (!(doorCell & PERIMETER)) return null;
    if (doorCell & BLOCK_DOOR) return null;

    const out_r = door_r + DI[dir];
    const out_c = door_c + DJ[dir];
    const outCell = this.cell[out_r]?.[out_c];
    if (outCell === undefined || outCell & BLOCKED) return null;

    let out_id: number | undefined;
    if (outCell & ROOM) {
      out_id = roomIdOf(outCell);
      if (out_id === room.id) return null;
    }
    return { sill_r, sill_c, door_r, door_c, dir, out_id };
  }

  private doorType(): DoorType {
    const table = DOOR_WEIGHTS[this.opt.door_set] ?? DOOR_WEIGHTS.Standard;
    return this.rng.weighted(table) as DoorType;
  }

  // - - - five-room dungeon - - -

  // Lays out one of the topologies from fiveroom.ts: each node gets its own
  // slot on a coarse grid so rooms never collide, each edge gets a corridor,
  // and the node index decides which story beat the room carries.
  private buildFiveRoom() {
    const topo = this.rng.pick(TOPOLOGIES);
    this.topology = topo.name;

    const gridW = Math.max(...topo.nodes.map(([gx]) => gx)) + 1;
    const gridH = Math.max(...topo.nodes.map(([, gy]) => gy)) + 1;
    const slotW = Math.floor(this.n_j / gridW);
    const slotH = Math.floor(this.n_i / gridH);
    const offJ = Math.floor((this.n_j - slotW * gridW) / 2);
    const offI = Math.floor((this.n_i - slotH * gridH) / 2);

    const base = ROOM_SIZE[this.opt.room_size] ?? ROOM_SIZE.Medium;
    // Leave at least one free room-unit of slot for the corridor lattice.
    const fit = (want: number, slot: number) =>
      Math.max(1, Math.min(want, slot - 2));

    const placed: (Room | undefined)[] = topo.nodes.map(([gx, gy], node) => {
      const height = fit(base.size + this.rng.int(base.radix + 1), slotH);
      const width = fit(base.size + this.rng.int(base.radix + 1), slotW);
      const i = offI + gy * slotH + Math.floor((slotH - height) / 2);
      const j = offJ + gx * slotW + Math.floor((slotW - width) / 2);
      const before = this.rooms.length;
      this.emplaceRoom({ i, j, height, width });
      const room = this.rooms[before];
      if (room) room.role = roleFor(node);
      return room;
    });

    for (const [a, b] of topo.edges) {
      const roomA = placed[a];
      const roomB = placed[b];
      if (roomA && roomB) this.connectRooms(roomA, roomB);
    }
  }

  // Punches a door in each room facing the other, then tunnels between them.
  private connectRooms(a: Room, b: Room) {
    const from = this.punchDoor(a, b);
    const to = this.punchDoor(b, a);
    if (from && to) this.carvePath(from, to);
  }

  /** Opens a door on the wall of `room` facing `target`; returns the cell outside it. */
  private punchDoor(room: Room, target: Room): Cell | null {
    const dr = midpoint(target.north, target.south) - midpoint(room.north, room.south);
    const dc = midpoint(target.east, target.west) - midpoint(room.west, room.east);
    const vert: Dir = dr < 0 ? "north" : "south";
    const horiz: Dir = dc < 0 ? "west" : "east";
    // Prefer the wall facing the target along its dominant axis.
    const order: Dir[] =
      Math.abs(dr) >= Math.abs(dc)
        ? [vert, horiz, opposite(horiz), opposite(vert)]
        : [horiz, vert, opposite(vert), opposite(horiz)];

    for (const dir of order) {
      const sill = this.bestSill(room, dir, target);
      if (!sill) continue;
      this.placeDoor(room, sill);
      return {
        r: sill.door_r + DI[dir],
        c: sill.door_c + DJ[dir],
      };
    }
    return null;
  }

  // The usable sill on `dir`'s wall that sits closest to the target room.
  private bestSill(room: Room, dir: Dir, target: Room): Sill | null {
    const sills: Sill[] = [];
    if (dir === "north" || dir === "south") {
      const r = dir === "north" ? room.north : room.south;
      if (dir === "north" ? r < 3 : r > this.max_row - 3) return null;
      for (let c = room.west; c <= room.east; c += 2) {
        const s = this.checkSill(room, r, c, dir);
        if (s) sills.push(s);
      }
    } else {
      const c = dir === "west" ? room.west : room.east;
      if (dir === "west" ? c < 3 : c > this.max_col - 3) return null;
      for (let r = room.north; r <= room.south; r += 2) {
        const s = this.checkSill(room, r, c, dir);
        if (s) sills.push(s);
      }
    }
    if (!sills.length) return null;

    const tr = midpoint(target.north, target.south);
    const tc = midpoint(target.west, target.east);
    let best = sills[0];
    let bestD = Infinity;
    for (const s of sills) {
      const d = Math.abs(s.sill_r - tr) + Math.abs(s.sill_c - tc);
      if (d < bestD) {
        bestD = d;
        best = s;
      }
    }
    return best;
  }

  // Shortest corridor between two cells, hopping the odd lattice and refusing
  // to cut through rooms or their walls. Existing corridors are reused, which
  // is what turns loop topologies into real junctions.
  private carvePath(from: Cell, to: Cell) {
    const width = this.n_cols + 1;
    const key = (r: number, c: number) => r * width + c;
    const prev = new Map<number, number>();
    const seen = new Set<number>([key(from.r, from.c)]);
    const queue: Cell[] = [from];
    let found = false;

    while (queue.length) {
      const cur = queue.shift()!;
      if (cur.r === to.r && cur.c === to.c) {
        found = true;
        break;
      }
      for (const dir of DIRS) {
        const mr = cur.r + DI[dir];
        const mc = cur.c + DJ[dir];
        const nr = cur.r + DI[dir] * 2;
        const nc = cur.c + DJ[dir] * 2;
        if (nr < 1 || nc < 1 || nr > this.max_row - 1 || nc > this.max_col - 1)
          continue;
        if (seen.has(key(nr, nc))) continue;
        const blocked = BLOCKED | ROOM | PERIMETER;
        if (this.cell[mr][mc] & blocked) continue;
        if (this.cell[nr][nc] & blocked) continue;
        seen.add(key(nr, nc));
        prev.set(key(nr, nc), key(cur.r, cur.c));
        queue.push({ r: nr, c: nc });
      }
    }
    if (!found) return;

    // Walk back from the target, carrying the corridor through the mid-cells.
    let at = key(to.r, to.c);
    const start = key(from.r, from.c);
    this.dig(to.r, to.c);
    while (at !== start) {
      const back = prev.get(at)!;
      const [r, c] = [Math.floor(at / width), at % width];
      const [pr, pc] = [Math.floor(back / width), back % width];
      this.dig((r + pr) / 2, (c + pc) / 2);
      this.dig(pr, pc);
      at = back;
    }
  }

  private dig(r: number, c: number) {
    this.cell[r][c] &= ~(ENTRANCE | PERIMETER);
    this.cell[r][c] |= CORRIDOR;
  }

  // - - - corridors (maze tunnelling) - - -

  private corridors() {
    for (let i = 1; i < this.n_i; i++) {
      const r = i * 2 + 1;
      for (let j = 1; j < this.n_j; j++) {
        const c = j * 2 + 1;
        if (this.cell[r][c] & CORRIDOR) continue;
        this.tunnel(i, j);
      }
    }
  }

  private tunnel(i: number, j: number, lastDir?: Dir) {
    const dirs = this.tunnelDirs(lastDir);
    for (const dir of dirs) {
      if (this.openTunnel(i, j, dir)) {
        this.tunnel(i + DI[dir], j + DJ[dir], dir);
      }
    }
  }

  private tunnelDirs(lastDir?: Dir): Dir[] {
    const p = CORRIDOR_STRAIGHT[this.opt.corridor_layout] ?? 50;
    const dirs = this.rng.shuffle([...DIRS]);
    if (lastDir && p && this.rng.int(100) < p) {
      dirs.unshift(lastDir);
    }
    return dirs;
  }

  private openTunnel(i: number, j: number, dir: Dir): boolean {
    const thisR = i * 2 + 1;
    const thisC = j * 2 + 1;
    const nextR = (i + DI[dir]) * 2 + 1;
    const nextC = (j + DJ[dir]) * 2 + 1;
    const midR = (thisR + nextR) / 2;
    const midC = (thisC + nextC) / 2;
    if (this.soundTunnel(midR, midC, nextR, nextC)) {
      this.delveTunnel(thisR, thisC, nextR, nextC);
      return true;
    }
    return false;
  }

  private soundTunnel(
    midR: number,
    midC: number,
    nextR: number,
    nextC: number,
  ): boolean {
    if (nextR < 0 || nextR > this.max_row) return false;
    if (nextC < 0 || nextC > this.max_col) return false;
    const [r1, r2] = midR < nextR ? [midR, nextR] : [nextR, midR];
    const [c1, c2] = midC < nextC ? [midC, nextC] : [nextC, midC];
    for (let r = r1; r <= r2; r++) {
      for (let c = c1; c <= c2; c++) {
        if (this.cell[r][c] & BLOCK_CORR) return false;
      }
    }
    return true;
  }

  private delveTunnel(r1: number, c1: number, r2: number, c2: number) {
    const [rr1, rr2] = r1 < r2 ? [r1, r2] : [r2, r1];
    const [cc1, cc2] = c1 < c2 ? [c1, c2] : [c2, c1];
    for (let r = rr1; r <= rr2; r++) {
      for (let c = cc1; c <= cc2; c++) {
        this.cell[r][c] &= ~ENTRANCE;
        this.cell[r][c] |= CORRIDOR;
      }
    }
  }

  // - - - stairs - - -

  private emplaceStairs() {
    if (this.opt.dungeon_layout === "FiveRoom") {
      this.emplaceBeatStairs();
      return;
    }
    const count = this.opt.add_stairs === "Many" ? this.rng.range(3, 6) : 2;
    const ends = this.stairEnds();
    if (!ends.length) return;

    for (let i = 0; i < count && ends.length; i++) {
      const end = ends.splice(this.rng.int(ends.length), 1)[0];
      const down = i < 2 ? i === 0 : this.rng.int(2) === 0;
      const stair: Stair = {
        row: end.row,
        col: end.col,
        next_row: end.next_row,
        next_col: end.next_col,
        key: down ? "down" : "up",
      };
      this.cell[end.row][end.col] |= down ? STAIR_DN : STAIR_UP;
      this.stairs.push(stair);
    }
  }

  // The way in and the way onward. Five-room corridors run room to room with
  // no dead ends, so the stairs go in the beats that mean something instead.
  private emplaceBeatStairs() {
    const place = (role: RoomRole, key: "up" | "down") => {
      const room = this.rooms.find((r) => r.role === role);
      if (!room) return;
      const up = key === "up";
      const row = up ? room.north : room.south;
      const col = up ? room.west : room.east;
      this.cell[row][col] |= up ? STAIR_UP : STAIR_DN;
      this.stairs.push({
        row,
        col,
        next_row: row + (up ? 1 : -1),
        next_col: col,
        key,
      });
    };
    place("Entrance", "up");
    place("Resolution", "down");
  }

  private stairEnds(): Stair[] {
    const list: Stair[] = [];
    for (let i = 0; i < this.n_i; i++) {
      const r = i * 2 + 1;
      for (let j = 0; j < this.n_j; j++) {
        const c = j * 2 + 1;
        if (this.cell[r]?.[c] !== CORRIDOR) continue; // pure corridor only
        if (this.cell[r][c] & STAIRS) continue;
        for (const dir of DIRS) {
          if (this.checkStairEnd(r, c, dir)) {
            list.push({
              row: r,
              col: c,
              next_row: r + DI[dir],
              next_col: c + DJ[dir],
              key: "down",
            });
            break;
          }
        }
      }
    }
    return list;
  }

  // A stair end is a corridor dead-end that opens in exactly one direction,
  // with a clear cell to step onto.
  private checkStairEnd(r: number, c: number, dir: Dir): boolean {
    // Only the given direction may be open; the other three must be closed.
    // Doors count as open, or a stair lands in the corridor just outside one
    // and blocks the way through.
    for (const d of DIRS) {
      const nr = r + DI[d];
      const nc = c + DJ[d];
      const open = !!(this.cell[nr]?.[nc] & (OPENSPACE | DOORSPACE));
      if (d === dir && !open) return false;
      if (d !== dir && open) return false;
    }
    return true;
  }

  // - - - cleanup - - -

  private cleanDungeon() {
    // Five-room corridors are the story structure; collapsing them would sever
    // beats from each other, so dead-end removal is skipped there.
    const pct =
      this.opt.dungeon_layout === "FiveRoom"
        ? 0
        : (DEADEND_PCT[this.opt.remove_deadends] ?? 0);
    if (pct) this.collapseTunnels(pct);
    this.fixDoors();
    this.emptyBlocks();
  }

  private collapseTunnels(pct: number) {
    const all = pct >= 100;
    for (let i = 0; i < this.n_i; i++) {
      const r = i * 2 + 1;
      for (let j = 0; j < this.n_j; j++) {
        const c = j * 2 + 1;
        if (!(this.cell[r][c] & OPENSPACE)) continue;
        if (this.cell[r][c] & STAIRS) continue;
        if (all || this.rng.int(100) < pct) this.collapse(r, c);
      }
    }
  }

  private collapse(r: number, c: number) {
    if (!(this.cell[r]?.[c] & OPENSPACE)) return;
    for (const dir of DIRS) {
      if (this.checkTunnelDeadend(r, c, dir)) {
        this.cell[r][c] = NOTHING;
        const nr = r + DI[dir];
        const nc = c + DJ[dir];
        if (this.cell[nr]?.[nc] !== undefined) {
          this.cell[nr][nc] |= CORRIDOR;
          this.collapse(nr, nc);
        }
        return;
      }
    }
  }

  // Dead-end pointing `dir`: every neighbour except `dir` must be non-open.
  private checkTunnelDeadend(r: number, c: number, dir: Dir): boolean {
    if (this.cell[r][c] & STAIRS) return false;
    let openCount = 0;
    let openDir: Dir | null = null;
    for (const d of DIRS) {
      if (this.cell[r + DI[d]]?.[c + DJ[d]] & OPENSPACE) {
        openCount++;
        openDir = d;
      }
    }
    return openCount === 1 && openDir === dir;
  }

  private fixDoors() {
    const seen = new Set<string>();
    const keep: Door[] = [];
    for (const room of this.rooms) {
      const roomDoors: Door[] = [];
      for (const door of room.doors) {
        const cellVal = this.cell[door.row][door.col];
        if (!(cellVal & OPENSPACE) && !(cellVal & DOORSPACE)) continue;
        // A door must still bridge two open cells.
        const openN = !!(this.cell[door.row - 1]?.[door.col] & OPENSPACE);
        const openS = !!(this.cell[door.row + 1]?.[door.col] & OPENSPACE);
        const openW = !!(this.cell[door.row]?.[door.col - 1] & OPENSPACE);
        const openE = !!(this.cell[door.row]?.[door.col + 1] & OPENSPACE);
        if (!((openN && openS) || (openW && openE))) {
          // No longer bridges anything; demote the cell to nothing.
          this.cell[door.row][door.col] &= ~DOORSPACE;
          continue;
        }
        const key = `${door.row},${door.col}`;
        if (seen.has(key)) continue;
        seen.add(key);
        roomDoors.push(door);
        keep.push(door);
      }
      room.doors = roomDoors;
    }
    this.doors = keep;
  }

  private emptyBlocks() {
    for (let r = 0; r <= this.n_rows; r++) {
      for (let c = 0; c <= this.n_cols; c++) {
        if (this.cell[r][c] & BLOCKED) this.cell[r][c] = NOTHING;
      }
    }
  }

  // - - - cavernous mode (cellular automata) - - -

  private generateCavern() {
    const rows = this.n_rows;
    const cols = this.n_cols;
    let map: boolean[][] = [];
    for (let r = 0; r <= rows; r++) {
      map[r] = [];
      for (let c = 0; c <= cols; c++) {
        const edge = r <= 1 || c <= 1 || r >= rows - 1 || c >= cols - 1;
        const blocked = !!(this.cell[r][c] & BLOCKED);
        map[r][c] = edge || blocked ? false : this.rng.next() > 0.45;
      }
    }
    // Smooth with the classic 4-5 rule.
    for (let pass = 0; pass < 4; pass++) {
      const next: boolean[][] = map.map((row) => [...row]);
      for (let r = 1; r < rows; r++) {
        for (let c = 1; c < cols; c++) {
          if (this.cell[r][c] & BLOCKED) {
            next[r][c] = false;
            continue;
          }
          let walls = 0;
          for (let dr = -1; dr <= 1; dr++)
            for (let dc = -1; dc <= 1; dc++)
              if (dr || dc) if (!map[r + dr]?.[c + dc]) walls++;
          next[r][c] = map[r][c] ? walls < 5 : walls < 3;
        }
      }
      map = next;
    }
    // Keep only the largest connected cavern, mark it as open corridor.
    this.keepLargestRegion(map);
    for (let r = 0; r <= rows; r++) {
      for (let c = 0; c <= cols; c++) {
        this.cell[r][c] = map[r][c] ? CORRIDOR : NOTHING;
      }
    }
  }

  private keepLargestRegion(map: boolean[][]) {
    const rows = map.length;
    const seen: boolean[][] = map.map((row) => row.map(() => false));
    let best: [number, number][] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < map[r].length; c++) {
        if (!map[r][c] || seen[r][c]) continue;
        const region: [number, number][] = [];
        const stack: [number, number][] = [[r, c]];
        seen[r][c] = true;
        while (stack.length) {
          const [cr, cc] = stack.pop()!;
          region.push([cr, cc]);
          for (const d of DIRS) {
            const nr = cr + DI[d];
            const nc = cc + DJ[d];
            if (map[nr]?.[nc] && !seen[nr][nc]) {
              seen[nr][nc] = true;
              stack.push([nr, nc]);
            }
          }
        }
        if (region.length > best.length) best = region;
      }
    }
    const keep = new Set(best.map(([r, c]) => `${r},${c}`));
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < map[r].length; c++)
        map[r][c] = keep.has(`${r},${c}`);
  }
}

// Clears entrance/label/door bits before writing a fresh door flag.
const ESPACE_CLEAR = ENTRANCE | DOORSPACE;

interface RoomProto {
  i: number;
  j: number;
  height: number;
  width: number;
}

interface Cell {
  r: number;
  c: number;
}

const midpoint = (a: number, b: number) => (a + b) / 2;

const OPPOSITE: Record<Dir, Dir> = {
  north: "south",
  south: "north",
  west: "east",
  east: "west",
};
const opposite = (dir: Dir): Dir => OPPOSITE[dir];

interface Sill {
  sill_r: number;
  sill_c: number;
  door_r: number;
  door_c: number;
  dir: Dir;
  out_id?: number;
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}
