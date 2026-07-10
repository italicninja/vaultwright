# Vaultwright

A modern, **fully client-side** remake of [donjon's classic 5e dungeon
generator](https://donjon.bin.sh/5e/dungeon/), built with **Vite + React +
TypeScript**.

The original renders its maps on a Perl backend (`construct.cgi` /
`preview.cgi`) — you send options, the server sends back an image. Vaultwright
instead ports the underlying generation algorithm to TypeScript so the entire
dungeon is generated and drawn **in your browser**, with no server round-trip.

## Features

- **Faithful algorithm** — rooms → doors → corridor maze → stairs → dead-end
  removal, the same pipeline as the original.
- **Deterministic seeds** — the same seed always reproduces the same dungeon.
- **All the original controls:**
  - Dungeon size (Fine … Colossal, plus Custom cols × rows)
  - Dungeon layout: Square, Rectangle, Box, Cross, Dagger, Saltire, Keep,
    Hexagon, Round, and **Cavernous** (a cellular-automata cave)
  - Room layout (Sparse / Scattered / Dense / Symmetric) and room size
  - Door sets (None / Basic / Secure / Standard / Deathtrap) — archways, doors,
    locked, trapped, secret, and portcullis
  - Corridor style (Labyrinth / Errant / Straight)
  - Dead-end removal (None / Some / All) and stairs
  - 15 map styles and Square / Hex / Vertical-Hex grids
- **Canvas renderer** with door & stair glyphs, room numbers, and a legend.
- **Stocked descriptions (the "Codex")** — click any room on the map to read a
  full writeup: an overall dungeon theme (history, walls, floor, temperature,
  illumination), a corridor-feature key, a wandering-monster table, and per-room
  entries with door details, trap/secret notes, "leads to room #N" links,
  monsters (with CR/XP/difficulty), treasure, tricks, and hidden hoards. All
  deterministically derived from the seed.
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
  App.tsx           # the app shell / control panel
```

## Credits

The generation algorithm follows the approach documented by **drow** for the
original donjon generator. Vaultwright is an independent, from-scratch
reimplementation for the browser; the `reference/` folder holds the scraped
original assets used to match the option set and visual style.
