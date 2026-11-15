# Vaultwright

A set of **fully client-side** D&D 5e tools. The landing page (`#/`) lists the
toolkit; each tool lives behind a hash route (`#/dungeon`, `#/fiveroom`). Two
tools are built so far; the other cards are placeholders.

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
- **Shareable links**: the address bar always holds the seed and every
  changed option (`#/dungeon?seed=…&dungeon_layout=Keep`), so a link opens the
  exact same map.
- **All the original controls:**
  - Dungeon size (Fine … Colossal, plus Custom cols × rows)
  - Dungeon layout: Square, Rectangle, Box, Cross, Dagger, Saltire, Keep,
    Hexagon, Round, **Nexus** (a large central chamber with labyrinthine arms
    sprawling out of it), **Cavernous** (a cellular-automata cave), and
    **Mines** (a shaft sunk from the surface with level drifts at regular
    depths, winzes between levels, dead-end prospecting spurs and ragged
    stopes; chambers are cut beside the workings and reached by straight
    crosscuts, and the Codex switches to mine flavor: ores, cart rails,
    firedamp, powder magazines)
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
- **PNG export** of the current map.

## Five Room Dungeon (`#/fiveroom`)

A one-session adventure, generated whole: a map plus the brief to run it from.

The five-room dungeon is the five-act structure John Four wrote up at
roleplayingtips.com - entrance, puzzle, setback, climax, resolution. It is a
story structure, not a floor plan, so a room here is really a scene and the
"dungeon" is any location an adventure happens in: a windmill, a sealed
mansion, a lighthouse, the furnished corpse of something enormous.

- **Eleven shapes.** Rooms are laid out along one of the topologies catalogued
  in Matthew J. Neagley's forms of the five room dungeon (Gnome Stew):
  Railroad, Arrow, Cross, Evil Mule, Fauchard Fork, Foglio's Snail, Moose, Paw,
  V for Vendetta, Cat's Cradle and Crown. The shape is what keeps two of them
  from feeling alike; Cat's Cradle and Crown add a junction hall that carries
  no beat of its own.
- **The job**: a patron, what they are actually paying for, and the site.
- **The entrance answers why the place has not been looted already** - a ward
  that has only just failed, a key buried with whoever turned it, a rockfall
  something has just cleared.
- **The puzzle is the counterweight to the entrance.** A fight at the door
  means a problem behind it; a riddle at the door means something with teeth
  behind it. Guises are tagged combat or not, and the puzzle takes the
  opposite.
- **The setback costs something** - spell slots, hit points, the retreat, an
  item the party was relying on - so the boss room is fought on fumes.
- **The climax** gets a battlefield worth using, the boss's tactics, and a
  twist: a duel, a bargain that is genuinely tempting, a name it should not
  know.
- **The resolution** pays out and leaves a thread: a complication (the chest
  is a mimic), a hook into the next adventure, and a twist held in reserve for
  a boss that went down too easily.
- **One piece kept in your pocket**: a name dropped here once and never
  explained, to cash in ten levels later.

Rooms are stocked from the same flavor tables as the dungeon generator, so the
puzzle gets a trick, the setback a trap, the climax a boss with minions, and
the resolution a hoard. Stairs go in the entrance (up) and the resolution
(down). Same seed, same adventure.

`npm run check` asserts the structural invariants (see below), including five
distinct beats, all reachable on foot from the entrance, for every dungeon size
and room size pair and every shape. Five-room maps are floored at 25 x 33 so
every room is at least 3 cells a side.

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # typecheck + production build to dist/
npm run check    # generator self-checks (a few seconds)
npm run preview  # preview the production build
```

`npm run check` generates a few thousand dungeons and fails on the first
broken one. It asserts that layout masks are one connected piece, every room
is reachable from every other, the same options always give the same map,
stairs get placed when asked for, every door glyph is in the door list, every
room's description lists a way in, a door's text agrees with its glyph, and
the five-room invariants above.

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
  check/            # `npm run check`: generator and stocker self-checks
  render/
    draw.ts         # canvas renderer (map, selection, corridor letters)
    palettes.ts     # per-map-style colour palettes
  ui/
    useMapTool.ts   # shared tool state: options <-> URL, canvas, export
    MapControls.tsx # shared sidebar fields and map stage
    options.ts      # control definitions + client-side name generator
    Codex.tsx       # description panel (dungeon generator)
    Brief.tsx       # adventure brief panel (five room dungeon)
    SelectField.tsx
    Legend.tsx
  App.tsx              # landing page + hash router
  DungeonGenerator.tsx # the generator shell / control panel
  FiveRoomDungeon.tsx  # the five-room shell / control panel
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
