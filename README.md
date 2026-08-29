# Vaultwright

A set of **fully client-side** D&D 5e tools. The landing page (`#/`) lists the
toolkit; each tool lives behind a hash route (`#/dungeon`). Only the dungeon
generator is built so far; the other cards are placeholders.

## Dungeon Generator (`#/dungeon`)

A modern remake of [donjon's classic 5e dungeon
generator](https://donjon.bin.sh/5e/dungeon/), built with **Vite + React +
TypeScript**.

The original renders its maps on a Perl backend (`construct.cgi` /
`preview.cgi`): you send options, the server sends back an image. Vaultwright
instead ports the underlying generation algorithm to TypeScript so the entire
dungeon is generated and drawn **in your browser**, with no server round-trip.

## Features

- **Faithful algorithm**: rooms → doors → corridor maze → stairs → dead-end
  removal, the same pipeline as the original.
- **Deterministic seeds**: the same seed always reproduces the same dungeon.
- **All the original controls:**
  - Dungeon size (Fine … Colossal, plus Custom cols × rows)
  - Dungeon layout: Square, Rectangle, Box, Cross, Dagger, Saltire, Keep,
    Hexagon, Round, **Nexus** (a large central chamber with labyrinthine arms
    sprawling out of it), **Five Room** (see below), and **Cavernous** (a
    cellular-automata cave)
  - Room layout (Sparse / Scattered / Dense / Symmetric) and room size
  - Door sets (None / Basic / Secure / Standard / Deathtrap): archways, doors,
    locked, trapped, secret, and portcullis
  - Corridor style (Labyrinth / Errant / Straight)
  - Dead-end removal (None / Some / All) and stairs
  - 15 map styles and Square / Hex / Vertical-Hex grids
- **Canvas renderer** with door & stair glyphs, room numbers, and a legend.
- **Stocked descriptions (the "Codex")**: click any room on the map to read a
  full writeup: an evocative **dungeon theme** (a d100-style headline concept),
  an overall theme (history, walls, floor, temperature, illumination), a
  corridor-feature key, a wandering-monster table, and per-room
  entries with door details, trap/secret notes, "leads to room #N" links,
  monsters (with CR/XP/difficulty), treasure, tricks, and hidden hoards. All
  deterministically derived from the seed.
- **Five-room dungeons**: a whole adventure in five beats - entrance, puzzle,
  setback, climax, resolution - the structure John Four wrote up at
  roleplayingtips.com. Rooms are laid out along one of eleven topologies drawn
  from Matthew J. Neagley's "Nine Forms of the Five Room Dungeon" (Gnome Stew)
  and its 21-form expansion: Railroad, Arrow, Cross, Evil Mule, Fauchard Fork,
  Foglio's Snail, Moose, Paw, V for Vendetta, Cat's Cradle and Crown. The shape
  is what keeps two of them from feeling alike, so each beat is also rolled a
  guise from the flavor tables - an entrance can be a guardian or a parley, a
  setback can be a false victory as easily as a false defeat - and the beat
  decides the room's centrepiece: the puzzle gets a trick, the setback a trap,
  the climax the boss, the resolution the hoard. Stairs go in the entrance (up)
  and the resolution (down). The Codex lists the shape and its beats.
- **PNG export** of the current map.

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # typecheck + production build to dist/
npm run preview  # preview the production build
```

## Project structure

```
src/
  dungeon/
    generate.ts     # the generation algorithm (rooms, corridors, doors, stairs)
    connectivity.ts # traces where each door leads through the corridors
    masks.ts        # dungeon-layout masks (Box, Cross, Round, …)
    fiveroom.ts     # five-room story beats and the topologies they lay out in
    flags.ts        # per-cell bit flags
    rng.ts          # seeded PRNG (mulberry32)
    types.ts        # option & data-model types
  content/
    tables.ts       # flavor tables (monsters, treasure, traps, features, …)
    stock.ts        # deterministic "stocker" → theme + per-room descriptions
  render/
    draw.ts         # canvas renderer (map, selection, corridor letters)
    palettes.ts     # per-map-style colour palettes
  ui/
    options.ts      # control definitions + client-side name generator
    Codex.tsx       # description panel
    Legend.tsx
  App.tsx             # landing page + hash router
  DungeonGenerator.tsx # the generator shell / control panel
```

## Credits

Parts of the flavor tables in `src/content/tables.ts` are adapted from the
community random tables published on
[r/BehindTheTables](https://www.reddit.com/r/BehindTheTables/wiki/index/):
Basic Dungeons, Dungeon Dressing, Temples, Tombs and Castle Dungeons.

The generation algorithm follows the approach documented by **drow** for the
original donjon generator. Vaultwright is an independent, from-scratch
reimplementation for the browser; the `reference/` folder holds the scraped
original assets used to match the option set and visual style.
