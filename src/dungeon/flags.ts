// Cell bit-flags, following the scheme from drow's classic dungeon generator.
// Each grid cell is a single 32-bit integer carrying its type and metadata.

export const NOTHING = 0x00000000;
export const BLOCKED = 0x00000001;
export const ROOM = 0x00000002;
export const CORRIDOR = 0x00000004;
export const PERIMETER = 0x00000010;
export const ENTRANCE = 0x00000020;
export const ROOM_ID = 0x0000ffc0; // room number stored in these bits

export const ARCH = 0x00010000;
export const DOOR = 0x00020000;
export const LOCKED = 0x00040000;
export const TRAPPED = 0x00080000;
export const SECRET = 0x00100000;
export const PORTC = 0x00200000; // portcullis

export const STAIR_DN = 0x00400000;
export const STAIR_UP = 0x00800000;

export const LABEL = 0xff000000; // ascii label stored in the top byte

// Composite masks
export const OPENSPACE = ROOM | CORRIDOR;
export const DOORSPACE = ARCH | DOOR | LOCKED | TRAPPED | SECRET | PORTC;
export const ESPACE = ENTRANCE | DOORSPACE | LABEL;
export const STAIRS = STAIR_DN | STAIR_UP;

export const BLOCK_ROOM = BLOCKED | ROOM;
export const BLOCK_CORR = BLOCKED | PERIMETER | CORRIDOR;
export const BLOCK_DOOR = BLOCKED | DOORSPACE;

// Room-id helpers (id is stored shifted left by 6 bits).
export const ROOM_ID_SHIFT = 6;
export const roomIdOf = (cell: number): number =>
  (cell & ROOM_ID) >> ROOM_ID_SHIFT;
