// Deterministically "stocks" a generated dungeon with descriptive content:
// an overall theme, corridor features, a wandering-monster table, and a full
// per-room writeup (entries, monsters, treasure, traps, tricks). Everything is
// derived from the dungeon seed, so the same seed always yields the same text.

import { RNG } from "../dungeon/rng";
import { CORRIDOR, ROOM, OPENSPACE, DOORSPACE } from "../dungeon/flags";
import type { Dungeon, Door, Dir, RoomRole } from "../dungeon/types";
import * as T from "./tables";
import { THEMES } from "./themes";

const DI: Record<Dir, number> = { north: -1, south: 1, west: 0, east: 0 };
const DJ: Record<Dir, number> = { north: 0, south: 0, west: -1, east: 1 };
const DIR_LABEL: Record<Dir, string> = {
  north: "North",
  south: "South",
  west: "West",
  east: "East",
};

export interface SymbolLine {
  sym: string;
  text: string;
}
export interface DoorEntry {
  label: string;
  title: string;
  symbols: SymbolLine[];
  leadsTo?: { id: number; inhabited?: string };
}
export interface HiddenTreasure {
  container: string;
  trapLine?: string;
  contents: string;
}
export interface Beat {
  role: RoomRole;
  purpose: string;
  guise: string;
}
export interface RoomContent {
  id: number;
  beat?: Beat;
  entries: DoorEntry[];
  feature?: string;
  monster?: string;
  treasure?: string;
  trap?: string;
  trick?: string;
  hidden?: HiddenTreasure;
  empty: boolean;
}
export interface CorridorFeature {
  letter: string;
  row: number;
  col: number;
  text: string;
}
export interface DungeonContent {
  theme: string;
  topology?: string;
  general: {
    history: string;
    size: string;
    walls: string;
    floor: string;
    temperature: string;
    illumination: string;
  };
  corridorFeatures: CorridorFeature[];
  wanderingMonsters: string[];
  rooms: Map<number, RoomContent>;
}

const MON_BY_NAME = new Map(T.MONSTERS.map((m) => [m.name, m]));

export function stockDungeon(dungeon: Dungeon): DungeonContent {
  // Independent RNG stream, still seed-derived for reproducibility.
  const rng = new RNG((dungeon.seed ^ 0x5f3759df) >>> 0);

  // Theme uses its own stream so it stays stable regardless of other content.
  const theme = new RNG((dungeon.seed ^ 0x9e3779b9) >>> 0).pick(THEMES);

  const general = genGeneral(rng, dungeon);
  const corridorFeatures = genCorridorFeatures(rng, dungeon);
  const wanderingMonsters = Array.from({ length: 6 }, () => {
    const g = genMonsterGroup(rng);
    return `${g.full}; ${rng.pick(T.MONSTER_ACTIVITY)}`;
  });

  // Pass 1: roll each room's monster so "inhabited by" can be resolved.
  const monsters = new Map<
    number,
    { full: string; short: string; count: number } | null
  >();
  for (const room of dungeon.rooms) {
    monsters.set(room.id, rollMonster(rng, room.role));
  }

  // Pass 2: build the full writeups.
  const rooms = new Map<number, RoomContent>();
  for (const room of dungeon.rooms) {
    const mon = monsters.get(room.id) ?? null;
    const entries = buildEntries(rng, dungeon, room.id, monsters);
    const beat = room.role ? genBeat(rng, room.role) : undefined;

    const feature = rng.chance(0.6) ? genFeature(rng) : undefined;
    const treasure = mon && rng.chance(beatTreasureOdds(room.role))
      ? individualTreasure(rng, mon.count)
      : undefined;

    let trap: string | undefined;
    let trick: string | undefined;
    let hidden: HiddenTreasure | undefined;
    // A story beat dictates its own centrepiece; anything else rolls for one.
    switch (room.role) {
      case "Puzzle":
        trick = genTrick(rng);
        break;
      case "Setback":
        trap = genTrapLine(rng);
        break;
      case "Climax":
        if (rng.chance(0.4)) trick = genTrick(rng);
        break;
      case "Resolution":
        hidden = genHidden(rng);
        break;
      default: {
        const special = rng.weighted({
          none: 62,
          hidden: 18,
          trick: 10,
          trap: 10,
        });
        if (special === "hidden") hidden = genHidden(rng);
        else if (special === "trick") trick = genTrick(rng);
        else if (special === "trap") trap = genTrapLine(rng);
      }
    }

    const empty = !beat && !feature && !mon && !trap && !trick && !hidden;

    rooms.set(room.id, {
      id: room.id,
      beat,
      entries,
      feature,
      monster: mon?.full,
      treasure,
      trap,
      trick,
      hidden,
      empty,
    });
  }

  return {
    theme,
    topology: dungeon.topology,
    general,
    corridorFeatures,
    wanderingMonsters,
    rooms,
  };
}

