// Five-room dungeon topologies.
//
// The five-room dungeon (John Four, roleplayingtips.com) is a five-act story
// structure - entrance, puzzle, setback, climax, resolution - not a floor plan.
// What keeps two of them from feeling identical is the shape: which room
// connects to which. Matthew J. Neagley's "Nine Forms of the Five Room Dungeon"
// (Gnome Stew), later expanded to 21 by a commenter citing the topology of
// five-node graphs, catalogues those shapes.
//
// Each topology below is a graph: nodes are rooms placed on a coarse slot grid,
// edges are corridors. Node order is the story order, so node 0 is always the
// entrance and node 4 the resolution; a node past index 4 is an unlabelled
// junction room, the hub of a cat's cradle or crown, which carries no beat.

import type { RoomRole } from "./types";

/** Story beat for each node index; anything past the fifth is a junction. */
export const ROLES: RoomRole[] = [
  "Entrance",
  "Puzzle",
  "Setback",
  "Climax",
  "Resolution",
];

export const roleFor = (node: number): RoomRole => ROLES[node] ?? "Junction";

export interface Topology {
  name: string;
  note: string;
  /** Slot coordinates [gx, gy] per node, on a small integer grid. */
  nodes: [number, number][];
  /** Corridor connections between node indices. */
  edges: [number, number][];
}

export const TOPOLOGIES: Topology[] = [
  {
    name: "Railroad",
    note: "One room after another, the beats hit in order.",
    nodes: [
      [0, 0],
      [1, 0],
      [2, 0],
      [2, 1],
      [2, 2],
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
    ],
  },
  {
    name: "Arrow",
    note: "A straight approach that splits at the head.",
    nodes: [
      [1, 0],
      [1, 1],
      [1, 2],
      [0, 3],
      [2, 3],
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [2, 4],
    ],
  },
  {
    name: "Cross",
    note: "Everything hangs off one central chamber.",
    nodes: [
      [1, 0],
      [0, 1],
      [1, 1],
      [2, 1],
      [1, 2],
    ],
    edges: [
      [0, 2],
      [1, 2],
      [2, 3],
      [2, 4],
    ],
  },
  {
    name: "Evil Mule",
    note: "A chain that kicks backwards at the end.",
    nodes: [
      [0, 0],
      [1, 0],
      [2, 0],
      [2, 1],
      [0, 1],
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [1, 4],
    ],
  },
  {
    name: "Fauchard Fork",
    note: "An early fork, one tine longer than the other.",
    nodes: [
      [1, 0],
      [1, 1],
      [0, 2],
      [2, 2],
      [2, 3],
    ],
    edges: [
      [0, 1],
      [1, 2],
      [1, 3],
      [3, 4],
    ],
  },
  {
    name: "Foglio's Snail",
    note: "A closed loop, so the party can arrive from either side.",
    nodes: [
      [0, 0],
      [2, 0],
      [2, 1],
      [1, 2],
      [0, 1],
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 0],
    ],
  },
  {
    name: "Moose",
    note: "Antlers: two branches, one of them growing a second time.",
    nodes: [
      [1, 3],
      [1, 2],
      [0, 1],
      [2, 1],
      [1, 0],
    ],
    edges: [
      [0, 1],
      [1, 2],
      [1, 3],
      [2, 4],
    ],
  },
  {
    name: "Paw",
    note: "Three toes off a single ankle, explored in any order.",
    nodes: [
      [1, 0],
      [1, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ],
    edges: [
      [0, 1],
      [1, 2],
      [1, 3],
      [1, 4],
    ],
  },
  {
    name: "V for Vendetta",
    note: "A diamond that rejoins before the final room.",
    nodes: [
      [1, 0],
      [0, 1],
      [2, 1],
      [1, 2],
      [1, 3],
    ],
    edges: [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 3],
      [3, 4],
    ],
  },
  {
    name: "Cat's Cradle",
    note: "A junction hall in the middle; the five beats can fall in any order.",
    nodes: [
      [1, 0],
      [0, 1],
      [2, 1],
      [0, 2],
      [2, 2],
      [1, 1], // hub, no beat
    ],
    edges: [
      [5, 0],
      [5, 1],
      [5, 2],
      [5, 3],
      [5, 4],
    ],
  },
  {
    name: "Crown",
    note: "A ring of rooms around a junction hall, walkable in either direction.",
    nodes: [
      [0, 0],
      [1, 0],
      [2, 1],
      [1, 2],
      [0, 1],
      [1, 1], // hub, no beat
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 0],
      [5, 0],
      [5, 2],
      [5, 3],
    ],
  },
];
