// Canvas renderer for a generated dungeon.

import {
  OPENSPACE,
  ROOM,
  ARCH,
  DOOR,
  LOCKED,
  TRAPPED,
  SECRET,
  PORTC,
  DOORSPACE,
  STAIR_DN,
  STAIR_UP,
} from "../dungeon/flags";
import type { Dungeon, GridStyle } from "../dungeon/types";
import { getPalette } from "./palettes";

export interface RenderConfig {
  cellSize: number;
  grid: GridStyle;
  showLabels: boolean;
}

const DEFAULT_CELL = 20;

export function measure(dungeon: Dungeon, cellSize = DEFAULT_CELL) {
  return {
    width: (dungeon.n_cols + 1) * cellSize,
    height: (dungeon.n_rows + 1) * cellSize,
  };
}

export function renderDungeon(
  canvas: HTMLCanvasElement,
  dungeon: Dungeon,
  config: RenderConfig,
) {
  const cs = config.cellSize;
  const pal = getPalette(dungeon.options.map_style);
  const { width, height } = measure(dungeon, cs);

  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const ctx = canvas.getContext("2d")!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = false;

  // Solid rock background.
  ctx.fillStyle = pal.wall;
  ctx.fillRect(0, 0, width, height);

  const cell = dungeon.cell;
  const isOpen = (r: number, c: number) =>
    !!(cell[r]?.[c] & (OPENSPACE | DOORSPACE));

  // Floor tiles.
  ctx.fillStyle = pal.floor;
  for (let r = 0; r <= dungeon.n_rows; r++) {
    for (let c = 0; c <= dungeon.n_cols; c++) {
      if (isOpen(r, c)) ctx.fillRect(c * cs, r * cs, cs, cs);
    }
  }

  // Inner shadow along walls, for depth.
  drawWallShadow(ctx, dungeon, cs, pal.shadow);

  // Grid overlay.
  if (config.grid !== "None") {
    drawGrid(ctx, dungeon, cs, config.grid, pal.grid);
  }

  // Crisp wall outline around all open space.
  drawWallOutline(ctx, dungeon, cs, pal.wall);

  // Doors and stairs.
  ctx.strokeStyle = pal.ink;
  ctx.fillStyle = pal.ink;
  for (let r = 0; r <= dungeon.n_rows; r++) {
    for (let c = 0; c <= dungeon.n_cols; c++) {
      const v = cell[r]?.[c] ?? 0;
      if (v & DOORSPACE) drawDoor(ctx, dungeon, r, c, cs, pal.floor, pal.ink);
      if (v & (STAIR_DN | STAIR_UP)) drawStair(ctx, dungeon, r, c, cs, pal.ink);
    }
  }

  // Room numbers.
  if (config.showLabels) drawLabels(ctx, dungeon, cs, pal.ink, pal.floor);
}

function drawGrid(
  ctx: CanvasRenderingContext2D,
  dungeon: Dungeon,
  cs: number,
  grid: GridStyle,
  color: string,
) {
  const w = (dungeon.n_cols + 1) * cs;
  const h = (dungeon.n_rows + 1) * cs;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;

  if (grid === "Square") {
    ctx.beginPath();
    for (let x = 0; x <= w; x += cs) {
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, h);
    }
    for (let y = 0; y <= h; y += cs) {
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(w, y + 0.5);
    }
    ctx.stroke();
  } else if (grid === "Hex" || grid === "VertHex") {
    drawHexGrid(ctx, w, h, cs, grid === "VertHex");
  }
  ctx.restore();
}

function drawHexGrid(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  cs: number,
  vertical: boolean,
) {
  const size = cs * 0.62;
  ctx.beginPath();
  if (vertical) {
    const hstep = size * Math.sqrt(3);
    const vstep = size * 1.5;
    for (let row = 0, y = 0; y < h + size; row++, y = row * vstep) {
      const xoff = row % 2 ? hstep / 2 : 0;
      for (let x = xoff; x < w + hstep; x += hstep) {
        hexPath(ctx, x, y, size, true);
      }
    }
  } else {
    const vstep = size * Math.sqrt(3);
    const hstep = size * 1.5;
    for (let col = 0, x = 0; x < w + size; col++, x = col * hstep) {
      const yoff = col % 2 ? vstep / 2 : 0;
      for (let y = yoff; y < h + vstep; y += vstep) {
        hexPath(ctx, x, y, size, false);
      }
    }
  }
  ctx.stroke();
}