// - - - five-room beats - - -

function genBeat(rng: RNG, role: RoomRole): Beat {
  const def = T.FIVE_ROOM_BEATS[role];
  return { role, purpose: def.purpose, guise: rng.pick(def.guises) };
}

// The climax always has something to fight; the quieter beats usually do not.
function rollMonster(rng: RNG, role?: RoomRole) {
  switch (role) {
    case "Climax":
      return genMonsterGroup(rng, true);
    case "Setback":
      return rng.chance(0.6) ? genMonsterGroup(rng) : null;
    case "Entrance":
      return rng.chance(0.5) ? genMonsterGroup(rng) : null;
    case "Puzzle":
    case "Resolution":
      return rng.chance(0.2) ? genMonsterGroup(rng) : null;
    default:
      return rng.chance(0.55) ? genMonsterGroup(rng) : null;
  }
}

// Whatever the climax is guarding, it is carrying some of it.
const beatTreasureOdds = (role?: RoomRole) => (role === "Climax" ? 1 : 0.7);

// - - - general / theme - - -

function genGeneral(rng: RNG, dungeon: Dungeon) {
  const history =
    `The dungeon was created by ${rng.pick(T.CREATORS)} as ${rng.pick(
      T.CREATOR_PURPOSE,
    )}. Its creators ${rng.pick(T.CREATOR_FATE)}, and ${rng.pick(T.SINCE)}.`;

  const sizeName =
    dungeon.options.dungeon_size === "Custom"
      ? "Custom"
      : dungeon.options.dungeon_size;
  const size = `${sizeName} (${dungeon.n_cols + 1} x ${dungeon.n_rows + 1})`;

  const walls = rng.pick(T.WALLS);
  const floor = rng.pick(T.FLOORS);
  return {
    history,
    size,
    walls: `${walls.name} (${walls.note})`,
    floor: floor.note ? `${floor.name} (${floor.note})` : floor.name,
    temperature: rng.pick(T.TEMPERATURES),
    illumination: rng.pick(T.ILLUMINATION),
  };
}

// - - - corridor features - - -

function genCorridorFeatures(rng: RNG, dungeon: Dungeon): CorridorFeature[] {
  const { cell, n_rows, n_cols } = dungeon;
  const open = (r: number, c: number) =>
    !!(cell[r]?.[c] & (OPENSPACE | DOORSPACE));

  // Candidate spots: corridor dead-ends and junctions.
  const candidates: { row: number; col: number }[] = [];
  for (let r = 0; r <= n_rows; r++) {
    for (let c = 0; c <= n_cols; c++) {
      const v = cell[r][c];
      if (!(v & CORRIDOR) || v & ROOM) continue;
      let deg = 0;
      for (const d of ["north", "south", "west", "east"] as Dir[])
        if (open(r + DI[d], c + DJ[d])) deg++;
      if (deg === 1 || deg >= 3) candidates.push({ row: r, col: c });
    }
  }
  rng.shuffle(candidates);
  const n = Math.min(candidates.length, rng.range(6, 12));
  const chosen = candidates
    .slice(0, n)
    .sort((a, b) => a.row - b.row || a.col - b.col);

  return chosen.map((spot, i) => ({
    letter: String.fromCharCode(97 + i),
    row: spot.row,
    col: spot.col,
    text: rng.chance(0.3) ? genTrapLine(rng) : rng.pick(T.CORRIDOR_FLAVOR),
  }));
}

