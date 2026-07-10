// Dungeon-layout masks. A mask is a small grid of 0/1 that is scaled
// (nearest-neighbour) onto the full cell grid; a 0 marks the cell BLOCKED.
// Layouts not listed here (Square, Rectangle) fill the whole grid, and
// Round / Cavernous are handled procedurally in generate.ts.

export type Mask = number[][];

export const MASKS: Partial<Record<string, Mask>> = {
  Box: [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ],
  Cross: [
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  Saltire: [
    [1, 0, 0, 0, 1],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 1, 0],
    [1, 0, 0, 0, 1],
  ],
  Dagger: [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0],
  ],
  Keep: [
    [1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 1, 1],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 1, 1],
  ],
  Hexagon: [
    [0, 0, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 0, 0],
  ],
};

/**
 * Build a full-grid boolean mask (true = open) for the given layout.
 * `nRows`/`nCols` are inclusive maxima (grid is (nRows+1) x (nCols+1)).
 */
export function buildMask(
  layout: string,
  nRows: number,
  nCols: number,
): boolean[][] | null {
  if (layout === "Square" || layout === "Rectangle") return null;

  const open: boolean[][] = Array.from({ length: nRows + 1 }, () =>
    new Array<boolean>(nCols + 1).fill(true),
  );

  if (layout === "Round") {
    const cx = nCols / 2;
    const cy = nRows / 2;
    const r = Math.min(nCols, nRows) / 2;
    for (let i = 0; i <= nRows; i++) {
      for (let j = 0; j <= nCols; j++) {
        const dx = j - cx;
        const dy = i - cy;
        open[i][j] = Math.hypot(dx, dy) <= r;
      }
    }
    return open;
  }

  const mask = MASKS[layout];
  if (!mask) return null;

  const mRows = mask.length;
  const mCols = mask[0].length;
  for (let i = 0; i <= nRows; i++) {
    const mi = Math.min(mRows - 1, Math.floor((i / (nRows + 1)) * mRows));
    for (let j = 0; j <= nCols; j++) {
      const mj = Math.min(mCols - 1, Math.floor((j / (nCols + 1)) * mCols));
      open[i][j] = mask[mi][mj] === 1;
    }
  }
  return open;
}