function hexPath(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  pointyTop: boolean,
) {
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i + (pointyTop ? Math.PI / 6 : 0);
    const x = cx + size * Math.cos(angle);
    const y = cy + size * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

// Draws a 1px outline separating open space from rock.
function drawWallOutline(
  ctx: CanvasRenderingContext2D,
  dungeon: Dungeon,
  cs: number,
  color: string,
) {
  const cell = dungeon.cell;
  const open = (r: number, c: number) =>
    !!(cell[r]?.[c] & (OPENSPACE | DOORSPACE));
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let r = 0; r <= dungeon.n_rows; r++) {
    for (let c = 0; c <= dungeon.n_cols; c++) {
      if (!open(r, c)) continue;
      const x = c * cs;
      const y = r * cs;
      if (!open(r - 1, c)) {
        ctx.moveTo(x, y + 0.5);
        ctx.lineTo(x + cs, y + 0.5);
      }
      if (!open(r + 1, c)) {
        ctx.moveTo(x, y + cs - 0.5);
        ctx.lineTo(x + cs, y + cs - 0.5);
      }
      if (!open(r, c - 1)) {
        ctx.moveTo(x + 0.5, y);
        ctx.lineTo(x + 0.5, y + cs);
      }
      if (!open(r, c + 1)) {
        ctx.moveTo(x + cs - 0.5, y);
        ctx.lineTo(x + cs - 0.5, y + cs);
      }
    }
  }
  ctx.stroke();
  ctx.restore();
}

// Soft shading just inside walls for a sense of depth.
function drawWallShadow(
  ctx: CanvasRenderingContext2D,
  dungeon: Dungeon,
  cs: number,
  color: string,
) {
  const cell = dungeon.cell;
  const open = (r: number, c: number) =>
    !!(cell[r]?.[c] & (OPENSPACE | DOORSPACE));
  const t = Math.max(2, Math.round(cs * 0.16));
  ctx.save();
  ctx.fillStyle = color;
  for (let r = 0; r <= dungeon.n_rows; r++) {
    for (let c = 0; c <= dungeon.n_cols; c++) {
      if (!open(r, c)) continue;
      const x = c * cs;
      const y = r * cs;
      if (!open(r - 1, c)) ctx.fillRect(x, y, cs, t);
      if (!open(r, c - 1)) ctx.fillRect(x, y, t, cs);
    }
  }
  ctx.restore();
}

function doorOrientation(dungeon: Dungeon, r: number, c: number): "h" | "v" {
  // Horizontal wall (door faces N/S) if open cells are above & below.
  const cell = dungeon.cell;
  const openV =
    cell[r - 1]?.[c] & (OPENSPACE | DOORSPACE) &&
    cell[r + 1]?.[c] & (OPENSPACE | DOORSPACE);
  return openV ? "h" : "v";
}