// - - - entries / doors - - -

function buildEntries(
  rng: RNG,
  dungeon: Dungeon,
  roomId: number,
  monsters: Map<number, { short: string } | null>,
): DoorEntry[] {
  const doors = dungeon.doors.filter((d) => d.roomId === roomId);
  const byDir = new Map<Dir, Door[]>();
  for (const d of doors) {
    if (!byDir.has(d.dir)) byDir.set(d.dir, []);
    byDir.get(d.dir)!.push(d);
  }

  const entries: DoorEntry[] = [];
  for (const dir of ["north", "south", "west", "east"] as Dir[]) {
    const list = byDir.get(dir);
    if (!list) continue;
    list.sort((a, b) => a.row - b.row || a.col - b.col);
    list.forEach((door, idx) => {
      const label =
        list.length > 1
          ? `${DIR_LABEL[dir]} Entry #${idx + 1}`
          : `${DIR_LABEL[dir]} Entry`;
      const { title, symbols } = genDoorDesc(rng, door);
      let leadsTo: DoorEntry["leadsTo"];
      if (door.destId && door.destId !== roomId) {
        const destMon = monsters.get(door.destId);
        leadsTo = { id: door.destId, inhabited: destMon?.short };
      }
      entries.push({ label, title, symbols, leadsTo });
    });
  }
  return entries;
}

function genDoorDesc(
  rng: RNG,
  door: Door,
): { title: string; symbols: SymbolLine[] } {
  const symbols: SymbolLine[] = [];

  if (door.type === "arch") return { title: "Archway", symbols };

  if (door.type === "portc") {
    const iron = rng.chance(0.4);
    const trapped = rng.chance(0.2);
    const base = iron
      ? "Iron Portcullis (DC 20 to lift, DC 25 to break; 60 hp)"
      : "Wooden Portcullis (DC 20 to lift, DC 15 to break; 30 hp)";
    const title = trapped ? `Trapped ${base}` : base;
    if (trapped) symbols.push({ sym: "Ⓣ", text: genTrapLine(rng) });
    return { title, symbols };
  }

  // Physical door: material + lock/stuck/trap/secret state.
  const mat = weightedMaterial(rng);
  const secret = door.type === "secret";
  const trapped = door.type === "trap";
  let state: "unlocked" | "locked" | "stuck";
  if (door.type === "lock") state = "locked";
  else state = rng.pick(["unlocked", "locked", "stuck"] as const);

  let stateWord: string;
  let lockInfo: string;
  if (state === "locked") {
    stateWord = "Locked";
    lockInfo = `(DC ${mat.openDC} to open, DC ${mat.breakDC} to break; ${mat.hp} hp)`;
  } else if (state === "stuck") {
    stateWord = "Stuck";
    lockInfo = `(DC ${mat.breakDC} to break; ${mat.hp} hp)`;
  } else {
    stateWord = "Unlocked";
    lockInfo = `(${mat.hp} hp)`;
  }

  const parts: string[] = [];
  if (secret) parts.push(`Secret (DC ${rng.range(15, 25)} to find)`);
  if (trapped) parts.push("Trapped and");
  parts.push(stateWord, `${mat.name} Door`, lockInfo);
  const quirk = rng.pick(T.DOOR_QUIRK);
  if (quirk) parts.push(quirk);
  const title = parts.join(" ");

  if (secret) symbols.push({ sym: "Ⓢ", text: rng.pick(T.SECRET_CONCEAL) });
  if (trapped) symbols.push({ sym: "Ⓣ", text: genDoorTrap(rng) });
  return { title, symbols };
}

function weightedMaterial(rng: RNG): T.DoorMaterial {
  // Wood common, stone/iron rarer.
  const weights = [40, 22, 18, 12, 8];
  const total = weights.reduce((a, b) => a + b, 0);
  let roll = rng.next() * total;
  for (let i = 0; i < weights.length; i++) {
    roll -= weights[i];
    if (roll < 0) return T.DOOR_MATERIALS[i];
  }
  return T.DOOR_MATERIALS[0];
}

// - - - monsters - - -

function countFor(cr: string, rng: RNG): number {
  switch (cr) {
    case "1/8":
      return rng.range(4, 8);
    case "1/4":
      return rng.range(2, 6);
    case "1/2":
      return rng.range(1, 3);
    case "1":
      return rng.range(1, 2);
    default:
      return 1;
  }
}

function difficulty(rawXp: number, count: number): string {
  const mult =
    count >= 15 ? 4 : count >= 11 ? 3 : count >= 7 ? 2.5 : count >= 3 ? 2 : count >= 2 ? 1.5 : 1;
  const adj = rawXp * mult;
  if (adj >= 400) return "deadly";
  if (adj >= 300) return "hard";
  if (adj >= 200) return "medium";
  return "easy";
}

function genMonsterGroup(
  rng: RNG,
  boss = false,
): {
  full: string;
  short: string;
  count: number;
} {
  if (boss || rng.chance(0.18)) {
    const pair = rng.pick(T.LEADER_PAIRS);
    const leader = T.LEADERS[pair.leader];
    const minion = MON_BY_NAME.get(pair.minion);
    if (leader && minion) {
      const minionCount = boss ? rng.range(3, 6) : rng.range(1, 3);
      const raw = leader.xp + minionCount * minion.xp;
      const count = 1 + minionCount;
      const diff = difficulty(raw, count);
      const short = `${leader.name} and ${minionCount} x ${pair.minion}`;
      const full = `${leader.name} (cr ${leader.cr}, mm ${leader.mm}) and ${minionCount} x ${pair.minion} (cr ${minion.cr}, mm ${minion.mm}); ${diff}, ${raw} xp`;
      return { full, short, count };
    }
  }
  const mon = rng.pick(T.MONSTERS);
  const count = countFor(mon.cr, rng);
  const raw = count * mon.xp;
  const diff = difficulty(raw, count);
  const short = count > 1 ? `${count} x ${mon.name}` : mon.name;
  const full = `${short} (cr ${mon.cr}, mm ${mon.mm}); ${diff}, ${raw} xp`;
  return { full, short, count };
}

// - - - treasure - - -

function coinDrop(rng: RNG): string {
  const r = rng.next();
  if (r < 0.25) return `${rng.range(3, 18)} cp`;
  if (r < 0.55) return `${rng.range(3, 20)} sp`;
  if (r < 0.7) return `${rng.range(2, 13)} ep`;
  if (r < 0.92) return `${rng.range(2, 21)} gp`;
  return `${rng.range(1, 6)} pp`;
}

function individualTreasure(rng: RNG, count: number): string {
  return Array.from({ length: Math.min(count, 8) }, () => coinDrop(rng)).join(
    "; ",
  );
}