function drawDoor(
  ctx: CanvasRenderingContext2D,
  dungeon: Dungeon,
  r: number,
  c: number,
  cs: number,
  floor: string,
  ink: string,
) {
  const v = dungeon.cell[r][c];
  const orient = doorOrientation(dungeon, r, c);
  const x = c * cs;
  const y = r * cs;
  ctx.save();
  ctx.strokeStyle = ink;
  ctx.fillStyle = ink;
  ctx.lineWidth = Math.max(1.5, cs * 0.09);

  // Local coordinate helpers for a wall-spanning axis.
  const cx = x + cs / 2;
  const cy = y + cs / 2;
  const half = cs / 2;

  if (v & ARCH) {
    // Two jamb ticks at the wall, no leaf.
    drawJambs(ctx, x, y, cs, orient, ink);
  } else if (v & DOOR) {
    drawJambs(ctx, x, y, cs, orient, ink);
    drawLeaf(ctx, x, y, cs, orient, floor, ink, false);
  } else if (v & LOCKED) {
    drawJambs(ctx, x, y, cs, orient, ink);
    drawLeaf(ctx, x, y, cs, orient, ink, ink, true);
  } else if (v & TRAPPED) {
    drawJambs(ctx, x, y, cs, orient, ink);
    drawLeaf(ctx, x, y, cs, orient, floor, ink, false);
    // Trap cross.
    ctx.beginPath();
    ctx.moveTo(cx - half * 0.35, cy - half * 0.35);
    ctx.lineTo(cx + half * 0.35, cy + half * 0.35);
    ctx.moveTo(cx + half * 0.35, cy - half * 0.35);
    ctx.lineTo(cx - half * 0.35, cy + half * 0.35);
    ctx.stroke();
  } else if (v & SECRET) {
    // Draw an 'S' glyph on the wall line.
    ctx.font = `bold ${Math.round(cs * 0.7)}px Georgia, serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("S", cx, cy + 0.5);
  } else if (v & PORTC) {
    drawJambs(ctx, x, y, cs, orient, ink);
    // Dotted bars across the opening.
    const dots = 4;
    ctx.fillStyle = ink;
    for (let i = 0; i < dots; i++) {
      const t = (i + 0.5) / dots;
      const px = orient === "h" ? x + cs * t : cx;
      const py = orient === "h" ? cy : y + cs * t;
      ctx.beginPath();
      ctx.arc(px, py, Math.max(1, cs * 0.07), 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

function drawJambs(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  cs: number,
  orient: "h" | "v",
  ink: string,
) {
  ctx.save();
  ctx.strokeStyle = ink;
  ctx.lineWidth = Math.max(1.5, cs * 0.1);
  ctx.beginPath();
  if (orient === "h") {
    // wall runs left-right; jambs at the two ends of the opening
    ctx.moveTo(x, y + cs * 0.28);
    ctx.lineTo(x, y + cs * 0.72);
    ctx.moveTo(x + cs, y + cs * 0.28);
    ctx.lineTo(x + cs, y + cs * 0.72);
  } else {
    ctx.moveTo(x + cs * 0.28, y);
    ctx.lineTo(x + cs * 0.72, y);
    ctx.moveTo(x + cs * 0.28, y + cs);
    ctx.lineTo(x + cs * 0.72, y + cs);
  }
  ctx.stroke();
  ctx.restore();
}

function drawLeaf(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  cs: number,
  orient: "h" | "v",
  fill: string,
  stroke: string,
  filled: boolean,
) {
  ctx.save();
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = Math.max(1, cs * 0.06);
  const th = cs * 0.34; // leaf thickness
  if (orient === "h") {
    const bx = x + cs * 0.5 - th / 2;
    ctx.beginPath();
    ctx.rect(bx, y + cs * 0.16, th, cs * 0.68);
  } else {
    const by = y + cs * 0.5 - th / 2;
    ctx.beginPath();
    ctx.rect(x + cs * 0.16, by, cs * 0.68, th);
  }
  if (filled) ctx.fill();
  else {
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

function drawStair(
  ctx: CanvasRenderingContext2D,
  dungeon: Dungeon,
  r: number,
  c: number,
  cs: number,
  ink: string,
) {
  const v = dungeon.cell[r][c];
  // Find neighbouring open cell to orient the stair run.
  const cell = dungeon.cell;
  let dr = 0,
    dc = 0;
  if (cell[r - 1]?.[c] & (OPENSPACE | DOORSPACE)) (dr = -1), (dc = 0);
  else if (cell[r + 1]?.[c] & (OPENSPACE | DOORSPACE)) (dr = 1), (dc = 0);
  else if (cell[r]?.[c - 1] & (OPENSPACE | DOORSPACE)) (dr = 0), (dc = -1);
  else (dr = 0), (dc = 1);

  const down = !!(v & STAIR_DN);
  const x = c * cs;
  const y = r * cs;
  ctx.save();
  ctx.strokeStyle = ink;
  ctx.lineWidth = Math.max(1, cs * 0.06);
  const steps = 5;
  const horizontal = dc !== 0;
  for (let i = 0; i < steps; i++) {
    // "down" steps shrink toward the exit, "up" steps grow.
    const t = (i + 0.5) / steps;
    const frac = down ? 1 - t * 0.6 : 0.4 + t * 0.6;
    const len = cs * 0.7 * frac;
    if (horizontal) {
      const px = x + cs * (dc > 0 ? t : 1 - t);
      ctx.beginPath();
      ctx.moveTo(px, y + cs / 2 - len / 2);
      ctx.lineTo(px, y + cs / 2 + len / 2);
      ctx.stroke();
    } else {
      const py = y + cs * (dr > 0 ? t : 1 - t);
      ctx.beginPath();
      ctx.moveTo(x + cs / 2 - len / 2, py);
      ctx.lineTo(x + cs / 2 + len / 2, py);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawLabels(
  ctx: CanvasRenderingContext2D,
  dungeon: Dungeon,
  cs: number,
  ink: string,
  floor: string,
) {
  ctx.save();
  ctx.font = `${Math.round(cs * 0.62)}px Georgia, serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const room of dungeon.rooms) {
    // Skip rooms that were entirely collapsed away.
    const cr = Math.round((room.north + room.south) / 2);
    const cc = Math.round((room.west + room.east) / 2);
    if (!(dungeon.cell[cr]?.[cc] & ROOM)) continue;
    const x = cc * cs + cs / 2;
    const y = cr * cs + cs / 2;
    const text = String(room.id);
    // Halo for legibility.
    ctx.lineWidth = Math.max(2, cs * 0.18);
    ctx.strokeStyle = floor;
    ctx.strokeText(text, x, y);
    ctx.fillStyle = ink;
    ctx.fillText(text, x, y);
  }
  ctx.restore();
}