function groupValuables(
  rng: RNG,
  list: string[],
  k: number,
  value: number,
): string[] {
  const counts = new Map<string, number>();
  const order: string[] = [];
  for (let i = 0; i < k; i++) {
    const name = rng.pick(list);
    if (!counts.has(name)) order.push(name);
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  return order.map((name) => {
    const n = counts.get(name)!;
    return `${n > 1 ? `${n} x ` : ""}${name} (${value} gp)`;
  });
}

function hoard(rng: RNG): string {
  const parts: string[] = [
    `${rng.range(14, 30) * 100} cp`,
    `${rng.range(4, 16) * 100} sp`,
    `${rng.range(3, 12) * 10} gp`,
  ];
  const r = rng.next();
  if (r < 0.45) parts.push(...groupValuables(rng, T.GEMS_50, rng.range(3, 8), 50));
  else if (r < 0.8) parts.push(...groupValuables(rng, T.ART_25, rng.range(4, 8), 25));
  else parts.push(...groupValuables(rng, T.GEMS_10, rng.range(3, 6), 10));

  const nMagic = rng.range(0, 2);
  const magic = new Set<string>();
  while (magic.size < nMagic) magic.add(rng.pick(T.MAGIC_ITEMS));
  parts.push(...magic);
  return parts.join(", ");
}

function genHidden(rng: RNG): HiddenTreasure {
  const iron = rng.chance(0.4);
  const hp = iron ? 60 : 10;
  const unlock = iron ? rng.range(15, 25) : rng.range(10, 25);
  const breakDC = iron ? 30 : 15;
  const mat = iron ? "Iron" : "Simple Wooden";
  const hidden = rng.chance(0.75)
    ? `Hidden (DC ${rng.range(12, 25)} to find) `
    : "";
  const trapped = rng.chance(0.25);
  const container = `${hidden}${trapped ? "Trapped and " : ""}Locked ${mat} Chest (DC ${unlock} to unlock, DC ${breakDC} to break; ${hp} hp)`;
  return {
    container,
    trapLine: trapped ? genTrapLine(rng) : undefined,
    contents: hoard(rng),
  };
}

// - - - traps & tricks - - -

function genTrapLine(rng: RNG): string {
  const def = rng.pick(T.TRAPS);
  const find = rng.pick([def.find[0], def.find[1]]);
  const disable = rng.pick([def.disable[0], def.disable[1]]);
  const save = rng.range(10, 20);
  const dice = rng.range(1, 4);
  const effect = def.effect(save, dice);
  const head = `${def.name}: DC ${find} to find, DC ${disable} to disable`;
  if (def.area === "attack") return `${head}; ${effect}`;
  if (def.area === "one target") return `${head}; one target, ${effect}`;
  return `${head}; ${def.area}, ${effect}`;
}

function genDoorTrap(rng: RNG): string {
  if (rng.chance(0.4)) {
    const tmpl = rng.pick(T.SPECIAL_DOOR_TRAPS);
    return tmpl
      .replace("{dis}", String(rng.range(10, 15)))
      .replace("{save}", String(rng.range(15, 20)));
  }
  return genTrapLine(rng);
}

function genTrick(rng: RNG): string {
  return rng
    .pick(T.TRICKS)
    .replace("{corner}", rng.pick(T.CORNERS))
    .replace("{side}", rng.pick(T.SIDES));
}

// - - - room features - - -

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function genFeature(rng: RNG): string {
  const r = rng.next();
  if (r < 0.4) {
    const purpose = rng.pick(T.ROOM_PURPOSE);
    const detailArr = T.ROOM_PURPOSE_DETAIL[purpose];
    const detail = detailArr ? ` ${rng.pick(detailArr)}` : "";
    return `This room ${rng.pick(T.ROOM_AGE)} ${purpose}${rng.pick(
      T.ROOM_RUIN,
    )}${detail}`.trim();
  }
  if (r < 0.65) {
    const blood = rng.chance(0.4) ? " in blood" : "";
    return `Someone has scrawled "${rng.pick(T.GRAFFITI)}"${blood} on the ${rng.pick(
      T.WALL_SIDES,
    )} wall, and ${rng.pick(T.FEATURE_CLAUSE)}`;
  }
  const a = rng.pick(T.FEATURE_CLAUSE);
  let b = rng.pick(T.FEATURE_CLAUSE);
  while (b === a) b = rng.pick(T.FEATURE_CLAUSE);
  return `${cap(a)}, and ${b}`;
}
